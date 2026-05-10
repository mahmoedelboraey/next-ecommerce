import { getServerSession } from "next-auth/next";
import dbconnected from "@/pages/lib/mongodb";
import Wishlist from "@/pages/models/Wishlist";
import UserAuth from "@/pages/models/UserAuth";
import { getOrCreateSessionId } from "../utils/helpers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbconnected();

    const session = await getServerSession(req, res, );

    if (session?.user?.email) {
      // Authenticated user - delete by userId
      const user = await UserAuth.findOne({ email: session.user.email });
      if (user) {
        await Wishlist.deleteOne({ userId: user._id });
      }
    } else {
      // Guest user - delete by sessionId
      const sessionId = getOrCreateSessionId(req, res);
      await Wishlist.deleteOne({ sessionId });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist cleared",
      wishlist: { items: [] },
    });
  } catch (error) {
    console.error("Clear wishlist error:", error);
    res.status(500).json({ error: "Failed to clear wishlist" });
  }
}
