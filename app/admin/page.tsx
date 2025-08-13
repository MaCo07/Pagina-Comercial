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
import { Switch } from "@/components/ui/switch"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  X,
  ImageIcon,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Home,
  Package,
  Star,
  StarOff,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ImageModal } from "@/components/image-modal"
import {
  getAllProductosAdmin,
  createProducto,
  updateProducto,
  deleteProducto,
  getCategorias,
  uploadImageToStorage,
  initializeStorageBucket,
  toggleProductoDestacado,
  countProductosDestacados,
  formatPrice,
  parsePrice,
  CATEGORIAS_FIJAS,
  type Producto,
  isSupabaseConfigured,
} from "@/lib/productos"

export default function AdminPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [productosDestacadosCount, setProductosDestacadosCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    activo: true,
    destacado: false,
  })

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    setLoading(true)
    try {
      // Inicializar bucket de storage
      await initializeStorageBucket()

      // Cargar datos
      await fetchData()
    } catch (error) {
      console.error("Error initializing app:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async () => {
    try {
      const [productosData, categoriasData, destacadosCount] = await Promise.all([
        getAllProductosAdmin(),
        getCategorias(),
        countProductosDestacados(),
      ])
      setProductos(productosData)
      setCategorias(categoriasData)
      setProductosDestacadosCount(destacadosCount)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "",
      activo: true,
      destacado: false,
    })
    setEditingProduct(null)
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleEdit = (producto: Producto) => {
    setEditingProduct(producto)
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: formatPrice(producto.precio).replace(" $", ""),
      categoria: producto.categoria,
      activo: producto.activo,
      destacado: producto.destacado || false,
    })
    setImagePreview(producto.imagen_url)
    setImageFile(null)
    setIsDialogOpen(true)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tamaño (15MB)
      const maxSize = 15 * 1024 * 1024
      if (file.size > maxSize) {
        alert("El archivo es muy grande. Máximo 15MB permitido.")
        return
      }

      // Validar tipo
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        alert("Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF, WebP)")
        return
      }

      setImageFile(file)

      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImagePreview(editingProduct?.imagen_url || null)
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      let imagenUrl = editingProduct?.imagen_url || null

      // Subir nueva imagen si se seleccionó una
      if (imageFile) {
        setUploading(true)
        try {
          imagenUrl = await uploadImageToStorage(imageFile)
        } catch (error) {
          alert(error instanceof Error ? error.message : "Error al subir la imagen")
          return
        } finally {
          setUploading(false)
        }
      }

      const productData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || null,
        precio: parsePrice(formData.precio),
        categoria: formData.categoria,
        imagen_url: imagenUrl,
        activo: formData.activo,
        destacado: formData.destacado,
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
        alert(`✅ Producto ${editingProduct ? "actualizado" : "creado"} correctamente`)
      } else {
        alert("❌ Error al guardar el producto")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert("❌ Error inesperado al guardar el producto")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteProducto(id)
      if (success) {
        await fetchData()
        alert("✅ Producto eliminado correctamente")
      } else {
        alert("❌ Error al eliminar el producto")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("❌ Error inesperado al eliminar el producto")
    }
  }

  const toggleActive = async (producto: Producto) => {
    try {
      const success = await updateProducto(producto.id, { activo: !producto.activo })
      if (success) {
        await fetchData()
      } else {
        alert("❌ Error al cambiar el estado del producto")
      }
    } catch (error) {
      console.error("Error toggling product status:", error)
      alert("❌ Error inesperado al cambiar el estado")
    }
  }

  const handleToggleDestacado = async (producto: Producto) => {
    try {
      const result = await toggleProductoDestacado(producto.id, !producto.destacado)

      if (result.success) {
        await fetchData()
        alert(`✅ ${result.message}`)
      } else {
        alert(`⚠️ ${result.message}`)
      }
    } catch (error) {
      console.error("Error toggling destacado:", error)
      alert("❌ Error inesperado al cambiar el estado de destacado")
    }
  }

  const handlePriceChange = (value: string) => {
    // Permitir solo números y puntos
    const cleanValue = value.replace(/[^\d]/g, "")
    if (cleanValue) {
      const formatted = formatPrice(Number(cleanValue)).replace(" $", "")
      setFormData({ ...formData, precio: formatted })
    } else {
      setFormData({ ...formData, precio: "" })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de administración...</p>
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
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Panel de Administración</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Ver Tienda</span>
              </Link>
              {isSupabaseConfigured && (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Conectado
                </Badge>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Configuration Notice */}
      {!isSupabaseConfigured && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Base de datos no configurada.</strong> Configura Supabase para usar todas las funcionalidades.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Total Productos</p>
                  <p className="text-2xl font-bold text-gray-900">{productos.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Productos Activos</p>
                  <p className="text-2xl font-bold text-green-600">{productos.filter((p) => p.activo).length}</p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Productos Inactivos</p>
                  <p className="text-2xl font-bold text-red-600">{productos.filter((p) => !p.activo).length}</p>
                </div>
                <EyeOff className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Destacados</p>
                  <p className="text-2xl font-bold text-yellow-600">{productosDestacadosCount}/4</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Categorías</p>
                  <p className="text-2xl font-bold text-purple-600">{categorias.length}</p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">{categorias.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Gestión de Productos</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      resetForm()
                      setIsDialogOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Producto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? "Editar Producto" : "Crear Nuevo Producto"}</DialogTitle>
                    <DialogDescription>
                      {editingProduct
                        ? "Modifica los datos del producto seleccionado"
                        : "Completa la información para crear un nuevo producto"}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Información Básica */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="nombre">Nombre del Producto *</Label>
                          <Input
                            id="nombre"
                            required
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            placeholder="Ej: Taladro Percutor 500W"
                          />
                        </div>

                        <div>
                          <Label htmlFor="precio">Precio *</Label>
                          <Input
                            id="precio"
                            required
                            value={formData.precio}
                            onChange={(e) => handlePriceChange(e.target.value)}
                            placeholder="20.000"
                          />
                          <p className="text-xs text-gray-500 mt-1">Formato: 20.000 (sin decimales)</p>
                        </div>

                        <div>
                          <Label htmlFor="categoria">Categoría *</Label>
                          <Select
                            value={formData.categoria}
                            onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIAS_FIJAS.map((categoria) => (
                                <SelectItem key={categoria} value={categoria}>
                                  {categoria}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="descripcion">Descripción</Label>
                          <Textarea
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            placeholder="Descripción detallada del producto..."
                            rows={4}
                          />
                        </div>

                        {/* Switches para estado */}
                        <div className="space-y-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="activo" className="text-sm font-medium">
                              Producto Activo
                            </Label>
                            <Switch
                              id="activo"
                              checked={formData.activo}
                              onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <Label htmlFor="destacado" className="text-sm font-medium">
                                Producto Destacado
                              </Label>
                              <p className="text-xs text-gray-500">
                                Máximo 4 productos destacados ({productosDestacadosCount}/4)
                              </p>
                            </div>
                            <Switch
                              id="destacado"
                              checked={formData.destacado}
                              onCheckedChange={(checked) => {
                                if (checked && productosDestacadosCount >= 4 && !editingProduct?.destacado) {
                                  alert(
                                    "El espacio de productos destacados está lleno. Deshabilite uno para habilitar otro.",
                                  )
                                  return
                                }
                                setFormData({ ...formData, destacado: checked })
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Imagen del Producto */}
                      <div className="space-y-4">
                        <Label>Imagen del Producto</Label>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploading}
                              className="flex items-center gap-2"
                            >
                              <Upload className="h-4 w-4" />
                              {uploading ? "Subiendo..." : "Seleccionar Imagen"}
                            </Button>
                            {imageFile && (
                              <span className="text-sm text-green-600 flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                {imageFile.name}
                              </span>
                            )}
                          </div>

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />

                          <p className="text-xs text-gray-500">Formatos: JPG, PNG, GIF, WebP • Máximo: 15MB</p>

                          {/* Vista previa */}
                          {imagePreview && (
                            <div className="relative">
                              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                                <ImageModal
                                  src={imagePreview || "/placeholder.svg"}
                                  alt="Vista previa"
                                  trigger={
                                    <Image
                                      src={imagePreview || "/placeholder.svg"}
                                      alt="Vista previa"
                                      fill
                                      className="object-cover cursor-pointer"
                                    />
                                  }
                                />
                                {imageFile && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={clearImage}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <p className="text-xs text-center text-gray-500 mt-2">
                                {imageFile ? "Nueva imagen seleccionada" : "Imagen actual"}
                              </p>
                            </div>
                          )}

                          {!imagePreview && (
                            <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                              <div className="text-center text-gray-500">
                                <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                                <p className="text-sm">Sin imagen</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={saving || uploading}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving || uploading}>
                        {saving ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            {uploading ? "Subiendo imagen..." : "Guardando..."}
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {editingProduct ? "Actualizar" : "Crear"} Producto
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {productos.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
                <p className="text-gray-500 mb-4">Comienza creando tu primer producto</p>
                <Button
                  onClick={() => {
                    resetForm()
                    setIsDialogOpen(true)
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Producto
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagen</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Destacado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productos.map((producto) => (
                      <TableRow key={producto.id}>
                        <TableCell>
                          <div className="relative w-12 h-12">
                            <ImageModal
                              src={producto.imagen_url || "/placeholder.svg?height=48&width=48"}
                              alt={producto.nombre}
                              trigger={
                                <Image
                                  src={producto.imagen_url || "/placeholder.svg?height=48&width=48"}
                                  alt={producto.nombre}
                                  fill
                                  className="object-cover rounded-lg cursor-pointer"
                                />
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{producto.nombre}</p>
                            {producto.descripcion && (
                              <p className="text-sm text-gray-500 truncate max-w-xs">{producto.descripcion}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{producto.categoria}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{formatPrice(producto.precio)}</span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={producto.activo ? "default" : "secondary"}
                            className={
                              producto.activo
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }
                          >
                            {producto.activo ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleDestacado(producto)}
                            className={
                              producto.destacado
                                ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                : "text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                            }
                            title={producto.destacado ? "Quitar de destacados" : "Marcar como destacado"}
                          >
                            {producto.destacado ? (
                              <Star className="h-4 w-4 fill-current" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleActive(producto)}
                              title={producto.activo ? "Desactivar" : "Activar"}
                            >
                              {producto.activo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>

                            <Button variant="outline" size="sm" onClick={() => handleEdit(producto)} title="Editar">
                              <Edit className="h-4 w-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                                  title="Eliminar"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción eliminará permanentemente el producto "{producto.nombre}" y su imagen
                                    asociada. Esta acción no se puede deshacer.
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
