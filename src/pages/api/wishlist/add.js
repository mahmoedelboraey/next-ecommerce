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
    const { product } = req.body;

    if (!product || !product.id)
      return res.status(400).json({ error: "Product data is required" });

    let wishlist = await Wishlist.findOne(query);

    if (!wishlist) {
      wishlist = new Wishlist({
        ...query,
        items: [{
          productId: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          description: product.description,
          rating: product.rating,
          addedAt: new Date(),
        }],
      });
    } else {
      const exists = wishlist.items.find((i) => i.productId === product.id);
      if (exists)
        return res.status(200).json({ success: true, message: "Already in wishlist", wishlist });

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

    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
}