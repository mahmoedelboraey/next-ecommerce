import dbconnected from "@/pages/lib/mongodb";
import Cart from "@/pages/models/Cart";
import { getOrCreateSessionId } from "../utils/helpers";


export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbconnected();
    const sessionId = getOrCreateSessionId(req, res);

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], appliedPromo: null },
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
}
