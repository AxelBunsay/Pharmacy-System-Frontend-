import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './components/Dashboard'
import Inventory from './components/Inventory'
import Orders from './components/Orders'
import Suppliers from './components/Suppliers'
import Reports from './components/Reports'
import sampleProducts from './data/products'

export default function App() {
  const [products, setProducts] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const raw = localStorage.getItem('pharmacy_products')
    if (raw) {
      try {
        setProducts(JSON.parse(raw))
      } catch (e) {
        setProducts(sampleProducts)
      }
    } else {
      setProducts(sampleProducts)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('pharmacy_products', JSON.stringify(products))
  }, [products])

  const addProduct = (p) => {
    setProducts((s) => [{ ...p, id: Date.now().toString() }, ...s])
    navigate('/inventory')
  }

  const updateProduct = (id, patch) => {
    setProducts((s) => s.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  const deleteProduct = (id) => {
    setProducts((s) => s.filter((p) => p.id !== id))
  }

  return (
    <div className="app-container">
      {/* overlay for mobile when sidebar is open */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar-collapsed'}`} aria-hidden={!sidebarOpen}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      <div className="main-content">
        <Topbar onToggle={() => setSidebarOpen((s) => !s)} />
        <main className="content px-4 md:px-8">
          <Routes>
            <Route path="/" element={<Dashboard products={products} />} />
            <Route
              path="/inventory"
              element={<Inventory products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} />}
            />
            <Route path="/orders" element={<Orders />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/reports" element={<Reports products={products} />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
