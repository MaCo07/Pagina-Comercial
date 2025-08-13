-- Agregar columna destacado a la tabla productos si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='productos' AND column_name='destacado') THEN
        ALTER TABLE productos ADD COLUMN destacado BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Crear índice para mejor rendimiento en consultas de productos destacados
CREATE INDEX IF NOT EXISTS idx_productos_destacado ON productos(destacado);

-- Actualizar algunos productos existentes como destacados (opcional)
UPDATE productos SET destacado = true WHERE id IN (1, 2, 3, 4) AND destacado = false;
