import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Topbar({ onToggle, sidebarOpen = false }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const onSearch = (e) => {
    e.preventDefault()
    if (location.pathname !== '/inventory') navigate('/inventory')
    const url = new URL(window.location)
    url.searchParams.set('q', q)
    window.history.replaceState({}, '', url)
  }

  return (
    <header className=" bg-red-600 fixed top-0 left-0 w-full z-50 bg-red-400 px-6 py-3 flex items-center rounded-b-lg">
    <div className="w-full flex items-center">
      
        {/* Hamburger for mobile */}
        <button
          onClick={onToggle}
          className="sm:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none mr-2"
          aria-label="Toggle sidebar"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="text-lg text-white font-bold sm:ml-auto">Pharmacy </div>
      </div>
    </header>
  )
}