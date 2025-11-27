"use client"

import { useState, useEffect } from "react"
import Login from "./login" // Ya jo bhi correct path hai

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (sessionStorage se)
    const isLoggedIn = sessionStorage.getItem("isLoggedIn")
    if (isLoggedIn === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (credentials: { username: string; password: string }) => {
    // Store authentication in sessionStorage
    sessionStorage.setItem("isLoggedIn", "true")
    sessionStorage.setItem("username", credentials.username)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem("isLoggedIn")
    sessionStorage.removeItem("username")
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logout button */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Your main app content here */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to Admin Panel</h2>
          <p>You are successfully logged in!</p>
          {/* Your existing app content */}
        </div>
      </main>
    </div>
  )
}