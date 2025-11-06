import React from 'react'

const suppliers = [
  { id: 's1', name: 'MediSupplies Inc.', contact: 'contact@medisup.com' },
  { id: 's2', name: 'HealthCorp', contact: 'sales@healthcorp.local' },
]

export default function Suppliers() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Suppliers</h2>
      <div className="card">
        <ul className="space-y-3">
          {suppliers.map(s => (
            <li key={s.id} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-gray-500">{s.contact}</div>
              </div>
              <div>
                <button className="px-3 py-1 border rounded">View</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
