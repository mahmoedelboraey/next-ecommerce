import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
          fontSize: "24px",
          marginRight: "4px",
        }}
      >
        ★
      </span>
    );
  }
  return stars;
}

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const { addToCart, isProductInCart } = useContext(CartContext);
  const { toggleWishlist, isProductInWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        setIsLoading(true);
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);
        setIsAdded(isProductInCart(data.id));
        setIsInWishlist(isProductInWishlist(data.id));
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id, isProductInCart, isProductInWishlist]);

  const handleAddToCart = async () => {
    if (!session) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    if (!product || isAdding) return;

    setIsAdding(true);
    const productWithQuantity = {
      ...product,
      purchaseQuantity: quantity,
    };

    const success = await addToCart(productWithQuantity);
    if (success) {
      setIsAdded(true);
    }
    setIsAdding(false);
  };

  const handleWishlistToggle = async () => {
    if (!session) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    await toggleWishlist(product);
    setIsInWishlist(!isInWishlist);
  };

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Product Not Found</h4>
          <p>{error || "The product you are looking for does not exist."}</p>
          <button className="btn btn-primary" onClick={() => router.push("/product")}>
            Go Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.thumbnail];

  return (
    <div className="container py-5">
      <div className="row g-4">
        
        <div className="col-lg-6">
          
          <div
            style={{
              marginBottom: "20px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              padding: "20px",
              position: "relative",
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {product.discountPercentage > 0 && (
              <span
                className="badge bg-danger position-absolute"
                style={{
                  top: "15px",
                  left: "15px",
                  fontSize: "18px",
                  padding: "8px 12px",
                }}
              >
                -{product.discountPercentage}% OFF
              </span>
            )}
            <img
              src={images[selectedImage]}
              alt={product.title}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          
          {images.length > 1 && (
            <div className="d-flex gap-2" style={{ overflowX: "auto" }}>
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.title} ${idx}`}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: selectedImage === idx ? "2px solid #0d6efd" : "2px solid #ddd",
                    transition: "border 0.3s",
                  }}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        
        <div className="col-lg-6">
          
          <nav style={{ marginBottom: "20px" }}>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/product">Products</Link>
              </li>
              <li className="breadcrumb-item active">{product.title}</li>
            </ol>
          </nav>

        
          <h1 className="fw-bold mb-2">{product.title}</h1>

      
          <div className="mb-3">
            <span className="badge bg-info me-2">
              {product.category?.toUpperCase()}
            </span>
            <span className="text-muted small">SKU: {product.id}</span>
          </div>

          
          <div className="mb-4">
            <div style={{ marginBottom: "8px" }}>
              {renderStars(product.rating)}
            </div>
            <span style={{ color: getColor(product.rating), fontWeight: "bold" }}>
              {product.rating?.toFixed(1)} / 5 ({product.reviews?.length || 0} reviews)
            </span>
          </div>

      
          <div className="mb-4 p-3 bg-light rounded">
            <div className="row g-2">
              <div className="col-auto">
                <span className="text-muted text-decoration-line-through">
                  ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                </span>
              </div>
              <div className="col-auto">
                <h3 className="fw-bold text-success mb-0">
                  ${product.price}
                </h3>
              </div>
              {product.discountPercentage > 0 && (
                <div className="col-auto">
                  <span className="badge bg-danger">
                    Save ${((product.price / (1 - product.discountPercentage / 100)) - product.price).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

       
          <div className="mb-4">
            {product.stock > 0 ? (
              <span className="badge bg-success p-2">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="badge bg-danger p-2">✗ Out of Stock</span>
            )}
          </div>

          
          <div className="mb-4">
            <h5 className="fw-bold">Description</h5>
            <p className="text-muted">{product.description}</p>
          </div>

         
          <div className="mb-4">
            <h5 className="fw-bold">Product Details</h5>
            <table className="table table-sm">
              <tbody>
                <tr>
                  <td className="fw-bold">Brand:</td>
                  <td>{product.brand || "N/A"}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Category:</td>
                  <td className="text-capitalize">{product.category}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Weight:</td>
                  <td>{product.weight || "N/A"} kg</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Quantity</label>
            <div className="d-flex gap-2 align-items-center">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isAdded}
              >
                -
              </button>
              <input
                type="number"
                className="form-control"
                style={{ width: "80px", textAlign: "center" }}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={product.stock}
                disabled={isAdded}
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock || isAdded}
              >
                +
              </button>
              <span className="text-muted small">
                {product.stock} available
              </span>
            </div>
          </div>

        
          <div className="d-flex gap-2 mb-4">
         
            <button
              onClick={handleAddToCart}
              disabled={isAdded || isAdding || !session || product.stock === 0}
              className={`btn btn-lg flex-grow-1 text-white ${
                isAdded ? "btn-success" : "btn-primary"
              }`}
              style={{
                cursor: isAdded || !session ? "not-allowed" : "pointer",
              }}
            >
              {!session
                ? "🔒 Login to Buy"
                : isAdding
                ? "⏳ Adding..."
                : isAdded
                ? "✓ Added to Cart"
                : "🛒 Add to Cart"}
            </button>

            {/* Wishlist */}
            <button
              onClick={handleWishlistToggle}
              className={`btn btn-lg ${
                isInWishlist ? "btn-danger" : "btn-outline-danger"
              }`}
              disabled={!session}
              title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {isInWishlist ? "❤️" : "🤍"}
            </button>
          </div>

       
          {!session && (
            <div className="alert alert-info" role="alert">
              <strong>Please log in</strong> to add this product to your cart or wishlist.
              <button
                className="btn btn-sm btn-info ms-2"
                onClick={() => router.push("/login")}
              >
                Login Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
