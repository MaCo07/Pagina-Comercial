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
  {
    id: 6,
    nombre: "Interruptor Doble",
    descripcion: "Interruptor eléctrico doble para pared",
    precio: 15.4,
    categoria: "Electricidad",
    imagen_url: "/placeholder.svg?height=250&width=250",
    activo: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 7,
    nombre: "Martillo de Carpintero",
    descripcion: "Martillo profesional con mango de madera",
    precio: 28.9,
    categoria: "Herramientas",
    imagen_url: "/placeholder.svg?height=250&width=250",
    activo: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 8,
    nombre: "Tubería PVC 4 pulgadas",
    descripcion: "Tubo de PVC para desagües y drenajes",
    precio: 22.6,
    categoria: "Agua y Accesorios",
    imagen_url: "/placeholder.svg?height=250&width=250",
    activo: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

export async function getProductos(): Promise<Producto[]> {
  if (!isSupabaseConfigured) {
    return mockProductos
  }

  try {
    const { data, error } = await supabase!.from("productos").select("*").eq("activo", true)

    if (error) {
      console.error("Error fetching productos:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching productos:", error)
    return []
  }
}

export async function getCategorias(): Promise<string[]> {
  if (!isSupabaseConfigured) {
    const categorias = Array.from(new Set(mockProductos.map((p) => p.categoria)))
    return categorias
  }

  try {
    const { data, error } = await supabase!.from("productos").select("categoria").neq("categoria", null)

    if (error) {
      console.error("Error fetching categorias:", error)
      return []
    }

    const categorias = Array.from(new Set(data.map((item) => item.categoria)))
    return categorias
  } catch (error) {
    console.error("Unexpected error fetching categorias:", error)
    return []
  }
}

export async function getAllProductosAdmin(): Promise<Producto[]> {
  if (!isSupabaseConfigured) {
    return mockProductos
  }

  try {
    const { data, error } = await supabase!.from("productos").select("*")

    if (error) {
      console.error("Error fetching productos:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching productos:", error)
    return []
  }
}

type ProductInput = Omit<Producto, "id" | "created_at" | "updated_at"> &
  Partial<Pick<Producto, "created_at" | "updated_at">>

export async function createProducto(producto: ProductInput): Promise<Producto | null> {
  if (!isSupabaseConfigured) {
    return null
  }

  try {
    const { data, error } = await supabase!.from("productos").insert([producto]).select().single()

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
  if (!isSupabaseConfigured) {
    return null
  }

  try {
    const { data, error } = await supabase!.from("productos").update(updates).eq("id", id).select().single()

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
  if (!isSupabaseConfigured) {
    return true
  }

  try {
    const { error } = await supabase!.from("productos").delete().eq("id", id)

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
