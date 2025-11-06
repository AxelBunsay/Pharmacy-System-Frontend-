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
  const [filterCat, setFilterCat] = useState('')
  const q = useQuery().get('q') || ''

  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))], [products])

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
    if (filterCat && p.category !== filterCat) return false
    if (q) {
      const qq = q.toLowerCase()
      return p.name.toLowerCase().includes(qq) || p.sku.toLowerCase().includes(qq)
    }
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Inventory</h2>
        <div className="flex items-center gap-2">
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="input">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => { setEditing(null); setOpen(true) }} className="btn-primary">Add product</button>
          <button onClick={() => exportToCSV('inventory.csv', products)} className="px-3 py-1 border rounded">Export CSV</button>
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
