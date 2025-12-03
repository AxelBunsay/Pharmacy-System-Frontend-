import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import POS from './components/POS';
import Suppliers from './components/Suppliers';
import Reports from './components/Reports';
import Login from './components/Login';

export default function App() {
  const [products, setProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

  useEffect(() => {
    const stored = localStorage.getItem('pharmacy_products');
    if (stored) setProducts(JSON.parse(stored));
    else {
      setProducts(exampleProducts);
      localStorage.setItem('pharmacy_products', JSON.stringify(exampleProducts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pharmacy_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (p) => setProducts((s) => [{ ...p, id: Date.now().toString() }, ...s]);
  const updateProduct = (id, patch) => setProducts((s) => s.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const deleteProduct = (id) => setProducts((s) => s.filter((p) => p.id !== id));

  const AppLayout = ({ children }) => (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 min-h-screen ml-[200px]">
        <Topbar onToggle={() => setSidebarOpen((s) => !s)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Login routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Authenticated routes */}
        <Route path="/dashboard" element={<AppLayout><Dashboard products={products} /></AppLayout>} />
        <Route path="/inventory" element={<AppLayout><Inventory products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} /></AppLayout>} />
        <Route path="/pos" element={<AppLayout><POS products={products} setProducts={setProducts} /></AppLayout>} />
        <Route path="/suppliers" element={<AppLayout><Suppliers /></AppLayout>} />
        <Route path="/reports" element={<AppLayout><Reports products={products} /></AppLayout>} />
      </Routes>
    </Router>
  );
}
