import React, { useEffect, useState } from 'react'

export default function ProductModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || {})

  useEffect(() => setForm(initial || {}), [initial])

  if (!open) return null

  const handle = (e) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  const submit = (e) => {
    e.preventDefault()
    // basic validation
    if (!form.name || !form.sku) {
      alert('Name and SKU are required')
      return
    }
    onSave({ ...form, price: Number(form.price || 0), stock: Number(form.stock || 0) })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">{initial ? 'Edit product' : 'Add product'}</h3>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="name" value={form.name || ''} onChange={handle} placeholder="Product name" className="input w-full" />
          <input name="sku" value={form.sku || ''} onChange={handle} placeholder="SKU" className="input w-full" />
          <input name="category" value={form.category || ''} onChange={handle} placeholder="Category" className="input w-full" />
          <input name="supplier" value={form.supplier || ''} onChange={handle} placeholder="Supplier" className="input w-full" />
          <input name="stock" value={form.stock ?? ''} onChange={handle} placeholder="Stock" type="number" className="input w-full" />
          <input name="price" value={form.price ?? ''} onChange={handle} placeholder="Price" type="number" step="0.01" className="input w-full" />
          <input name="expiryDate" value={form.expiryDate || ''} onChange={handle} placeholder="Expiry (YYYY-MM-DD)" className="input w-full" />
          <textarea name="description" value={form.description || ''} onChange={handle} placeholder="Description" className="input w-full col-span-2" />
          <div className="col-span-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
