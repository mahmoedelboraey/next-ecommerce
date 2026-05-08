import dbconnected from "@/pages/lib/mongodb";
import Wishlist from "@/pages/models/Wishlist";
import { getOrCreateSessionId } from "../utils/helpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbconnected();
    const sessionId = getOrCreateSessionId(req, res);

    const wishlist = await Wishlist.findOne({ sessionId });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlist: { items: [] },
      });
    }

    res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
}
