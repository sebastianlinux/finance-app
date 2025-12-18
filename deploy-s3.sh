#!/bin/bash

# Script para deploy a AWS S3
# Uso: ./deploy-s3.sh [bucket-name] [region]

set -e  # Salir si hay algún error

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variables
BUCKET_NAME="${1:-financeapp-static}"
REGION="${2:-us-east-1}"

echo -e "${BLUE}🚀 Iniciando deployment a S3${NC}"
echo -e "${YELLOW}Bucket: ${BUCKET_NAME}${NC}"
echo -e "${YELLOW}Región: ${REGION}${NC}"
echo ""

# Verificar que AWS CLI está instalado
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI no está instalado${NC}"
    echo "Instala AWS CLI: https://aws.amazon.com/cli/"
    exit 1
fi

# Verificar que el bucket existe
if ! aws s3 ls "s3://${BUCKET_NAME}" 2>&1 | grep -q 'NoSuchBucket\|AccessDenied'; then
    echo -e "${GREEN}✅ Bucket encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  Bucket no encontrado o sin acceso${NC}"
    echo -e "${YELLOW}Creando bucket...${NC}"
    aws s3 mb "s3://${BUCKET_NAME}" --region "${REGION}" || {
        echo -e "${RED}❌ Error al crear bucket. Verifica tus credenciales AWS.${NC}"
        exit 1
    }
    echo -e "${GREEN}✅ Bucket creado${NC}"
fi

# Paso 1: Build
echo -e "${BLUE}📦 Generando build estático...${NC}"
npm run build:static

if [ ! -d "out" ]; then
    echo -e "${RED}❌ Error: La carpeta 'out' no fue generada${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build generado exitosamente${NC}"
echo ""

# Paso 2: Subir archivos estáticos (con cache)
echo -e "${BLUE}📤 Subiendo archivos estáticos a S3...${NC}"
echo -e "${YELLOW}Subiendo assets (JS, CSS, imágenes) con cache largo...${NC}"

aws s3 sync out/ "s3://${BUCKET_NAME}" \
  --region "${REGION}" \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "service-worker.js" \
  --exclude "manifest.json" \
  --exclude "robots.txt" \
  --exclude "sitemap.xml"

echo -e "${GREEN}✅ Assets subidos${NC}"

# Paso 3: Subir HTML (sin cache)
echo -e "${YELLOW}Subiendo archivos HTML (sin cache)...${NC}"

aws s3 sync out/ "s3://${BUCKET_NAME}" \
  --region "${REGION}" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --exclude "*" \
  --include "*.html"

echo -e "${GREEN}✅ HTML subido${NC}"

# Paso 4: Subir otros archivos importantes
echo -e "${YELLOW}Subiendo otros archivos...${NC}"

aws s3 sync out/ "s3://${BUCKET_NAME}" \
  --region "${REGION}" \
  --cache-control "public, max-age=3600" \
  --exclude "*" \
  --include "service-worker.js" \
  --include "manifest.json" \
  --include "robots.txt" \
  --include "sitemap.xml"

echo -e "${GREEN}✅ Otros archivos subidos${NC}"
echo ""

# Paso 5: Configurar permisos públicos (opcional)
echo -e "${YELLOW}⚠️  Configurando permisos públicos...${NC}"
echo -e "${YELLOW}Nota: Esto hace el bucket público. Asegúrate de que es lo que quieres.${NC}"

read -p "¿Hacer el bucket público? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Configurar bucket policy para acceso público
    cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    }
  ]
}
EOF

    aws s3api put-bucket-policy \
      --bucket "${BUCKET_NAME}" \
      --policy file:///tmp/bucket-policy.json

    # Deshabilitar bloqueo de acceso público
    aws s3api put-public-access-block \
      --bucket "${BUCKET_NAME}" \
      --public-access-block-configuration \
      "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

    echo -e "${GREEN}✅ Permisos públicos configurados${NC}"
    rm /tmp/bucket-policy.json
else
    echo -e "${YELLOW}⏭️  Saltando configuración de permisos públicos${NC}"
fi

echo ""

# Paso 6: Habilitar static website hosting
echo -e "${BLUE}🌐 Configurando static website hosting...${NC}"

aws s3 website "s3://${BUCKET_NAME}" \
  --index-document index.html \
  --error-document index.html

echo -e "${GREEN}✅ Static website hosting habilitado${NC}"
echo ""

# Resumen
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Deployment completado exitosamente!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}🌐 URLs de acceso:${NC}"
echo -e "   S3 Website: ${YELLOW}http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com${NC}"
echo -e "   S3 Bucket:  ${YELLOW}s3://${BUCKET_NAME}${NC}"
echo ""
echo -e "${YELLOW}💡 Próximos pasos:${NC}"
echo -e "   1. Configura CloudFront para mejor rendimiento y HTTPS"
echo -e "   2. Configura un dominio personalizado"
echo -e "   3. Configura custom error responses en CloudFront (403/404 → index.html)"
echo ""
echo -e "${BLUE}📚 Ver DEPLOY_S3.md para más detalles${NC}"

