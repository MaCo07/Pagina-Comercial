"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Grid3X3, Calculator } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getProductos, getCategorias, type Producto } from "@/lib/productos"

export default function CatalogoComercio() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // 🎯 PERSONALIZA AQUÍ TU INFORMACIÓN
  const miNegocio = {
    nombre: "Ferretería Victoria",
    eslogan:
      "Tu ferretería de confianza con los mejores productos para construcción, electricidad y hogar. Calidad garantizada en cada compra.",
    telefono: "+1 (555) 123-4567",
    email: "info@ferreteriaVictoria.com",
    direccion: "Módulos mza 128A Casa 5",
    whatsapp: "15551234567",

    logo: "/images/logo-ferreteria-victoria.png", // 🎯 Logo real implementado
    imagenLocal: "/placeholder.svg?height=400&width=600&text=Foto+del+Local", // 🖼️ Aquí puedes cambiar por la foto real de tu ferretería

    facebook: "https://facebook.com/ferreteria-victoria",
    instagram: "https://instagram.com/ferreteria_victoria",

    colorPrimario: "#f8cf40",
    colorSecundario: "#69def5",
  }

  useEffect(() => {
    async function fetchData() {
      const [productosData, categoriasData] = await Promise.all([getProductos(), getCategorias()])
      setProductos(productosData.slice(0, 9))
      setCategorias(categoriasData)
      setLoading(false)
    }

    fetchData()
  }, [])

  const categoriasConConteo = categorias.map((categoria) => {
    const count = productos.filter((p) => p.categoria === categoria).length
    return {
      nombre: categoria,
      descripcion: `Productos de ${categoria.toLowerCase()}`,
      imagen: "/placeholder.svg?height=200&width=300",
      productos: count,
    }
  })

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
            <Link href="#inicio" className="text-sm font-medium hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link href="/productos" className="text-sm font-medium hover:text-primary transition-colors">
              Productos
            </Link>
            <Link href="/contacto" className="text-sm font-medium hover:text-primary transition-colors">
              Contacto
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section con imagen del local */}
      <section id="inicio" className="py-20 md:py-32" style={{ backgroundColor: miNegocio.colorPrimario }}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenido de texto */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-6">
                {/* Logo principal */}
                <div className="flex justify-center lg:justify-start">
                  <div className="w-48 h-48 lg:w-64 lg:h-64">
                    <Image
                      src={miNegocio.logo || "/placeholder.svg"}
                      alt={`Logo de ${miNegocio.nombre}`}
                      width={256}
                      height={256}
                      className="w-full h-full object-contain"
                      priority
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black">
                    {miNegocio.nombre}
                  </h1>
                  <p className="text-lg md:text-xl text-black/80 max-w-[600px] mx-auto lg:mx-0">{miNegocio.eslogan}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="bg-black text-white hover:bg-black/90">
                  <Link href="/productos">
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Ver Catálogo
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-black text-black hover:bg-black hover:text-white bg-transparent"
                >
                  <Link href="/contacto">Contactar</Link>
                </Button>
              </div>
            </div>

            {/* Imagen del local */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-black/10">
                  <Image
                    src={miNegocio.imagenLocal || "/placeholder.svg"}
                    alt={`Fachada de ${miNegocio.nombre}`}
                    width={600}
                    height={400}
                    className="w-full h-80 md:h-96 object-cover"
                    priority
                  />
                  {/* Overlay con información */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="text-white">
                      <h3 className="text-lg font-bold mb-1">Nuestra Tienda</h3>
                      <p className="text-sm text-white/90">{miNegocio.direccion}</p>
                    </div>
                  </div>
                </div>

                {/* Badge decorativo */}
                <div className="absolute -top-4 -right-4 bg-black text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  ¡Visítanos!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Section */}
      <section id="categorias" className="py-20" style={{ backgroundColor: miNegocio.colorSecundario }}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black">Nuestras Categorías</h2>
            <p className="text-xl text-black/80 max-w-[600px] mx-auto">
              Explora nuestras diferentes categorías de productos organizadas para tu comodidad
            </p>
          </div>
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-black">Cargando categorías...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {categoriasConConteo.map((categoria, index) => (
                <Link
                  key={index}
                  href={`/productos?categoria=${encodeURIComponent(categoria.nombre)}`}
                  className="block h-full"
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-2 border-black/10 hover:border-black/30 h-full flex flex-col">
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={categoria.imagen || "/placeholder.svg"}
                          alt={categoria.nombre}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge
                          className="absolute top-4 right-4 text-black border-black"
                          style={{ backgroundColor: miNegocio.colorPrimario }}
                        >
                          {categoria.productos} productos
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <CardTitle className="mb-2 text-black group-hover:text-blue-600 transition-colors">
                          {categoria.nombre}
                        </CardTitle>
                        <CardDescription className="text-black/70">{categoria.descripcion}</CardDescription>
                      </div>
                      <div className="mt-3 text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver productos →
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Nueva Sección de Presupuestos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-black">Presupuestos</h2>
              <p className="text-xl text-black/80 max-w-[700px] mx-auto">
                Realizamos Presupuestos de Materiales, Ropa, Herramientas. Todo para tu obra o tu pequeña empresa. Con
                descuentos increíbles
              </p>
            </div>

            <div className="flex justify-center">
              <Button size="lg" asChild className="bg-black text-white hover:bg-black/90">
                <Link href="/contacto">
                  <Calculator className="h-5 w-5 mr-2" />
                  Solicitar Presupuesto
                </Link>
              </Button>
            </div>

            {/* Tarjetas informativas sobre presupuestos */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <Card className="bg-white border-2 border-black/10">
                <CardContent className="p-6 text-center">
                  <div
                    className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: miNegocio.colorSecundario }}
                  >
                    <Calculator className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle className="mb-2 text-black">Presupuesto Gratuito</CardTitle>
                  <CardDescription className="text-black/70">
                    Te hacemos un presupuesto detallado sin costo alguno
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-black/10">
                <CardContent className="p-6 text-center">
                  <div
                    className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: miNegocio.colorPrimario }}
                  >
                    <span className="text-black font-bold text-xl">%</span>
                  </div>
                  <CardTitle className="mb-2 text-black">Descuentos Especiales</CardTitle>
                  <CardDescription className="text-black/70">
                    Descuentos por volumen para obras y empresas
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-black/10">
                <CardContent className="p-6 text-center">
                  <div
                    className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: miNegocio.colorSecundario }}
                  >
                    <span className="text-black font-bold text-xl">24h</span>
                  </div>
                  <CardTitle className="mb-2 text-black">Respuesta Rápida</CardTitle>
                  <CardDescription className="text-black/70">
                    Te respondemos en menos de 24 horas hábiles
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Grid Section */}
      <section id="productos" className="py-20" style={{ backgroundColor: miNegocio.colorSecundario }}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black">Productos Destacados</h2>
            <p className="text-xl text-black/80 max-w-[600px] mx-auto">
              Una selección de nuestros mejores productos organizados en formato de catálogo
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-black">Cargando productos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {productos.map((producto) => (
                <Card
                  key={producto.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-2 border-black/10"
                >
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={producto.imagen_url || "/placeholder.svg"}
                        alt={producto.nombre}
                        width={250}
                        height={250}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <CardTitle className="text-lg text-black">{producto.nombre}</CardTitle>
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

      {/* Contacto Section */}
      <section id="contacto" className="py-20" style={{ backgroundColor: miNegocio.colorPrimario }}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black">Contáctanos</h2>
            <p className="text-xl text-black/80 max-w-[600px] mx-auto">
              ¿Interesado en algún producto? Ponte en contacto con nosotros para más información
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-6 bg-white border-2 border-black/10">
              <CardContent className="space-y-4">
                <div
                  className="mx-auto w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: miNegocio.colorSecundario }}
                >
                  <Phone className="h-6 w-6 text-black" />
                </div>
                <div>
                  <CardTitle className="mb-2 text-black">Teléfono</CardTitle>
                  <CardDescription className="text-black/70">{miNegocio.telefono}</CardDescription>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-white border-2 border-black/10">
              <CardContent className="space-y-4">
                <div
                  className="mx-auto w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: miNegocio.colorSecundario }}
                >
                  <Mail className="h-6 w-6 text-black" />
                </div>
                <div>
                  <CardTitle className="mb-2 text-black">Email</CardTitle>
                  <CardDescription className="text-black/70">{miNegocio.email}</CardDescription>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-white border-2 border-black/10">
              <CardContent className="space-y-4">
                <div
                  className="mx-auto w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: miNegocio.colorSecundario }}
                >
                  <MapPin className="h-6 w-6 text-black" />
                </div>
                <div>
                  <CardTitle className="mb-2 text-black">Ubicación</CardTitle>
                  <CardDescription className="text-black/70">{miNegocio.direccion}</CardDescription>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild className="bg-black text-white hover:bg-black/90">
              <Link href="/contacto">
                <Mail className="h-4 w-4 mr-2" />
                Ir a Contacto
              </Link>
            </Button>
          </div>
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
              <p className="text-white/80">{miNegocio.eslogan}</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold" style={{ color: miNegocio.colorPrimario }}>
                Navegación
              </h4>
              <div className="space-y-2 text-sm">
                <Link href="#inicio" className="block text-white/80 hover:text-[#69def5]">
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
                {categorias.map((categoria) => (
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
                <div>{miNegocio.telefono}</div>
                <div>{miNegocio.email}</div>
                <div>{miNegocio.direccion}</div>
              </div>
              <div className="flex space-x-4 pt-2">
                <a
                  href={miNegocio.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-[#69def5] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href={`https://wa.me/${miNegocio.whatsapp}`}
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
            <p>&copy; 2024 {miNegocio.nombre}. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
