-- Script para configurar Supabase Storage para productos

-- 1. Crear bucket para productos (ejecutar en SQL Editor)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'productos',
  'productos',
  true,
  15728640, -- 15MB en bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
);

-- 2. Crear políticas de seguridad para el bucket
-- Permitir subida de archivos (para admin)
CREATE POLICY "Permitir subida de imágenes de productos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'productos');

-- Permitir lectura pública de imágenes
CREATE POLICY "Permitir lectura pública de imágenes de productos" ON storage.objects
  FOR SELECT USING (bucket_id = 'productos');

-- Permitir eliminación de archivos (para admin)
CREATE POLICY "Permitir eliminación de imágenes de productos" ON storage.objects
  FOR DELETE USING (bucket_id = 'productos');

-- 3. Verificar que la tabla productos existe con la estructura correcta
-- Si no existe, crearla:
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  imagen_url TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_productos_created_at ON productos(created_at DESC);

-- 4. Habilitar Row Level Security
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas para la tabla productos
-- Permitir lectura pública de productos activos
CREATE POLICY "Permitir lectura pública de productos activos" ON productos
  FOR SELECT USING (activo = true);

-- Permitir todas las operaciones para admin (ajustar según tu sistema de autenticación)
CREATE POLICY "Permitir todas las operaciones para admin" ON productos
  FOR ALL USING (true);

-- 6. Insertar algunos productos de ejemplo (opcional)
INSERT INTO productos (nombre, descripcion, precio, categoria, imagen_url) VALUES
('Cable Eléctrico 2.5mm', 'Cable de cobre para instalaciones eléctricas residenciales', 25.50, 'Electricidad', null),
('Taladro Percutor', 'Taladro profesional con función de percusión', 189.00, 'Herramientas', null),
('Cemento Portland', 'Bolsa de cemento de 50kg para construcción', 12.75, 'Materiales de Construcción', null),
('Filtro de Agua', 'Filtro universal para sistemas de agua potable', 35.90, 'Agua y Accesorios', null),
('Tornillos Autorroscantes', 'Caja de 100 tornillos para metal y madera', 8.25, 'Repuestos en General', null)
ON CONFLICT DO NOTHING;
