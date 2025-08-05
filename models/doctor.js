import { pool } from "../db.js";

export const createUser = async ({ name, specialistIn, age, phoneNumber }) => {
  const [result] = await pool.query(
    "INSERT INTO doctors (name, specialistIn, age, phoneNumber) VALUES (?,?,?,?)",
    [name, specialistIn, age, phoneNumber]
  );
  return result.insertId;
};

export const showSpecialistIn = async () => {
  const [rows] = await pool.query("SELECT DISTINCT specialistIn FROM doctors");
  return rows.map((row) => row.specialistIn);
};

export const getDoctorsBySpecialist = async (specialistIn) => {
  const [rows] = await pool.query(
    "SELECT id, name FROM doctors WHERE specialistIn = ?",
    [specialistIn]
  );
  return rows;
};
