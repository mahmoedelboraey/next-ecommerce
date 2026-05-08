import React, { useContext, useState } from "react";
import { WishlistContext } from "./context/WishlistContext";
import { CartContext } from "./context/CartContext";
import Link from "next/link";

function Wishlist() {
  const { wishlist, isLoading, removeFromWishlist } =
    useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const [addingProductId, setAddingProductId] = useState(null);

  const handleAddToCart = async (product) => {
    setAddingProductId(product.productId);
    const success = await addToCart({
      id: product.productId,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      description: product.description,
      rating: product.rating,
    });
    setAddingProductId(null);
    // if (success) {
    //   alert(`✓ ${product.title} added to cart!`);
    // }
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h2 className="mb-3">Your Wishlist is Empty</h2>
              <p className="text-muted mb-4">
                Add items to your wishlist to save them for later.
              </p>
              <Link href="/product">
                <button className="btn btn-primary btn-lg">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <h1 className="mb-4">
          ❤️ My Wishlist ({wishlist.items.length})
        </h1>

        <div className="row g-4">
          {wishlist.items.map((item) => (
            <div key={item.productId} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm border-0 position-relative overflow-hidden">
                <div
                  style={{
                    position: "relative",
                    paddingTop: "100%",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    className="btn btn-light position-absolute"
                    style={{
                      top: "8px",
                      right: "8px",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      border: "none",
                      cursor: "pointer",
                      zIndex: 10,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                    onClick={() => removeFromWishlist(item.productId)}
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>

                <div className="card-body d-flex flex-column">
                  <h6 className="card-title text-truncate">{item.title}</h6>
                  <p className="text-muted small flex-grow-1">
                    {item.description?.slice(0, 60)}...
                  </p>

                  <div className="mb-3">
                    <div style={{ fontSize: "0.9rem", letterSpacing: "2px" }}>
                      {"★".repeat(Math.round(item.rating))}
                      {"☆".repeat(5 - Math.round(item.rating))}
                    </div>
                    <small className="text-muted">
                      {item.rating?.toFixed(1)} / 5
                    </small>
                  </div>

                  <h5 className="text-success mb-3">${item.price}</h5>

                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleAddToCart(item)}
                    disabled={addingProductId === item.productId}
                  >
                    {addingProductId === item.productId
                      ? "Adding..."
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;

