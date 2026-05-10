import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import dbconnected from "../lib/mongodb";
import Wishlist from "../models/Wishlist";
import UserAuth from "../models/UserAuth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Not authenticated" });

  await dbconnected();
  const dbUser = await UserAuth.findOne({ email: session.user.email });
  if (!dbUser) return res.status(404).json({ message: "User not found" });

  const userId = dbUser._id;


  if (req.method === "GET") {
    const wishlist = await Wishlist.findOne({ userId });
    return res.status(200).json({ items: wishlist?.items || [] });
  }


  if (req.method === "POST") {
    const { productId, name, price, image, category } = req.body;
    if (!productId) return res.status(400).json({ message: "productId required" });

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) wishlist = await Wishlist.create({ userId, items: [] });

    const idx = wishlist.items.findIndex((i) => i.productId === productId);

    if (idx > -1) {
    
      wishlist.items.splice(idx, 1);
    } else {

      wishlist.items.push({ productId, name, price, image, category });
    }

    await wishlist.save();
    return res.status(200).json({ items: wishlist.items });
  }

  if (req.method === "DELETE") {
    const { productId } = req.body;
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: "Not found" });

    wishlist.items = wishlist.items.filter((i) => i.productId !== productId);
    await wishlist.save();
    return res.status(200).json({ items: wishlist.items });
  }

  res.status(405).json({ message: "Method not allowed" });
}