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
  const totalProducts = products.length
  const lowStock = products.filter((p) => p.stock <= 10).length
  const expired = products.filter((p) => new Date(p.expiryDate) < new Date()).length
  const totalValue = products.reduce((s, p) => s + p.stock * (p.price || 0), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total products" value={totalProducts} />
        <StatCard title="Low stock" value={lowStock} hint="<= 10 units" />
        <StatCard title="Expired" value={expired} />
        <StatCard title="Inventory value" value={`$${totalValue.toFixed(2)}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card col-span-2">
          <h3 className="text-lg font-semibold mb-2">Recent activity</h3>
          <div className="text-sm text-gray-500">This area can show recent stock adjustments, orders, or alerts.</div>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Quick actions</h3>
          <div className="flex flex-col gap-2">
            <button className="btn-primary">Add product</button>
            <button className="px-3 py-2 border rounded-md">Export CSV</button>
          </div>
        </div>
      </div>
    </div>
  )
}
