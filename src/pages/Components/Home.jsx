import { useState, useEffect } from "react";
import HeroSectionHome from "./HeroSectionHome";
import ProductList from "./ProductList";

function Home() {
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
    <div>
      <HeroSectionHome />

      
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="fw-bold mb-2">Featured Products</h2>
            <p className="text-muted">Check out our latest and most popular items</p>
          </div>
        </div>
      </div>

      <ProductList products={products} isLoading={isLoading} />
    </div>
  );
}

export default Home;