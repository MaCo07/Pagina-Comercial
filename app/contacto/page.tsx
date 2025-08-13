"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  })

  // Información del negocio
  const miNegocio = {
    nombre: "Ferretería Victoria",
    telefono: "+1 (555) 123-4567",
    email: "info@ferreteriaVictoria.com",
    direccion: "Módulos mza 128A Casa 5",
    whatsapp: "15551234567",
    horarios: "Lunes a Viernes: 8:00 AM - 6:00 PM\nSábados: 8:00 AM - 2:00 PM\nDomingos: Cerrado",
    colorPrimario: "#f8cf40",
    colorSecundario: "#69def5",
    logo: "/images/logo-ferreteria-victoria.png",
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Crear mensaje para WhatsApp
    const mensaje = `Hola! Mi nombre es ${formData.nombre}.
    
Email: ${formData.email}
Teléfono: ${formData.telefono}

Mensaje: ${formData.mensaje}

Enviado desde el formulario de contacto del sitio web.`

    const whatsappUrl = `https://wa.me/${miNegocio.whatsapp}?text=${encodeURIComponent(mensaje)}`
    window.open(whatsappUrl, "_blank")

    // Limpiar formulario
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      mensaje: "",
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
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
            <Link href="/productos" className="text-sm font-medium hover:text-primary transition-colors">
              Productos
            </Link>
            <Link href="/contacto" className="text-sm font-medium text-primary">
              Contacto
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12" style={{ backgroundColor: miNegocio.colorPrimario }}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-black">Contáctanos</h1>
            <p className="text-lg text-black/80 max-w-[600px] mx-auto">
              Estamos aquí para ayudarte. Ponte en contacto con nosotros para cualquier consulta o presupuesto
            </p>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-12" style={{ backgroundColor: miNegocio.colorSecundario }}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Información de Contacto */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-black mb-6">Información de Contacto</h2>
                <div className="space-y-6">
                  {/* Teléfono */}
                  <Card className="bg-white border-2 border-black/10">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: miNegocio.colorPrimario }}
                        >
                          <Phone className="h-6 w-6 text-black" />
                        </div>
                        <div>
                          <CardTitle className="mb-2 text-black">Teléfono</CardTitle>
                          <CardDescription className="text-black/70">
                            <a href={`tel:${miNegocio.telefono}`} className="hover:underline">
                              {miNegocio.telefono}
                            </a>
                          </CardDescription>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Email */}
                  <Card className="bg-white border-2 border-black/10">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: miNegocio.colorPrimario }}
                        >
                          <Mail className="h-6 w-6 text-black" />
                        </div>
                        <div>
                          <CardTitle className="mb-2 text-black">Email</CardTitle>
                          <CardDescription className="text-black/70">
                            <a href={`mailto:${miNegocio.email}`} className="hover:underline">
                              {miNegocio.email}
                            </a>
                          </CardDescription>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dirección */}
                  <Card className="bg-white border-2 border-black/10">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: miNegocio.colorPrimario }}
                        >
                          <MapPin className="h-6 w-6 text-black" />
                        </div>
                        <div>
                          <CardTitle className="mb-2 text-black">Dirección</CardTitle>
                          <CardDescription className="text-black/70">{miNegocio.direccion}</CardDescription>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Horarios */}
                  <Card className="bg-white border-2 border-black/10">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: miNegocio.colorPrimario }}
                        >
                          <Clock className="h-6 w-6 text-black" />
                        </div>
                        <div>
                          <CardTitle className="mb-2 text-black">Horarios de Atención</CardTitle>
                          <CardDescription className="text-black/70 whitespace-pre-line">
                            {miNegocio.horarios}
                          </CardDescription>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* WhatsApp Directo */}
                  <Card className="bg-green-50 border-2 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="mb-2 text-green-800">WhatsApp</CardTitle>
                          <CardDescription className="text-green-700 mb-4">
                            ¿Necesitas una respuesta rápida? Escríbenos directamente por WhatsApp
                          </CardDescription>
                          <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                            <a
                              href={`https://wa.me/${miNegocio.whatsapp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <MessageCircle className="h-4 w-4" />
                              Abrir WhatsApp
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Formulario de Contacto */}
            <div>
              <Card className="bg-white border-2 border-black/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-black">Envíanos un Mensaje</CardTitle>
                  <CardDescription className="text-black/70">
                    Completa el formulario y te contactaremos a la brevedad. También puedes solicitar presupuestos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nombre">Nombre Completo *</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          required
                          value={formData.nombre}
                          onChange={handleChange}
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          value={formData.telefono}
                          onChange={handleChange}
                          placeholder="Tu número de teléfono"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mensaje">Mensaje *</Label>
                      <Textarea
                        id="mensaje"
                        name="mensaje"
                        required
                        value={formData.mensaje}
                        onChange={handleChange}
                        placeholder="Describe tu consulta, solicitud de presupuesto o cualquier información adicional..."
                        rows={6}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar por WhatsApp
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Al enviar este formulario, se abrirá WhatsApp con tu mensaje pre-cargado para que puedas enviarlo
                      directamente.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="py-12 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-black">Nuestra Ubicación</h2>
            <p className="text-lg text-black/80">Visítanos en nuestra tienda física</p>
          </div>

          <div className="relative w-full h-96 rounded-lg overflow-hidden border-2 border-black/10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.344!2d-58.5317!3d-34.6425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM4JzMzLjAiUyA1OMKwMzEnNTQuMSJX!5e0!3m2!1ses!2sar!4v1620000000000!5m2!1ses!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Ubicación de ${miNegocio.nombre}`}
            ></iframe>
          </div>

          <div className="text-center mt-6">
            <p className="text-black/70 mb-4">{miNegocio.direccion}</p>
            <Button
              asChild
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white bg-transparent"
            >
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(miNegocio.direccion)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Ver en Google Maps
              </a>
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
                Contacto
              </h4>
              <div className="space-y-2 text-sm text-white/80">
                <div>{miNegocio.telefono}</div>
                <div>{miNegocio.email}</div>
                <div>{miNegocio.direccion}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold" style={{ color: miNegocio.colorPrimario }}>
                Horarios
              </h4>
              <div className="text-sm text-white/80 whitespace-pre-line">{miNegocio.horarios}</div>
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
