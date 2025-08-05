import {
  createAppointment,
  getAppointmentsByUserId,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointmentById,
  getAppointmentHistoryByUserId,
} from "../models/appointmentModel.js";
import { showSpecialistIn } from "../models/doctor.js";

const VALID_STATUSES = ["pending", "accepted", "rejected"];

function isValidDate(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

function isValidTime(str) {
  return /^\d{2}:\d{2}(:\d{2})?$/.test(str);
}

export async function addAppointment(req, res, next) {
  try {
    const {
      name,
      discreption,
      phoneNumber,
      date,
      time,
      status,
      specialistIn,
      doctorId,
    } = req.body;
    const userId = req.user?.id; // userId from token

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Token invalid or missing." });
    }

    if (!specialistIn)
      return res.status(400).json({ message: "specialistIn is required" });
    if (!doctorId)
      return res.status(400).json({ message: "doctorId is required" });

    // Validations
    if (!name) return res.status(400).json({ message: "name is required." });
    if (!discreption)
      return res.status(400).json({ message: "discreption is required." });
    if (!phoneNumber || Number.isNaN(Number(phoneNumber))) {
      return res.status(400).json({ message: "phoneNumber must be a number." });
    }
    if (!date || !isValidDate(date)) {
      return res
        .status(400)
        .json({ message: "date must be in YYYY-MM-DD format." });
    }
    if (!time || !isValidTime(time)) {
      return res
        .status(400)
        .json({ message: "time must be in HH:MM or HH:MM:SS format." });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `status must be one of ${VALID_STATUSES.join(", ")}.`,
      });
    }

    const { insertId, patientId } = await createAppointment({
      userId,
      name,
      discreption,
      phoneNumber: String(phoneNumber),
      date,
      time: time.length === 5 ? `${time}:00` : time,
      status: status || "pending",
      specialistIn,
      doctorId,
    });

    return res.status(201).json({
      message: "Appointment created successfully.",
      status: 201,
      data: {
        id: insertId,
        patientId,
        userId,
        name,
        discreption,
        phoneNumber: String(phoneNumber),
        date,
        time: time.length === 5 ? `${time}:00` : time,
        status: status || "pending",
        specialistIn,
        doctorId,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getMyAppointments(req, res, next) {
  try {
    const { userId } = req.params;
    if (!userId || Number.isNaN(Number(userId))) {
      return res.status(400).json({ message: "Valid userId is required." });
    }

    const appointments = await getAppointmentsByUserId(Number(userId));

    if (appointments.length > 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Appointments",
        data: appointments,
      });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "No data found",
        data: appointments,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: "No Appointment Found",
    });
    next(error);
  }
}

export async function getAllAppointmentsController(req, res, next) {
  try {
    const appointments = await getAllAppointments();

    if (appointments.length > 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Appointments",
        data: appointments,
      });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "No data found",
        data: appointments,
      });
    }
    // return res
    //   .status(200)
    //   .json({ status: 200, success: true, data: appointments });
  } catch (err) {
    next(err);
  }
}

export async function editAppointmentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || Number.isNaN(Number(id))) {
      return res
        .status(400)
        .json({ message: "Valid appointment ID is required." });
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${VALID_STATUSES.join(", ")}.`,
      });
    }

    const updated = await updateAppointmentStatus(Number(id), status);

    if (updated === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    return res.status(200).json({
      status: 200,
      message: "Appointment status updated successfully.",
      data: { id: Number(id), status },
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteAppointment(req, res, next) {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res
        .status(400)
        .json({ message: "Valid appointment ID is required." });
    }

    const deleted = await deleteAppointmentById(Number(id));

    if (deleted === 0) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    return res.status(200).json({
      status: 200,
      message: "Appointment deleted successfully.",
      id: Number(id),
    });
  } catch (err) {
    next(err);
  }
}

export async function getAppointmentHistory(req, res, next) {
  try {
    const { userId } = req.params;

    if (!userId || Number.isNaN(Number(userId))) {
      return res.status(400).json({ message: "Valid userId is required." });
    }

    const history = await getAppointmentHistoryByUserId(Number(userId));

    return res.status(200).json({
      status: 200,
      success: true,
      data: history,
    });
  } catch (err) {
    next(err);
  }
}
