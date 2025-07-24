import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  phoneNumber: z.string().min(10, { message: "Phone Number is required" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
