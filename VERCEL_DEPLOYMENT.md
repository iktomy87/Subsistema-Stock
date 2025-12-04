# 🚀 Guía de Deployment en Vercel

Esta guía te ayudará a desplegar la aplicación Next.js del frontend en Vercel.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener:

- ✅ Una cuenta en [Vercel](https://vercel.com) (puedes usar GitHub para login)
- ✅ Acceso al repositorio Git del proyecto
- ✅ Las credenciales de Keycloak (CLIENT_ID y CLIENT_SECRET)
- ✅ Acceso al servidor de Keycloak en `https://keycloak.cubells.com.ar`

## 🔧 Paso 1: Preparar el Proyecto

Tu proyecto ya está configurado correctamente con:

- [x] Archivo `.env.example` con todas las variables necesarias
- [x] Configuración de `next.config.ts` con rewrites al backend
- [x] Autenticación con Keycloak via NextAuth.js

## 🌐 Paso 2: Importar Proyecto en Vercel

### Opción A: Desde el Dashboard de Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Conecta tu cuenta de GitHub/GitLab/Bitbucket
3. Selecciona el repositorio `Subsistema-Stock`
4. Configura las siguientes opciones:

   ```
   Project Name: subsistema-stock-frontend (o el nombre que prefieras)
   Framework Preset: Next.js (detectado automáticamente)
   Root Directory: frontend
   Build Command: npm run build (por defecto)
   Output Directory: .next (por defecto)
   Install Command: npm install (por defecto)
   ```

5. **NO hagas clic en "Deploy" todavía** - primero debes configurar las variables de entorno

### Opción B: Desde la CLI de Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Navegar al directorio del frontend
cd frontend

# Iniciar el deployment
vercel

# Seguir las instrucciones interactivas
```

## 🔐 Paso 3: Configurar Variables de Entorno

En el dashboard de Vercel, antes de hacer el deploy:

1. Ve a **Settings** > **Environment Variables**
2. Agrega las siguientes variables **una por una**:

### Variables Requeridas

| Variable | Valor | Entorno | Descripción |
|----------|-------|---------|-------------|
| `NEXTAUTH_SECRET` | `(generar nuevo)` | Production, Preview, Development | Clave secreta para NextAuth.js |
| `NEXTAUTH_URL` | `https://tu-app.vercel.app` | Production | URL de producción (actualizar después del primer deploy) |
| `NEXTAUTH_URL` | `https://tu-app-preview.vercel.app` | Preview | URL de preview |
| `KEYCLOAK_CLIENT_ID` | `grupo-08` | Production, Preview, Development | Client ID de Keycloak |
| `KEYCLOAK_CLIENT_SECRET` | `248f42b5-7007-...` | Production, Preview, Development | Client Secret de Keycloak |
| `KEYCLOAK_ISSUER` | `https://keycloak.cubells.com.ar/realms/ds-2025-realm` | Production, Preview, Development | URL del issuer de Keycloak |
| `KEYCLOAK_WELL_KNOWN_URL` | `https://keycloak.cubells.com.ar/realms/ds-2025-realm/.well-known/openid-configuration` | Production, Preview, Development | Endpoint Well-Known |
| `NEXT_PUBLIC_STOCK_API_URL` | `https://api.cubells.com.ar/stock` | Production, Preview, Development | URL del backend API |

### Generar NEXTAUTH_SECRET

Ejecuta en tu terminal:

```bash
openssl rand -base64 32
```

Copia el resultado y úsalo como valor para `NEXTAUTH_SECRET`.

> [!IMPORTANT]
> Las variables que empiezan con `NEXT_PUBLIC_` son expuestas al cliente (browser). Las demás permanecen en el servidor.

## 🚀 Paso 4: Deploy

1. Haz clic en **"Deploy"** en Vercel
2. Espera a que el build se complete (2-3 minutos aproximadamente)
3. Una vez completado, Vercel te dará una URL de producción (ej: `https://subsistema-stock-frontend.vercel.app`)

## 🔄 Paso 5: Actualizar NEXTAUTH_URL

Después del primer deployment:

1. Copia la URL de producción que te asignó Vercel
2. Ve a **Settings** > **Environment Variables**
3. Edita la variable `NEXTAUTH_URL` (Production)
4. Reemplaza el valor con tu URL real: `https://tu-app-real.vercel.app`
5. Haz clic en **Save**
6. Ve a **Deployments** y haz clic en **Redeploy** para aplicar los cambios

## 🔑 Paso 6: Configurar Keycloak

Para que la autenticación funcione, debes agregar tu URL de Vercel a las URLs permitidas en Keycloak:

1. Accede al **Admin Console de Keycloak**: `https://keycloak.cubells.com.ar/admin`
2. Selecciona el realm `ds-2025-realm`
3. Ve a **Clients** > `grupo-08`
4. Agrega las siguientes URLs:

   ```
   Valid Redirect URIs:
   - https://tu-app.vercel.app/*
   - https://tu-app.vercel.app/api/auth/callback/keycloak

   Web Origins:
   - https://tu-app.vercel.app
   ```

5. Haz clic en **Save**

## ✅ Paso 7: Verificar el Deployment

1. Visita tu URL de Vercel: `https://tu-app.vercel.app`
2. Prueba el flujo de login con Keycloak
3. Verifica que puedas:
   - Iniciar sesión
   - Ver productos
   - Acceder a las páginas protegidas
   - Cerrar sesión

## 🔍 Troubleshooting

### Error: "Configuration error: There was a problem with the server configuration"

**Causa**: Falta `NEXTAUTH_SECRET` o `NEXTAUTH_URL`

**Solución**: Verifica que ambas variables estén configuradas correctamente en Vercel.

---

### Error: "redirect_uri_mismatch" al intentar login

**Causa**: La URL de redirect no está registrada en Keycloak

**Solución**: Agrega `https://tu-app.vercel.app/api/auth/callback/keycloak` a **Valid Redirect URIs** en Keycloak.

---

### Error de CORS al llamar al backend

**Causa**: El backend no permite requests desde tu dominio de Vercel

**Solución**: 
1. Verifica que los rewrites en `next.config.ts` estén configurados correctamente
2. O bien, configura CORS en el backend para permitir tu dominio de Vercel

---

### Las variables de entorno no se actualizan

**Causa**: Vercel cachea las variables del último build

**Solución**: 
1. Ve a **Deployments**
2. Selecciona el deployment más reciente
3. Haz clic en el menú ⋮ > **Redeploy**

---

### Build falla con error de TypeScript

**Causa**: Errores de tipo en el código

**Solución**: 
1. Revisa los logs de build en Vercel
2. Ejecuta `npm run build` localmente primero para detectar errores
3. Corrige los errores de TypeScript antes de hacer push

## 🔄 Deployments Automáticos

Vercel automáticamente hace deploy cuando:

- **Push a `main` branch**: Deploy a producción
- **Pull Request**: Deploy de preview con URL única
- **Push a otras branches**: Deploy de preview

Cada deployment tiene su propia URL única para testing.

## 🎨 Configuración Adicional (Opcional)

### Dominio Personalizado

1. Ve a **Settings** > **Domains**
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Vercel
4. Actualiza `NEXTAUTH_URL` con tu nuevo dominio
5. Actualiza las URLs en Keycloak con tu nuevo dominio

### Analytics y Monitoring

Vercel ofrece analytics y monitoring gratuitos:

- **Analytics**: Ve a **Analytics** para ver métricas de tráfico
- **Speed Insights**: Monitorea el rendimiento de tu app
- **Logs**: Ve a **Deployments** > [deployment] > **Functions** para ver logs

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Variables de Entorno en Vercel](https://vercel.com/docs/environment-variables)
- [NextAuth.js](https://next-auth.js.org/)
- [Keycloak Documentation](https://www.keycloak.org/documentation)

---

## 🎯 Checklist Final

Antes de considerar el deployment completo, verifica:

- [ ] El build se completó exitosamente en Vercel
- [ ] Todas las variables de entorno están configuradas
- [ ] `NEXTAUTH_URL` apunta a la URL correcta de producción
- [ ] Las redirect URIs están configuradas en Keycloak
- [ ] El login con Keycloak funciona correctamente
- [ ] Las páginas protegidas requieren autenticación
- [ ] El logout funciona correctamente
- [ ] El backend API responde correctamente (via rewrites)
- [ ] No hay errores en la consola del browser
- [ ] Los logs en Vercel no muestran errores críticos

¡Felicidades! Tu aplicación está desplegada en Vercel 🎉
