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
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res
        .status(400)
        .json({ error: "Product ID and quantity are required" });
    }

    if (quantity < 0) {
      return res.status(400).json({ error: "Quantity cannot be negative" });
    }

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const item = cart.items.find((item) => item.productId === productId);

    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    if (quantity === 0) {
      // Remove item
      cart.items = cart.items.filter((item) => item.productId !== productId);
    } else {
      // Update quantity
      item.quantity = quantity;
    }

    // If cart is empty, delete it
    if (cart.items.length === 0) {
      await Cart.deleteOne({ _id: cart._id });
      return res.status(200).json({
        success: true,
        message: "Quantity updated",
        cart: { items: [], appliedPromo: null },
      });
    }

    cart.updatedAt = new Date();
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Quantity updated",
      cart,
    });
  } catch (error) {
    console.error("Update quantity error:", error);
    res.status(500).json({ error: "Failed to update quantity" });
  }
}
