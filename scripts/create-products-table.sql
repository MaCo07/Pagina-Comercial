-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  imagen_url TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, categoria, imagen_url) VALUES
('Smartphone Pro Max', 'Último modelo con cámara avanzada', 899.00, 'Electrónicos', '/placeholder.svg?height=250&width=250'),
('Silla Ergonómica', 'Comodidad para largas jornadas', 299.00, 'Hogar y Jardín', '/placeholder.svg?height=250&width=250'),
('Chaqueta Deportiva', 'Material transpirable y resistente', 79.00, 'Ropa y Accesorios', '/placeholder.svg?height=250&width=250'),
('Bicicleta Montaña', 'Para aventuras extremas', 599.00, 'Deportes', '/placeholder.svg?height=250&width=250'),
('Laptop Gaming', 'Alto rendimiento para juegos', 1299.00, 'Electrónicos', '/placeholder.svg?height=250&width=250'),
('Set de Jardinería', 'Herramientas básicas para jardín', 45.00, 'Hogar y Jardín', '/placeholder.svg?height=250&width=250'),
('Zapatillas Running', 'Máximo confort para correr', 129.00, 'Ropa y Accesorios', '/placeholder.svg?height=250&width=250'),
('Pesas Ajustables', 'Entrenamiento en casa', 199.00, 'Deportes', '/placeholder.svg?height=250&width=250'),
('Cafetera Automática', 'Café perfecto cada mañana', 249.00, 'Hogar y Jardín', '/placeholder.svg?height=250&width=250'),
('Tablet Pro', 'Productividad y entretenimiento', 699.00, 'Electrónicos', '/placeholder.svg?height=250&width=250'),
('Mesa de Centro', 'Diseño moderno y funcional', 189.00, 'Hogar y Jardín', '/placeholder.svg?height=250&width=250'),
('Reloj Inteligente', 'Monitoreo de salud avanzado', 299.00, 'Electrónicos', '/placeholder.svg?height=250&width=250'),
('Jeans Premium', 'Calidad y estilo duradero', 89.00, 'Ropa y Accesorios', '/placeholder.svg?height=250&width=250'),
('Raqueta de Tenis', 'Para jugadores intermedios', 159.00, 'Deportes', '/placeholder.svg?height=250&width=250'),
('Aspiradora Robot', 'Limpieza automática inteligente', 399.00, 'Hogar y Jardín', '/placeholder.svg?height=250&width=250'),
('Cable Eléctrico 2.5mm', 'Cable de cobre para instalaciones eléctricas residenciales', 25.50, 'Electricidad', '/placeholder.svg?height=250&width=250'),
('Taladro Percutor', 'Taladro profesional con función de percusión', 189.00, 'Herramientas', '/placeholder.svg?height=250&width=250'),
('Cemento Portland', 'Bolsa de cemento de 50kg para construcción', 12.75, 'Materiales de Construcción', '/placeholder.svg?height=250&width=250'),
('Filtro de Agua', 'Filtro universal para sistemas de agua potable', 35.90, 'Agua y Accesorios', '/placeholder.svg?height=250&width=250'),
('Tornillos Autorroscantes', 'Caja de 100 tornillos para metal y madera', 8.25, 'Repuestos en General', '/placeholder.svg?height=250&width=250'),
('Interruptor Doble', 'Interruptor eléctrico doble para pared', 15.40, 'Electricidad', '/placeholder.svg?height=250&width=250'),
('Martillo de Carpintero', 'Martillo profesional con mango de madera', 28.90, 'Herramientas', '/placeholder.svg?height=250&width=250'),
('Tubería PVC 4 pulgadas', 'Tubo de PVC para desagües y drenajes', 22.60, 'Agua y Accesorios', '/placeholder.svg?height=250&width=250'),
('Destornillador Set', 'Juego de destornilladores Phillips y planos', 18.75, 'Herramientas', '/placeholder.svg?height=250&width=250'),
('Ladrillo Común', 'Ladrillo rojo para construcción tradicional', 0.85, 'Materiales de Construcción', '/placeholder.svg?height=250&width=250'),
('Enchufe Triple', 'Enchufe eléctrico con tres tomas', 12.30, 'Electricidad', '/placeholder.svg?height=250&width=250'),
('Llave Inglesa', 'Llave ajustable de 12 pulgadas', 24.50, 'Herramientas', '/placeholder.svg?height=250&width=250'),
('Arena Fina', 'Metro cúbico de arena para construcción', 45.00, 'Materiales de Construcción', '/placeholder.svg?height=250&width=250'),
('Codo PVC 90°', 'Codo de PVC de 90 grados para tuberías', 3.25, 'Agua y Accesorios', '/placeholder.svg?height=250&width=250'),
('Pernos y Tuercas', 'Set de pernos galvanizados con tuercas', 15.60, 'Repuestos en General', '/placeholder.svg?height=250&width=250');

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
