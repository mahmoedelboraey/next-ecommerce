"use client"
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import FilterSidebar from "./FilterSidebar";

export default function ProductList({ products: initialProducts = [], isLoading = false }) {
  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openSidebar, setOpenSidebar] = useState(false);

  const productsPerPage = 12;

  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = ["all", ...new Set(products.map((p) => p.category))];
      setCategories(uniqueCategories);
    }
  }, [products]);

  useEffect(() => {
    setProducts(initialProducts);
    setFilteredProducts(initialProducts);
    setCurrentPage(1);
  }, [initialProducts]);

  useEffect(() => {
    let result = [...products];

    if (search) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedPrice) {
      result = result.filter(
        (p) => p.price >= selectedPrice.min && p.price <= selectedPrice.max
      );
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [search, selectedCategory, selectedPrice, products]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div>
      <div className="d-md-none d-flex justify-content-between align-items-center bg-dark text-white p-3 mb-3">
        <h5 className="m-0">Products</h5>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => setOpenSidebar(true)}
        >
          ☰ Filters
        </button>
      </div>

      <div className="d-flex align-items-start gap-0">
        {openSidebar && (
          <div
            onClick={() => setOpenSidebar(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              zIndex: 99,
            }}
          />
        )}

        <div
          className="d-md-none"
          style={{
            position: "fixed",
            top: 0,
            left: openSidebar ? 0 : "-300px",
            width: "280px",
            height: "100vh",
            background: "rgba(89,74,123,1)",
            color: "white",
            zIndex: 100,
            transition: "0.3s",
            overflowY: "auto",
          }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-light">
            <h5 className="m-0">Filters</h5>
            <button
              className="btn btn-light btn-sm"
              onClick={() => setOpenSidebar(false)}
            >
              ✕
            </button>
          </div>
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            search={search}
            setSearch={setSearch}
            onMobileClose={() => setOpenSidebar(false)}
          />
        </div>

        <div
          className="d-none d-md-block"
          style={{
            width: "280px",
            minWidth: "280px",
            maxWidth: "280px",
            height: "100vh",
            position: "sticky",
            top: 0,
            background: "rgba(89,74,123,1)",
            color: "white",
            overflowY: "auto",
            borderRight: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            search={search}
            setSearch={setSearch}
          />
        </div>

        <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: "100vh" }}>
          <div className="mb-4">
            <p className="text-muted">
              Showing {currentProducts.length > 0 ? startIndex + 1 : 0} - {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
            </p>
          </div>

          {isLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!isLoading && currentProducts.length === 0 && (
            <div className="text-center py-5">
              <h5 className="text-muted">No products found</h5>
              <p className="text-muted">Try adjusting your filters or search query</p>
            </div>
          )}

          {!isLoading && currentProducts.length > 0 && (
            <div className="row g-4 mb-4">
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"
                >
                  <ProductCard product={product} showViewDetails={true} />
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
