import { User } from "@/models/userModel";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();
  try {
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return NextResponse.json({message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    user.password = hashedPassword;
    
    await user.save({ validateModifiedOnly: true });

    return NextResponse.json({message: "Password reset successfully" });

  } 
  catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({message: "Error resetting password" });
  }
}
