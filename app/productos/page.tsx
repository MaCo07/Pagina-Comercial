"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Grid3X3, List, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ImageModal } from "@/components/image-modal"
import { getProductos, getCategorias, formatPrice, CATEGORIAS_FIJAS, type Producto } from "@/lib/productos"

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // 🎯 PERSONALIZA AQUÍ TU INFORMACIÓN
  const miNegocio = {
    nombre: "Ferretería Victoria",
    whatsapp: "15551234567",
    logo: "/images/logo-ferreteria-victoria.png",
    colorPrimario: "#f8cf40",
    colorSecundario: "#69def5",
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [productosData, categoriasData] = await Promise.all([getProductos(), getCategorias()])
        setProductos(productosData)
        setFilteredProductos(productosData)
        setCategorias(categoriasData)

        // Verificar si hay una categoría en la URL
        const urlParams = new URLSearchParams(window.location.search)
        const categoria = urlParams.get("categoria")
        if (categoria && CATEGORIAS_FIJAS.includes(categoria)) {
          setSelectedCategory(categoria)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = productos

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (producto) =>
          producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          producto.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter((producto) => producto.categoria === selectedCategory)
    }

    setFilteredProductos(filtered)
  }, [productos, searchTerm, selectedCategory])

  const handleWhatsAppContact = (producto: Producto) => {
    const message = `Hola! Me interesa el producto: ${producto.nombre} - ${formatPrice(producto.precio)}`
    const whatsappUrl = `https://wa.me/${miNegocio.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src={miNegocio.logo || "/placeholder.svg"}
                  alt={`Logo de ${miNegocio.nombre}`}
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="text-xl font-semibold text-gray-900">{miNegocio.nombre}</span>
              </Link>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Inicio
              </Link>
              <Link href="/productos" className="text-blue-600 font-medium">
                Productos
              </Link>
              <Link href="/contacto" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contacto
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12" style={{ backgroundColor: miNegocio.colorPrimario }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Nuestros Productos</h1>
            <p className="text-xl text-black/80 max-w-2xl mx-auto">
              Explora nuestro catálogo completo de productos para construcción, electricidad y hogar
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {CATEGORIAS_FIJAS.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredProductos.length} producto{filteredProductos.length !== 1 ? "s" : ""} encontrado
            {filteredProductos.length !== 1 ? "s" : ""}
            {selectedCategory !== "all" && ` en ${selectedCategory}`}
          </div>
        </div>
      </section>

      {/* Products Grid/List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProductos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory !== "all"
                  ? "Intenta con otros términos de búsqueda o filtros"
                  : "No hay productos disponibles en este momento"}
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
                variant="outline"
              >
                Limpiar filtros
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProductos.map((producto) => (
                <Card key={producto.id} className="group hover:shadow-lg transition-all duration-300 bg-white">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <ImageModal
                        src={producto.imagen_url || "/placeholder.svg"}
                        alt={producto.nombre}
                        trigger={
                          <Image
                            src={producto.imagen_url || "/placeholder.svg"}
                            alt={producto.nombre}
                            width={300}
                            height={250}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        }
                      />
                      <Badge
                        variant="secondary"
                        className="absolute top-4 left-4 text-black border-black"
                        style={{ backgroundColor: miNegocio.colorPrimario }}
                      >
                        {producto.categoria}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <CardTitle className="text-lg text-gray-900">{producto.nombre}</CardTitle>
                      {producto.descripcion && (
                        <CardDescription className="text-gray-600 line-clamp-2">{producto.descripcion}</CardDescription>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">{formatPrice(producto.precio)}</span>
                        <Button
                          onClick={() => handleWhatsAppContact(producto)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Consultar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProductos.map((producto) => (
                <Card key={producto.id} className="hover:shadow-md transition-shadow duration-300 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6">
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <ImageModal
                          src={producto.imagen_url || "/placeholder.svg"}
                          alt={producto.nombre}
                          trigger={
                            <Image
                              src={producto.imagen_url || "/placeholder.svg"}
                              alt={producto.nombre}
                              fill
                              className="object-cover rounded-lg"
                            />
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{producto.nombre}</h3>
                            <Badge variant="outline" className="mb-2">
                              {producto.categoria}
                            </Badge>
                            {producto.descripcion && <p className="text-gray-600 mb-3">{producto.descripcion}</p>}
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-gray-900 mb-3">{formatPrice(producto.precio)}</div>
                            <Button
                              onClick={() => handleWhatsAppContact(producto)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Consultar por WhatsApp
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Image
                src={miNegocio.logo || "/placeholder.svg"}
                alt={`Logo de ${miNegocio.nombre}`}
                width={24}
                height={24}
                className="rounded"
              />
              <span className="text-xl font-bold">{miNegocio.nombre}</span>
            </div>
            <p className="text-white/80">Tu ferretería de confianza</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
