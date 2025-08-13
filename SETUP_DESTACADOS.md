# 🌟 Configuración de Productos Destacados

## Pasos para Configurar

### 1. Ejecutar Script SQL
Ejecuta el siguiente script en Supabase SQL Editor:

\`\`\`sql
-- Agregar columna destacado si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='productos' AND column_name='destacado') THEN
        ALTER TABLE productos ADD COLUMN destacado BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Crear índice para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_productos_destacado ON productos(destacado);

-- Marcar algunos productos como destacados (opcional)
UPDATE productos SET destacado = true WHERE id IN (1, 2, 3, 4) AND destacado = false;
\`\`\`

### 2. Características Implementadas

#### ✅ Productos Destacados
- **Máximo 4 productos** destacados simultáneamente
- **Validación automática** del límite
- **Mensaje de advertencia** cuando se alcanza el límite
- **Badge visual** en la landing page

#### ✅ Categorías Fijas
- **Solo 5 categorías** predefinidas:
  1. Electricidad
  2. Herramientas
  3. Materiales de Construcción
  4. Repuestos en General
  5. Agua y Accesorios

#### ✅ Formato de Precios
- **Separador de miles** con punto (20.000)
- **Sin decimales** para simplificar
- **Formato consistente** en toda la aplicación

#### ✅ Panel de Admin Mejorado
- **Switch para destacado** con validación
- **Contador visual** de productos destacados (X/4)
- **Estadísticas actualizadas** en tiempo real
- **Columna destacado** en la tabla

### 3. Uso del Panel

#### Marcar Producto como Destacado:
1. Ir al panel admin (`/admin`)
2. Hacer clic en el botón ⭐ junto al producto
3. Si hay espacio disponible, se marcará como destacado
4. Si está lleno, aparecerá mensaje de advertencia

#### Desmarcar Producto Destacado:
1. Hacer clic en el botón ⭐ (lleno) del producto destacado
2. Se quitará de destacados automáticamente
3. Liberará espacio para otro producto

### 4. Visualización en Landing Page

Los productos destacados aparecen en una sección especial con:
- **Badge "⭐ Destacado"** en la esquina
- **Máximo 4 productos** mostrados
- **Diseño especial** diferenciado
- **Enlace a catálogo completo**

### 5. Validaciones Implementadas

- ✅ **Límite de 4 productos** destacados
- ✅ **Solo categorías válidas** permitidas
- ✅ **Formato de precio** automático
- ✅ **Validación de imágenes** (15MB máx)
- ✅ **Estados activo/inactivo** independientes

¡Tu sistema de productos destacados está listo para usar! 🚀
