import React, { createContext, useState, useEffect, useCallback } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch wishlist from API
  const fetchWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/wishlist/get");
      const data = await response.json();

      if (data.success) {
        setWishlist(data.wishlist);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist({ items: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (product) => {
    try {
      const response = await fetch("/api/wishlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });

      const data = await response.json();
      if (data.success) {
        setWishlist(data.wishlist);
        return true;
      }
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
      if (data.success) {
        setWishlist(data.wishlist);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return false;
    }
  };

  const toggleWishlist = async (product) => {
    const isInWishlist = isProductInWishlist(product.id);

    if (isInWishlist) {
      return await removeFromWishlist(product.id);
    } else {
      return await addToWishlist(product);
    }
  };

  const isProductInWishlist = (productId) => {
    if (!wishlist || !wishlist.items) return false;
    return wishlist.items.some((item) => item.productId === productId);
  };

  const getWishlist = () => wishlist;

  const clearWishlist = () => {
    setWishlist({ items: [] });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isProductInWishlist,
        getWishlist,
        clearWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
