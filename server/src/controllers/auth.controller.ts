import type { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User";
import { registerSchema } from "../validators/auth.validator";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // 1. Validate request data
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid registration data",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const { name, username, email, password } = validation.data;

    // 2. Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "Email or username already exists",
      });
      return;
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // 4. Create user
    const user = await User.create({
      name,
      username,
      email,
      passwordHash,
    });

    // 5. Return public user information
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // Handle concurrent duplicate registrations
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      res.status(409).json({
        success: false,
        message: "Email or username already exists",
      });
      return;
    }

    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};