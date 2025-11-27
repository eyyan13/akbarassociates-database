"use client"

import { useState, useEffect } from "react"
import Login from "@/components/login"
import DrawingDatabase from "@/components/drawing-database" // Ya jo bhi aapka main component hai

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

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
    setShowSuccess(true)
    
    // 2 second baad success message hide karo aur main app show karo
    setTimeout(() => {
      setShowSuccess(false)
    }, 2000)
  }

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem("isLoggedIn")
    sessionStorage.removeItem("username")
    setIsAuthenticated(false)
    setShowSuccess(false)
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

  // Success message show karne ke liye
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  // Main app content
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

      {/* Your main app content here - Replace DrawingDatabase with your actual component */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <DrawingDatabase />
        {/* Ya jo bhi aapka main component hai */}
      </main>
    </div>
  )
}