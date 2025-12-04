import React, { useState } from 'react'

const suppliers = [
  { id: 's1', name: 'ZUELLIG PHARMA CORPORATION.', contact: '2-8027575' },
  { id: 's2', name: 'METRO DRUG,INC.', contact: '09284241228' },
  { id: 's3', name: 'PHARMACEUTICAL DISTRIBUTORS', contact: '09065214600' },
  { id: 's4', name: 'MEDCARE Pharmaceuticals', contact: '044-958-2518' },
  { id: 's5', name: 'CARL ANDRE TRADING CORP', contact: '0965-258-4685' },
  { id: 's6', name: 'DYNA DRUG CORPORATION - BRANCH', contact: '7910-7172' },
]

export default function Suppliers() {
  const [activeTab, setActiveTab] = useState('list')

  const handleCopyContact = (supplier) => {
    const text = `${supplier.name}\n${supplier.contact}`
    navigator.clipboard.writeText(text)
    alert("Contact info copied!")
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
      </div>

      {/* Tab Content */}
      <div className="card">

        {/* LIST TAB ONLY */}
        {activeTab === 'list' && (
          <ul className="space-y-3 relative">
            {suppliers.map(s => (
              <li key={s.id} className="flex justify-between items-center relative">

                {/* Supplier Name */}
                <div className="font-medium">{s.name || "No name"}</div>

                {/* Contact + Copy Button */}
                <div className="flex items-center space-x-3">
                  <div className="px-3 py-1 border rounded bg-gray-50">
                    {s.contact}
                  </div>

                  <button
                    onClick={() => handleCopyContact(s)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Copy
                  </button>
                </div>

              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  )
}
