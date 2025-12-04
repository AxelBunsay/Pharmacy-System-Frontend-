
import React, { useState } from 'react';

export default function POS({ products = [], setProducts }) {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');

  const addToCart = (medicine) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === medicine.id);
      if (found) {
        // Don't allow adding more than available stock
        if (found.qty < medicine.stock) {
          return prev.map((item) =>
            item.id === medicine.id ? { ...item, qty: item.qty + 1 } : item
          );
        } else {
          return prev;
        }
      }
      if (medicine.stock > 0) {
        return [...prev, { ...medicine, qty: 1 }];
      }
      return prev;
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((item) => {
        const product = products.find((p) => p.id === id);
        const maxQty = product ? product.stock : 1;
        return item.id === id ? { ...item, qty: Math.max(1, Math.min(qty, maxQty)) } : item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const filteredMedicines = products.filter((m) =>
    m.name && m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckout = () => {
    // Decrease stock in products for each item in cart
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const cartItem = cart.find((item) => item.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.qty) };
        }
        return p;
      })
    );
    setCart([]);
  };

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-3xl font-bold font-poppins mt-20">Point of Sale (POS)</h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search medicines..."
        className="input w-full max-w-md mb-4 px-4 py-2 border border-gray-300 rounded"
      />
      <div className="flex flex-col md:flex-row gap-8">
        {/* Medicine List */}
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Medicines</h3>
          <div className="card overflow-auto max-h-96">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Price</th>
                  <th className="py-2 px-3">Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((m) => (
                  <tr key={m.id}>
                    <td className="py-2 px-3">{m.name}</td>
                    <td className="py-2 px-3">${m.price}</td>
                    <td className="py-2 px-3">{m.stock}</td>
                    <td>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        onClick={() => addToCart(m)}
                        disabled={cart.find((item) => item.id === m.id) || m.stock === 0}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredMedicines.length === 0 && (
                  <tr><td colSpan={4} className="p-4 text-center text-gray-400">No medicines found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Cart */}
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Cart</h3>
          <div className="card overflow-auto max-h-96">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Qty</th>
                  <th className="py-2 px-3">Price</th>
                  <th className="py-2 px-3">Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-3">{item.name}</td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="1"
                        max={(() => {
                          const product = products.find((p) => p.id === item.id);
                          return product ? product.stock : 1;
                        })()}
                        value={item.qty}
                        onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="py-2 px-3">${item.price}</td>
                    <td className="py-2 px-3">${(item.price * item.qty).toFixed(2)}</td>
                    <td>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {cart.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-center text-gray-400">Cart is empty</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="font-bold">Total: ${total.toFixed(2)}</span>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
              disabled={cart.length === 0}
              onClick={handleCheckout}
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
