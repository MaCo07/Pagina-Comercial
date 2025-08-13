import { createClient } from "@supabase/supabase-js"

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

let supabase: any = null

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl!, supabaseAnonKey!)
}

// Categorías fijas del negocio
export const CATEGORIAS_FIJAS = ["Herramientas", "Electricidad", "Plomería", "Construcción", "Ferretería"]

// Tipos
export interface Producto {
  id: number
  nombre: string
  descripcion?: string
  precio: number
  categoria: string
  imagen_url?: string
  activo: boolean
  destacado?: boolean
  created_at?: string
  updated_at?: string
}

export interface ProductoInput {
  nombre: string
  descripcion?: string | null
  precio: number
  categoria: string
  imagen_url?: string | null
  activo: boolean
  destacado?: boolean
}

// Funciones de formato
export function formatPrice(precio: number): string {
  return (
    new Intl.NumberFormat("es-ES", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(precio) + " $"
  )
}

export function parsePrice(priceString: string): number {
  // Remover puntos, espacios y el símbolo $
  const cleanPrice = priceString.replace(/[.\s$]/g, "")
  return Number.parseInt(cleanPrice) || 0
}

// Funciones de productos (con fallback a datos mock si no hay Supabase)
const PRODUCTOS_MOCK: Producto[] = [
  {
    id: 1,
    nombre: "Taladro Percutor 500W",
    descripcion: "Taladro percutor profesional con cable, ideal para trabajos de construcción",
    precio: 45000,
    categoria: "Herramientas",
    imagen_url: "/placeholder.svg?height=300&width=300&text=Taladro",
    activo: true,
    destacado: true,
  },
  {
    id: 2,
    nombre: "Martillo de Carpintero",
    descripcion: "Martillo profesional con mango de madera, cabeza de acero templado",
    precio: 12000,
    categoria: "Herramientas",
    imagen_url: "/placeholder.svg?height=300&width=300&text=Martillo",
    activo: true,
    destacado: true,
  },
  {
    id: 3,
    nombre: "Cable Eléctrico 2.5mm",
    descripcion: "Cable eléctrico de cobre, aislamiento PVC, rollo de 100 metros",
    precio: 35000,
    categoria: "Electricidad",
    imagen_url: "/placeholder.svg?height=300&width=300&text=Cable",
    activo: true,
    destacado: false,
  },
  {
    id: 4,
    nombre: 'Llave Inglesa 12"',
    descripción: "Llave inglesa ajustable de 12 pulgadas, acero al cromo vanadio",
    precio: 18000,
    categoria: "Herramientas",
    imagen_url: "/placeholder.svg?height=300&width=300&text=Llave",
    activo: true,
    destacado: true,
  },
]

export async function getAllProductos(): Promise<Producto[]> {
  if (!isSupabaseConfigured) {
    return PRODUCTOS_MOCK.filter((p) => p.activo)
  }

  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching productos:", error)
      return PRODUCTOS_MOCK.filter((p) => p.activo)
    }

    return data || []
  } catch (error) {
    console.error("Error fetching productos:", error)
    return PRODUCTOS_MOCK.filter((p) => p.activo)
  }
}

export async function getAllProductosAdmin(): Promise<Producto[]> {
  if (!isSupabaseConfigured) {
    return PRODUCTOS_MOCK
  }

  try {
    const { data, error } = await supabase.from("productos").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching productos for admin:", error)
      return PRODUCTOS_MOCK
    }

    return data || []
  } catch (error) {
    console.error("Error fetching productos for admin:", error)
    return PRODUCTOS_MOCK
  }
}

export async function getProductosPorCategoria(): Promise<Record<string, number>> {
  if (!isSupabaseConfigured) {
    const conteo: Record<string, number> = {}
    CATEGORIAS_FIJAS.forEach((categoria) => {
      conteo[categoria] = PRODUCTOS_MOCK.filter((p) => p.categoria === categoria && p.activo).length
    })
    return conteo
  }

  try {
    const { data, error } = await supabase.from("productos").select("categoria").eq("activo", true)

    if (error) {
      console.error("Error fetching categorias:", error)
      const conteo: Record<string, number> = {}
      CATEGORIAS_FIJAS.forEach((categoria) => {
        conteo[categoria] = PRODUCTOS_MOCK.filter((p) => p.categoria === categoria && p.activo).length
      })
      return conteo
    }

    const conteo: Record<string, number> = {}
    CATEGORIAS_FIJAS.forEach((categoria) => {
      conteo[categoria] = (data || []).filter((p) => p.categoria === categoria).length
    })

    return conteo
  } catch (error) {
    console.error("Error fetching categorias:", error)
    const conteo: Record<string, number> = {}
    CATEGORIAS_FIJAS.forEach((categoria) => {
      conteo[categoria] = PRODUCTOS_MOCK.filter((p) => p.categoria === categoria && p.activo).length
    })
    return conteo
  }
}

