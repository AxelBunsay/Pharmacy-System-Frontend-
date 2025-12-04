import React, { useState, useRef } from 'react';
import { exportToCSV } from '../utils/csv';
import { ResponsiveLine } from '@nivo/line';

export default function Reports({ products = [] }) {
  const [filter, setFilter] = useState("daily");
  const salesPrintRef = useRef(null); // Reference for Sales Report print

  // PRINT HANDLER
  const handlePrint = () => {
    const printContent = salesPrintRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // restore UI
  };

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
      <h2 className="text-3xl font-bold mb-4 mt-16">Reports</h2>

      {/* INVENTORY REPORT */}
      <div className="card mb-6">
        <h3 className="font-semibold text-lg">Inventory Export</h3>
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

      {/* SALES REPORT WITH PRINT BUTTON */}
      <div className="card mb-6" ref={salesPrintRef}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">Sales Report</h3>

          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border text-sm px-2 py-1 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition cursor-pointer"
            >
              <option value="daily">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>

            {/* PRINT BUTTON */}
            <button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded transition"
            >
              Print
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          Filter sales activity by time range.
        </p>

        <div className="mt-2">
          <h4 className="font-semibold text-gray-700">
            Showing: {filter.charAt(0).toUpperCase() + filter.slice(1)} Sales Report
          </h4>

          {filteredData.length === 0 ? (
            <p className="text-gray-400 text-sm">No sales activity found.</p>
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

        {/* SALES LINE CHART FILTERED */}
        <div className="bg-white rounded shadow p-4 mt-6" style={{ height: 300 }}>
          <h3 className="text-lg font-semibold mb-2">
            {filter === 'daily' && 'Sales (Weekly)'}
            {filter === 'monthly' && 'Sales (Monthly)'}
            {filter === 'annual' && 'Sales (Annual)'}
          </h3>
          <ResponsiveLine
            data={
              filter === 'daily'
                ? [{
                    id: 'Sales',
                    color: 'hsl(205, 70%, 50%)',
                    data: [
                      { x: 'Week 1', y: 120 },
                      { x: 'Week 2', y: 210 },
                      { x: 'Week 3', y: 150 },
                      { x: 'Week 4', y: 300 },
                    ],
                  }]
                : filter === 'monthly'
                ? [{
                    id: 'Sales',
                    color: 'hsl(205, 70%, 50%)',
                    data: [
                      { x: 'Jan', y: 800 },
                      { x: 'Feb', y: 950 },
                      { x: 'Mar', y: 700 },
                      { x: 'Apr', y: 1200 },
                      { x: 'May', y: 1100 },
                      { x: 'Jun', y: 1300 },
                      { x: 'Jul', y: 900 },
                      { x: 'Aug', y: 1000 },
                      { x: 'Sep', y: 1150 },
                      { x: 'Oct', y: 1250 },
                      { x: 'Nov', y: 1400 },
                      { x: 'Dec', y: 1500 },
                    ],
                  }]
                : [{
                    id: 'Sales',
                    color: 'hsl(205, 70%, 50%)',
                    data: [
                      { x: '2021', y: 12000 },
                      { x: '2022', y: 18000 },
                      { x: '2023', y: 15000 },
                      { x: '2024', y: 20000 },
                      { x: '2025', y: 22000 },
                    ],
                  }]
            }
            margin={{ top: 30, right: 40, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend:
                filter === 'daily'
                  ? 'Week'
                  : filter === 'monthly'
                  ? 'Month'
                  : 'Year',
              legendOffset: 36,
              legendPosition: 'middle',
            }}
            axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Sales',
              legendOffset: -50,
              legendPosition: 'middle',
            }}
            colors={{ scheme: 'nivo' }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            enableSlices="x"
          />
        </div>
      </div>

      {/* STOCK HEALTH REPORT (NO PRINT BUTTON) */}
      <div className="card mb-6">
        <h3 className="font-semibold text-lg mb-3">Stock Health Report</h3>

        <p className="text-sm text-gray-500 mb-3">
          Overall stock status of all products.
        </p>

        <ul className="mt-2 space-y-1">
          {products.length === 0 ? (
            <p className="text-gray-400 text-sm">No stock data found.</p>
          ) : (
            products.map((p) => (
              <li
                key={p.id}
                className="flex justify-between border-b last:border-b-0 py-1 text-sm"
              >
                <span>{p.name}</span>
                <span className="text-gray-600">Stock: {p.stock}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
