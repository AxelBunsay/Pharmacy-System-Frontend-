import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ResponsiveLine } from '@nivo/line';

function StatCard({ title, value, hint }) {
  return (
    <div className="card">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-400">{hint}</div>}
    </div>
  )
}

export default function Dashboard() {
    // Example monthly sales data for the line chart (replace with real sales data)
    const monthlySalesData = [
      {
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
      },
    ];
  const [products, setProducts] = useState([]);
  const [lowStockList, setLowStockList] = useState([]);
  const [soonToExpireList, setSoonToExpireList] = useState([]);

  // ⭐ Update this to your real API endpoint
  const API_URL = "http://localhost:5000/api/products";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      const data = res.data;

      setProducts(data);

      // Low stock items (<= 10)
      setLowStockList(data.filter((p) => p.stock <= 10));

      // Medicines expiring in the next 30 days
      const today = new Date();
      const soonDate = new Date();
      soonDate.setDate(today.getDate() + 30);

      const soonExpire = data.filter((p) => {
        const exp = new Date(p.expiryDate);
        return exp >= today && exp <= soonDate;
      });

      setSoonToExpireList(soonExpire);

    } catch (err) {
      console.log("Error fetching dashboard data:", err);
    }
  };

  const totalProducts = products.length;
  const expiredList = products.filter((p) => new Date(p.expiryDate) < new Date());
  const expired = expiredList.length;
  const totalValue = products.reduce((s, p) => s + p.stock * (p.price || 0), 0);

  // Example sales data for the line chart (replace with real sales data)
  const salesData = [
    {
      id: 'Sales',
      color: 'hsl(205, 70%, 50%)',
      data: [
        { x: 'Week 1', y: 6700 },
        { x: 'Week 2', y: 8000 },
        { x: 'Week 3', y: 5000 },
        { x: 'Week 4', y: 10000 },
      ],
    },
  ];

  return (
    <div className="space-y-4 flex flex-col gap-2 mt-8">
      <h2 className="text-3xl font-bold font-poppins mb-3 mt-10">Dashboard</h2>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total products" value={totalProducts} />
        <StatCard title="Low stock" value={lowStockList.length} hint="<= 10 units" />
        <StatCard title="Expired" value={expired} />
        <StatCard title="Inventory value" value={`₱${totalValue.toFixed(2)}`} />
      </div>

      {/* ...existing code... */}

      {/* EXPIRED LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card col-span-2">
          <h3 className="text-lg font-semibold mb-2">Expired Medicines</h3>
          {expiredList.length === 0 ? (
            <div className="text-gray-400">No expired medicines.</div>
          ) : (
            <ul className="space-y-1">
              {expiredList.map((p) => (
                <li key={p.id} className="flex justify-between border-b last:border-b-0 py-1">
                  <span>{p.name} ({p.sku})</span>
                  <span className="text-red-600 font-semibold">Expired: {p.expiryDate}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ⭐ LOW STOCK LIST FROM API */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-2">Low Stock Items (less than 10)</h3>

        {lowStockList.length === 0 ? (
          <div className="text-gray-400">No low stock items.</div>
        ) : (
          <ul className="space-y-1">
            {lowStockList.map((p) => (
              <li key={p.id} className="flex justify-between border-b last:border-b-0 py-1">
                <span>{p.name} ({p.sku})</span>
                <span className="text-yellow-600 font-semibold">Stock: {p.stock}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ⭐ SOON TO EXPIRE ITEMS FROM API */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-2">Soon to Expire (Next 30 Days)</h3>

        {soonToExpireList.length === 0 ? (
          <div className="text-gray-400">No medicines expiring soon.</div>
        ) : (
          <ul className="space-y-1">
            {soonToExpireList.map((p) => (
              <li key={p.id} className="flex justify-between border-b last:border-b-0 py-1">
                <span>{p.name} ({p.sku})</span>
                <span className="text-orange-600 font-semibold">
                  Expires: {p.expiryDate}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
