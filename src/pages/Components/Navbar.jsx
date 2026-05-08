import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const { getCartQuantity } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const cartQuantity = getCartQuantity();
  const wishlistCount = wishlist?.items?.length || 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setIsDropdownOpen(false);
    router.push("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg"
      style={{ borderBottom: "2px solid #595a7b" }}
    >
      <div className="container-fluid">
        {/* Brand/Logo */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center"
          href="/Home"
          style={{ fontSize: "1.5rem", gap: "10px" }}
        >
          <span style={{ fontSize: "2rem" }}>🛍️</span>
          eShop
        </Link>

        {/* Mobile Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Navigation Menu */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="navbarNav">
          {/* Left Menu Items */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link fw-500" href="/Home" style={{ transition: "0.3s" }}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-500" href="/product" style={{ transition: "0.3s" }}>
                Products
              </Link>
            </li>
          </ul>

          {/* Right Menu Items */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center gap-3">
            {/* Cart Icon */}
            <li className="nav-item">
              <Link
                className="nav-link position-relative"
                href={session ? "/cart" : "/login"}
                title={session ? "Shopping Cart" : "Login to view cart"}
              >
                <span style={{ fontSize: "1.3rem" }}>🛒</span>
                {cartQuantity > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{
                      fontSize: "0.7rem",
                      marginTop: "-2px",
                      marginRight: "-8px",
                    }}
                  >
                    {cartQuantity}
                  </span>
                )}
              </Link>
            </li>

            {/* Wishlist Icon */}
            <li className="nav-item">
              <Link
                className="nav-link position-relative"
                href={session ? "/wishlist" : "/login"}
                title={session ? "Wishlist" : "Login to view wishlist"}
              >
                <span style={{ fontSize: "1.3rem" }}>❤️</span>
                {wishlistCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{
                      fontSize: "0.7rem",
                      marginTop: "-2px",
                      marginRight: "-8px",
                    }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </li>

            {/* User Info / Auth Buttons */}
            {session ? (
              // User Logged In - Dropdown
              <li className="nav-item dropdown position-relative" ref={dropdownRef} style={{ listStyle: "none" }}>
                <button
                  className="nav-link fw-500"
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>👤</span>
                  <span className="d-none d-lg-inline">{session.user?.name || "Account"}</span>
                  <span style={{ fontSize: "0.8rem", marginLeft: "4px" }}>▼</span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <ul
                    className="dropdown-menu show"
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      left: "auto",
                      minWidth: "200px",
                      backgroundColor: "white",
                      border: "1px solid #dee2e6",
                      borderRadius: "4px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      display: "block",
                      zIndex: 1000,
                      marginTop: "8px",
                      padding: "0.5rem 0",
                      animation: "slideDown 0.2s ease-out",
                    }}
                  >
                    <li>
                      <Link
                        className="dropdown-item"
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        style={{
                          display: "block",
                          padding: "0.5rem 1rem",
                          color: "#333",
                          textDecoration: "none",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#f8f9fa";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                        }}
                      >
                        👤 My Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        href="/orders"
                        onClick={() => setIsDropdownOpen(false)}
                        style={{
                          display: "block",
                          padding: "0.5rem 1rem",
                          color: "#333",
                          textDecoration: "none",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#f8f9fa";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                        }}
                      >
                        📦 My Orders
                      </Link>
                    </li>
                    <li style={{ borderTop: "1px solid #dee2e6", margin: "0.5rem 0" }} />
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "0.5rem 1rem",
                          color: "#dc3545",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#f8f9fa";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                        }}
                      >
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              // User Not Logged In
              <>
                <li className="nav-item">
                  <Link className="nav-link btn btn-outline-light btn-sm" href="/login" style={{ marginRight: "8px" }}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn btn-primary btn-sm text-white" href="/register">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .navbar-nav .nav-link:hover {
          color: #0d6efd !important;
          text-decoration: underline;
        }

        .nav-link {
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          transform: translateY(-2px);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-menu.show {
          animation: slideDown 0.2s ease-out;
        }

        @media (max-width: 768px) {
          .navbar-nav {
            gap: 0.5rem !important;
          }

          .nav-link {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }

          .dropdown-menu {
            position: fixed !important;
            right: 1rem !important;
            left: auto !important;
            width: auto !important;
            min-width: 180px !important;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;