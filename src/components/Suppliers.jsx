import React, { useState } from 'react'

const suppliers = [
  { id: 's1', name: 'MediSupplies Inc.', contact: 'Marriel may bitaw' },
  { id: 's2', name: 'HealthCorp', contact: 'hazel may bitaw' },
]

export default function Suppliers() {
  const [activeTab, setActiveTab] = useState('list')

  const handleContact = (supplier) => {
    window.location.href = `mailto:${supplier.contact}?subject=Inquiry from Pharmacy System`
  }

  const namesText = suppliers.map(s => s.name).join('\n')

  const handleCopy = () => {
    navigator.clipboard.writeText(namesText)
    alert('Supplier names copied!')
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-9 mt-16">Suppliers</h2>
      
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'list'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Suppliers List
        </button>

        <button
          onClick={() => setActiveTab('names')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'names'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Suppliers Name
        </button>
      </div>

      {/* Tab Content */}
      <div className="card">

        {/* LIST TAB */}
        {activeTab === 'list' && (
          <ul className="space-y-3">
            {suppliers.map(s => (
              <li key={s.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-gray-500">{s.contact}</div>
                </div>
                <div className="space-x-2">
                  <button className="px-3 py-1 border rounded hover:bg-gray-100">View</button>
                  <button
                    onClick={() => handleContact(s)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Contact
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* SUPPLIERS NAME TAB */}
        {activeTab === 'names' && (
          <div className="space-y-4">
            {suppliers.map(s => (
              <div key={s.id} className="p-3 border rounded hover:bg-gray-50">
                <div className="font-medium text-lg">{s.name}</div>
              </div>
            ))}

            {/* Copy-Paste Box */}
            <div>
              <label className="font-medium">Copy Supplier Names:</label>
              <textarea
                readOnly
                className="w-full mt-2 p-2 border rounded h-32"
                value={namesText}
              ></textarea>
              <button
                onClick={handleCopy}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
  