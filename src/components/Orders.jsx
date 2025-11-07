import React from 'react'

const sampleOrders = [
  { id: 'o1', date: '2025-10-02', total: 34.5, status: 'Delivered' },
  { id: 'o2', date: '2025-10-05', total: 12.0, status: 'Pending' },
]

export default function Orders() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500"><th className="py-2">ID</th><th>Date</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {sampleOrders.map(o => (
              <tr key={o.id} className="border-b"><td className="py-2">{o.id}</td><td>{o.date}</td><td>${o.total}</td><td>{o.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
