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
    const { product } = req.body;

    if (!product || !product.id)
      return res.status(400).json({ error: "Product data is required" });

    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({
        ...query,
        items: [{
          productId: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          description: product.description,
          rating: product.rating,
          quantity: 1,
        }],
      });
    } else {
      const existingItem = cart.items.find((i) => i.productId === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
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

    res.status(200).json({ success: true, message: "Product added to cart", cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
}