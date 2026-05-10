

import mongoose from "mongoose";

const userAuthSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, default: null }, // null لو GitHub/Google
    phone:    { type: String, default: "" },   // ✅ أضفنا phone
    image:    { type: String, default: "" },
  },
  { timestamps: true }
);

const UserAuth =
  mongoose.models.UserAuth ||
  mongoose.model("UserAuth", userAuthSchema);

export default UserAuth;