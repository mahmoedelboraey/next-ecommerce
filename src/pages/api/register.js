import bcrypt from "bcryptjs";
import dbconnected from "../lib/mongodb";       // ✅ path صح
import UserAuth from "../models/UserAuth";       // ✅ path صح

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbconnected();

    const { name, email, password, phone } = req.body;

    // تأكد إن كل الحقول موجودة
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserAuth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserAuth.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}