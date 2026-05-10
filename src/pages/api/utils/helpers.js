import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbconnected from "@/pages/lib/mongodb";
import UserAuth from "@/pages/models/UserAuth";

export const getOrCreateSessionId = (req, res) => {
  let sessionId = req.cookies?.sessionId;

  if (!sessionId) {
    sessionId = uuidv4();
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

export async function getCartIdentifier(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (session?.user?.email) {
      await dbconnected();
      const dbUser = await UserAuth.findOne({ email: session.user.email });
      if (dbUser) {
        return {
          type: "userId",
          userId: dbUser._id,
          sessionId: null,
        };
      }
    }
  } catch (e) {
  }

  // Guest
  const sessionId = getOrCreateSessionId(req, res);
  return {
    type: "sessionId",
    userId: null,
    sessionId,
  };
}

export function buildCartQuery(identifier) {
  if (identifier.type === "userId") {
    return { userId: identifier.userId };
  }
  return { sessionId: identifier.sessionId };
}