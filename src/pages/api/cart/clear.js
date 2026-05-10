import dbconnected from "@/pages/lib/mongodb";
import Cart from "@/pages/models/Cart";
import { getCartIdentifier, buildCartQuery } from "../utils/helpers";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    await dbconnected();
    const identifier = await getCartIdentifier(req, res);
    const query = buildCartQuery(identifier);

    await Cart.deleteOne(query);

    res.status(200).json({ success: true, cart: { items: [], appliedPromo: null } });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
}