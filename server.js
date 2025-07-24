import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config({ path: ".env" });
const app = express();

const APP_PORT = process.env.APP_PORT || 8000;

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.include(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     method: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
//   })
// );

// Routes
app.use("/api/user", userRoutes);
app.use("/api", appointmentRoutes);

app.get("/", (req, res) => {
  res.send("❤️ Appointment Backend is running! ❤️");
});

app.listen(APP_PORT, () => {
  console.log(`❤️ Server is running at http://localhost:${APP_PORT}`);
});
