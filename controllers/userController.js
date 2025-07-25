import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  loginSchema,
  registerUserSchema,
} from "../validations/userValidation.js";
import * as UserModel from "../models/UserModel.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register a user
export const registerUser = async (req, res) => {
  try {
    const parsed = registerUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ errors: parsed.error.flatten().fieldErrors });
    }

    const { name, email, password, phoneNumber } = parsed.data;

    const existing = await UserModel.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        error: "Email already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await UserModel.createUser({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    const token = generateToken(userId);

    res.status(201).json({
      status: "201",
      message: "User registered successfully",
      user: {
        id: userId,
        name,
        email,
        phoneNumber,
        token,
      },
    });
  } catch (error) {
    console.log("Registration Error", error);
    res.status(500).json({
      error: "❌ Server crashed",
    });
  }
};

// Login

export const loginUser = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.flatten().fieldErrors });
    }

    const { email, password } = parsed.data;

    const existingUser = await UserModel.findUserByEmail(email);
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({
      status: "200",
      message: "Login successful",
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        phoneNumber: existingUser.phoneNumber,
      },
    });
  } catch (error) {
    console.log("Login Error", error);
    res.status(500).json({ message: "❌ Server crashed" });
  }
};
