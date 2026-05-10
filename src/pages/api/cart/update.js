import dbconnected from "../../lib/mongodb";
import Cart from "../../models/Cart";
import { getCartIdentifier, buildCartQuery } from "../utils/helpers";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    await dbconnected();
    const identifier = await getCartIdentifier(req, res);
    const query = buildCartQuery(identifier);
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined)
      return res.status(400).json({ error: "Product ID and quantity are required" });

    if (quantity < 0)
      return res.status(400).json({ error: "Quantity cannot be negative" });

    const cart = await Cart.findOne(query);
    if (!cart)
      return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find((i) => i.productId === productId);
    if (!item)
      return res.status(404).json({ error: "Item not found in cart" });

    if (quantity === 0) {
      cart.items = cart.items.filter((i) => i.productId !== productId);
    } else {
      item.quantity = quantity;
    }

    if (cart.items.length === 0) {
      await Cart.deleteOne({ _id: cart._id });
      return res.status(200).json({ success: true, cart: { items: [], appliedPromo: null } });
    }

    cart.updatedAt = new Date();
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Update quantity error:", error);
    res.status(500).json({ error: "Failed to update quantity" });
  }
}