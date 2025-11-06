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
      <aside className="sidebar">
        <Sidebar />
      </aside>
      <div className="flex-1 min-h-screen">
        <Topbar />
        <main className="content">
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
