"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, LinkIcon, X, ImageIcon, Settings, Save, Camera } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  getAllProductosAdmin,
  createProducto,
  updateProducto,
  deleteProducto,
  getCategorias,
  type Producto,
  isSupabaseConfigured,
} from "@/lib/productos"

const CATEGORIAS_DISPONIBLES = [
  "Electricidad",
  "Herramientas",
  "Materiales de Construcción",
  "Repuestos en General",
  "Agua y Accesorios",
]

// 🖼️ Configuración de imágenes por defecto
const DEFAULT_IMAGES = {
  tienda: "/placeholder.svg?height=400&width=600&text=Foto+del+Local",
  categorias: {
    Electricidad: "/placeholder.svg?height=200&width=300&text=Electricidad",
    Herramientas: "/placeholder.svg?height=200&width=300&text=Herramientas",
    "Materiales de Construcción": "/placeholder.svg?height=200&width=300&text=Materiales",
    "Repuestos en General": "/placeholder.svg?height=200&width=300&text=Repuestos",
    "Agua y Accesorios": "/placeholder.svg?height=200&width=300&text=Agua",
  },
}

export default function AdminPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageMethod, setImageMethod] = useState<"url" | "upload">("url")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 🖼️ Estados para gestión de imágenes
  const [activeTab, setActiveTab] = useState("productos")
  const [imageConfig, setImageConfig] = useState(DEFAULT_IMAGES)
  const [editingImageType, setEditingImageType] = useState<string | null>(null)
  const [tempImagePreview, setTempImagePreview] = useState<string | null>(null)
  const [tempImageFile, setTempImageFile] = useState<File | null>(null)
  const [tempImageUrl, setTempImageUrl] = useState("")
  const [tempImageMethod, setTempImageMethod] = useState<"url" | "upload">("url")
  const tempFileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    imagen_url: "",
    activo: true,
  })

  useEffect(() => {
    fetchData()
    loadImageConfig()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [productosData, categoriasData] = await Promise.all([getAllProductosAdmin(), getCategorias()])
    setProductos(productosData)
    setCategorias(categoriasData)
    setLoading(false)
  }

  // 🖼️ Cargar configuración de imágenes desde localStorage
  const loadImageConfig = () => {
    try {
      const saved = localStorage.getItem("imageConfig")
      if (saved) {
        setImageConfig(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Error loading image config:", error)
    }
  }

  // 💾 Guardar configuración de imágenes
  const saveImageConfig = (newConfig: typeof DEFAULT_IMAGES) => {
    try {
      localStorage.setItem("imageConfig", JSON.stringify(newConfig))
      setImageConfig(newConfig)
    } catch (error) {
      console.error("Error saving image config:", error)
      alert("Error al guardar la configuración de imágenes")
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "",
      imagen_url: "",
      activo: true,
    })
    setEditingProduct(null)
    setImagePreview(null)
    setImageFile(null)
    setImageMethod("url")
  }

  const handleEdit = (producto: Producto) => {
    setEditingProduct(producto)
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: producto.precio.toString(),
      categoria: producto.categoria,
      imagen_url: producto.imagen_url || "",
      activo: producto.activo,
    })
    setImagePreview(producto.imagen_url)
    setImageMethod("url")
    setIsDialogOpen(true)
  }

  // 🖼️ Manejar selección de archivo para productos
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        alert("Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF, WebP)")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo es muy grande. Máximo 5MB permitido.")
        return
      }

      setImageFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      setFormData({ ...formData, imagen_url: "" })
    }
  }

  // 🖼️ Manejar selección de archivo para configuración de imágenes
  const handleTempFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        alert("Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF, WebP)")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo es muy grande. Máximo 5MB permitido.")
        return
      }

      setTempImageFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setTempImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      setTempImageUrl("")
    }
  }

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, imagen_url: url })
    setImagePreview(url)
    setImageFile(null)
  }

  // 🖼️ Manejar URL temporal
  const handleTempUrlChange = (url: string) => {
    setTempImageUrl(url)
    setTempImagePreview(url)
    setTempImageFile(null)
  }

  const clearImage = () => {
    setImagePreview(null)
    setImageFile(null)
    setFormData({ ...formData, imagen_url: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // 🖼️ Limpiar imagen temporal
  const clearTempImage = () => {
    setTempImagePreview(null)
    setTempImageFile(null)
    setTempImageUrl("")
    if (tempFileInputRef.current) {
      tempFileInputRef.current.value = ""
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // 🖼️ Iniciar edición de imagen
  const startImageEdit = (type: string) => {
    setEditingImageType(type)
    if (type === "tienda") {
      setTempImagePreview(imageConfig.tienda)
      setTempImageUrl(imageConfig.tienda)
    } else {
      const categoria = type.replace("categoria-", "")
      setTempImagePreview(imageConfig.categorias[categoria as keyof typeof imageConfig.categorias])
      setTempImageUrl(imageConfig.categorias[categoria as keyof typeof imageConfig.categorias])
    }
    setTempImageMethod("url")
  }

  // 💾 Guardar cambio de imagen
  const saveImageChange = async () => {
    if (!editingImageType) return

    let finalImageUrl = tempImageUrl

    if (tempImageFile) {
      try {
        finalImageUrl = await fileToBase64(tempImageFile)
      } catch (error) {
        alert("Error al procesar la imagen")
        return
      }
    }

    const newConfig = { ...imageConfig }

    if (editingImageType === "tienda") {
      newConfig.tienda = finalImageUrl
    } else {
      const categoria = editingImageType.replace("categoria-", "")
      newConfig.categorias[categoria as keyof typeof newConfig.categorias] = finalImageUrl
    }

    saveImageConfig(newConfig)
    setEditingImageType(null)
    clearTempImage()
    alert("Imagen actualizada correctamente")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let finalImageUrl = formData.imagen_url

    if (imageFile) {
      try {
        finalImageUrl = await fileToBase64(imageFile)
      } catch (error) {
        alert("Error al procesar la imagen")
        return
      }
    }

    const productData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion || null,
      precio: Number.parseFloat(formData.precio),
      categoria: formData.categoria,
      imagen_url: finalImageUrl || null,
      activo: formData.activo,
    }

    let success = false

    if (editingProduct) {
      const result = await updateProducto(editingProduct.id, productData)
      success = result !== null
    } else {
      const result = await createProducto(productData)
      success = result !== null
    }

    if (success) {
      await fetchData()
      setIsDialogOpen(false)
      resetForm()
    } else {
      alert("Error al guardar el producto")
    }
  }

  const handleDelete = async (id: number) => {
    const success = await deleteProducto(id)
    if (success) {
      await fetchData()
    } else {
      alert("Error al eliminar el producto")
    }
  }

  const toggleActive = async (producto: Producto) => {
    const success = await updateProducto(producto.id, { activo: !producto.activo })
    if (success) {
      await fetchData()
    } else {
      alert("Error al cambiar el estado del producto")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black">Cargando panel de administración...</p>
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
              <Image src="/images/mi-logo.png" alt="Logo Mi Ferretería" width={32} height={32} className="rounded" />
              <span className="text-xl font-bold">Mi Ferretería - Admin</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-[#69def5] transition-colors">
              Ver Tienda
            </Link>
            <Link href="/productos" className="text-sm font-medium hover:text-[#69def5] transition-colors">
              Productos
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-[#f8cf40]">
        <div className="container">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-black">Panel de Administración</h1>
            <p className="text-xl text-black/80 max-w-[600px] mx-auto">
              Gestiona productos e imágenes de tu catálogo desde un solo lugar
            </p>
          </div>
        </div>
      </section>

      {/* Configuration Notice */}
      {!isSupabaseConfigured && (
        <section className="py-8 bg-yellow-100 border-y border-yellow-300">
          <div className="container">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-yellow-800">⚠️ Base de Datos No Configurada</h3>
              <p className="text-yellow-700 max-w-2xl mx-auto">
                Para usar el panel de administración, necesitas configurar Supabase. Actualmente estás viendo datos de
                ejemplo.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Estadísticas */}
      <section className="py-8 bg-[#69def5]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white border-2 border-black/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-black">{productos.filter((p) => p.activo).length}</div>
                <div className="text-sm text-black/70">Productos Activos</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-2 border-black/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-black">{productos.filter((p) => !p.activo).length}</div>
                <div className="text-sm text-black/70">Productos Inactivos</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-2 border-black/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-black">{categorias.length}</div>
                <div className="text-sm text-black/70">Categorías</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-2 border-black/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-black">{productos.length}</div>
                <div className="text-sm text-black/70">Total Productos</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contenido Principal con Tabs */}
      <section className="py-12 bg-white">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="productos" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Gestión de Productos
              </TabsTrigger>
              <TabsTrigger value="imagenes" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Configuración de Imágenes
              </TabsTrigger>
            </TabsList>

            {/* Tab de Productos */}
            <TabsContent value="productos" className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-black">Lista de Productos</h2>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-black text-white hover:bg-black/90"
                      onClick={() => {
                        resetForm()
                        setIsDialogOpen(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Producto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}</DialogTitle>
                      <DialogDescription>
                        {editingProduct
                          ? "Modifica los datos del producto"
                          : "Completa la información del nuevo producto"}
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Información del Producto */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre del Producto</Label>
                            <Input
                              id="nombre"
                              required
                              value={formData.nombre}
                              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                              placeholder="Ej: Smartphone Pro Max"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="precio">Precio</Label>
                              <Input
                                id="precio"
                                type="number"
                                step="0.01"
                                required
                                value={formData.precio}
                                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                placeholder="0.00"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="categoria">Categoría</Label>
                              <Select
                                value={formData.categoria}
                                onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                  {CATEGORIAS_DISPONIBLES.map((categoria) => (
                                    <SelectItem key={categoria} value={categoria}>
                                      {categoria}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Textarea
                              id="descripcion"
                              value={formData.descripcion}
                              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                              placeholder="Descripción del producto..."
                              rows={4}
                            />
                          </div>
                        </div>

                        {/* Gestión de Imágenes */}
                        <div className="space-y-4">
                          <Label>Imagen del Producto</Label>

                          <Tabs
                            value={imageMethod}
                            onValueChange={(value) => setImageMethod(value as "url" | "upload")}
                          >
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="url" className="flex items-center gap-2">
                                <LinkIcon className="h-4 w-4" />
                                URL de Internet
                              </TabsTrigger>
                              <TabsTrigger value="upload" className="flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                Subir Archivo
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="url" className="space-y-3">
                              <Input
                                placeholder="https://ejemplo.com/imagen.jpg"
                                value={formData.imagen_url}
                                onChange={(e) => handleUrlChange(e.target.value)}
                              />
                              <p className="text-sm text-gray-600">Pega la URL de una imagen desde internet</p>
                            </TabsContent>

                            <TabsContent value="upload" className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="flex items-center gap-2"
                                >
                                  <Upload className="h-4 w-4" />
                                  Seleccionar Archivo
                                </Button>
                                {imageFile && <span className="text-sm text-green-600">✓ {imageFile.name}</span>}
                              </div>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                              />
                              <p className="text-sm text-gray-600">Formatos: JPG, PNG, GIF, WebP (máx. 5MB)</p>
                            </TabsContent>
                          </Tabs>

                          {/* Vista previa de imagen */}
                          {imagePreview && (
                            <div className="relative">
                              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                                <Image
                                  src={imagePreview || "/placeholder.svg"}
                                  alt="Vista previa"
                                  fill
                                  className="object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={clearImage}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-center text-gray-600 mt-2">Vista previa de la imagen</p>
                            </div>
                          )}

                          {!imagePreview && (
                            <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                              <div className="text-center text-gray-500">
                                <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                                <p className="text-sm">Sin imagen seleccionada</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" className="bg-black text-white hover:bg-black/90">
                          {editingProduct ? "Actualizar" : "Crear"} Producto
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Lista de Productos */}
              <div className="grid gap-4">
                {productos.map((producto) => (
                  <Card
                    key={producto.id}
                    className={`border-2 ${producto.activo ? "border-black/10" : "border-red-200 bg-red-50"}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={producto.imagen_url || "/placeholder.svg"}
                            alt={producto.nombre}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-black truncate">{producto.nombre}</h3>
                            <Badge
                              variant={producto.activo ? "default" : "secondary"}
                              className={producto.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                            >
                              {producto.activo ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                          <p className="text-black/70 text-sm mb-2 line-clamp-2">{producto.descripcion}</p>
                          <div className="flex items-center space-x-4 text-sm text-black/60">
                            <span className="font-semibold text-black">${producto.precio}</span>
                            <Badge variant="outline" className="border-[#69def5] text-black">
                              {producto.categoria}
                            </Badge>
                            <span>ID: {producto.id}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleActive(producto)}
                            className="border-black/20"
                          >
                            {producto.activo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(producto)}
                            className="border-black/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará permanentemente el producto "{producto.nombre}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(producto.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {productos.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-2xl font-bold text-black mb-2">No hay productos</h3>
                  <p className="text-black/70 mb-4">Comienza agregando tu primer producto</p>
                </div>
              )}
            </TabsContent>

            {/* 🖼️ Tab de Configuración de Imágenes */}
            <TabsContent value="imagenes" className="space-y-8">
              <div className="text-center space-y-4 mb-8">
                <h2 className="text-2xl font-bold text-black">Configuración de Imágenes</h2>
                <p className="text-black/70 max-w-2xl mx-auto">
                  Personaliza las imágenes que aparecen en tu tienda: foto del local, imágenes de categorías y productos
                  destacados.
                </p>
              </div>

              <div className="grid gap-8">
                {/* Imagen de la Tienda */}
                <Card className="border-2 border-black/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Imagen de la Tienda
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-black/70 mb-4">
                          Esta imagen aparece en la página principal junto al logo y título de tu negocio.
                        </p>
                        <Button
                          onClick={() => startImageEdit("tienda")}
                          className="bg-black text-white hover:bg-black/90"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Cambiar Imagen
                        </Button>
                      </div>
                      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                        <Image
                          src={imageConfig.tienda || "/placeholder.svg"}
                          alt="Imagen de la tienda"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Imágenes de Categorías */}
                <Card className="border-2 border-black/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Imágenes de Categorías
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-sm text-black/70">
                      Personaliza las imágenes que representan cada categoría de productos en tu tienda.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(imageConfig.categorias).map(([categoria, imagen]) => (
                        <div key={categoria} className="space-y-3">
                          <h4 className="font-semibold text-black">{categoria}</h4>
                          <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                            <Image
                              src={imagen || "/placeholder.svg"}
                              alt={`Imagen de ${categoria}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startImageEdit(`categoria-${categoria}`)}
                            className="w-full border-black/20"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Cambiar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 🖼️ Modal para editar imágenes */}
              {editingImageType && (
                <Dialog open={!!editingImageType} onOpenChange={() => setEditingImageType(null)}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        Cambiar{" "}
                        {editingImageType === "tienda"
                          ? "Imagen de la Tienda"
                          : `Imagen de ${editingImageType.replace("categoria-", "")}`}
                      </DialogTitle>
                      <DialogDescription>
                        Selecciona una nueva imagen desde tu computadora o pega una URL de internet.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      <Tabs
                        value={tempImageMethod}
                        onValueChange={(value) => setTempImageMethod(value as "url" | "upload")}
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="url" className="flex items-center gap-2">
                            <LinkIcon className="h-4 w-4" />
                            URL de Internet
                          </TabsTrigger>
                          <TabsTrigger value="upload" className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Subir Archivo
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="url" className="space-y-3">
                          <Input
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={tempImageUrl}
                            onChange={(e) => handleTempUrlChange(e.target.value)}
                          />
                          <p className="text-sm text-gray-600">Pega la URL de una imagen desde internet</p>
                        </TabsContent>

                        <TabsContent value="upload" className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => tempFileInputRef.current?.click()}
                              className="flex items-center gap-2"
                            >
                              <Upload className="h-4 w-4" />
                              Seleccionar Archivo
                            </Button>
                            {tempImageFile && <span className="text-sm text-green-600">✓ {tempImageFile.name}</span>}
                          </div>
                          <input
                            ref={tempFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleTempFileSelect}
                            className="hidden"
                          />
                          <p className="text-sm text-gray-600">Formatos: JPG, PNG, GIF, WebP (máx. 5MB)</p>
                        </TabsContent>
                      </Tabs>

                      {/* Vista previa */}
                      {tempImagePreview && (
                        <div className="relative">
                          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                            <Image
                              src={tempImagePreview || "/placeholder.svg"}
                              alt="Vista previa"
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={clearTempImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-center text-gray-600 mt-2">Vista previa de la nueva imagen</p>
                        </div>
                      )}

                      <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setEditingImageType(null)}>
                          Cancelar
                        </Button>
                        <Button
                          onClick={saveImageChange}
                          className="bg-black text-white hover:bg-black/90"
                          disabled={!tempImagePreview}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-black text-white">
        <div className="container">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Image src="/images/mi-logo.png" alt="Logo Mi Ferretería" width={24} height={24} className="rounded" />
              <span className="text-xl font-bold">Mi Ferretería - Admin</span>
            </div>
            <p className="text-white/80">Panel de administración para gestión completa de tu catálogo</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
