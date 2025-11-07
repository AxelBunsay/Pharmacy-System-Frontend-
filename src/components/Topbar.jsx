import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Topbar({ onToggle }) {
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
    <header className="topbar">
      {/* Container aligns Topbar content with main content */}
      <div className="container-responsive w-full flex flex-col gap-2">
        <div className="flex flex-row items-center w-full relative">
          <button
            onClick={() => onToggle && onToggle()}
            className="md:hidden px-2 py-1 border rounded-md mr-2"
            aria-label="Toggle menu">
            ☰
          </button>
        </div>

        <form onSubmit={onSearch} className="flex items-center gap-2 w-full">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="input w-full" />
          <button className="btn-primary" type="submit">Search</button>
        </form>
      </div>
    </header>
  )
}
