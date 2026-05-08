import React, { useContext, useState } from "react";
import { CartContext } from "./context/CartContext";
import { useRouter } from "next/router";
import Link from "next/link";

function Checkout() {
  const router = useRouter();
  const { cart, isLoading, getCartTotal, appliedPromo, discount, clearCart } =
    useContext(CartContext);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
    if (!formData.email.includes("@"))
      newErrors.email = "Valid email required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number required";
    if (!formData.address.trim()) newErrors.address = "Address required";
    if (!formData.city.trim()) newErrors.city = "City required";
    if (!formData.state.trim()) newErrors.state = "State required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code required";

    if (paymentMethod === "credit_card") {
      if (formData.cardNumber.length !== 16)
        newErrors.cardNumber = "Card number must be 16 digits";
      if (!formData.expiryDate.match(/^\d{2}\/\d{2}$/))
        newErrors.expiryDate = "Format: MM/YY";
      if (formData.cvv.length !== 3) newErrors.cvv = "CVV must be 3 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      // Clear cart after successful order
      await clearCart();
      setOrderPlaced(true);
    }, 1500);
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
    if (!orderPlaced) {
      return (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h2>Your Cart is Empty</h2>
              <p className="text-muted">
                Add items to your cart before checkout.
              </p>
              <Link href="/product">
                <button className="btn btn-primary mt-3">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  if (orderPlaced) {
    return (
      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div
                className="card border-success bg-light"
                style={{ borderWidth: "2px" }}
              >
                <div className="card-body text-center py-5">
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      margin: "0 auto",
                      background: "#28a745",
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                      marginBottom: "20px",
                    }}
                  >
                    ✓
                  </div>

                  <h2 className="mb-2">Order Placed Successfully!</h2>
                  <p className="text-muted mb-4">
                    Thank you for your purchase. Your order has been confirmed.
                  </p>

                  <div
                    className="bg-white p-4 rounded"
                    style={{ marginBottom: "20px" }}
                  >
                    <p className="mb-2">
                      <strong>Order Number:</strong> #ORD
                      {Math.floor(Math.random() * 1000000).toString().padStart(6, "0")}
                    </p>
                    <p className="mb-2">
                      <strong>Payment Method:</strong>{" "}
                      {paymentMethod === "credit_card"
                        ? "Credit Card"
                        : paymentMethod === "paypal"
                        ? "PayPal"
                        : paymentMethod === "cash"
                        ? "Cash on Delivery"
                        : "Wallet"}
                    </p>
                    <p className="mb-0">
                      <strong>Email:</strong> {formData.email}
                    </p>
                  </div>

                  <Link href="/product">
                    <button className="btn btn-primary btn-lg">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
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
        <h1 className="mb-4">💳 Checkout</h1>

        <div className="row g-4">
          {/* Checkout Form */}
          <div className="col-lg-8">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-4 border-bottom pb-2">
                    Shipping Information
                  </h5>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        className={`form-control ${
                          errors.firstName ? "is-invalid" : ""
                        }`}
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                      {errors.firstName && (
                        <small className="text-danger">{errors.firstName}</small>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        className={`form-control ${
                          errors.lastName ? "is-invalid" : ""
                        }`}
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                      {errors.lastName && (
                        <small className="text-danger">{errors.lastName}</small>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && (
                      <small className="text-danger">{errors.email}</small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className={`form-control ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    {errors.phone && (
                      <small className="text-danger">{errors.phone}</small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      className={`form-control ${
                        errors.address ? "is-invalid" : ""
                      }`}
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                    {errors.address && (
                      <small className="text-danger">{errors.address}</small>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        name="city"
                        className={`form-control ${
                          errors.city ? "is-invalid" : ""
                        }`}
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                      {errors.city && (
                        <small className="text-danger">{errors.city}</small>
                      )}
                    </div>

                    <div className="col-md-3 mb-3">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        name="state"
                        className={`form-control ${
                          errors.state ? "is-invalid" : ""
                        }`}
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                      {errors.state && (
                        <small className="text-danger">{errors.state}</small>
                      )}
                    </div>

                    <div className="col-md-3 mb-3">
                      <label className="form-label">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        className={`form-control ${
                          errors.zipCode ? "is-invalid" : ""
                        }`}
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                      {errors.zipCode && (
                        <small className="text-danger">{errors.zipCode}</small>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-4 border-bottom pb-2">
                    Payment Method
                  </h5>

                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="credit_card"
                        value="credit_card"
                        checked={paymentMethod === "credit_card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="credit_card">
                        💳 Credit Card
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="paypal"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="paypal">
                        🅿️ PayPal
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="cash"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="cash">
                        💵 Cash on Delivery
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="wallet"
                        value="wallet"
                        checked={paymentMethod === "wallet"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="wallet">
                        👛 Wallet
                      </label>
                    </div>
                  </div>

                  {paymentMethod === "credit_card" && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          maxLength="16"
                          className={`form-control ${
                            errors.cardNumber ? "is-invalid" : ""
                          }`}
                          value={formData.cardNumber}
                          onChange={(e) => {
                            handleInputChange({
                              target: {
                                name: "cardNumber",
                                value: e.target.value.replace(/\D/g, ""),
                              },
                            });
                          }}
                        />
                        {errors.cardNumber && (
                          <small className="text-danger">
                            {errors.cardNumber}
                          </small>
                        )}
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            placeholder="MM/YY"
                            maxLength="5"
                            className={`form-control ${
                              errors.expiryDate ? "is-invalid" : ""
                            }`}
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                          />
                          {errors.expiryDate && (
                            <small className="text-danger">
                              {errors.expiryDate}
                            </small>
                          )}
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            placeholder="123"
                            maxLength="3"
                            className={`form-control ${
                              errors.cvv ? "is-invalid" : ""
                            }`}
                            value={formData.cvv}
                            onChange={(e) => {
                              handleInputChange({
                                target: {
                                  name: "cvv",
                                  value: e.target.value.replace(/\D/g, ""),
                                },
                              });
                            }}
                          />
                          {errors.cvv && (
                            <small className="text-danger">{errors.cvv}</small>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-success btn-lg w-100"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div
              className="card shadow-sm sticky-top"
              style={{ top: "20px" }}
            >
              <div className="card-body">
                <h5 className="card-title mb-4">Order Summary</h5>

                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    marginBottom: "16px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  {cart.items.map((item) => (
                    <div
                      key={item.productId}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "50px 1fr 80px",
                        gap: "12px",
                        alignItems: "flex-start",
                        marginBottom: "12px",
                      }}
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                      <div style={{ fontSize: "0.9rem" }}>
                        <p style={{ margin: "0", fontWeight: "500" }}>
                          {item.title}
                        </p>
                        <small className="text-muted">Qty: {item.quantity}</small>
                      </div>
                      <p style={{ fontWeight: "600", color: "#28a745" }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      fontSize: "0.95rem",
                    }}
                  >
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      fontSize: "0.95rem",
                    }}
                  >
                    <span>Shipping:</span>
                    <span className="text-success">Free</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      fontSize: "0.95rem",
                    }}
                  >
                    <span>Tax (10%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  {appliedPromo && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                        fontSize: "0.95rem",
                        color: "#28a745",
                      }}
                    >
                      <span>Discount:</span>
                      <span>-${finalDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <hr />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#28a745",
                  }}
                >
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

