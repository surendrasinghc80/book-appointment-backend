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
  specialistIn,
  doctorId,
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

  // 2️⃣ Insert appointment (now also includes specialistIn & doctorId)
  const sql = `
    INSERT INTO appointments
      (patientId, userId, name, discreption, phoneNumber, date, time, status, specialistIn, doctorId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    specialistIn,
    doctorId,
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

export const getAppointmentsByUserId = async (userId) => {
  const [rows] = await pool.query(
    `SELECT a.*, d.name as doctorName 
     FROM appointments a
     LEFT JOIN doctors d ON a.doctorId = d.id
     WHERE a.userId = ?`,
    [userId]
  );
  return rows;
};

export const getAllAppointments = async () => {
  const [rows] = await pool.query(
    `SELECT a.*, d.name as doctorName 
     FROM appointments a
     LEFT JOIN doctors d ON a.doctorId = d.id`
  );
  return rows;
};
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
