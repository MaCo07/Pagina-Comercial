"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, MapPin, MessageCircle, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    consulta: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío del formulario
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubmitted(true)
    setIsSubmitting(false)

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ nombre: "", correo: "", consulta: "" })
    }, 3000)
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hola! Me interesa obtener más información sobre sus productos. Mi nombre es ${formData.nombre || "[Nombre]"}.`,
    )
    window.open(`https://wa.me/15551234567?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/logo-ferreteria-victoria.png"
                alt="Logo Ferretería Victoria"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="text-xl font-bold">Ferretería Victoria</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-[#69def5] transition-colors">
              Inicio
            </Link>
            <Link href="/productos" className="text-sm font-medium hover:text-[#69def5] transition-colors">
              Productos
            </Link>
            <Link href="/contacto" className="text-sm font-medium text-[#69def5]">
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
            <h1 className="text-4xl md:text-5xl font-bold text-black">Contáctanos</h1>
            <p className="text-xl text-black/80 max-w-[600px] mx-auto">
              Estamos aquí para ayudarte. Envíanos tu consulta y te responderemos lo antes posible.
            </p>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Formulario de Contacto */}
            <div>
              <Card className="border-2 border-black/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-black flex items-center gap-2">
                    <Mail className="h-6 w-6" />
                    Envíanos tu Consulta
                  </CardTitle>
                  <CardDescription className="text-black/70">
                    Completa el formulario y nos pondremos en contacto contigo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">✅</div>
                      <h3 className="text-2xl font-bold text-black mb-2">¡Mensaje Enviado!</h3>
                      <p className="text-black/70">Gracias por contactarnos. Te responderemos pronto.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="nombre" className="text-black font-medium">
                          Nombre Completo
                        </Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          type="text"
                          required
                          value={formData.nombre}
                          onChange={handleInputChange}
                          placeholder="Tu nombre completo"
                          className="border-black/20 focus:border-[#69def5] text-black"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="correo" className="text-black font-medium">
                          Correo Electrónico
                        </Label>
                        <Input
                          id="correo"
                          name="correo"
                          type="email"
                          required
                          value={formData.correo}
                          onChange={handleInputChange}
                          placeholder="tu@email.com"
                          className="border-black/20 focus:border-[#69def5] text-black"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="consulta" className="text-black font-medium">
                          Tu Consulta
                        </Label>
                        <Textarea
                          id="consulta"
                          name="consulta"
                          required
                          value={formData.consulta}
                          onChange={handleInputChange}
                          placeholder="Escribe tu consulta aquí..."
                          rows={5}
                          className="border-black/20 focus:border-[#69def5] text-black resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black text-white hover:bg-black/90 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          "Enviando..."
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Enviar Consulta
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* WhatsApp y Ubicación */}
            <div className="space-y-8">
              {/* WhatsApp */}
              <Card className="border-2 border-black/10 bg-[#69def5]">
                <CardHeader>
                  <CardTitle className="text-2xl text-black flex items-center gap-2">
                    <MessageCircle className="h-6 w-6" />
                    WhatsApp
                  </CardTitle>
                  <CardDescription className="text-black/80">
                    ¿Necesitas una respuesta rápida? Contáctanos directamente por WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-black/80">
                      Estamos disponibles en nuestros horarios de atención para responder tus consultas de manera
                      inmediata.
                    </p>
                    <Button onClick={handleWhatsAppClick} className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Enviar Mensaje por WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Ubicación */}
              <Card className="border-2 border-black/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-black flex items-center gap-2">
                    <MapPin className="h-6 w-6" />
                    Nuestra Ubicación
                  </CardTitle>
                  <CardDescription className="text-black/70">Visítanos en nuestra tienda física</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-black">Dirección:</h4>
                      <p className="text-black/80">Módulos mza 128A Casa 5</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-black">Horarios de Atención:</h4>
                      <div className="text-black/80 space-y-1">
                        <p>Lunes a Viernes: 8:00 AM - 13:00 PM y 16:00 - 20:30 PM</p>
                        <p>Sábados: 8:00 AM - 13:00 PM y 16:00 - 20:00 PM</p>
                        <p>Domingos: Cerrado</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-black">Información de Contacto:</h4>
                      <div className="text-black/80 space-y-1">
                        <p>📞 +1 (555) 123-4567</p>
                        <p>📧 info@ferreteriaVictoria.com</p>
                      </div>
                    </div>

                    {/* Mapa con pin fijo en la ubicación */}
                    <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-black/10">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.123456789!2d-65.99232036410704!3d-26.06685193650166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA0JzAwLjciUyA2NcKwNTknMzIuNCJX!5e0!3m2!1ses!2sar!4v1753975586154!5m2!1ses!2sar"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación Ferretería Victoria - Módulos mza 128A Casa 5"
                      />
                    </div>

                    {/* Botón para abrir en Google Maps */}
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full border-black/20 text-black hover:bg-black hover:text-white bg-transparent"
                      >
                        <a
                          href="https://www.google.com/maps/place/26°04'00.7%22S+65°59'32.4%22W/@-26.0668519,-65.9923204,17z"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          Abrir en Google Maps
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-black text-white">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/images/logo-ferreteria-victoria.png"
                    alt="Logo Ferretería Victoria"
                    width={24}
                    height={24}
                    className="rounded"
                  />
                  <span className="text-xl font-bold">Ferretería Victoria</span>
                </div>
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
                <div className="text-white/80">Electricidad</div>
                <div className="text-white/80">Herramientas</div>
                <div className="text-white/80">Materiales de Construcción</div>
                <div className="text-white/80">Repuestos en General</div>
                <div className="text-white/80">Agua y Accesorios</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-[#f8cf40]">Contacto</h4>
              <div className="space-y-2 text-sm text-white/80">
                <div>+1 (555) 123-4567</div>
                <div>info@ferreteriaVictoria.com</div>
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
            <p>&copy; 2024 Ferretería Victoria. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
