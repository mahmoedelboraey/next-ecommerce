import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";

function Button({ product }) {
  const { addToCart, isProductInCart, cart } = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setIsAdded(isProductInCart(product.id));
    }
  }, [cart, product, isProductInCart]);

  const handleAddToCart = async () => {
    if (product && !isAdded && !isAdding) {
      setIsAdding(true);
      const success = await addToCart(product);
      if (success) {
        setIsAdded(true);
      }
      setIsAdding(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleAddToCart}
        disabled={isAdded || isAdding}
        className={`btn w-100 text-white mt-3 ${
          isAdded ? "btn-success" : "btn-primary"
        }`}
        style={{
          opacity: isAdded ? 0.7 : 1,
          cursor: isAdded ? "not-allowed" : isAdding ? "wait" : "pointer",
        }}
      >
        {isAdding ? "Adding..." : isAdded ? "Added ✓" : "Add to Cart"}
      </button>
    </div>
  );
}

export default Button;
