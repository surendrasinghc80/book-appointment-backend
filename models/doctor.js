import { pool } from "../db.js";

export const createUser = async ({ name, specialistIn, age, phoneNumber }) => {
  const [result] = await pool.query(
    "INSERT INTO doctors (name, specialistIn, age, phoneNumber) VALUES (?,?,?,?)",
    [name, specialistIn, age, phoneNumber]
  );
  return result.insertId;
};