export async function getProductosDestacados(): Promise<Producto[]> {
  if (!isSupabaseConfigured) {
    return PRODUCTOS_MOCK.filter((p) => p.destacado && p.activo).slice(0, 4)
  }

  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .eq("destacado", true)
      .limit(4)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching productos destacados:", error)
      return PRODUCTOS_MOCK.filter((p) => p.destacado && p.activo).slice(0, 4)
    }

    return data || []
  } catch (error) {
    console.error("Error fetching productos destacados:", error)
    return PRODUCTOS_MOCK.filter((p) => p.destacado && p.activo).slice(0, 4)
  }
}

export async function getProductosByCategoria(categoria: string): Promise<Producto[]> {
  if (!isSupabaseConfigured) {
    return PRODUCTOS_MOCK.filter((p) => p.categoria === categoria && p.activo)
  }

  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("categoria", categoria)
      .eq("activo", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching productos by categoria:", error)
      return PRODUCTOS_MOCK.filter((p) => p.categoria === categoria && p.activo)
    }

    return data || []
  } catch (error) {
    console.error("Error fetching productos by categoria:", error)
    return PRODUCTOS_MOCK.filter((p) => p.categoria === categoria && p.activo)
  }
}

export async function getCategorias(): Promise<string[]> {
  return CATEGORIAS_FIJAS
}

export async function createProducto(producto: ProductoInput): Promise<Producto | null> {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not configured, cannot create producto")
    return null
  }

  try {
    const { data, error } = await supabase.from("productos").insert([producto]).select().single()

    if (error) {
      console.error("Error creating producto:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error creating producto:", error)
    return null
  }
}

export async function updateProducto(id: number, updates: Partial<ProductoInput>): Promise<Producto | null> {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not configured, cannot update producto")
    return null
  }

  try {
    const { data, error } = await supabase.from("productos").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating producto:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error updating producto:", error)
    return null
  }
}

export async function deleteProducto(id: number): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not configured, cannot delete producto")
    return false
  }

  try {
    const { error } = await supabase.from("productos").delete().eq("id", id)

    if (error) {
      console.error("Error deleting producto:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error deleting producto:", error)
    return false
  }
}

// Funciones para productos destacados
export async function countProductosDestacados(): Promise<number> {
  if (!isSupabaseConfigured) {
    return PRODUCTOS_MOCK.filter((p) => p.destacado).length
  }

  try {
    const { count, error } = await supabase
      .from("productos")
      .select("*", { count: "exact", head: true })
      .eq("destacado", true)

    if (error) {
      console.error("Error counting productos destacados:", error)
      return PRODUCTOS_MOCK.filter((p) => p.destacado).length
    }

    return count || 0
  } catch (error) {
    console.error("Error counting productos destacados:", error)
    return PRODUCTOS_MOCK.filter((p) => p.destacado).length
  }
}

export async function toggleProductoDestacado(
  id: number,
  destacado: boolean,
): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, message: "Base de datos no configurada" }
  }

  try {
    // Si se quiere marcar como destacado, verificar el límite
    if (destacado) {
      const count = await countProductosDestacados()
      if (count >= 4) {
        return {
          success: false,
          message: "Máximo 4 productos destacados permitidos. Desmarca otro producto primero.",
        }
      }
    }

    const { data, error } = await supabase.from("productos").update({ destacado }).eq("id", id).select().single()

    if (error) {
      console.error("Error toggling destacado:", error)
      return { success: false, message: "Error al actualizar el producto" }
    }

    return {
      success: true,
      message: destacado ? "Producto marcado como destacado" : "Producto removido de destacados",
    }
  } catch (error) {
    console.error("Error toggling destacado:", error)
    return { success: false, message: "Error inesperado" }
  }
}

// Funciones para manejo de imágenes
export async function initializeStorageBucket(): Promise<void> {
  if (!isSupabaseConfigured) {
    return
  }

  try {
    // Verificar si el bucket existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("Error listing buckets:", listError)
      return
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === "productos")

    if (!bucketExists) {
      // Crear el bucket si no existe
      const { error: createError } = await supabase.storage.createBucket("productos", {
        public: true,
        allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
        fileSizeLimit: 15728640, // 15MB
      })

      if (createError) {
        console.error("Error creating bucket:", createError)
      } else {
        console.log('Bucket "productos" created successfully')
      }
    }
  } catch (error) {
    console.error("Error initializing storage bucket:", error)
  }
}

export async function uploadImageToStorage(file: File): Promise<string> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase no está configurado")
  }

  try {
    // Generar nombre único para el archivo
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `productos/${fileName}`

    // Subir archivo
    const { data, error } = await supabase.storage.from("productos").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file:", error)
      throw new Error(`Error al subir la imagen: ${error.message}`)
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage.from("productos").getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      throw new Error("Error al obtener la URL pública de la imagen")
    }

    return urlData.publicUrl
  } catch (error) {
    console.error("Error in uploadImageToStorage:", error)
    throw error
  }
}
