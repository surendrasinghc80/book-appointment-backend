// controllers/appointment.controller.js
import { createAppointment } from "../models/appointmentModel.js";

const VALID_STATUSES = ["Pending", "Accepted", "Rejected"];

function isValidDate(str) {
  // very simple check - you can swap this with a stricter lib like zod
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

function isValidTime(str) {
  return /^\d{2}:\d{2}(:\d{2})?$/.test(str);
}

export async function addAppointment(req, res, next) {
  try {
    const { userId, name, phoneNumber, date, time, status } = req.body;

    // Validate input (same as before)
    if (!userId || Number.isNaN(Number(userId))) {
      return res.status(400).json({ message: "userId is required (number)." });
    }
    if (!name) {
      return res.status(400).json({ message: "name is required." });
    }
    if (!phoneNumber || Number.isNaN(Number(phoneNumber))) {
      return res.status(400).json({ message: "phoneNumber must be a number." });
    }
    if (!date) {
      return res.status(400).json({ message: "date is required." });
    }
    if (!time) {
      return res.status(400).json({ message: "time is required." });
    }

    // Call model to create appointment and generate patientId
    const { insertId, patientId } = await createAppointment({
      userId: Number(userId),
      name,
      phoneNumber: String(phoneNumber),
      date,
      time: time.length === 5 ? `${time}:00` : time,
      status: status || "Pending",
    });

    return res.status(201).json({
      message: "Appointment created successfully.",
      data: {
        id: insertId,
        patientId,
        userId: Number(userId),
        name,
        phoneNumber: String(phoneNumber),
        date,
        time: time.length === 5 ? `${time}:00` : time,
        status: status || "Pending",
      },
    });
  } catch (err) {
    next(err);
  }
}
