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
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total products" value={totalProducts} />
        <StatCard title="Low stock" value={lowStock} hint="<= 10 units" />
        <StatCard title="Expired" value={expired} />
        <StatCard title="Inventory value" value={`$${totalValue.toFixed(2)}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card col-span-2">
          <h3 className="text-lg font-semibold mb-2">Recent activity</h3>
        </div>
      </div>
    </div>
  )
}
