"use client"
import { useState, useEffect } from "react";
import ProductList from "./ProductList";

function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch("https://dummyjson.com/products?limit=100");
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <>
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "3rem 0",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 className="fw-bold mb-2">Our Products</h1>
        <p className="lead mb-0">Discover our complete collection of premium items</p>
      </div>

      <ProductList products={products} isLoading={isLoading} />
    </>
  );
}

export default Products;