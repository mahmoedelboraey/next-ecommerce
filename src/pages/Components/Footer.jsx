"use client"
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaCcVisa,
  FaCcPaypal,
  FaCcMastercard,
  FaShippingFast,
  FaHeadset,
  FaLock,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 mt-5">
      <div className="container">
        <div className="row g-4 pb-4">
          <div className="col-lg-4 col-md-6">
            <h2 className="fw-bold mb-3 text-warning">ShopHub</h2>

            <p className="text-secondary">
              Discover premium products with the best prices and fast delivery.
              Your trusted online shopping destination.
            </p>

            <div className="d-flex gap-3 mt-4">
              <a href="#" className="social-icon">
                <FaFacebookF />
              </a>

              <a href="#" className="social-icon">
                <FaInstagram />
              </a>

              <a href="#" className="social-icon">
                <FaTwitter />
              </a>

              <a href="#" className="social-icon">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

     
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3">Quick Links</h5>

            <ul className="list-unstyled footer-links">
              <li>
                <Link href="/">Home</Link>
              </li>

              <li>
                <Link href="/wishlist">whishList</Link>
              </li>
              <li>
                <Link href="/cart">Cart</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">Customer Support</h5>

            <div className="d-flex align-items-center gap-3 mb-3">
              <FaShippingFast className="text-warning fs-4" />

              <div>
                <h6 className="mb-0">Fast Delivery</h6>
                <small className="text-secondary">
                  Delivery within 2-5 days
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <FaHeadset className="text-warning fs-4" />

              <div>
                <h6 className="mb-0">24/7 Support</h6>
                <small className="text-secondary">
                  Friendly customer service
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <FaLock className="text-warning fs-4" />

              <div>
                <h6 className="mb-0">Secure Payment</h6>
                <small className="text-secondary">
                  100% protected payments
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className="border-top border-secondary py-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-3 mb-md-0 text-secondary">
            © 2026 ShopHub. All Rights Reserved.
          </p>

          <div className="d-flex gap-3 fs-3 text-light">
            <FaCcVisa />
            <FaCcPaypal />
            <FaCcMastercard />
          </div>
        </div>
      </div>
      <style jsx>{`
        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: #adb5bd;
          text-decoration: none;
          transition: 0.3s;
        }

        .footer-links a:hover {
          color: #ffc107;
          padding-left: 5px;
        }

        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #212529;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: 0.3s;
          text-decoration: none;
          border: 1px solid #343a40;
        }

        .social-icon:hover {
          background: #ffc107;
          color: black;
          transform: translateY(-4px);
        }
      `}</style>
    </footer>
  );
}