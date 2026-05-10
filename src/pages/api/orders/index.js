import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbconnected from "../../lib/mongodb";
import Order from "../../models/Orders";
import UserAuth from "../../models/UserAuth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  await dbconnected();

  const dbUser = await UserAuth.findOne({ email: session.user.email });
  if (!dbUser) return res.status(404).json({ error: "User not found" });

  if (req.method === "GET") {
    const orders = await Order.find({ userId: dbUser._id })
      .sort({ createdAt: -1 }); // الأحدث أولاً
    return res.status(200).json({ success: true, orders });
  }


  if (req.method === "POST") {
    const {
      items, shippingInfo, paymentMethod,
      subtotal, tax, discount, total, promoCode,
    } = req.body;

    if (!items?.length || !shippingInfo || !paymentMethod) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const orderNumber = "ORD" + Date.now().toString().slice(-8) +
      Math.floor(Math.random() * 100).toString().padStart(2, "0");

    const order = await Order.create({
      userId: dbUser._id,
      orderNumber,
      items,
      shippingInfo,
      paymentMethod,
      subtotal,
      tax,
      discount: discount || 0,
      total,
      promoCode: promoCode || null,
    });

    return res.status(201).json({ success: true, order });
  }

  res.status(405).json({ error: "Method not allowed" });
}