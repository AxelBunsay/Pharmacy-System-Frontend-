import React from 'react'
import { exportToCSV } from '../utils/csv'

export default function Reports({ products = [] }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 mt-8">Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold">Inventory export</h3>
          <p className="text-sm text-gray-500">Download current inventory snapshot as CSV.</p>
          <div className="mt-3">
            <button onClick={() => exportToCSV('inventory-report.csv', products)} className="btn-primary">Download CSV</button>
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold">Stock health</h3>
          <p className="text-sm text-gray-500">This section can include charts and trends. For the demo, CSV export is provided.</p>
        </div>
      </div>
    </div>
  )
}
