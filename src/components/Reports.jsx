import React, { useState } from 'react'
import { exportToCSV } from '../utils/csv'

export default function Reports({ products = [] }) {
  const [filter, setFilter] = useState("daily");

  // Filter logic
  const getFilteredStockData = () => {
    const today = new Date();

    return products.filter((p) => {
      const date = new Date(p.updatedAt || p.createdAt || p.expiryDate);

      if (filter === "daily") {
        return (
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      }

      if (filter === "monthly") {
        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );
      }

      if (filter === "annual") {
        return date.getFullYear() === today.getFullYear();
      }

      return true;
    });
  };

  const filteredData = getFilteredStockData();

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 mt-16">Sales</h2>

      {/* INVENTORY REPORT (TOP) */}
      <div className="card mb-6">
        <h3 className="font-semibold">Inventory export</h3>
        <p className="text-sm text-gray-500">
          Download current inventory snapshot as CSV.
        </p>
        <div className="mt-3">
          <button
            onClick={() => exportToCSV("inventory-report.csv", products)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition"
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* STOCK HEALTH (BELOW INVENTORY REPORT) */}
      {/* STOCK HEALTH (BELOW INVENTORY REPORT) */}
<div className="card">
  
  {/* HEADER + FILTER */}
  <div className="flex justify-between items-center mb-3">
    <h3 className="font-semibold">Stock health</h3>

    {/* Small stylish filter */}
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className="border text-sm px-2 py-1 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition cursor-pointer"
    >
      <option value="daily">Daily</option>
      <option value="monthly">Monthly</option>
      <option value="annual">Annual</option>
    </select>
  </div>

  <p className="text-sm text-gray-500 mb-3">
    Filter stock activity by time range.
  </p>

  {/* RESULTS DISPLAY */}
  <div className="mt-2">
    <h4 className="font-semibold text-gray-700">
      Showing: {filter.charAt(0).toUpperCase() + filter.slice(1)} Report
    </h4>

    {filteredData.length === 0 ? (
      <p className="text-gray-400 text-sm">No stock activity found.</p>
    ) : (
      <ul className="mt-2 space-y-1">
        {filteredData.map((p) => (
          <li
            key={p.id}
            className="flex justify-between border-b last:border-b-0 py-1 text-sm"
          >
            <span>{p.name}</span>
            <span className="text-gray-600">Stock: {p.stock}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>


    </div>
  );
}
