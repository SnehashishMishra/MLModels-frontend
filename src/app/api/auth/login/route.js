import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );

  /* ✅ ADD ROLE TO TOKEN */
  const token = signToken({
    id: user._id,
    email: user.email,
    role: user.role, // ⭐ IMPORTANT
  });

  const res = NextResponse.json({
    message: "Login successful",
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
    sameSite: "strict",
    path: "/",
  });

  return res;
}
