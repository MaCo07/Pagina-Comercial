"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Grid3X3, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ImageModal } from "@/components/image-modal"
import { getAllProductos, getProductosByCategoria, formatPrice, CATEGORIAS_FIJAS, type Producto } from "@/lib/productos"

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("todas")
  const [sortBy, setSortBy] = useState<string>("nombre")

  // Información del negocio
  const miNegocio = {
    nombre: "Ferretería Victoria",
    whatsapp: "15551234567",
    colorPrimario: "#f8cf40",
    colorSecundario: "#69def5",
    logo: "/images/logo-ferreteria-victoria.png",
  }

  useEffect(() => {
    fetchProductos()
  }, [])

  useEffect(() => {
    // Obtener categoría de la URL
    const urlParams = new URLSearchParams(window.location.search)
    const categoria = urlParams.get("categoria")
    if (categoria && CATEGORIAS_FIJAS.includes(categoria)) {
      setSelectedCategory(categoria)
    }
  }, [])

  useEffect(() => {
    filterAndSortProductos()
  }, [productos, searchTerm, selectedCategory, sortBy])

  const fetchProductos = async () => {
    setLoading(true)
    try {
      const data = await getAllProductos()
      setProductos(data)
    } catch (error) {
      console.error("Error fetching productos:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProductos = () => {
    let filtered = [...productos]

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
    if (selectedCategory !== "todas") {
      filtered = filtered.filter((producto) => producto.categoria === selectedCategory)
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "precio-asc":
          return a.precio - b.precio
        case "precio-desc":
          return b.precio - a.precio
        case "categoria":
          return a.categoria.localeCompare(b.categoria)
        case "nombre":
        default:
          return a.nombre.localeCompare(b.nombre)
      }
    })

    setFilteredProductos(filtered)
  }

  const handleCategoryChange = async (categoria: string) => {
    setSelectedCategory(categoria)
    setLoading(true)

    try {
      let data: Producto[]
      if (categoria === "todas") {
        data = await getAllProductos()
      } else {
        data = await getProductosByCategoria(categoria)
      }
      setProductos(data)
    } catch (error) {
      console.error("Error fetching productos by category:", error)
    } finally {
      setLoading(false)
    }
  }

  const getWhatsAppMessage = (producto: Producto) => {
    return `Hola! Me interesa el producto: *${producto.nombre}* - Precio: ${formatPrice(producto.precio)}. ¿Podrías darme más información?`
  }

  const getWhatsAppUrl = (producto: Producto) => {
    const message = encodeURIComponent(getWhatsAppMessage(producto))
    return `https://wa.me/${miNegocio.whatsapp}?text=${message}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <Image
              src={miNegocio.logo || "/placeholder.svg"}
              alt={`Logo de ${miNegocio.nombre}`}
              width={40}
              height={40}
              className="rounded"
            />
            <span className="text-xl font-bold">{miNegocio.nombre}</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link href="/productos" className="text-sm font-medium text-primary">
              Productos
            </Link>
            <Link href="/contacto" className="text-sm font-medium hover:text-primary transition-colors">
              Contacto
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12" style={{ backgroundColor: miNegocio.colorPrimario }}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-black">Nuestros Productos</h1>
            <p className="text-lg text-black/80 max-w-[600px] mx-auto">
              Explora nuestro catálogo completo de productos para construcción, electricidad y hogar
            </p>
          </div>
        </div>
      </section>

      {/* Filtros y Búsqueda */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtros */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Filtros:</span>
              </div>

              {/* Categoría */}
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las categorías</SelectItem>
                  {CATEGORIAS_FIJAS.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Ordenar */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nombre">Nombre A-Z</SelectItem>
                  <SelectItem value="precio-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="precio-desc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="categoria">Categoría</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resultados */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {loading ? "Cargando..." : `${filteredProductos.length} productos encontrados`}
            </p>
            {selectedCategory !== "todas" && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Categoría: {selectedCategory}
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Productos Grid */}
      <section className="py-12" style={{ backgroundColor: miNegocio.colorSecundario }}>
        <div className="container mx-auto max-w-7xl px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-black">Cargando productos...</p>
            </div>
          ) : filteredProductos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-black mb-2">No se encontraron productos</h3>
              <p className="text-black/70 mb-4">
                {searchTerm || selectedCategory !== "todas"
                  ? "Intenta cambiar los filtros de búsqueda"
                  : "No hay productos disponibles en este momento"}
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("todas")
                }}
                className="bg-black text-white hover:bg-black/90"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Ver Todos los Productos
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProductos.map((producto) => (
                <Card
                  key={producto.id}
                  className="group hover:shadow-xl transition-all duration-300 bg-white border-2 border-black/10 hover:border-black/30"
                >
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
                      {producto.destacado && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                            ⭐ Destacado
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <CardTitle className="text-lg text-black line-clamp-2">{producto.nombre}</CardTitle>
                      {producto.descripcion && (
                        <p className="text-sm text-black/70 line-clamp-2">{producto.descripcion}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-black">{formatPrice(producto.precio)}</span>
                      </div>
                      <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white" size="sm">
                        <a
                          href={getWhatsAppUrl(producto)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Consultar por WhatsApp
                        </a>
                      </Button>
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
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={miNegocio.logo || "/placeholder.svg"}
                  alt={`Logo de ${miNegocio.nombre}`}
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="text-xl font-bold">{miNegocio.nombre}</span>
              </div>
              <p className="text-white/80">Tu ferretería de confianza</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold" style={{ color: miNegocio.colorPrimario }}>
                Navegación
              </h4>
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
              <h4 className="font-semibold" style={{ color: miNegocio.colorPrimario }}>
                Categorías
              </h4>
              <div className="space-y-2 text-sm">
                {CATEGORIAS_FIJAS.map((categoria) => (
                  <div key={categoria} className="text-white/80">
                    {categoria}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold" style={{ color: miNegocio.colorPrimario }}>
                Contacto
              </h4>
              <div className="space-y-2 text-sm text-white/80">
                <div>+1 (555) 123-4567</div>
                <div>info@ferreteriaVictoria.com</div>
                <div>Módulos mza 128A Casa 5</div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/80">
            <p>&copy; 2024 {miNegocio.nombre}. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
