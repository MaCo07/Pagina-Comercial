import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if environment variables are present
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export type Producto = {
  id: number
  nombre: string
  descripcion: string | null
  precio: number
  categoria: string
  imagen_url: string | null
  activo: boolean
  created_at: string
  updated_at: string
}

const mockProductos: Producto[] = [
  {
    id: 1,
    nombre: "Cable Eléctrico 2.5mm",
    descripcion: "Cable de cobre para instalaciones eléctricas residenciales",
    precio: 25.5,
    categoria: "Electricidad",
    imagen_url: "/placeholder.svg?height=250&width=250",
    activo: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    nombre: "Taladro Percutor",
    descripcion: "Taladro profesional con función de percusión",
    precio: 189.0,
    categoria: "Herramientas",
    imagen_url: "/placeholder.svg?height=250&width=250",
    activo: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    nombre: "Cemento Portland",
    descripcion: "Bolsa de cemento de 50kg para construcción",
    precio: 12.75,
    categoria: "Materiales de Construcción",
    imagen_url: "/placeholder.svg?height=250&width=250",
    activo: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    nombre: "Filtro de Agua",
    descripcion: "Filtro universal para sistemas de agua potable",
    precio: 35.9,
    categoria: "Agua y Accesorios",
    imagen_url: "/placeholder.svg?height=250&width=250",
    activo: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 5,
    nombre: "Tornillos Autorroscantes",
    descripcion: "Caja de 100 tornillos para metal y madera",
    precio: 8.25,
    categoria: "Repuestos en General",
    imagen_url: "/placeholder.svg?height=250&width=250",
    activo: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

// ===== FUNCIONES PARA PRODUCTOS =====

export async function getProductos(): Promise<Producto[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockProductos.filter((p) => p.activo)
  }

  try {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching productos:", error)
      return mockProductos.filter((p) => p.activo)
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching productos:", error)
    return mockProductos.filter((p) => p.activo)
  }
}

export async function getAllProductosAdmin(): Promise<Producto[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockProductos
  }

  try {
    const { data, error } = await supabase.from("productos").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching productos:", error)
      return mockProductos
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching productos:", error)
    return mockProductos
  }
}

export async function getCategorias(): Promise<string[]> {
  if (!isSupabaseConfigured || !supabase) {
    const categorias = Array.from(new Set(mockProductos.map((p) => p.categoria)))
    return categorias
  }

  try {
    const { data, error } = await supabase.from("productos").select("categoria").neq("categoria", null)

    if (error) {
      console.error("Error fetching categorias:", error)
      const categorias = Array.from(new Set(mockProductos.map((p) => p.categoria)))
      return categorias
    }

    const categorias = Array.from(new Set(data.map((item) => item.categoria)))
    return categorias.length > 0 ? categorias : Array.from(new Set(mockProductos.map((p) => p.categoria)))
  } catch (error) {
    console.error("Unexpected error fetching categorias:", error)
    const categorias = Array.from(new Set(mockProductos.map((p) => p.categoria)))
    return categorias
  }
}

type ProductInput = Omit<Producto, "id" | "created_at" | "updated_at"> &
  Partial<Pick<Producto, "created_at" | "updated_at">>

export async function createProducto(producto: ProductInput): Promise<Producto | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured, cannot create producto")
    return null
  }

  try {
    const { data, error } = await supabase
      .from("productos")
      .insert([
        {
          ...producto,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating producto:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error creating producto:", error)
    return null
  }
}

export async function updateProducto(id: number, updates: Partial<ProductInput>): Promise<Producto | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured, cannot update producto")
    return null
  }

  try {
    const { data, error } = await supabase
      .from("productos")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating producto:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error updating producto:", error)
    return null
  }
}

export async function deleteProducto(id: number): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured, cannot delete producto")
    return false
  }

  try {
    // Primero obtener el producto para eliminar su imagen
    const { data: producto } = await supabase.from("productos").select("imagen_url").eq("id", id).single()

    // Eliminar imagen del storage si existe
    if (producto?.imagen_url && producto.imagen_url.includes("supabase")) {
      const fileName = producto.imagen_url.split("/").pop()
      if (fileName) {
        await supabase.storage.from("productos").remove([fileName])
      }
    }

    // Eliminar producto de la base de datos
    const { error } = await supabase.from("productos").delete().eq("id", id)

    if (error) {
      console.error("Error deleting producto:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Unexpected error deleting producto:", error)
    return false
  }
}

// ===== FUNCIONES PARA SUPABASE STORAGE =====

export async function uploadImageToStorage(file: File): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured, cannot upload image")
    return null
  }

  try {
    // Validar tamaño del archivo (15MB máximo)
    const maxSize = 15 * 1024 * 1024 // 15MB en bytes
    if (file.size > maxSize) {
      throw new Error("El archivo es muy grande. Máximo 15MB permitido.")
    }

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      throw new Error("Tipo de archivo no válido. Solo se permiten: JPG, PNG, GIF, WebP")
    }

    // Generar nombre único para el archivo
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Subir archivo al bucket 'productos'
    const { data, error } = await supabase.storage.from("productos").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading image:", error)
      throw new Error("Error al subir la imagen: " + error.message)
    }

    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage.from("productos").getPublicUrl(fileName)

    return publicUrlData.publicUrl
  } catch (error) {
    console.error("Unexpected error uploading image:", error)
    throw error
  }
}

export async function deleteImageFromStorage(imageUrl: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false
  }

  try {
    // Extraer nombre del archivo de la URL
    if (!imageUrl.includes("supabase")) {
      return true // No es una imagen de Supabase, no necesita eliminarse
    }

    const fileName = imageUrl.split("/").pop()
    if (!fileName) {
      return false
    }

    const { error } = await supabase.storage.from("productos").remove([fileName])

    if (error) {
      console.error("Error deleting image from storage:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Unexpected error deleting image:", error)
    return false
  }
}

// ===== FUNCIÓN PARA INICIALIZAR BUCKET =====

export async function initializeStorageBucket(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false
  }

  try {
    // Verificar si el bucket existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("Error listing buckets:", listError)
      return false
    }

    const productsBucket = buckets?.find((bucket) => bucket.name === "productos")

    if (!productsBucket) {
      // Crear bucket si no existe
      const { error: createError } = await supabase.storage.createBucket("productos", {
        public: true,
        allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
        fileSizeLimit: 15728640, // 15MB
      })

      if (createError) {
        console.error("Error creating bucket:", createError)
        return false
      }

      console.log("Bucket 'productos' created successfully")
    }

    return true
  } catch (error) {
    console.error("Error initializing storage bucket:", error)
    return false
  }
}
