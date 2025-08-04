import { pool } from "../db.js";

// create a new user

export const createUser = async ({ name, email, password, phoneNumber }) => {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, phoneNumber) VALUES (?,?,?,?)",
    [name, email, password, phoneNumber]
  );
  return result.insertId;
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query(" SELECT * FROM users WHERE email = ? ", [
    email,
  ]);
  return rows[0];
};

export const getAllUsers = async () => {
  const [rows] = await pool.query("SELECT id, name, email, FROM users");
  return rows;
};
