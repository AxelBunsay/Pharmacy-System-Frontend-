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
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {/* Sidebar: slide-in on mobile, static on desktop */}
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
