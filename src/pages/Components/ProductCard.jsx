"use client"
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { useSession } from "next-auth/react";

function getColor(rating) {
  if (rating >= 4) return "#28a745";
  if (rating >= 3) return "#ffc107";
  return "#dc3545";
}

function renderStars(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{
          color: i <= Math.round(rating) ? "#ffc107" : "#ddd",
          fontSize: "16px",
        }}
      >
        ★
      </span>
    );
  }
  return stars;
}

export default function ProductCard({ product, showViewDetails = true }) {
  const { data: session } = useSession();
  const { addToCart, isProductInCart } = useContext(CartContext);
  const { toggleWishlist, isProductInWishlist } = useContext(WishlistContext);

  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    setIsAdded(isProductInCart(product.id));
    setIsInWishlist(isProductInWishlist(product.id));
  }, [product.id, isProductInCart, isProductInWishlist]);

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!session) {
      alert("Please login first to add items to cart");
      return;
    }

    if (product && !isAdded && !isAdding) {
      setIsAdding(true);
      const success = await addToCart(product);
      if (success) {
        setIsAdded(true);
      }
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();

    if (!session) {
      alert("Please login first to add items to wishlist");
      return;
    }

    await toggleWishlist(product);
    setIsInWishlist(!isInWishlist);
  };

  return (
    <div className="card h-100 shadow-sm border-0 position-relative" style={{ cursor: "pointer", transition: "transform 0.3s, box-shadow 0.3s" }}>
      <div className="position-relative" style={{ height: "200px", overflow: "hidden" }}>
        {product.discountPercentage > 0 && (
          <span
            className="badge bg-danger position-absolute"
            style={{
              top: "10px",
              left: "10px",
              zIndex: 10,
              fontSize: "14px",
            }}
          >
            -{product.discountPercentage}%
          </span>
        )}

        <img
          src={product.thumbnail}
          className="card-img-top"
          style={{
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s",
          }}
          alt={product.title}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        />

        <button
          className="btn btn-light position-absolute"
          style={{
            top: "8px",
            right: "8px",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            padding: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            cursor: "pointer",
          }}
          onClick={handleWishlistToggle}
          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="card-body d-flex flex-column">
        <h6 className="text-truncate fw-bold">{product.title}</h6>
        <p className="text-muted small" style={{ minHeight: "40px" }}>
          {product.description?.slice(0, 60)}...
        </p>

        <div className="mb-2">
          <div>{renderStars(product.rating)}</div>
          <small style={{ color: getColor(product.rating) }} className="fw-bold">
            {product.rating?.toFixed(1)} / 5
          </small>
        </div>

        <div className="mt-auto d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold text-success fs-6">${product.price}</span>
          {product.stock > 0 ? (
            <span className="badge bg-success">In Stock</span>
          ) : (
            <span className="badge bg-danger">Out</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdded || isAdding || !session}
          className={`btn w-100 text-white mt-3 ${isAdded ? "btn-success" : "btn-primary"}`}
          style={{
            opacity: isAdded || !session ? 0.7 : 1,
            cursor: isAdded || !session ? "not-allowed" : isAdding ? "wait" : "pointer",
          }}
        >
          {!session ? "Login to Buy" : isAdding ? "Adding..." : isAdded ? "Added ✓" : "Add to Cart"}
        </button>

        {showViewDetails && (
          <Link href={`/product/${product.id}`} className="btn btn-outline-secondary w-100 mt-2">
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}
