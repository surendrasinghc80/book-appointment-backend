// models/appointment.model.js
import { pool } from "../db.js";

export async function createAppointment({
  userId,
  name,
  phoneNumber,
  date, // 'YYYY-MM-DD'
  time, // 'HH:MM:SS'
  status = "Pending",
}) {
  const sql = `
    INSERT INTO appointments
      (patientId, userId, name, phoneNumber, date, time, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // Generate a placeholder for now
  const tempPatientId = "TEMP";

  const [result] = await pool.execute(sql, [
    tempPatientId,
    userId,
    name,
    phoneNumber,
    date,
    time,
    status,
  ]);

  // Generate patientId based on insertId (e.g., PAT-0001)
  const generatedPatientId = `PAT-${String(result.insertId).padStart(4, "0")}`;

  // Update the record with the new patientId
  await pool.execute(`UPDATE appointments SET patientId = ? WHERE id = ?`, [
    generatedPatientId,
    result.insertId,
  ]);

  return { insertId: result.insertId, patientId: generatedPatientId };
}
