import React from 'react'

export default function ProductCard({ product, onEdit, onDelete }) {
  const expired = new Date(product.expiryDate) < new Date()
  return (
    <tr className="border-b">
      <td className="py-2 px-3">{product.name}</td>
      <td className="py-2 px-3">{product.sku}</td>
      <td className="py-2 px-3">{product.category}</td>
      <td className="py-2 px-3">{product.supplier}</td>
      <td className="py-2 px-3">{product.stock}</td>
      <td className="py-2 px-3">${product.price}</td>
      <td className="py-2 px-3">{product.expiryDate}{expired && <span className="ml-2 text-xs text-red-600">(expired)</span>}</td>
      <td className="py-2 px-3">
        <div className="flex gap-2">
          <button onClick={() => onEdit(product)} className="px-2 py-1 border rounded bg-green-400 text-white text-sm">Edit</button>
          <button onClick={() => onDelete(product.id)} className="px-2 py-1 border rounded bg-red-400 text-white text-sm">Delete</button>
        </div>
      </td>
    </tr>
  )
}
