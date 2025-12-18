# 🚀 Guía de Deployment a AWS S3

Esta guía te ayudará a generar un build estático de tu aplicación Next.js y desplegarlo en AWS S3.

## 📋 Prerequisitos

1. **AWS CLI instalado y configurado**
   ```bash
   # Verificar instalación
   aws --version
   
   # Configurar credenciales (si no lo has hecho)
   aws configure
   ```

2. **Bucket de S3 creado**
   - Crea un bucket en AWS S3
   - Configura permisos públicos para lectura (opcional, según tu caso)

3. **Node.js y npm instalados**

---

## 🔧 Paso 1: Configurar Next.js para Export Estático

La configuración ya está lista en `next.config.ts`:
- `output: 'export'` - Genera build estático
- `trailingSlash: true` - Mejor compatibilidad con S3
- `images: { unoptimized: true }` - Imágenes sin optimización (no requiere servidor)

---

## 📦 Paso 2: Generar el Build Estático

Ejecuta el siguiente comando para generar el build:

```bash
npm run build:static
```

O simplemente:

```bash
npm run build
```

**Nota**: El build generará una carpeta `out/` con todos los archivos estáticos listos para subir a S3.

Esto generará una carpeta `out/` en la raíz del proyecto con todos los archivos estáticos.

**Contenido de la carpeta `out/`:**
- `index.html` - Página principal
- `_next/` - Assets de Next.js (JS, CSS, imágenes)
- Todas las rutas como archivos HTML estáticos
- Archivos públicos de la carpeta `public/`

---

## 🔍 Paso 3: Verificar el Build

Antes de subir, puedes verificar el build localmente:

```bash
# Instalar un servidor HTTP simple (si no lo tienes)
npm install -g serve

# Servir la carpeta out
serve out
```

O usar Python:

```bash
cd out
python3 -m http.server 8000
```

Luego visita `http://localhost:8000` para verificar que todo funciona.

---

## ☁️ Paso 4: Subir a S3

### Opción A: Usando AWS CLI (Recomendado)

```bash
# Sincronizar carpeta out/ con el bucket S3
aws s3 sync out/ s3://tu-bucket-name --delete

# Con configuración de cache y headers
aws s3 sync out/ s3://tu-bucket-name \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "service-worker.js"

# Para archivos HTML (sin cache)
aws s3 sync out/ s3://tu-bucket-name \
  --delete \
  --cache-control "no-cache, no-store, must-revalidate" \
  --exclude "*" \
  --include "*.html"

# Para service worker (sin cache)
aws s3 sync out/ s3://tu-bucket-name \
  --delete \
  --cache-control "no-cache, no-store, must-revalidate" \
  --exclude "*" \
  --include "service-worker.js"
```

### Opción B: Script Automatizado (Ya incluido)

Ya existe un script `deploy-s3.sh` en la raíz del proyecto. Úsalo así:

```bash
# Con bucket y región por defecto
./deploy-s3.sh

# Especificando bucket y región
./deploy-s3.sh mi-bucket-name us-east-1
```

El script automáticamente:
- Genera el build estático
- Sube archivos con cache apropiado
- Configura static website hosting
- Opcionalmente configura permisos públicos

**O crea tu propio script personalizado:**

```bash
#!/bin/bash

# Variables
BUCKET_NAME="tu-bucket-name"
REGION="us-east-1"  # Cambia por tu región

echo "🔨 Building static export..."
npm run build:static

echo "📦 Uploading to S3..."
aws s3 sync out/ s3://$BUCKET_NAME \
  --region $REGION \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "service-worker.js"

# HTML files with no cache
aws s3 sync out/ s3://$BUCKET_NAME \
  --region $REGION \
  --cache-control "no-cache, no-store, must-revalidate" \
  --exclude "*" \
  --include "*.html"

echo "✅ Deployment complete!"
echo "🌐 Visit: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
```

Hazlo ejecutable y úsalo:

```bash
chmod +x deploy-s3.sh
./deploy-s3.sh
```

### Opción C: Usando la Consola de AWS

1. Ve a la consola de AWS S3
2. Selecciona tu bucket
3. Click en "Upload"
4. Arrastra todos los archivos de la carpeta `out/`
5. Click en "Upload"

---

## ⚙️ Paso 5: Configurar S3 para Hosting Estático

### 5.1 Habilitar Hosting Estático

1. Ve a tu bucket en AWS S3
2. Ve a la pestaña **"Properties"**
3. Scroll hasta **"Static website hosting"**
4. Click en **"Edit"**
5. Selecciona **"Enable"**
6. **Index document**: `index.html`
7. **Error document**: `index.html` (para SPA routing)
8. Guarda los cambios

### 5.2 Configurar Permisos del Bucket

1. Ve a la pestaña **"Permissions"**
2. En **"Block public access"**, edita y desmarca todas las opciones (si quieres acceso público)
3. En **"Bucket policy"**, agrega la política del archivo `s3-bucket-policy.json` (reemplaza `TU-BUCKET-NAME` con el nombre de tu bucket):

**Opción A: Usar el archivo incluido**
```bash
# Edita s3-bucket-policy.json y reemplaza TU-BUCKET-NAME
# Luego aplica la política:
aws s3api put-bucket-policy --bucket tu-bucket-name --policy file://s3-bucket-policy.json
```

