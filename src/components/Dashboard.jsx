import { useEffect, useState } from "react";
import { fetchSummary } from "../api/products";

function StatCard({ title, value, hint }) {
  return (
    <div className="card">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-400">{hint}</div>}
    </div>
  );
}

function ListSection({ title, items, emptyMessage, renderItem }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {!items || items.length === 0 || typeof items === 'string' ? (
        <div className="text-gray-400 p-2">
          {typeof items === 'string' ? items : emptyMessage}
        </div>
      ) : (
        <ul className="space-y-1">
          {items.map(renderItem)}
        </ul>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await fetchSummary();
      setSummary(data);
    } catch (err) {
      console.log("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 flex flex-col gap-2 mt-8">
        <h2 className="text-3xl font-bold font-poppins mb-3 mt-10">
          Dashboard
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="space-y-4 flex flex-col gap-2 mt-8">
        <h2 className="text-3xl font-bold font-poppins mb-3 mt-10">
          Dashboard
        </h2>
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          {error || "Failed to load dashboard data. Please try again."}
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 self-start"
        >
          Retry
        </button>
      </div>
    );
  }

  const { total_products, low_stock, expired, inventory_value } =
    summary.summary;
  const { expired_medicines = [], low_stock_items = [], soon_to_expire = [] } =
    summary.details || {};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4 flex flex-col gap-2 mt-8">
      <h2 className="text-3xl font-bold font-poppins mb-3 mt-10">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total products" value={total_products} />
        <StatCard title="Low stock" value={low_stock} hint="<= 10 units" />
        <StatCard title="Expired" value={expired} />
        <StatCard title="Inventory value" value={inventory_value} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card col-span-2">
          <h3 className="text-lg font-semibold mb-2">Expired Medicines</h3>
          {!expired_medicines || expired_medicines.length === 0 || expired_medicines === "No expired medicines." ? (
            <div className="text-gray-400 p-2">
              {typeof expired_medicines === 'string' ? expired_medicines : "No expired medicines."}
            </div>
          ) : (
            <ul className="space-y-1">
              {expired_medicines.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between border-b last:border-b-0 py-2"
                >
                  <span>
                    {p.name} ({p.sku})
                  </span>
                  <span className="text-red-600 font-semibold">
                    Expired: {formatDate(p.expiry_date)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-2">
          Low Stock Items (less than 10)
        </h3>

        {!low_stock_items || low_stock_items.length === 0 || low_stock_items === "No low stock items." ? (
          <div className="text-gray-400 p-2">
            {typeof low_stock_items === 'string' ? low_stock_items : "No low stock items."}
          </div>
        ) : (
          <ul className="space-y-1">
            {low_stock_items.map((p) => (
              <li
                key={p.id}
                className="flex justify-between border-b last:border-b-0 py-2"
              >
                <span>
                  {p.name} ({p.sku})
                </span>
                <span className="text-yellow-600 font-semibold">
                  Stock: {p.stock}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-2">
          Soon to Expire (Next 30 Days)
        </h3>

        {!soon_to_expire || soon_to_expire.length === 0 || soon_to_expire === "No medicines expiring soon." ? (
          <div className="text-gray-400 p-2">
            {typeof soon_to_expire === 'string' ? soon_to_expire : "No medicines expiring soon."}
          </div>
        ) : (
          <ul className="space-y-1">
            {soon_to_expire.map((p) => (
              <li
                key={p.id}
                className="flex justify-between border-b last:border-b-0 py-2"
              >
                <span>
                  {p.name} ({p.sku})
                </span>
                <span className="text-orange-600 font-semibold">
                  Expires: {formatDate(p.expiry_date)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}