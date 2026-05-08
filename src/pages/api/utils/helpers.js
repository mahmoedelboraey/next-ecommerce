import { v4 as uuidv4 } from "uuid";

export const getOrCreateSessionId = (req, res) => {
  let sessionId = req.cookies?.sessionId;

  if (!sessionId) {
    sessionId = uuidv4();
    // Set cookie to expire in 30 days
    res.setHeader(
      "Set-Cookie",
      `sessionId=${sessionId}; Path=/; Max-Age=2592000; HttpOnly; SameSite=Strict`
    );
  }

  return sessionId;
};

export const calculateDiscount = (total, promoData) => {
  if (!promoData) return 0;

  if (promoData.discountType === "percentage") {
    const discount = (total * promoData.discount) / 100;
    const maxDiscount = promoData.maxDiscount || discount;
    return Math.min(discount, maxDiscount);
  } else {
    return promoData.discount;
  }
};
