import React, { useState, useEffect, useRef } from "react";
import { checkOutBulk } from "../api/pos";
import { getProducts, searchBySKUorName } from "../api/products";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import beep from "../assets/beep.mp3";

export default function POS() {
  const [tab, setTab] = useState("pos");
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [receiptItems, setReceiptItems] = useState([]);
  const [receiptTotal, setReceiptTotal] = useState(0);
  const [receiptNumber, setReceiptNumber] = useState("");

  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [scanError, setScanError] = useState("");
  const [lastScanned, setLastScanned] = useState("");

  const scannerRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts(page);
      if (page === 1) {
        setProducts(response.data || []);
      } else {
        setProducts((prev) => [...prev, ...(response.data || [])]);
      }
      setHasMore(response.next_page || false);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setPage(1);
      loadProducts();
      return;
    }

    try {
      setLoading(true);
      const results = await searchBySKUorName(query);
      setProducts(results || []);
      setHasMore(false);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (data) => {
    if (data && data.text && !scanning) {
      const scannedCode = data.text.trim();

      if (scannedCode === lastScanned) {
        return;
      }

      setLastScanned(scannedCode);
      setScanning(true);
      setScanResult("");
      setScanError("");

      const audio = new Audio(beep);
      audio.play().catch(() => console.warn("Audio play failed"));

      try {
        const results = await searchBySKUorName(scannedCode);

        if (results && results.length > 0) {
          const product = results[0];

          if (product.is_archived) {
            setScanError(`${product.name} is archived`);
            setTimeout(() => {
              setScanError("");
              setScanning(false);
            }, 2000);
            return;
          }

          if (product.stock <= 0) {
            setScanError(`${product.name} is out of stock`);
            setTimeout(() => {
              setScanError("");
              setScanning(false);
            }, 2000);
            return;
          }

          const existingItem = cart.find((item) => item.id === product.id);

          if (existingItem) {
            if (existingItem.qty < product.stock) {
              updateQty(product.id, existingItem.qty + 1);
              setScanResult(`✓ Added ${product.name}`);
            } else {
              setScanError(`Only ${product.stock} available`);
            }
          } else {
            addToCart(product);
            setScanResult(`✓ Added ${product.name}`);
          }

          setTimeout(() => {
            setScanning(false);
            setScanResult("");
            setLastScanned("");
          }, 1500);
        } else {
          setScanError(`✗ Product not found`);
          setTimeout(() => {
            setScanError("");
            setScanning(false);
            setLastScanned("");
          }, 2000);
        }
      } catch (error) {
        setScanError("✗ Scan error");
        setTimeout(() => {
          setScanError("");
          setScanning(false);
          setLastScanned("");
        }, 2000);
      }
    }
  };

  const toggleScanner = () => {
    setShowScanner(!showScanner);
    if (!showScanner) {
      setScanResult("");
      setScanError("");
      setLastScanned("");
    }
  };

  const addToCart = (product) => {
    if (product.is_archived) {
      alert(`Product ${product.name} is archived and cannot be sold`);
      return;
    }

    if (product.stock <= 0) {
      alert(`Product ${product.name} is out of stock`);
      return;
    }

    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        if (found.qty < product.stock) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
          );
        } else {
          alert(`Only ${product.stock} units available for ${product.name}`);
          return prev;
        }
      }
      return [
        ...prev,
        {
          ...product,
          qty: 1,
          product_id: product.id,
        },
      ];
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((item) => {
        const product = products.find((p) => p.id === id);
        const maxQty = product ? product.stock : item.stock;
        return item.id === id
          ? {
              ...item,
              qty: Math.max(1, Math.min(qty, maxQty)),
            }
          : item;
      }),
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    return sum + price * item.qty;
  }, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    for (const item of cart) {
      const product = products.find((p) => p.id === item.id);
      if (product && item.qty > product.stock) {
        alert(
          `Cannot checkout: ${item.name} only has ${product.stock} units available`,
        );
        return;
      }
    }

    try {
      const checkoutData = cart.map((item) => ({
        product_id: item.id,
        quantity: item.qty,
        unit_price: parseFloat(item.price) || 0,
      }));

      const result = await checkOutBulk(checkoutData);

      if (result) {
        setReceiptItems([...cart]);
        setReceiptTotal(total);
        setReceiptNumber(
          Math.floor(100000 + Math.random() * 1000000).toString(),
        );

        setPage(1);
        await loadProducts();

        alert(`Successfully processed sale(s)`);
        setTab("receipt");
        setCart([]);
      } else {
        alert("Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(`Checkout failed: ${error.message || "Unknown error"}`);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      (product.name && product.name.toLowerCase().includes(query)) ||
      (product.sku && product.sku.toLowerCase().includes(query))
    );
  });

  const loadMoreProducts = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const returnToPOS = () => {
    setTab("pos");
    setReceiptItems([]);
    setReceiptTotal(0);
    setReceiptNumber("");
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Point of Sale (POS)</h2>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          className={`px-4 py-2 rounded ${tab === "pos" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("pos")}
        >
          POS
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "receipt" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          onClick={() => setTab("receipt")}
          disabled={receiptItems.length === 0}
        >
          Receipt
        </button>
        <button
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            showScanner ? "bg-red-600 text-white" : "bg-blue-600 text-white"
          }`}
          onClick={toggleScanner}
        >
          {showScanner ? (
            <>
              <span>Stop Scanner</span>
              <span className="animate-pulse">●</span>
            </>
          ) : (
            <>
              <span>Start Scanner</span>
              <span>📷</span>
            </>
          )}
        </button>
      </div>

      {tab === "pos" && (
        <>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search by name or SKU..."
              className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {showScanner && (
              <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded">
                <span className="animate-pulse mr-2">●</span>
                Scanner Active
              </div>
            )}
            {loading && (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <h3 className="font-semibold mb-2">Products</h3>
              <div className="overflow-auto max-h-96 border rounded">
                <table className="w-full table-auto border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr className="text-left text-sm text-gray-500">
                      <th className="py-2 px-3 border border-gray-300">
                        SKU/Barcode
                      </th>
                      <th className="py-2 px-3 border border-gray-300">Name</th>
                      <th className="py-2 px-3 border border-gray-300">
                        Price
                      </th>
                      <th className="py-2 px-3 border border-gray-300">
                        Stock
                      </th>
                      <th className="py-2 px-3 border border-gray-300 text-center">
                        Add
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && products.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-4 text-center text-gray-400 border border-gray-300"
                        >
                          Loading products...
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-4 text-center text-gray-400 border border-gray-300"
                        >
                          No products found
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => {
                        const isInCart = cart.find(
                          (item) => item.id === product.id,
                        );
                        const isDisabled =
                          product.is_archived ||
                          product.stock === 0 ||
                          isInCart;

                        return (
                          <tr
                            key={product.id}
                            className={
                              product.is_archived
                                ? "bg-gray-100 opacity-70"
                                : ""
                            }
                          >
                            <td className="py-2 px-3 border border-gray-300 text-sm font-mono">
                              {product.sku}
                            </td>
                            <td className="py-2 px-3 border border-gray-300">
                              {product.name}
                              {product.is_archived && (
                                <span className="ml-2 text-xs text-red-600">
                                  (Archived)
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 border border-gray-300">
                              ₱{parseFloat(product.price || 0).toFixed(2)}
                            </td>
                            <td
                              className={`py-2 px-3 border border-gray-300 ${product.stock <= 10 ? "text-red-600 font-semibold" : ""}`}
                            >
                              {product.stock}
                            </td>
                            <td className="py-2 px-3 border border-gray-300 text-center">
                              <button
                                className={`px-3 py-1 rounded text-white font-semibold ${
                                  isDisabled
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-700"
                                }`}
                                onClick={() => addToCart(product)}
                                disabled={isDisabled}
                                title={
                                  product.is_archived
                                    ? "Product is archived"
                                    : product.stock === 0
                                      ? "Out of stock"
                                      : isInCart
                                        ? "Already in cart"
                                        : ""
                                }
                              >
                                {isInCart ? "Added" : "Add"}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {hasMore && !search.trim() && (
                <button
                  onClick={loadMoreProducts}
                  disabled={loading}
                  className="mt-2 w-full py-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                >
                  {loading ? "Loading..." : "Load More Products"}
                </button>
              )}
            </div>

            <div className="lg:w-1/3 space-y-6">
              <div>
                <h3 className="font-semibold mb-2">
                  Cart ({cart.length} items)
                </h3>
                <div className="overflow-auto max-h-96 border rounded">
                  <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr className="text-left text-sm text-gray-500">
                        <th className="py-2 px-3 border border-gray-300">
                          Name
                        </th>
                        <th className="py-2 px-3 border border-gray-300 text-center">
                          Qty
                        </th>
                        <th className="py-2 px-3 border border-gray-300">
                          Price
                        </th>
                        <th className="py-2 px-3 border border-gray-300">
                          Total
                        </th>
                        <th className="py-2 px-3 border border-gray-300 text-center">
                          Remove
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-4 text-center text-gray-400 border border-gray-300"
                          >
                            Cart is empty
                          </td>
                        </tr>
                      ) : (
                        cart.map((item) => {
                          const product = products.find(
                            (p) => p.id === item.id,
                          );
                          const maxQty = product ? product.stock : item.stock;

                          return (
                            <tr key={item.id}>
                              <td className="py-2 px-3 border border-gray-300">
                                {item.name}
                                <div className="text-xs text-gray-500 font-mono">
                                  {item.sku}
                                </div>
                                {product && product.is_archived && (
                                  <span className="ml-2 text-xs text-red-600">
                                    (Archived)
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-3 border border-gray-300 text-center">
                                <input
                                  type="number"
                                  min="1"
                                  max={maxQty}
                                  value={item.qty}
                                  onChange={(e) =>
                                    updateQty(
                                      item.id,
                                      parseInt(e.target.value) || 1,
                                    )
                                  }
                                  className="w-16 px-2 py-1 border rounded text-center"
                                />
                              </td>
                              <td className="py-2 px-3 border border-gray-300">
                                ₱{parseFloat(item.price || 0).toFixed(2)}
                              </td>
                              <td className="py-2 px-3 border border-gray-300">
                                ₱
                                {(
                                  parseFloat(item.price || 0) * item.qty
                                ).toFixed(2)}
                              </td>
                              <td className="py-2 px-3 border border-gray-300 text-center">
                                <button
                                  className="text-red-600 hover:underline font-semibold"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="font-bold text-lg">
                        Total: ₱{total.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {cart.length} items
                      </div>
                    </div>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={cart.length === 0}
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>

              {showScanner && (
                <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Barcode Scanner</h3>
                    <button
                      onClick={toggleScanner}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Hide Scanner
                    </button>
                  </div>

                  <div className="mb-3 min-h-8">
                    {scanning && (
                      <div className="flex items-center justify-center text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Scanning...
                      </div>
                    )}
                    {scanResult && !scanning && (
                      <div className="text-center text-green-600 bg-green-50 py-2 rounded">
                        {scanResult}
                      </div>
                    )}
                    {scanError && !scanning && (
                      <div className="text-center text-red-600 bg-red-50 py-2 rounded">
                        {scanError}
                      </div>
                    )}
                    {!scanResult && !scanError && !scanning && (
                      <div className="text-center text-gray-600">
                        Ready to scan
                      </div>
                    )}
                  </div>

                  <div className="relative rounded-md overflow-hidden bg-black">
                    <BarcodeScannerComponent
                      ref={scannerRef}
                      width={400}
                      height={180}
                      onUpdate={(_err, result) => {
                        if (result) handleScan(result);
                      }}
                      scanDelay={500}
                      constraints={{
                        audio: false,
                        video: {
                          facingMode: "environment",
                          width: { ideal: 400 },
                          height: { ideal: 300 },
                        },
                      }}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                      }}
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-24 border-2 border-green-500 rounded-md"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
                          Align barcode
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Product will be automatically added to cart
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {tab === "receipt" && (
        <div className="card p-6 max-w-lg mx-auto border rounded-lg shadow-lg bg-white">
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold mb-1">Marquez Pharmacy</h3>
          </div>
          <div className="text-xs text-gray-500 mb-4 text-center">
            {new Date().toLocaleString()}
          </div>
          <div className="mb-4 flex justify-between items-center border-b pb-2">
            <span className="font-semibold">Receipt No:</span>
            <span className="font-mono">{receiptNumber}</span>
          </div>
          <table className="w-full mb-4">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-2">Item</th>
                <th className="pb-2 text-center">Qty</th>
                <th className="pb-2 text-right">Price</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {receiptItems.map((item) => (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="py-2">
                    {item.name}
                    <div className="text-xs text-gray-500 font-mono">
                      {item.sku}
                    </div>
                  </td>
                  <td className="py-2 text-center">{item.qty}</td>
                  <td className="py-2 text-right">
                    ₱{parseFloat(item.price || 0).toFixed(2)}
                  </td>
                  <td className="py-2 text-right">
                    ₱{(parseFloat(item.price || 0) * item.qty).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right border-t pt-4">
            <div className="font-bold text-xl mb-1">
              Total: ₱{receiptTotal.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Thank you for your purchase!
            </div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold w-full"
              onClick={returnToPOS}
            >
              Return to POS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
