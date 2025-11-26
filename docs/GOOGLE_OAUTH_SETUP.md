# Configuración de Google OAuth en Supabase

Para habilitar el inicio de sesión con Google, sigue estos pasos:

## 1. Configurar Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google+ API** o **Google Identity Services**
4. Ve a **Credenciales** → **Crear credenciales** → **ID de cliente de OAuth 2.0**
5. Configura la pantalla de consentimiento OAuth:
   - Tipo de usuario: Externo
   - Nombre de la aplicación: InterSer
   - Correo de soporte: tu correo
   - Dominios autorizados: tu dominio de producción
6. Crea las credenciales OAuth 2.0:

   - Tipo de aplicación: **Aplicación web**
   - Nombre: InterSer Web Client
   - **Orígenes autorizados de JavaScript:**
     - `http://localhost:3000` (desarrollo)
     - `https://tu-dominio.com` (producción)
   - **URIs de redirección autorizados:**
     - `https://[TU_PROYECTO_REF].supabase.co/auth/v1/callback`
     - Ejemplo: `https://abcdefghijklmn.supabase.co/auth/v1/callback`

7. Copia el **Client ID** y **Client Secret**

## 2. Configurar Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com/)
2. Navega a **Authentication** → **Providers**
3. Busca **Google** y habilítalo
4. Pega el **Client ID** y **Client Secret** de Google
5. En **Redirect URLs**, verifica que esté configurado:
   - Para desarrollo: `http://localhost:3000/auth/callback`
   - Para producción: `https://tu-dominio.com/auth/callback`

## 3. Variables de entorno (opcional)

Si quieres personalizar la URL de callback, puedes agregar en `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4. Probar la integración

1. Inicia el servidor de desarrollo: `npm run dev`
2. Ve a `/login` o `/register`
3. Haz clic en "Continuar con Google"
4. Deberías ser redirigido a la pantalla de consentimiento de Google
5. Después de autorizar, serás redirigido de vuelta a `/dashboard`

## Archivos relacionados

- `src/components/Auth/GoogleSignInButton/index.tsx` - Componente del botón
- `src/app/auth/callback/route.ts` - Maneja el callback de OAuth
- `src/components/Auth/LoginForm/index.tsx` - Formulario de login con Google
- `src/components/Auth/RegisterForm/index.tsx` - Formulario de registro con Google

## Solución de problemas

### Error: "redirect_uri_mismatch"

- Verifica que la URI de redirección en Google Cloud Console coincida exactamente con la URL de Supabase
- Formato correcto: `https://[PROYECTO_REF].supabase.co/auth/v1/callback`

### El usuario no es redirigido después de autenticarse

- Verifica que el archivo `src/app/auth/callback/route.ts` exista
- Revisa la consola del navegador en busca de errores

### Error: "access_denied"

- El usuario canceló o rechazó el consentimiento
- Verifica que el dominio esté autorizado en Google Cloud Console

## Seguridad

- **Nunca** compartas tu Client Secret públicamente
- Mantén tu `.env.local` fuera del control de versiones (ya está en `.gitignore`)
- En producción, considera habilitar la verificación de dominios en Google Cloud Console
- Revisa periódicamente los accesos en la [página de seguridad de Google](https://myaccount.google.com/permissions)
