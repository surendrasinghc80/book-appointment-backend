// models/appointment.model.js
import { pool } from "../db.js";

export async function createAppointment({
  userId,
  name,
  discreption,
  phoneNumber,
  date, // 'YYYY-MM-DD'
  time, // 'HH:MM:SS'
  status = "Pending",
}) {
  const sql = `
    INSERT INTO appointments
      (patientId, userId, name, discreption, phoneNumber, date, time, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Generate a placeholder for now
  const tempPatientId = "TEMP";

  const [result] = await pool.execute(sql, [
    tempPatientId,
    userId,
    name,
    discreption,
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

export async function getAppointmentsByUserId(userId) {
  const [rows] = await pool.execute(
    `SELECT * FROM appointments WHERE userId = ? ORDER BY date DESC, time DESC`,
    [userId]
  );
  return rows;
}

export async function getAllAppointments() {
  const [rows] = await pool.execute(
    `SELECT * FROM appointments ORDER BY date DESC, time DESC`
  );
  return rows;
}

export async function updateAppointmentStatus(id, status) {
  const sql = `UPDATE appointments SET status = ? WHERE id = ?`;
  const [result] = await pool.execute(sql, [status, id]);
  return result.affectedRows;
}

export async function deleteAppointmentById(appointmentId) {
  const sql = `DELETE FROM appointments WHERE id = ?`;
  const [rows] = await pool.execute(sql, [appointmentId]);
  return rows.affectedRows;
}
