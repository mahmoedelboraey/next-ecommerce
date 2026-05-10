
import { useSession } from "next-auth/react";
import CartComponent from "./Components/CartComponent";
import Link from "next/link";

function Cart() {
  const { data: session, status } = useSession();


  if (status === "loading") {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }


  if (!session) {
    return (
      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <div className="card shadow-lg">
                <div className="card-body p-5">
                  <h2 className="mb-3">🛒 Your Cart</h2>
                  <p className="text-muted mb-4 fs-5">
                    Please login first to view your personal cart and manage your items.
                  </p>
                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <Link href="/login">
                      <button className="btn btn-primary btn-lg">
                        Sign In
                      </button>
                    </Link>
                    <Link href="/register">
                      <button className="btn btn-outline-primary btn-lg">
                        Create Account
                      </button>
                    </Link>
                  </div>
                  <hr className="my-4" />
                  <p className="text-muted">
                    Continue browsing products as a guest
                  </p>
                  <Link href="/product">
                    <button className="btn btn-outline-secondary btn-lg">
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

 
  return (
    <CartComponent />
  );
}

export default Cart;

