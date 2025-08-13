# 🛠️ Configuración del Panel de Administración

## 📋 Requisitos Previos

1. **Cuenta de Supabase activa**
2. **Proyecto de Supabase creado**
3. **Variables de entorno configuradas**

## 🚀 Configuración Paso a Paso

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
\`\`\`

### 2. Configurar Base de Datos y Storage

Ejecuta el script `scripts/setup-supabase-storage.sql` en el SQL Editor de Supabase:

1. Ve a tu proyecto en Supabase
2. Navega a "SQL Editor"
3. Copia y pega el contenido del archivo `setup-supabase-storage.sql`
4. Ejecuta el script

### 3. Verificar Configuración

El script creará:
- ✅ Bucket `productos` para almacenar imágenes
- ✅ Tabla `productos` con estructura completa
- ✅ Políticas de seguridad (RLS)
- ✅ Índices para mejor rendimiento
- ✅ Productos de ejemplo

### 4. Acceder al Panel

1. Inicia la aplicación: `npm run dev`
2. Ve a `/admin` en tu navegador
3. Deberías ver el badge "Conectado" si todo está configurado correctamente

## 🎯 Funcionalidades del Panel

### ✅ Gestión de Productos
- **Crear** nuevos productos con imagen
- **Editar** productos existentes
- **Eliminar** productos (incluye imagen del storage)
- **Activar/Desactivar** productos
- **Vista en tabla** con información completa

### 🖼️ Gestión de Imágenes
- **Subida directa** desde computadora
- **Validación de tamaño** (máximo 15MB)
- **Validación de formato** (JPG, PNG, GIF, WebP)
- **Almacenamiento en Supabase Storage**
- **URLs públicas automáticas**
- **Eliminación automática** al borrar producto

### 📊 Dashboard
- **Estadísticas en tiempo real**
- **Contadores de productos activos/inactivos**
- **Total de categorías**
- **Interfaz limpia y responsive**

## 🔧 Características Técnicas

### Validaciones
- ✅ Tamaño máximo de imagen: 15MB
- ✅ Formatos permitidos: JPG, PNG, GIF, WebP
- ✅ Campos obligatorios validados
- ✅ Precios con decimales

### Seguridad
- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas de acceso configuradas
- ✅ Validación de archivos en cliente y servidor
- ✅ URLs públicas seguras

### Performance
- ✅ Índices en base de datos
- ✅ Carga optimizada de imágenes
- ✅ Estados de carga para UX
- ✅ Manejo de errores robusto

## 🚨 Solución de Problemas

### Error: "Bucket no encontrado"
\`\`\`sql
-- Verificar que el bucket existe
SELECT * FROM storage.buckets WHERE name = 'productos';

-- Si no existe, crearlo manualmente
INSERT INTO storage.buckets (id, name, public) VALUES ('productos', 'productos', true);
\`\`\`

### Error: "No se puede subir imagen"
1. Verificar políticas de storage
2. Comprobar tamaño del archivo (< 15MB)
3. Verificar formato de imagen

### Error: "Tabla no encontrada"
\`\`\`sql
-- Verificar que la tabla existe
SELECT * FROM productos LIMIT 1;

-- Si no existe, ejecutar el script completo
\`\`\`

## 📱 Uso del Panel

### Crear Producto
1. Click en "Nuevo Producto"
2. Llenar información obligatoria
3. Seleccionar imagen (opcional)
4. Click en "Crear Producto"

### Editar Producto
1. Click en botón "Editar" en la tabla
2. Modificar campos necesarios
3. Cambiar imagen si es necesario
4. Click en "Actualizar Producto"

### Gestionar Estado
- **Activar/Desactivar**: Click en el ícono de ojo
- **Eliminar**: Click en ícono de basura + confirmar

## 🎨 Personalización

El panel está diseñado para ser:
- **Responsive**: Funciona en móviles y desktop
- **Accesible**: Cumple estándares de accesibilidad
- **Consistente**: Sigue el diseño de la landing page
- **Extensible**: Fácil de agregar nuevas funcionalidades

## 📞 Soporte

Si encuentras problemas:
1. Revisa la consola del navegador (F12)
2. Verifica las variables de entorno
3. Comprueba la configuración de Supabase
4. Revisa los logs del servidor
