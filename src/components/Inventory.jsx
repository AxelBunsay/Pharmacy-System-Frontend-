import React, { useEffect, useState, useCallback } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import ProductModal from "./ProductModal";
import { exportToCSV } from "../utils/csv";
import beep from "../assets/beep.mp3";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  searchBySKUorName,
} from "../api/products";
import { getSuppliers } from "../api/suppliers";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [scanOpen, setScanOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  const getSupplierName = useCallback(
    (supplierId) => {
      if (!supplierId || !suppliers.length) return "N/A";
      const supplier = suppliers.find((s) => s.id === supplierId);
      return supplier ? supplier.name : "Unknown";
    },
    [suppliers],
  );

  const processProductsWithSuppliers = useCallback(
    (productsData) => {
      return productsData.map((product) => ({
        ...product,
        supplierName: getSupplierName(product.supplier_id),
      }));
    },
    [getSupplierName],
  );

  useEffect(() => {
    fetchSuppliers();
    fetchProducts(1, true);
  }, []);

  const fetchSuppliers = async () => {
    setLoadingSuppliers(true);
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error("Failed to load suppliers:", err);
      alert("Failed to load suppliers list");
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const fetchProducts = async (pageNum = 1, reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await getProducts(pageNum);
      const newProducts = res.data || [];

      const processedProducts = await processProductsWithSuppliers(newProducts);

      setProducts((prev) =>
        reset ? processedProducts : [...prev, ...processedProducts],
      );
      setFiltered((prev) =>
        reset ? processedProducts : [...prev, ...processedProducts],
      );
      setHasNextPage(res.next_page ?? false);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(async () => {
    if (products.length > 0 && suppliers.length > 0) {
      const processedProducts = await processProductsWithSuppliers(products);
      setProducts(processedProducts);
      setFiltered(processedProducts);
    }
  }, [suppliers, processProductsWithSuppliers]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setScanOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(products);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await searchBySKUorName(search);
        const processedResults = await processProductsWithSuppliers(results);
        setFiltered(processedResults);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, products, processProductsWithSuppliers]);

  const onEdit = (product) => {
    setEditing(product);
    setOpen(true);
  };

  const onDelete = async (id) => {
    if (window.confirm("Delete product?")) {
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setFiltered((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete product");
      }
    }
  };

  const handleScanUpdate = (err, result) => {
    if (result) {
      const code = result.text;
      setSearch(code);
      setScanOpen(false);

      const audio = new Audio(beep);
      audio.play().catch(() => console.warn("Audio play failed"));
    }
  };

  const handleSave = async (data) => {
    try {
      if (editing) {
        await updateProduct(editing.id, data);
      } else {
        await addProduct(data);
      }
      setOpen(false);
      setEditing(null);
      fetchProducts(1, true);
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  const handleExportCSV = () => {
    const exportData = filtered.map((product) => ({
      ...product,
      supplier: getSupplierName(product.supplier_id),
    }));
    exportToCSV("inventory.csv", exportData);
  };

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-3xl font-bold font-poppins mt-10">Inventory</h2>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or SKU..."
          className="input w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex gap-2">
          <button
            onClick={() => setScanOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded transition"
            disabled={loading}
          >
            Scan Barcode
          </button>

          <button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1 rounded transition"
            disabled={loading}
          >
            Add Product
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1 rounded transition"
            disabled={loading || filtered.length === 0}
          >
            Export CSV
          </button>
        </div>
      </div>

      {scanOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-2 text-center">Scan Barcode</h3>

            <div className="relative">
              <BarcodeScannerComponent
                width={600}
                height={250}
                onUpdate={handleScanUpdate}
                scanDelay={500}
                constraints={{
                  audio: false,
                  video: {
                    facingMode: "environment",
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                  },
                }}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                }}
              />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-24 border-2 border-green-500 rounded-lg"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-sm bg-black bg-opacity-50 text-white px-3 py-1 rounded inline-block">
                    Align barcode
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setScanOpen(false)}
              className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {(loading || loadingSuppliers) && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading inventory...</p>
        </div>
      )}

      {!loading && !loadingSuppliers && (
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
                <th className="py-2 px-3 border">Expiry Date</th>
                <th className="py-2 px-3 border">Edit</th>
                <th className="py-2 px-3 border">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="p-6 text-center text-gray-400 border"
                  >
                    {search
                      ? "No products match your search"
                      : "No products found"}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-2 px-3 border">{p.name}</td>
                    <td className="py-2 px-3 border font-mono">{p.sku}</td>
                    <td className="py-2 px-3 border">{p.category || "—"}</td>
                    <td className="py-2 px-3 border">
                      {p.supplierName || "—"}
                    </td>
                    <td
                      className={`py-2 px-3 border font-bold ${
                        p.stock <= 0
                          ? "text-red-600"
                          : p.stock < 10
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {p.stock}
                    </td>
                    <td className="py-2 px-3 border">
                      ₱{parseFloat(p.price).toFixed(2)}
                    </td>
                    <td className="py-2 px-3 border">
                      {p.expiry_date
                        ? new Date(p.expiry_date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-2 px-3 border text-center">
                      <button
                        onClick={() => onEdit(p)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="py-2 px-3 border text-center">
                      <button
                        onClick={() => onDelete(p.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
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
      )}

      {!loading && hasNextPage && !search && filtered.length > 0 && (
        <div className="text-center mt-4">
          <button
            onClick={() => fetchProducts(page + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      <ProductModal
        open={open}
        onClose={() => setOpen(false)}
        initial={editing}
        onSave={handleSave}
        suppliers={suppliers}
      />
    </div>
  );
}
