"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getProductos, getCategorias, type Producto } from "@/lib/productos"

export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todas")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [productosData, categoriasData] = await Promise.all([getProductos(), getCategorias()])
      setProductos(productosData)
      setCategorias(categoriasData)
      setLoading(false)
    }

    fetchData()
  }, [])

  // Establecer categoría desde URL params
  useEffect(() => {
    const categoriaFromUrl = searchParams.get("categoria")
    if (categoriaFromUrl && categorias.includes(categoriaFromUrl)) {
      setSelectedCategory(categoriaFromUrl)
    }
  }, [searchParams, categorias])

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const matchesSearch =
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === "todas" || producto.categoria === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [productos, searchTerm, selectedCategory])

  const productosPerCategory = useMemo(() => {
    const counts: Record<string, number> = {}
    productos.forEach((producto) => {
      counts[producto.categoria] = (counts[producto.categoria] || 0) + 1
    })
    return counts
  }, [productos])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/mi-logo.png" // 👈 Cambia por tu logo
                alt="Logo Mi Ferretería" // 👈 Cambia por tu nombre
                width={32}
                height={32}
                className="rounded"
              />
              <span className="text-xl font-bold">Mi Ferretería</span> // 👈 Tu nombre aquí
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-[#69def5] transition-colors">
              Inicio
            </Link>
            <Link href="/productos" className="text-sm font-medium text-[#69def5]">
              Productos
            </Link>
            <Link href="/contacto" className="text-sm font-medium hover:text-[#69def5] transition-colors">
              Contacto
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-[#f8cf40]">
        <div className="container">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-black text-black hover:bg-black hover:text-white bg-transparent"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Link>
            </Button>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-black">Catálogo de Productos</h1>
            <p className="text-xl text-black/80 max-w-[600px] mx-auto">
              Explora todos nuestros productos. Usa los filtros para encontrar exactamente lo que buscas.
            </p>
            {selectedCategory !== "todas" && (
              <div className="flex justify-center">
                <Badge className="bg-black text-white text-lg px-4 py-2">Mostrando: {selectedCategory}</Badge>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filtros y Búsqueda */}
      <section className="py-8 bg-[#69def5]">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-black/20 bg-white text-black placeholder:text-black/60"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-black" />
                <span className="text-sm font-medium text-black">Categoría:</span>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 border-black/20 bg-white text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las categorías</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria} ({productosPerCategory[categoria] || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-black text-white">
              {productosFiltrados.length} productos encontrados
            </Badge>
            {selectedCategory !== "todas" && (
              <Badge variant="outline" className="border-black text-black bg-white">
                Categoría: {selectedCategory}
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="outline" className="border-black text-black bg-white">
                Búsqueda: "{searchTerm}"
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Grid de Productos */}
      <section className="py-12 bg-white">
        <div className="container">
          {productosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-black mb-2">No se encontraron productos</h3>
              <p className="text-black/70 mb-4">Intenta cambiar los filtros o términos de búsqueda</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("todas")
                }}
                className="bg-black text-white hover:bg-black/90"
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosFiltrados.map((producto) => (
                <Card
                  key={producto.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-2 border-black/10"
                >
                  <CardHeader className="p-0">
                    <div
                      className="relative overflow-hidden rounded-t-lg cursor-pointer"
                      onClick={() => setSelectedImage(producto.imagen_url)}
                    >
                      <Image
                        src={producto.imagen_url || "/placeholder.svg"}
                        alt={producto.nombre}
                        width={250}
                        height={250}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge variant="secondary" className="absolute top-4 left-4 bg-[#69def5] text-black border-black">
                        {producto.categoria}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <CardTitle className="text-lg text-black">{producto.nombre}</CardTitle>
                      <CardDescription className="text-black/70 text-sm">{producto.descripcion}</CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-black">${producto.precio}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de imagen ampliada */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Producto ampliado"
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t py-12 bg-black text-white">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/images/mi-logo.png" // 👈 Cambia por tu logo
                  alt="Logo Mi Ferretería" // 👈 Cambia por tu nombre
                  width={24}
                  height={24}
                  className="rounded"
                />
                <span className="text-xl font-bold">Mi Ferretería</span> // 👈 Tu nombre aquí
              </div>
              <p className="text-white/80">
                Tu ferretería de confianza con los mejores productos para construcción, electricidad y hogar.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-[#f8cf40]">Navegación</h4>
              <div className="space-y-2 text-sm">
                <Link href="/" className="block text-white/80 hover:text-[#69def5]">
                  Inicio
                </Link>
                <Link href="/productos" className="block text-white/80 hover:text-[#69def5]">
                  Productos
                </Link>
                <Link href="/contacto" className="block text-white/80 hover:text-[#69def5]">
                  Contacto
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-[#f8cf40]">Categorías</h4>
              <div className="space-y-2 text-sm">
                {categorias.map((categoria) => (
                  <div key={categoria} className="text-white/80">
                    {categoria} ({productosPerCategory[categoria] || 0})
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-[#f8cf40]">Contacto</h4>
              <div className="space-y-2 text-sm text-white/80">
                <div>+1 (555) 123-4567</div>
                <div>info@micomercio.com</div>
                <div>Módulos mza 128A Casa 5</div>
              </div>
              <div className="flex space-x-4 pt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-[#69def5] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/15551234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-[#69def5] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/80">
            <p>&copy; 2024 Mi Comercio. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
