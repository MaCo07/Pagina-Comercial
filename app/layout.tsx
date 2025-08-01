import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mi Ferretería - Catálogo de Productos", // 👈 Cambia por tu nombre
  description: "Tu ferretería de confianza con los mejores productos para construcción, electricidad y hogar",
  icons: {
    icon: [
      { url: "/images/mi-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/images/mi-logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/images/mi-logo.png",
    shortcut: "/images/mi-logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
