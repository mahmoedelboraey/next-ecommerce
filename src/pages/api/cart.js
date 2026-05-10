
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import dbconnected from "../lib/mongodb";
import Cart from "../models/Cart";
import UserAuth from "../models/UserAuth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  await dbconnected();

  const dbUser = await UserAuth.findOne({ email: session.user.email });
  if (!dbUser) return res.status(404).json({ message: "User not found" });

  const userId = dbUser._id;

  
  if (req.method === "GET") {
    const cart = await Cart.findOne({ userId });
    return res.status(200).json({ items: cart?.items || [] });
  }

  
  if (req.method === "POST") {
    const { productId, name, price, image, category, quantity = 1 } = req.body;
    if (!productId || !name || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

  
    const existIdx = cart.items.findIndex(
      (i) => i.productId === productId
    );

    if (existIdx > -1) {
      cart.items[existIdx].quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, image, category, quantity });
    }

    await cart.save();
    return res.status(200).json({ items: cart.items });
  }


  if (req.method === "PUT") {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.productId === productId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.productId !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    return res.status(200).json({ items: cart.items });
  }


  if (req.method === "DELETE") {
    const { productId } = req.body;


    if (!productId) {
      await Cart.findOneAndUpdate({ userId }, { items: [] });
      return res.status(200).json({ items: [] });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.productId !== productId);
    await cart.save();
    return res.status(200).json({ items: cart.items });
  }

  res.status(405).json({ message: "Method not allowed" });}