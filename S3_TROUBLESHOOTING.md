# 🔧 Solución de Problemas con Política de S3

## ❌ Error al Aplicar Bucket Policy

Si recibes un error al aplicar la política, sigue estos pasos:

---

## 🔍 Paso 1: Verificar "Block Public Access"

**Este es el error más común.** Antes de aplicar la política, debes deshabilitar "Block public access":

### En la Consola de AWS:

1. Ve a **S3** → Selecciona tu bucket `sebastianrincon`
2. Ve a la pestaña **"Permissions"**
3. Busca **"Block public access (bucket settings)"**
4. Click en **"Edit"**
5. **Desmarca TODAS las opciones:**
   - ☐ Block all public access
   - ☐ Block public access to buckets and objects granted through new access control lists (ACLs)
   - ☐ Block public access to buckets and objects granted through any access control lists (ACLs)
   - ☐ Block public access to buckets and objects granted through new public bucket or access point policies
   - ☐ Block public and cross-account access to buckets and objects through any public bucket or access point policies
6. Click en **"Save changes"**
7. Confirma escribiendo `confirm` en el campo de confirmación

### Usando AWS CLI:

```bash
aws s3api put-public-access-block \
  --bucket sebastianrincon \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

---

## 🔍 Paso 2: Verificar el Formato JSON

Asegúrate de que el JSON esté bien formateado. Usa este comando para validarlo:

```bash
# Validar JSON
cat s3-bucket-policy-fixed.json | python3 -m json.tool
```

Si hay errores de formato, corrígelos.

---

## 🔍 Paso 3: Aplicar la Política Correctamente

### Opción A: Usando AWS CLI

```bash
aws s3api put-bucket-policy \
  --bucket sebastianrincon \
  --policy file://s3-bucket-policy-fixed.json
```

### Opción B: Desde la Consola de AWS

1. Ve a **S3** → `sebastianrincon` → **Permissions**
2. Scroll hasta **"Bucket policy"**
3. Click en **"Edit"**
4. Pega esta política (ya tiene tu bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::sebastianrincon/*"
    }
  ]
}
```

5. Click en **"Save changes"**

---

## 🔍 Paso 4: Verificar Errores Específicos

### Error: "Invalid principal"

**Solución**: El `Principal: "*"` es correcto. Si el error persiste, verifica que no haya espacios extra o caracteres especiales.

### Error: "Access Denied"

**Solución**: Tu usuario de AWS necesita permisos `s3:PutBucketPolicy`. Agrega esta política a tu usuario IAM:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutBucketPolicy",
        "s3:GetBucketPolicy",
        "s3:DeleteBucketPolicy"
      ],
      "Resource": "arn:aws:s3:::sebastianrincon"
    }
  ]
}
```

### Error: "MalformedPolicy"

**Solución**: 
- Verifica que no haya comas extra al final
- Verifica que todos los corchetes y llaves estén cerrados
- Usa un validador JSON online: https://jsonlint.com/

### Error: "The bucket policy does not allow public access"

**Solución**: Asegúrate de haber deshabilitado "Block public access" (Paso 1).

---

## ✅ Verificar que Funciona

Después de aplicar la política, verifica que funciona:

```bash
# Ver la política actual
aws s3api get-bucket-policy --bucket sebastianrincon

# Probar acceso público (reemplaza con un archivo real)
curl -I http://sebastianrincon.s3-website-us-east-1.amazonaws.com/index.html
```

---

## 🔒 Alternativa: Política Más Restrictiva (Recomendada para Producción)

Si quieres una política más segura que solo permita acceso desde CloudFront:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::sebastianrincon/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::TU-ACCOUNT-ID:distribution/TU-DISTRIBUTION-ID"
        }
      }
    }
  ]
}
```

---

## 📝 Checklist de Verificación

- [ ] "Block public access" está deshabilitado
- [ ] El JSON está bien formateado
- [ ] El nombre del bucket en el ARN es correcto (`sebastianrincon`)
- [ ] Tienes permisos `s3:PutBucketPolicy` en tu usuario IAM
- [ ] La política se aplicó sin errores
- [ ] Puedes acceder a los archivos públicamente

---

## 🆘 Si Nada Funciona

1. **Verifica los logs de CloudTrail** para ver el error exacto
2. **Intenta desde la consola web** en lugar de CLI
3. **Verifica que el bucket existe** y está en la región correcta
4. **Contacta soporte de AWS** si el problema persiste

---

## 📚 Recursos

- [AWS S3 Bucket Policy Examples](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html)
- [Block Public Access Settings](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html)
