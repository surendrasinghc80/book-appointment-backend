import express from "express";
import { addAppointment } from "../controllers/appointmentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/addappointments", protect, addAppointment);

export default router;
