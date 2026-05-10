import React, { useState } from "react";

const priceRanges = [
  { id: 1, label: "$0 - $100", min: 0, max: 100 },
  { id: 2, label: "$100 - $500", min: 100, max: 500 },
  { id: 3, label: "$500 - $1000", min: 500, max: 1000 },
  { id: 4, label: "$1000+", min: 1000, max: 10000 },
];

function FilterSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedPrice,
  setSelectedPrice,
  search,
  setSearch,
  onMobileClose,
}) {
  const [isExpanded, setIsExpanded] = useState({
    search: true,
    category: true,
    price: true,
  });

  const toggleSection = (section) => {
    setIsExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onMobileClose?.();
  };

  const handlePriceChange = (priceRange) => {
    setSelectedPrice(
      selectedPrice?.id === priceRange.id ? null : priceRange
    );
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedPrice(null);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      className="p-3"
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-bold text-white">Filters</h5>
        <button
          className="btn btn-sm btn-outline-light"
          onClick={handleResetFilters}
        >
          Reset
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-3">
        <div
          onClick={() => toggleSection("search")}
          style={{
            cursor: "pointer",
            padding: "8px 0",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <h6 className="text-white mb-0" style={{ fontSize: "14px" }}>
            Search {isExpanded.search ? "▼" : "▶"}
          </h6>
        </div>
        {isExpanded.search && (
          <input
            className="form-control mt-2"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", color: "white" }}
          />
        )}
      </div>

     
      <div className="mb-3">
        <div
          onClick={() => toggleSection("category")}
          style={{
            cursor: "pointer",
            padding: "8px 0",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <h6 className="text-white mb-0" style={{ fontSize: "14px" }}>
            Categories {isExpanded.category ? "▼" : "▶"}
          </h6>
        </div>
        {isExpanded.category && (
          <div className="d-flex flex-column gap-2 mt-2">
            <label className="form-check text-white" style={{ cursor: "pointer" }}>
              <input
                type="radio"
                className="form-check-input"
                checked={selectedCategory === "all"}
                onChange={() => handleCategoryChange("all")}
                style={{ cursor: "pointer" }}
              />
              <span style={{ marginLeft: "8px" }}>All Categories</span>
            </label>

            {categories.map((cat, i) => (
              <label key={i} className="form-check text-white" style={{ cursor: "pointer" }}>
                <input
                  type="radio"
                  className="form-check-input"
                  checked={selectedCategory === cat}
                  onChange={() => handleCategoryChange(cat)}
                  style={{ cursor: "pointer" }}
                />
                <span style={{ marginLeft: "8px", textTransform: "capitalize" }}>{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      
      <div className="mb-3">
        <div
          onClick={() => toggleSection("price")}
          style={{
            cursor: "pointer",
            padding: "8px 0",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <h6 className="text-white mb-0" style={{ fontSize: "14px" }}>
            Price Range {isExpanded.price ? "▼" : "▶"}
          </h6>
        </div>
        {isExpanded.price && (
          <div className="d-flex flex-column gap-2 mt-2">
            {priceRanges.map((p) => (
              <label key={p.id} className="form-check text-white" style={{ cursor: "pointer" }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedPrice?.id === p.id}
                  onChange={() => handlePriceChange(p)}
                  style={{ cursor: "pointer" }}
                />
                <span style={{ marginLeft: "8px" }}>{p.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterSidebar;