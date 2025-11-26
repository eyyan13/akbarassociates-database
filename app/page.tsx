"use client"

import { useState, useEffect } from "react"
import DrawingDatabase from "@/components/drawing-database"
import Login from "@/components/login"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (sessionStorage use karo)
    const authToken = sessionStorage.getItem("auth_token")
    if (authToken === "authenticated") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (credentials: { username: string; password: string }) => {
    // Store authentication in sessionStorage (browser close = logout)
    sessionStorage.setItem("auth_token", "authenticated")
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem("auth_token")
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
    <main className="min-h-screen bg-background">
      {/* Logout button add karo header mein */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Drawing Database</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </header>
      <DrawingDatabase />
    </main>
  )
}