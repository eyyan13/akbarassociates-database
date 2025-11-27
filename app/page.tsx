"use client"

import { useState, useEffect } from "react"
import DrawingDatabase from "@/components/drawing-database"
import Login from "@/components/login"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const authToken = localStorage.getItem("auth_token")
    if (authToken === "authenticated") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (credentials: { username: string; password: string }) => {
    // Store authentication in localStorage
    localStorage.setItem("auth_token", "authenticated")
    setIsAuthenticated(true)
  }

  if (isLoading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <main className="min-h-screen bg-background">
      <DrawingDatabase />
    </main>
  )
}
