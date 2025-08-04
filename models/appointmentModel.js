// models/appointment.model.js
import { pool } from "../db.js";

export async function createAppointment({
  userId,
  name,
  discreption,
  phoneNumber,
  date,
  time,
  status = "pending",
}) {
  // 1️⃣ Check if user already has a patientId from previous appointments
  const [existing] = await pool.execute(
    `SELECT patientId FROM appointments WHERE userId = ? LIMIT 1`,
    [userId]
  );

  let patientId;

  if (existing.length > 0) {
    // Reuse existing patientId
    patientId = existing[0].patientId;
  } else {
    // Will create new patientId after insert
    patientId = "TEMP";
  }

  // 2️⃣ Insert appointment
  const sql = `
    INSERT INTO appointments
      (patientId, userId, name, discreption, phoneNumber, date, time, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.execute(sql, [
    patientId,
    userId,
    name,
    discreption,
    phoneNumber,
    date,
    time,
    status,
  ]);

  // 3️⃣ If patientId was TEMP, generate it now based on first appointment ID
  if (patientId === "TEMP") {
    patientId = `PAT-${String(result.insertId).padStart(4, "0")}`;

    await pool.execute(`UPDATE appointments SET patientId = ? WHERE id = ?`, [
      patientId,
      result.insertId,
    ]);
  }

  return { insertId: result.insertId, patientId };
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

export async function getAppointmentHistoryByUserId(userId) {
  const sql = `
    SELECT discreption, date, patientId
    FROM appointments
    WHERE userId = ?
    ORDER BY date DESC
  `;
  const [rows] = await pool.execute(sql, [userId]);
  return rows;
}
