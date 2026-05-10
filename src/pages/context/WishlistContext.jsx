"use client"
import React, { createContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [wishlist, setWishlist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/wishlist/get");
      const data = await response.json();
      if (data.success) setWishlist(data.wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist({ items: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  
  useEffect(() => {
    if (status !== "loading") {
      fetchWishlist();
    }
  }, [status, session?.user?.email, fetchWishlist]);

  const addToWishlist = async (product) => {
    try {
      const response = await fetch("/api/wishlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      const data = await response.json();
      if (data.success) { setWishlist(data.wishlist); return true; }
      return false;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch("/api/wishlist/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (data.success) { setWishlist(data.wishlist); return true; }
      return false;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return false;
    }
  };

  const toggleWishlist = async (product) => {
    if (isProductInWishlist(product.id)) return await removeFromWishlist(product.id);
    return await addToWishlist(product);
  };

  const isProductInWishlist = (productId) => wishlist?.items?.some((i) => i.productId === productId) ?? false;
  const getWishlist = () => wishlist;
  const clearWishlist = () => setWishlist({ items: [] });

  return (
    <WishlistContext.Provider value={{
      wishlist, isLoading,
      addToWishlist, removeFromWishlist,
      toggleWishlist, isProductInWishlist,
      getWishlist, clearWishlist, fetchWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};