import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  await connectDB();

  const { name, email, password } = await req.json();

  if (!name || !email || !password)
    return NextResponse.json(
      { message: "All fields required" },
      { status: 400 }
    );

  const exists = await User.findOne({ email });
  if (exists)
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: email === process.env.ADMIN_EMAIL ? "admin" : "user",
  });

  /* ✅ ADD ROLE TO TOKEN */
  const token = signToken({
    id: user._id,
    email: user.email,
    role: user.role, // ⭐ IMPORTANT
  });

  const res = NextResponse.json({
    message: "Signup successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // ⭐ IMPORTANT
    },
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
    path: "/",
  });

  return res;
}
