import React from 'react'
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import Link from "next/link";
function CartComponent() {

      const {
    cart,
    isLoading,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    appliedPromo,
    discount,
    applyPromoCode,
    removePromoCode,
  } = useContext(CartContext);

  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    setIsApplyingPromo(true);
    const result = await applyPromoCode(promoCode);

    if (result.success) {
      setPromoSuccess(
        `Promo code applied! ${result.promo.discountType === "percentage" ? result.promo.discount + "%" : "$" + result.promo.discount} off`
      );
      setPromoCode("");
    } else {
      setPromoError(result.error || "Failed to apply promo code");
    }
    setIsApplyingPromo(false);
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h2 className="mb-3">Your Cart is Empty</h2>
            <p className="text-muted mb-4">
              Start shopping to add items to your cart.
            </p>
            <Link href="/product">
              <button className="btn btn-primary btn-lg">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const finalDiscount = appliedPromo ? discount : 0;
  const total = subtotal + tax - finalDiscount;

  return (
      <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <h1 className="mb-4">🛒 Shopping Cart</h1>

        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "80px" }}>Image</th>
                      <th>Product</th>
                      <th style={{ width: "100px" }}>Price</th>
                      <th style={{ width: "150px" }}>Quantity</th>
                      <th style={{ width: "120px" }}>Total</th>
                      <th style={{ width: "80px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map((item) => (
                      <tr key={item.productId} className="align-middle">
                        <td>
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            style={{
                              width: "70px",
                              height: "70px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        </td>
                        <td>
                          <div>
                            <h6 className="mb-1">{item.title}</h6>
                            <small className="text-muted">
                              {item.description?.slice(0, 40)}...
                            </small>
                          </div>
                        </td>
                        <td className="fw-bold">${item.price.toFixed(2)}</td>
                        <td>
                          <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              gap: "8px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              padding: "4px",
                              width: "fit-content",
                            }}
                          >
                            <button
                              className="btn btn-sm"
                              style={{
                                background: "none",
                                border: "none",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                                padding: "0 4px",
                              }}
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.productId,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              style={{
                                width: "50px",
                                border: "none",
                                textAlign: "center",
                                fontWeight: "600",
                              }}
                            />
                            <button
                              className="btn btn-sm"
                              style={{
                                background: "none",
                                border: "none",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                                padding: "0 4px",
                              }}
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="fw-bold text-success">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
              <div className="card-body">
                <h5 className="card-title mb-4">Order Summary</h5>

                {/* Promo Code Section */}
                <div className="mb-4">
                  <form onSubmit={handleApplyPromo}>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={isApplyingPromo || !!appliedPromo}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="submit"
                        disabled={
                          isApplyingPromo ||
                          !!appliedPromo ||
                          !promoCode.trim()
                        }
                      >
                        {isApplyingPromo ? "..." : "Apply"}
                      </button>
                    </div>
                  </form>

                  {promoError && (
                    <small className="text-danger d-block mt-2">
                      {promoError}
                    </small>
                  )}
                  {promoSuccess && (
                    <small className="text-success d-block mt-2">
                      ✓ {promoSuccess}
                    </small>
                  )}
                </div>

                {appliedPromo && (
                  <div className="alert alert-info py-2 px-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <small>
                        <strong>{appliedPromo.code}</strong> applied
                      </small>
                      <button
                        className="btn btn-sm"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "0",
                        }}
                        onClick={removePromoCode}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span className="text-success">Free</span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Tax (10%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  {appliedPromo && (
                    <div className="d-flex justify-content-between mb-3 text-success">
                      <span>Discount:</span>
                      <span>-${finalDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <hr />

                  <div className="d-flex justify-content-between mb-4">
                    <strong>Total:</strong>
                    <strong className="text-success fs-5">
                      ${total.toFixed(2)}
                    </strong>
                  </div>
                </div>

                <Link href="/checkout">
                  <button className="btn btn-success w-100 mb-2 btn-lg">
                    Proceed to Checkout
                  </button>
                </Link>

                <Link href="/product">
                  <button className="btn btn-outline-secondary w-100">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   
  )
}

export default CartComponent
