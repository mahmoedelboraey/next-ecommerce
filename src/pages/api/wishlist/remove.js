import dbconnected from "@/pages/lib/mongodb";
import Wishlist from "@/pages/models/Wishlist";
import { getCartIdentifier, buildCartQuery } from "../utils/helpers";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    await dbconnected();
    const identifier = await getCartIdentifier(req, res);
    const query = buildCartQuery(identifier);
    const { productId } = req.body;

    if (!productId)
      return res.status(400).json({ error: "Product ID is required" });

    const wishlist = await Wishlist.findOne(query);
    if (!wishlist)
      return res.status(404).json({ error: "Wishlist not found" });

    wishlist.items = wishlist.items.filter((i) => i.productId !== productId);
    wishlist.updatedAt = new Date();

    if (wishlist.items.length === 0) {
      await Wishlist.deleteOne({ _id: wishlist._id });
      return res.status(200).json({ success: true, wishlist: { items: [] } });
    }

    await wishlist.save();
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
}