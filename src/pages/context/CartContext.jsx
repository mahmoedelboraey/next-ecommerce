import React, { createContext, useState, useEffect, useCallback } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [discount, setDiscount] = useState(0);

  // Fetch cart from API
  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cart/get");
      const data = await response.json();

      if (data.success) {
        setCart(data.cart);
        if (data.cart.appliedPromo) {
          setAppliedPromo(data.cart.appliedPromo);
        }
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart({ items: [], appliedPromo: null });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product) => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });

      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating quantity:", error);
      return false;
    }
  };

  const isProductInCart = (productId) => {
    if (!cart || !cart.items) return false;
    return cart.items.some((item) => item.productId === productId);
  };

  const getCartTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartQuantity = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const applyPromoCode = async (code) => {
    try {
      const cartTotal = getCartTotal();
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, cartTotal }),
      });

      const data = await response.json();
      if (data.success) {
        setAppliedPromo(data.promo);
        setDiscount(data.promo.calculatedDiscount);
        
        // Update cart with promo
        if (cart) {
          const updatedCart = {
            ...cart,
            appliedPromo: data.promo,
          };
          setCart(updatedCart);
        }
        return { success: true, promo: data.promo };
      }
      return { success: false, error: data.error };
    } catch (error) {
      console.error("Error applying promo code:", error);
      return { success: false, error: "Failed to apply promo code" };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setDiscount(0);
    if (cart) {
      setCart({ ...cart, appliedPromo: null });
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch("/api/cart/clear", {
        method: "POST",
      });

      const data = await response.json();
      if (data.success) {
        setCart({ items: [], appliedPromo: null });
        setAppliedPromo(null);
        setDiscount(0);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error clearing cart:", error);
      return false;
    }
  };

  const getCart = () => cart;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        appliedPromo,
        discount,
        addToCart,
        removeFromCart,
        updateQuantity,
        isProductInCart,
        getCart,
        getCartTotal,
        getCartQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
