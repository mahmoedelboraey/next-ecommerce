import dbconnected from "@/pages/lib/mongodb";
import Wishlist from "@/pages/models/Wishlist";
import { getOrCreateSessionId } from "../utils/helpers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbconnected();
    const sessionId = getOrCreateSessionId(req, res);
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const wishlist = await Wishlist.findOne({ sessionId });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    // Remove item from wishlist
    wishlist.items = wishlist.items.filter(
      (item) => item.productId !== productId
    );
    wishlist.updatedAt = new Date();

    // If wishlist is empty, delete it
    if (wishlist.items.length === 0) {
      await Wishlist.deleteOne({ _id: wishlist._id });
      return res.status(200).json({
        success: true,
        message: "Product removed from wishlist",
        wishlist: { items: [] },
      });
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ error: "Failed to remove product from wishlist" });
  }
}
