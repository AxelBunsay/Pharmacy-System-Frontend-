import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Topbar() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const onSearch = (e) => {
    e.preventDefault()
    // naive: encode query in URL search param for Inventory route
    if (location.pathname !== '/inventory') navigate('/inventory')
    const url = new URL(window.location)
    url.searchParams.set('q', q)
    window.history.replaceState({}, '', url)
  }

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-4">
        <button className="md:hidden px-2 py-1 border rounded-md">☰</button>
        <h1 className="text-lg font-semibold">Admin Console</h1>
      </div>
      <form onSubmit={onSearch} className="flex items-center gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, sku..." className="input w-64" />
        <button className="btn-primary" type="submit">Search</button>
      </form>
    </header>
  )
}
