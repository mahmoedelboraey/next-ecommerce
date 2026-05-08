import dbconnected from "@/pages/lib/mongodb";
import PromoCode from "@/pages/models/PromoCode";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbconnected();
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Promo code is required" });
    }

    const promo = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiryDate: { $gte: new Date() },
    });

    if (!promo) {
      return res.status(404).json({ error: "Invalid or expired promo code" });
    }

    // Check usage limit
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      return res.status(400).json({ error: "Promo code usage limit reached" });
    }

    // Check minimum order amount
    if (cartTotal < promo.minOrderAmount) {
      return res.status(400).json({
        error: `Minimum order amount required: $${promo.minOrderAmount}`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (promo.discountType === "percentage") {
      discount = (cartTotal * promo.discount) / 100;
      if (promo.maxDiscount) {
        discount = Math.min(discount, promo.maxDiscount);
      }
    } else {
      discount = promo.discount;
    }

    res.status(200).json({
      success: true,
      promo: {
        code: promo.code,
        discountType: promo.discountType,
        discount: promo.discount,
        calculatedDiscount: discount,
        maxDiscount: promo.maxDiscount,
      },
    });
  } catch (error) {
    console.error("Validate promo code error:", error);
    res.status(500).json({ error: "Failed to validate promo code" });
  }
}
