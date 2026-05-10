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
    const { productId } = req.body;

    if (!productId)
      return res.status(400).json({ error: "Product ID is required" });

    const cart = await Cart.findOne(query);
    if (!cart)
      return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter((i) => i.productId !== productId);
    cart.updatedAt = new Date();

    if (cart.items.length === 0) {
      await Cart.deleteOne({ _id: cart._id });
      return res.status(200).json({ success: true, cart: { items: [], appliedPromo: null } });
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ error: "Failed to remove product from cart" });
  }
}