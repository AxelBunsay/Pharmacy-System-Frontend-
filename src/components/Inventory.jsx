import React, { useEffect, useMemo, useState } from 'react'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import { exportToCSV } from '../utils/csv'
import { useLocation } from 'react-router-dom'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function Inventory({ products = [], addProduct, updateProduct, deleteProduct }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [search, setSearch] = useState("");

  useEffect(() => {
    // close modal on escape (simple)
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onEdit = (p) => { setEditing(p); setOpen(true) }
  const onDelete = (id) => {
    if (confirm('Delete product?')) deleteProduct(id)
  }

  const filtered = products.filter((p) => {
    if (search) {
      const qq = search.toLowerCase();
      return p.name.toLowerCase().includes(qq) || p.sku.toLowerCase().includes(qq);
    }
    return true;
  });

  return (
    <div className="space-y-4 mt-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold font-poppins mb-2">Inventory</h2>
        {/* Search bar below title */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or SKU..."
          className="input w-full mb-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        {/* Action buttons below search bar, left-aligned, minimal padding */}
        <div className="flex flex-row gap-2 mt-1">
          <button
            onClick={() => { setEditing(null); setOpen(true) }}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1 rounded transition"
          >
            Add product
          </button>
          <button
            onClick={() => exportToCSV('inventory.csv', products)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1 rounded transition"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="card overflow-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">SKU</th>
              <th className="py-2 px-3">Category</th>
              <th className="py-2 px-3">Supplier</th>
              <th className="py-2 px-3">Stock</th>
              <th className="py-2 px-3">Price</th>
              <th className="py-2 px-3">Expiry</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onEdit={onEdit} onDelete={onDelete} />
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="p-6 text-center text-gray-400">No products match your filters</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ProductModal
        open={open}
        onClose={() => setOpen(false)}
        initial={editing}
        onSave={(data) => {
          if (editing) updateProduct(editing.id, data)
          else addProduct(data)
          setOpen(false)
        }}
      />
    </div>
  )
}
