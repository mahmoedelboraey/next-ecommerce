import dbconnected from "@/pages/lib/mongodb";
import Cart from "@/pages/models/Cart";
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

    // Find or create cart for this session
    let cart = await Cart.findOne({ sessionId });

    if (!cart) {
      cart = new Cart({
        sessionId,
        items: [
          {
            productId: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            description: product.description,
            rating: product.rating,
            quantity: 1,
          },
        ],
      });
    } else {
      // Check if product already in cart
      const existingItem = cart.items.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        // Increase quantity
        existingItem.quantity += 1;
      } else {
        // Add new item
        cart.items.push({
          productId: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          description: product.description,
          rating: product.rating,
          quantity: 1,
        });
      }
    }

    cart.updatedAt = new Date();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
}
