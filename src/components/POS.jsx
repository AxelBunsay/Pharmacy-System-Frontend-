import React, { useState } from 'react';

export default function POS({ products = [], setProducts }) {
    const [tab, setTab] = useState('pos'); // 'pos' or 'receipt'
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');

  const addToCart = (medicine) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === medicine.id);
      if (found) {
        if (found.qty < medicine.stock) {
          return prev.map((item) =>
            item.id === medicine.id ? { ...item, qty: item.qty + 1 } : item
          );
        }
        return prev;
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
      <h2 className="text-3xl font-bold mt-10">Point of Sale (POS)</h2>
      <div className="mb-4 flex gap-2">
        <button
          className={`px-4 py-2 rounded ${tab === 'pos' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('pos')}
        >POS</button>
        <button
          className={`px-4 py-2 rounded ${tab === 'receipt' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('receipt')}
          disabled={cart.length === 0}
        >Receipt</button>
      </div>
      {tab === 'pos' && (
        <>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicines..."
            className="w-full max-w-md mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex flex-col md:flex-row gap-8">
            {/* Medicines */}
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Medicines</h3>
              <div className="overflow-auto max-h-96 border rounded">
                <table className="w-full table-auto border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr className="text-left text-sm text-gray-500">
                      <th className="py-2 px-3 border border-gray-300">Name</th>
                      <th className="py-2 px-3 border border-gray-300">Price</th>
                      <th className="py-2 px-3 border border-gray-300">Stock</th>
                      <th className="py-2 px-3 border border-gray-300 text-center">Add</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMedicines.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-gray-400 border border-gray-300">
                          No medicines found
                        </td>
                      </tr>
                    ) : (
                      filteredMedicines.map((m) => (
                        <tr key={m.id}>
                          <td className="py-2 px-3 border border-gray-300">{m.name}</td>
                          <td className="py-2 px-3 border border-gray-300">${m.price}</td>
                          <td className="py-2 px-3 border border-gray-300">{m.stock}</td>
                          <td className="py-2 px-3 border border-gray-300 text-center">
                            <button
                              className={`px-3 py-1 rounded text-white font-semibold ${
                                m.stock === 0 || cart.find((item) => item.id === m.id)
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-red-600 hover:bg-red-700'
                              }`}
                              onClick={() => addToCart(m)}
                              disabled={cart.find((item) => item.id === m.id) || m.stock === 0}
                            >
                              Add
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cart */}
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Cart</h3>
              <div className="overflow-auto max-h-96 border rounded">
                <table className="w-full table-auto border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr className="text-left text-sm text-gray-500">
                      <th className="py-2 px-3 border border-gray-300">Name</th>
                      <th className="py-2 px-3 border border-gray-300 text-center">Qty</th>
                      <th className="py-2 px-3 border border-gray-300">Price</th>
                      <th className="py-2 px-3 border border-gray-300">Total</th>
                      <th className="py-2 px-3 border border-gray-300 text-center">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-400 border border-gray-300">
                          Cart is empty
                        </td>
                      </tr>
                    ) : (
                      cart.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2 px-3 border border-gray-300">{item.name}</td>
                          <td className="py-2 px-3 border border-gray-300 text-center">
                            <input
                              type="number"
                              min="1"
                              max={products.find((p) => p.id === item.id)?.stock || 1}
                              value={item.qty}
                              onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 px-2 py-1 border rounded text-center"
                            />
                          </td>
                          <td className="py-2 px-3 border border-gray-300">${item.price}</td>
                          <td className="py-2 px-3 border border-gray-300">${(item.price * item.qty).toFixed(2)}</td>
                          <td className="py-2 px-3 border border-gray-300 text-center">
                            <button
                              className="text-red-600 hover:underline font-semibold"
                              onClick={() => removeFromCart(item.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
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
        </>
      )}
      {tab === 'receipt' && (
        <div className="card p-6 max-w-lg mx-auto">
          <h3 className="text-xl font-bold mb-2">Marquez Pharmacy</h3>
          <div className="text-sm text-gray-600 mb-2">123 Main St, City<br/>Tel: (123) 456-7890</div>
          <div className="text-xs text-gray-500 mb-4">{new Date().toLocaleString()}</div>
          <div className="mb-2 flex justify-between items-center">
            <span className="font-semibold">Receipt No:</span>
            <span>{Math.floor(100000 + Math.random() * 1000000)}</span>
          </div>
          {/* Sales Report Filter */}
          <div className="mb-4">
            <label className="mr-2 font-semibold text-sm">Sales Report:</label>
            <select className="border px-2 py-1 rounded text-sm">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <table className="w-full mb-4">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>${item.price}</td>
                  <td>${(item.price * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="font-bold text-right mb-2">Total: ${total.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mb-4">Thank you for your purchase!</div>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold w-full"
            onClick={() => window.print()}
          >
            Print Receipt
          </button>
        </div>
      )}
    </div>
  );
}
