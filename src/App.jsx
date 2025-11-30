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
  
  // Example products for initial seed
  const exampleProducts = [
    {
      id: 'p1',
      name: 'Paracetamol 500mg',
      sku: 'SKU1001',
      category: 'Tablet',
      supplier: 'ABC Pharma',
      stock: 50,
      price: 10.5,
      expiryDate: '2026-01-01',
      description: 'Pain reliever and fever reducer.'
    },
    {
      id: 'p2',
      name: 'Ibuprofen 200mg',
      sku: 'SKU1002',
      category: 'Tablet',
      supplier: 'MediSupply',
      stock: 20,
      price: 15.0,
      expiryDate: '2025-12-01',
      description: 'Nonsteroidal anti-inflammatory drug.'
    },
    {
      id: 'p3',
      name: 'Amoxicillin 250mg',
      sku: 'SKU1003',
      category: 'Capsule',
      supplier: 'HealthPlus',
      stock: 5,
      price: 25.0,
      expiryDate: '2024-12-01',
      description: 'Antibiotic for bacterial infections.'
    },
    {
      id: 'p4',
      name: 'Cetirizine 10mg',
      sku: 'SKU1004',
      category: 'Tablet',
      supplier: 'PharmaPro',
      stock: 100,
      price: 8.0,
      expiryDate: '2027-05-01',
      description: 'Antihistamine for allergy relief.'
    },
    {
      id: 'p5',
      name: 'Loperamide 2mg',
      sku: 'SKU1005',
      category: 'Capsule',
      supplier: 'MediLink',
      stock: 8,
      price: 12.0,
      expiryDate: '2025-02-01',
      description: 'Used to treat diarrhea.'
    },
    {
      id: 'p6',
      name: 'Metformin 500mg',
      sku: 'SKU1006',
      category: 'Tablet',
      supplier: 'ABC Pharma',
      stock: 60,
      price: 18.0,
      expiryDate: '2026-08-01',
      description: 'Used to treat type 2 diabetes.'
    },
    {
      id: 'p7',
      name: 'Amlodipine 5mg',
      sku: 'SKU1007',
      category: 'Tablet',
      supplier: 'MediSupply',
      stock: 12,
      price: 22.0,
      expiryDate: '2025-09-01',
      description: 'Used to treat high blood pressure.'
    },
    {
      id: 'p8',
      name: 'Simvastatin 20mg',
      sku: 'SKU1008',
      category: 'Tablet',
      supplier: 'HealthPlus',
      stock: 30,
      price: 30.0,
      expiryDate: '2026-03-01',
      description: 'Used to control cholesterol.'
    },
    {
      id: 'p9',
      name: 'Omeprazole 40mg',
      sku: 'SKU1009',
      category: 'Capsule',
      supplier: 'PharmaPro',
      stock: 0,
      price: 20.0,
      expiryDate: '2024-11-01',
      description: 'Used to treat acid reflux.'
    },
    {
      id: 'p10',
      name: 'Losartan 50mg',
      sku: 'SKU1010',
      category: 'Tablet',
      supplier: 'MediLink',
      stock: 25,
      price: 28.0,
      expiryDate: '2025-07-01',
      description: 'Used to treat high blood pressure.'
    }
  ];
  
  // TEMPORARY: Uncomment to force reset
  // localStorage.removeItem('pharmacy_products');

  useEffect(() => {
    const raw = localStorage.getItem('pharmacy_products');
    if (raw) {
      try {
        setProducts(JSON.parse(raw));
      } catch (e) {
        setProducts([]);
      }
    } else {
      setProducts(exampleProducts);
      localStorage.setItem('pharmacy_products', JSON.stringify(exampleProducts));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('pharmacy_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (p) => {
    setProducts((s) => [{ ...p, id: Date.now().toString() }, ...s]);
  };

  const updateProduct = (id, patch) => {
    setProducts((s) => s.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const deleteProduct = (id) => {
    setProducts((s) => s.filter((p) => p.id !== id));
  };

  const handleLogin = (user) => {
    // handle login logic here if needed
  };

  // Layout for authenticated pages
  const AppLayout = ({ children }) => (
    <div className="min-h-screen bg-gray-50">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] z-50 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          sm:static sm:translate-x-0 sm:h-auto sm:top-auto sm:left-auto sm:z-auto sm:bg-transparent sm:border-none sm:shadow-none`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      {/* Main Content */}
      <div className="pt-8 min-h-screen sm:ml-[280px]">
        <Topbar onToggle={() => setSidebarOpen((s) => !s)} sidebarOpen={sidebarOpen} />
        <main className="content-wrapper">
          <div className="container-responsive">{children}</div>
        </main>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Login routes: no sidebar/topbar */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Authenticated routes: with sidebar/topbar */}
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard products={products} />
            </AppLayout>
          }
        />
        <Route
          path="/inventory"
          element={
            <AppLayout>
              <Inventory
                products={products}
                addProduct={addProduct}
                updateProduct={updateProduct}
                deleteProduct={deleteProduct}
              />
            </AppLayout>
          }
        />
        <Route
          path="/pos"
          element={
            <AppLayout>
              <POS products={products} setProducts={setProducts} />
            </AppLayout>
          }
        />
        <Route
          path="/suppliers"
          element={
            <AppLayout>
              <Suppliers />
            </AppLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <AppLayout>
              <Reports products={products} />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}
