import express from "express";
import {
  addAppointment,
  getMyAppointments,
  getAllAppointmentsController,
  editAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/addappointments", protect, addAppointment);

router.get("/appointments/:userId", getMyAppointments);

router.get("/all-appointments", getAllAppointmentsController);

router.patch("/appointments/:id", editAppointmentStatus);

router.delete("/appointments/:id", deleteAppointment);

export default router;
