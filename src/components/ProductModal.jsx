import React, { useEffect, useState } from "react";

export default function ProductModal({
  open,
  onClose,
  onSave,
  initial,
  suppliers,
}) {
  const [form, setForm] = useState(initial || {});

  useEffect(() => setForm(initial || {}), [initial]);

  if (!open) return null;

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.sku) {
      alert("Name and SKU are required");
      return;
    }
    onSave({
      ...form,
      price: Number(form.price || 0),
      stock: Number(form.stock || 0),
      supplier_id: form.supplier_id || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">
          {initial ? "Edit product" : "Add product"}
        </h3>
        <form
          onSubmit={submit}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <input
            name="name"
            value={form.name || ""}
            onChange={handle}
            placeholder="Product name"
            className="input w-full px-3 py-2 border rounded"
            required
          />
          <input
            name="sku"
            value={form.sku || ""}
            onChange={handle}
            placeholder="SKU"
            type="number"
            className="input w-full px-3 py-2 border rounded"
            required
          />
          <input
            name="category"
            value={form.category || ""}
            onChange={handle}
            placeholder="Category"
            className="input w-full px-3 py-2 border rounded"
          />

          <select
            name="supplier_id"
            value={form.supplier_id || ""}
            onChange={handle}
            className="input w-full px-3 py-2 border rounded"
          >
            <option value="">Select Supplier</option>
            {suppliers &&
              suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
          </select>

          <input
            name="stock"
            value={form.stock ?? ""}
            onChange={handle}
            placeholder="Stock"
            type="number"
            className="input w-full px-3 py-2 border rounded"
          />
          <input
            name="price"
            value={form.price ?? ""}
            onChange={handle}
            placeholder="Price"
            type="number"
            step="0.01"
            className="input w-full px-3 py-2 border rounded"
            required
          />
          <input
            name="expiry_date"
            value={form.expiry_date || ""}
            onChange={handle}
            placeholder="Expiry (YYYY-MM-DD)"
            type="date"
            className="input w-full px-3 py-2 border rounded"
            required
          />

          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}