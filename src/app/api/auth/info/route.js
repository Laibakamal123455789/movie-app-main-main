import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Authorization header missing or malformed" },
      { status: 401 }
    );
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return NextResponse.json({
      success: true,
      user: {
        email: decoded.email,
        firstName: decoded.firstName,
      },
    });
  } catch (error) {
    console.error("JWT verification error:", error);
    return NextResponse.json(
      { error: error.name === "TokenExpiredError" ? "Token expired" : "Invalid token" },
      { status: 401 }
    );
  }
}
