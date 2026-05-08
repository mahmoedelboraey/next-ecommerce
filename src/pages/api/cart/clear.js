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

    await Cart.deleteOne({ sessionId });

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart: { items: [], appliedPromo: null },
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
}
