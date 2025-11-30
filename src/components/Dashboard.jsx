import React from 'react'

function StatCard({ title, value, hint }) {
  return (
    <div className="card">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-400">{hint}</div>}
    </div>
  )
}

export default function Dashboard({ products = [] }) {
  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock <= 10).length;
  const expiredList = products.filter((p) => new Date(p.expiryDate) < new Date());
  const expired = expiredList.length;
  const totalValue = products.reduce((s, p) => s + p.stock * (p.price || 0), 0);

  return (
    <div className="space-y-4 flex flex-col gap-2 mt-8">
      <h2 className="text-3xl  font-bold font-poppins mb-3 mt-10">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total products" value={totalProducts} />
        <StatCard title="Low stock" value={lowStock} hint="&lt;= 10 units" />
        <StatCard title="Expired" value={expired} />
        <StatCard title="Inventory value" value={`₱${totalValue.toFixed(2)}`} />
      </div>

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
                  <span className="text-green-600 font-semibold">Expired: {p.expiryDate}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
