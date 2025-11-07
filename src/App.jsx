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
    <div className="min-h-screen bg-gray-50">
      {/* Overlay for mobile when sidebar is open.
          Place overlay to the right of the sidebar so it does not cover or dim the sidebar itself.
      */}
      {sidebarOpen && (
        <div
          className="fixed bg-black bg-opacity-50 z-40 transition-opacity sm:hidden"
          style={{ top: 0, bottom: 0, right: 0, left: '280px' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0 transition-transform duration-300 ease-in-out`}
        style={{ zIndex: 9999 }}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Topbar onToggle={() => setSidebarOpen((s) => !s)} sidebarOpen={sidebarOpen} />
        <main className="content-wrapper">
          <div className="container-responsive">
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
          </div>
        </main>
      </div>
    </div>
  )
}
