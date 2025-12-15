import React, { useEffect, useState } from 'react';
import ProductModal from './ProductModal';
import { exportToCSV } from '../utils/csv';

export default function Inventory({ products = [], addProduct, updateProduct, deleteProduct }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onEdit = (product) => { setEditing(product); setOpen(true); };
  const onDelete = (id) => { if (window.confirm('Delete product?')) deleteProduct(id); };

  const filtered = products.filter(p => 
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-3xl font-bold font-poppins mt-10">Inventory</h2>

      {/* Search and Action Buttons */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or SKU..."
          className="input w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-2">
          <button
            onClick={() => { setEditing(null); setOpen(true); }}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1 rounded transition"
          >
            Add Product
          </button>
          <button
            onClick={() => exportToCSV('inventory.csv', products)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1 rounded transition"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card overflow-auto border border-gray-300 rounded mt-4">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 border">Name</th>
              <th className="py-2 px-3 border">SKU</th>
              <th className="py-2 px-3 border">Category</th>
              <th className="py-2 px-3 border">Supplier</th>
              <th className="py-2 px-3 border">Stock</th>
              <th className="py-2 px-3 border">Price</th>
              <th className="py-2 px-3 border">Edit</th>
              <th className="py-2 px-3 border">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-400 border">
                  No products match your filters
                </td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id}>
                  <td className="py-2 px-3 border">{p.name}</td>
                  <td className="py-2 px-3 border">{p.sku}</td>
                  <td className="py-2 px-3 border">{p.category}</td>
                  <td className="py-2 px-3 border">{p.supplier}</td>
                  <td className="py-2 px-3 border">{p.stock}</td>
                  <td className="py-2 px-3 border">{p.price}</td>

                  {/* Edit Button Cell */}
                  <td className="py-2 px-3 border text-center">
                    <button
                      onClick={() => onEdit(p)}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded transition"
                    >
                      Edit
                    </button>
                  </td>

                  {/* Delete Button Cell */}
                  <td className="py-2 px-3 border text-center">
                    <button
                      onClick={() => onDelete(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      <ProductModal
        open={open}
        onClose={() => setOpen(false)}
        initial={editing}
        onSave={(data) => {
          if (editing) updateProduct(editing.id, data);
          else addProduct(data);
          setOpen(false);
        }}
      />
    </div>
  );
}
