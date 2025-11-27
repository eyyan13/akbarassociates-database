import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "AKBAR & ASSOCIATES DRAWING MANAGEMENT SYSTEM",
  description: "Professional drawing database management system for Akbar & Associates Consulting Engineers",
  icons: {
    icon: "/logo.png",            // Favicon (PNG)
    shortcut: "/logo.png",        // Shortcut icon
    apple: "/logo.png",           // Apple devices
    other: [
      { rel: "icon", url: "/logo.png", sizes: "32x32" },
      { rel: "icon", url: "/logo.png", sizes: "192x192" },
      { rel: "icon", url: "/logo.png", sizes: "512x512" }
    ]
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  )
}
