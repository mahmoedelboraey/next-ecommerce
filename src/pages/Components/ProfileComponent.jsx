"use client"
import React from 'react'
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

function ProfileComponent() {

    const { data: session, status } = useSession();
  const router = useRouter();
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((d) => { if (d.success) setOrdersCount(d.orders.length); })
        .catch(console.error);
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ background: "#f5f0eb" }}>
        <div className="spinner-border" style={{ color: "#8B7355" }} />
      </div>
    );
  }

  if (!session) return null;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const initial = session.user?.name?.charAt(0)?.toUpperCase() || "U";
  return (
    <div>
       <div className="min-vh-100 py-5" style={{ background: "#f5f0eb" }}>
            <div className="container" style={{ maxWidth: 680 }}>
      
           
              <div className="text-center mb-4">
                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle shadow"
                  style={{ width: 90, height: 90, background: "#8B7355", fontSize: "2.5rem", color: "white" }}>
                  {session.user?.image ? (
                    <img src={session.user.image} alt="avatar"
                      style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover" }} />
                  ) : initial}
                </div>
                <h3 className="fw-bold mb-1" style={{ color: "#3d2b1f" }}>
                  {session.user?.name}
                </h3>
                <p className="text-muted">{session.user?.email}</p>
              </div>
      
         
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="card border-0 shadow-sm rounded-4 text-center p-3">
                    <div style={{ fontSize: "2rem" }}>📦</div>
                    <h4 className="fw-bold mb-0" style={{ color: "#8B7355" }}>{ordersCount}</h4>
                    <small className="text-muted">Total Orders</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card border-0 shadow-sm rounded-4 text-center p-3">
                    <div style={{ fontSize: "2rem" }}>✅</div>
                    <h4 className="fw-bold mb-0" style={{ color: "#8B7355" }}>Active</h4>
                    <small className="text-muted">Account Status</small>
                  </div>
                </div>
              </div>
      
          
              <div className="card border-0 shadow-sm rounded-4 mb-3">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ color: "#3d2b1f" }}>Account Information</h6>
      
                  <div className="d-flex justify-content-between align-items-center py-2"
                    style={{ borderBottom: "1px solid #e8ddd4" }}>
                    <span className="text-muted small">Full Name</span>
                    <span className="fw-semibold">{session.user?.name || "—"}</span>
                  </div>
      
                  <div className="d-flex justify-content-between align-items-center py-2"
                    style={{ borderBottom: "1px solid #e8ddd4" }}>
                    <span className="text-muted small">Email</span>
                    <span className="fw-semibold">{session.user?.email || "—"}</span>
                  </div>
      
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <span className="text-muted small">Login Method</span>
                    <span className="fw-semibold">
                      {session.user?.image?.includes("google") ? "🔵 Google"
                        : session.user?.image?.includes("github") ? "⚫ GitHub"
                        : "📧 Email"}
                    </span>
                  </div>
                </div>
              </div>
      
           
              <div className="card border-0 shadow-sm rounded-4 mb-3">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ color: "#3d2b1f" }}>Quick Links</h6>
                  <div className="d-flex flex-column gap-2">
                    {[
                      { href: "/orders",   icon: "📦", label: "My Orders" },
                      { href: "/wishlist", icon: "❤️", label: "My Wishlist" },
                      { href: "/cart",     icon: "🛒", label: "My Cart" },
                      { href: "/product",  icon: "🛍️", label: "Browse Products" },
                    ].map(({ href, icon, label }) => (
                      <Link key={href} href={href}
                        className="d-flex align-items-center gap-3 p-2 rounded-3 text-decoration-none"
                        style={{ color: "#3d2b1f", transition: "background 0.2s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#e8ddd4"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                        <span style={{ fontSize: "1.3rem" }}>{icon}</span>
                        <span className="fw-semibold">{label}</span>
                        <span className="ms-auto text-muted">›</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
      
              
              <button onClick={handleLogout} className="btn w-100 rounded-4 py-3 fw-bold"
                style={{ background: "#fff", border: "2px solid #dc3545", color: "#dc3545", fontSize: "1rem" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#dc3545"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#dc3545"; }}>
                🚪 Logout
              </button>
      
            </div>
          </div>
    </div>
  )
}

export default ProfileComponent
