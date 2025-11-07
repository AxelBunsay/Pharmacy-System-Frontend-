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
      <div className="container-responsive w-full">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onToggle}
              className="sm:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <form onSubmit={onSearch} className="flex items-center gap-2 max-w-md w-full">
              <input 
                type="text"
                value={q} 
                onChange={(e) => setQ(e.target.value)} 
                placeholder="Search products" 
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
