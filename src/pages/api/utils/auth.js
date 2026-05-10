import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import dbconnected from "@/pages/lib/mongodb";
import UserAuth from "@/pages/models/UserAuth";


export const getAuthUser = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user?.email) {
      return null;
    }

    await dbconnected();
    const user = await UserAuth.findOne({ email: session.user.email });
    
    if (!user) {
      return null;
    }

    return {
      _id: user._id.toString(),
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      image: user.image,
    };
  } catch (error) {
    console.error("Error getting auth user:", error);
    return null;
  }
};


export const isAuthenticated = async (req, res) => {
  const user = await getAuthUser(req, res);
  return !!user;
};


export const requireAuth = async (req, res) => {
  const user = await getAuthUser(req, res);
  
  if (!user) {
    res.status(401).json({
      success: false,
      error: "Unauthorized. Please login first.",
      code: "UNAUTHORIZED",
    });
    return null;
  }

  return user;
};

/**
 * Validate that user owns the resource
 */
export const validateUserOwnership = (resourceUserId, userIdString) => {
  if (!resourceUserId || !userIdString) return false;
  return resourceUserId.toString() === userIdString;
};