**Opción B: Copiar y pegar manualmente en la consola de AWS**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::tu-bucket-name/*"
    }
  ]
}
```

**⚠️ IMPORTANTE**: Reemplaza `tu-bucket-name` con el nombre real de tu bucket en el ARN.

**⚠️ Nota**: Esto hace el bucket público. Para producción, considera usar CloudFront con OAI.

### 5.3 Configurar CORS (si es necesario)

En **"Permissions" > "Cross-origin resource sharing (CORS)"**, agrega la configuración del archivo `s3-cors-policy.json`:

**Opción A: Usar el archivo incluido**
```bash
aws s3api put-bucket-cors --bucket tu-bucket-name --cors-configuration file://s3-cors-policy.json
```

**Opción B: Copiar y pegar manualmente en la consola de AWS**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

---

## 🌐 Paso 6: Configurar CloudFront (Opcional pero Recomendado)

CloudFront mejora el rendimiento y permite HTTPS:

### 6.1 Crear Distribución CloudFront

1. Ve a AWS CloudFront
2. Click en **"Create distribution"**
3. **Origin domain**: Selecciona tu bucket S3
4. **Origin path**: Deja vacío
5. **Viewer protocol policy**: Redirect HTTP to HTTPS
6. **Default root object**: `index.html`
7. **Error pages**: 
   - HTTP Error: 403 → Response: 200 → Path: `/index.html`
   - HTTP Error: 404 → Response: 200 → Path: `/index.html`
8. Click en **"Create distribution"**

### 6.2 Configurar Custom Error Responses

En tu distribución CloudFront:
1. Ve a **"Error pages"**
2. Agrega:
   - **HTTP Error Code**: 403
   - **Response Page Path**: `/index.html`
   - **HTTP Response Code**: 200
3. Repite para 404

Esto permite que el routing de Next.js funcione correctamente.

---

## 🔒 Paso 7: Configurar Dominio Personalizado (Opcional)

### Con CloudFront:

1. En CloudFront, ve a **"General"**
2. Click en **"Edit"** en **"Settings"**
3. En **"Alternate domain names (CNAMEs)"**, agrega tu dominio
4. Configura SSL/TLS certificate
5. Actualiza tus DNS records para apuntar a CloudFront

### Sin CloudFront (Solo S3):

S3 no soporta dominios personalizados directamente. Necesitas CloudFront o Route 53.

---

## 📝 Scripts de Package.json

Ya están configurados estos scripts:

```json
{
  "build:static": "next build",  // Genera build estático
  "export": "next build"         // Alias para build estático
}
```

---

## 🚨 Consideraciones Importantes

### 1. Rutas Dinámicas

Las rutas dinámicas como `/blog/[id]` funcionarán en client-side routing (como una SPA). 
- **Nota importante**: Como el componente es cliente (`'use client'`), no se pueden pre-generar rutas estáticas con `generateStaticParams`
- Las rutas funcionarán correctamente en navegación client-side
- Para SEO, considera usar un servicio de renderizado en el edge o pre-generar las rutas conocidas manualmente
- Las rutas dinámicas se renderizarán en el cliente cuando el usuario navegue a ellas

### 2. API Routes

Next.js API routes **NO funcionan** con export estático. Si necesitas backend:
- Usa servicios externos (AWS Lambda, API Gateway)
- O despliega el backend por separado

### 3. Variables de Entorno

Las variables `NEXT_PUBLIC_*` se incluyen en el build. Variables sin `NEXT_PUBLIC_` no están disponibles.

### 4. Estado y Persistencia

- `localStorage` funciona normalmente
- Zustand persist funciona
- No hay servidor, todo es client-side

### 5. Performance

- CloudFront mejora significativamente la velocidad
- Considera comprimir archivos (gzip/brotli)
- Optimiza imágenes antes del build

---

## 🔄 Workflow de Deployment

### Desarrollo Local:
```bash
npm run dev
```

### Build para Producción:
```bash
npm run build:static
```

### Verificar Build Localmente:
```bash
serve out
# o
cd out && python3 -m http.server 8000
```

### Deploy a S3:
```bash
aws s3 sync out/ s3://tu-bucket-name --delete
```

### Con CloudFront:
Después de subir a S3, invalida la cache de CloudFront:
```bash
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
```

---

## 📊 Monitoreo y Logs

### Habilitar Logging en S3:

1. Ve a **"Properties" > "Server access logging"**
2. Habilita logging
3. Selecciona un bucket para logs

### CloudFront Logs:

1. Ve a **"Behaviors"**
2. Edita el behavior
3. Habilita **"Logging"**
4. Selecciona bucket para logs

---

## 🐛 Troubleshooting

### Problema: Páginas 404 en rutas directas

**Solución**: Configura error document en S3 y custom error responses en CloudFront apuntando a `index.html`

### Problema: Assets no cargan

**Solución**: Verifica que la ruta base esté correcta. Next.js usa rutas relativas por defecto.

### Problema: Build falla

**Solución**: 
- Verifica que no uses features de servidor (API routes, getServerSideProps)
- Asegúrate de que todas las rutas dinámicas tengan fallback

### Problema: Imágenes no se muestran

**Solución**: Verifica que `images: { unoptimized: true }` esté en `next.config.ts`

---

## 📚 Recursos Adicionales

- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)

---

## ✅ Checklist de Deployment

- [ ] Build generado exitosamente (`out/` folder existe)
- [ ] Build verificado localmente
- [ ] Bucket S3 creado
- [ ] Archivos subidos a S3
- [ ] Static website hosting habilitado
- [ ] Permisos del bucket configurados
- [ ] CloudFront configurado (opcional)
- [ ] Custom error responses configurados
- [ ] Dominio personalizado configurado (opcional)
- [ ] SSL/TLS certificate configurado (si usas CloudFront)
- [ ] DNS actualizado (si usas dominio personalizado)
- [ ] Aplicación accesible públicamente

---

**¡Listo! Tu aplicación debería estar funcionando en S3.** 🎉

