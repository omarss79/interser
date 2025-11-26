# Configuración Rápida - Google OAuth

## Tu Información de OAuth:

- **Client ID:** `1020659238901-pab8cc1daphabpf0htntahl8ikrrieud.apps.googleusercontent.com`
- **Client Secret:** `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`
- **Proyecto Supabase:** `qiwifsgqmohiuwarshgi`

## Paso 1: Google Cloud Console

Ve a: https://console.cloud.google.com/apis/credentials

1. Busca tu OAuth 2.0 Client ID: `1020659238901-pab8cc1daphabpf0htntahl8ikrrieud`
2. Haz clic para editarlo
3. En **URIs de redirección autorizadas**, añade EXACTAMENTE estas URLs:

```
https://qiwifsgqmohiuwarshgi.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
```

4. En **Orígenes de JavaScript autorizados**, añade:

```
http://localhost:3000
https://qiwifsgqmohiuwarshgi.supabase.co
```

5. **Guarda** los cambios (botón azul abajo)

## Paso 2: Supabase Dashboard

Ve a: https://app.supabase.com/project/qiwifsgqmohiuwarshgi/auth/providers

1. Busca **Google** en la lista
2. Activa el toggle (debe quedar en verde/ON)
3. Ingresa:
   - **Client ID:** `1020659238901-pab8cc1daphabpf0htntahl8ikrrieud.apps.googleusercontent.com`
   - **Client Secret:** `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`
4. Haz clic en **Save**

## Paso 3: Verificar URL Configuration en Supabase

Ve a: https://app.supabase.com/project/qiwifsgqmohiuwarshgi/auth/url-configuration

1. **Site URL:** debe ser `http://localhost:3000`
2. **Redirect URLs:** debe incluir `http://localhost:3000/**`

## Paso 4: Probar

```bash
npm run dev
```

Abre: http://localhost:3000/login

Haz clic en **"Continuar con Google"**

## Troubleshooting

### Error: "redirect_uri_mismatch"

- Verifica que en Google Cloud Console, la URI sea EXACTAMENTE:
  `https://qiwifsgqmohiuwarshgi.supabase.co/auth/v1/callback`
- No debe tener espacios, barras extras, ni diferencias en mayúsculas

### Error: "provider is not enabled"

- El toggle de Google en Supabase debe estar **ON** (verde)
- Guarda las credenciales después de activarlo

### El login funciona pero no redirige

- Verifica que `/auth/callback/route.ts` exista
- Revisa la consola del navegador en busca de errores

## Mejoras Implementadas

✅ Callback route mejorado con manejo de errores
✅ Muestra mensajes de error en el formulario de login
✅ Mejor logging para debugging
✅ Validación de parámetros de error de OAuth
