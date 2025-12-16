import { useState, useEffect } from "react";
import {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} from "../api/suppliers";

export default function Suppliers() {
  const [activeTab, setActiveTab] = useState("list");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch suppliers on mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    try {
      setLoading(true);
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err) {
      setError(err.message || "Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  }

  const handleCopyContact = (supplier) => {
    const text = ${supplier.name}\n${supplier.contact};
    navigator.clipboard.writeText(text);
    alert("Contact info copied!");
  };

  // Example add supplier
  async function handleAddSupplier() {
    const name = prompt("Enter supplier name:");
    const contact = prompt("Enter supplier contact:");
    if (!name || !contact) return;

    try {
      const newSupplier = await addSupplier({ name, contact });
      setSuppliers((prev) => [...prev, newSupplier]);
    } catch (err) {
      alert(err.message || "Failed to add supplier");
    }
  }

  // Example delete supplier
  async function handleDeleteSupplier(id) {
    if (!confirm("Are you sure you want to delete this supplier?")) return;

    try {
      await deleteSupplier(id);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete supplier");
    }
  }

  // Example update supplier
  async function handleUpdateSupplier(supplier) {
    const name = prompt("Update supplier name:", supplier.name);
    const contact = prompt("Update supplier contact:", supplier.contact);
    if (!name || !contact) return;

    try {
      const updated = await updateSupplier(supplier.id, { name, contact });
      setSuppliers((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s)),
      );
    } catch (err) {
      alert(err.message || "Failed to update supplier");
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-9 mt-16">Suppliers</h2>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 font-medium ${
            activeTab === "list"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Suppliers List
        </button>
        <button
          onClick={handleAddSupplier}
          className="ml-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Supplier
        </button>
      </div>

      {/* Tab Content */}
      <div className="card">
        {activeTab === "list" && (
          <>
            {loading && <p className="p-4">Loading suppliers...</p>}
            {error && <p className="p-4 text-red-500">{error}</p>}
            {!loading && !error && suppliers.length === 0 && (
              <p className="p-4 text-gray-500">No suppliers found</p>
            )}
            {!loading && !error && suppliers.length > 0 && (
              <ul className="space-y-3 relative">
                {suppliers.map((s) => (
                  <li
                    key={s.id}
                    className="flex justify-between items-center relative"
                  >
                    <div className="font-medium">{s.name || "No name"}</div>

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

                      <button
                        onClick={() => handleUpdateSupplier(s)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteSupplier(s.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}