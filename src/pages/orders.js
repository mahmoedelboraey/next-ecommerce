
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

const STATUS_STYLES = {
  pending:    { bg: "#fff3cd", color: "#856404",  label: "⏳ Pending" },
  confirmed:  { bg: "#d1e7dd", color: "#0a3622",  label: "✅ Confirmed" },
  processing: { bg: "#cff4fc", color: "#055160",  label: "⚙️ Processing" },
  shipped:    { bg: "#d0d3ff", color: "#1a1a6e",  label: "🚚 Shipped" },
  delivered:  { bg: "#d1e7dd", color: "#0a3622",  label: "📦 Delivered" },
  cancelled:  { bg: "#f8d7da", color: "#58151c",  label: "❌ Cancelled" },
};

const PAYMENT_LABELS = {
  credit_card: "💳 Credit Card",
  paypal:      "🅿️ PayPal",
  cash:        "💵 Cash on Delivery",
  wallet:      "👛 Wallet",
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(null); // order مفتوحة

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((d) => { if (d.success) setOrders(d.orders); })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border" style={{ color: "#8B7355" }} />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-vh-100 py-5" style={{ background: "#f5f0eb" }}>
      <div className="container" style={{ maxWidth: 860 }}>

        
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="fw-bold mb-0" style={{ color: "#3d2b1f" }}>My Orders</h2>
            <p className="text-muted small mb-0">{orders.length} order{orders.length !== 1 ? "s" : ""} found</p>
          </div>
          <Link href="/product">
            <button className="btn btn-sm px-4 rounded-pill"
              style={{ background: "#8B7355", color: "white", border: "none" }}>
              + Shop More
            </button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 text-center p-5">
            <div style={{ fontSize: "4rem" }}>📦</div>
            <h4 className="fw-bold mt-3" style={{ color: "#3d2b1f" }}>No orders yet</h4>
            <p className="text-muted">Start shopping and your orders will appear here.</p>
            <Link href="/product">
              <button className="btn px-4 mt-2 rounded-pill"
                style={{ background: "#8B7355", color: "white", border: "none" }}>
                Browse Products
              </button>
            </Link>
          </div>
        ) : (

          <div className="d-flex flex-column gap-3">
            {orders.map((order) => {
              const s = STATUS_STYLES[order.status] || STATUS_STYLES.confirmed;
              const isOpen = expanded === order._id;

              return (
                <div key={order._id} className="card border-0 shadow-sm rounded-4 overflow-hidden">

                 
                  <div className="card-body p-4">
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">

                      <div>
                        <p className="text-muted small mb-1">Order Number</p>
                        <h6 className="fw-bold mb-0" style={{ color: "#3d2b1f" }}>
                          #{order.orderNumber}
                        </h6>
                      </div>

                      <div>
                        <p className="text-muted small mb-1">Date</p>
                        <h6 className="fw-semibold mb-0">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "short", day: "numeric"
                          })}
                        </h6>
                      </div>

                      <div>
                        <p className="text-muted small mb-1">Total</p>
                        <h6 className="fw-bold mb-0 text-success">
                          ${order.total?.toFixed(2)}
                        </h6>
                      </div>

                      <div>
                        <p className="text-muted small mb-1">Payment</p>
                        <h6 className="fw-semibold mb-0" style={{ fontSize: "0.85rem" }}>
                          {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                        </h6>
                      </div>

                      <div className="d-flex flex-column align-items-end gap-2">
                        <span className="badge rounded-pill px-3 py-2"
                          style={{ background: s.bg, color: s.color, fontSize: "0.8rem" }}>
                          {s.label}
                        </span>
                        <button
                          className="btn btn-sm rounded-pill px-3"
                          style={{ border: "1px solid #8B7355", color: "#8B7355", fontSize: "0.8rem" }}
                          onClick={() => setExpanded(isOpen ? null : order._id)}>
                          {isOpen ? "Hide Details ▲" : "View Details ▼"}
                        </button>
                      </div>

                    </div>

                    <div className="d-flex gap-2 mt-3 flex-wrap">
                      {order.items.slice(0, 4).map((item, i) => (
                        <div key={i} style={{ position: "relative" }}>
                          <img src={item.thumbnail} alt={item.title}
                            style={{ width: 48, height: 48, objectFit: "cover",
                              borderRadius: 8, border: "2px solid #e8ddd4" }} />
                          {item.quantity > 1 && (
                            <span style={{
                              position: "absolute", top: -6, right: -6,
                              background: "#8B7355", color: "white",
                              borderRadius: "50%", width: 18, height: 18,
                              fontSize: "0.65rem", display: "flex",
                              alignItems: "center", justifyContent: "center",
                            }}>
                              {item.quantity}
                            </span>
                          )}
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div style={{
                          width: 48, height: 48, borderRadius: 8,
                          background: "#e8ddd4", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          fontSize: "0.75rem", color: "#8B7355", fontWeight: "bold"
                        }}>
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ borderTop: "1px solid #e8ddd4", background: "#faf7f4" }}>
                      <div className="p-4">

                        <div className="row g-4">

                          {/* Items */}
                          <div className="col-md-7">
                            <h6 className="fw-bold mb-3" style={{ color: "#3d2b1f" }}>
                              Items ({order.items.length})
                            </h6>
                            <div className="d-flex flex-column gap-2">
                              {order.items.map((item, i) => (
                                <div key={i} className="d-flex gap-3 align-items-center p-2 rounded-3"
                                  style={{ background: "white" }}>
                                  <img src={item.thumbnail} alt={item.title}
                                    style={{ width: 54, height: 54, objectFit: "cover", borderRadius: 8 }} />
                                  <div className="flex-grow-1">
                                    <p className="mb-0 fw-semibold small">{item.title}</p>
                                    <small className="text-muted">Qty: {item.quantity}</small>
                                  </div>
                                  <span className="fw-bold text-success small">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>


                          <div className="col-md-5">
                            <h6 className="fw-bold mb-3" style={{ color: "#3d2b1f" }}>
                              Shipping Address
                            </h6>
                            <div className="p-3 rounded-3 mb-3" style={{ background: "white" }}>
                              <p className="mb-1 fw-semibold">
                                {order.shippingInfo?.firstName} {order.shippingInfo?.lastName}
                              </p>
                              <p className="mb-1 small text-muted">{order.shippingInfo?.address}</p>
                              <p className="mb-1 small text-muted">
                                {order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.zipCode}
                              </p>
                              <p className="mb-0 small text-muted">{order.shippingInfo?.phone}</p>
                            </div>

                            <h6 className="fw-bold mb-3" style={{ color: "#3d2b1f" }}>Price Breakdown</h6>
                            <div className="p-3 rounded-3" style={{ background: "white" }}>
                              {[
                                { l: "Subtotal",  v: `$${order.subtotal?.toFixed(2)}` },
                                { l: "Tax (10%)", v: `$${order.tax?.toFixed(2)}` },
                                { l: "Shipping",  v: "Free", cls: "text-success" },
                                ...(order.discount > 0 ? [{ l: "Discount", v: `-$${order.discount?.toFixed(2)}`, cls: "text-success" }] : []),
                              ].map(({ l, v, cls }) => (
                                <div key={l} className="d-flex justify-content-between mb-1">
                                  <small className="text-muted">{l}</small>
                                  <small className={cls}>{v}</small>
                                </div>
                              ))}
                              <hr className="my-2" />
                              <div className="d-flex justify-content-between fw-bold">
                                <span>Total</span>
                                <span className="text-success">${order.total?.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}