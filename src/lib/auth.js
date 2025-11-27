import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

/* ================= SIGN TOKEN ================= */

export const signToken = (payload) => {
  // payload will include id, email, role
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

/* ================= VERIFY TOKEN ================= */

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

/* ================= AUTH HELPERS ================= */

export const getUserFromToken = (token) => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || "user",
    };
  } catch {
    return null;
  }
};

/* ================= ADMIN ONLY ================= */

export const isAdmin = (token) => {
  if (!token) return false;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    return decoded.role === "admin";
  } catch {
    return false;
  }
};
