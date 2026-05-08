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
    const { product } = req.body;

    if (!product || !product.id) {
      return res.status(400).json({ error: "Product data is required" });
    }

    // Find or create wishlist for this session
    let wishlist = await Wishlist.findOne({ sessionId });

    if (!wishlist) {
      wishlist = new Wishlist({
        sessionId,
        items: [
          {
            productId: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            description: product.description,
            rating: product.rating,
            addedAt: new Date(),
          },
        ],
      });
    } else {
      // Check if product already in wishlist
      const existingItem = wishlist.items.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        return res.status(200).json({
          success: true,
          message: "Product already in wishlist",
          wishlist,
        });
      }

      // Add new item
      wishlist.items.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        description: product.description,
        rating: product.rating,
        addedAt: new Date(),
      });
    }

    wishlist.updatedAt = new Date();
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ error: "Failed to add product to wishlist" });
  }
}
