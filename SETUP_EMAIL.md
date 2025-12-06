# Configuración del Sistema de Correos - InterSer

Este proyecto usa **Resend** para enviar correos de confirmación de citas.

## 1. Crear cuenta en Resend

1. Ve a [https://resend.com](https://resend.com)
2. Crea una cuenta gratuita (incluye 3,000 correos/mes gratis)
3. Verifica tu email

## 2. Obtener API Key

1. En el dashboard de Resend, ve a **API Keys**
2. Crea una nueva API Key
3. Copia la clave (empieza con `re_...`)

## 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
RESEND_API_KEY=re_tu_api_key_aqui
ADMIN_EMAIL=admin@interser.org.mx
```

## 4. Instalar dependencia

```bash
npm install resend
```

## 5. Configurar dominio (Opcional pero recomendado)

### Para usar tu propio dominio (interser.org.mx):

1. En Resend dashboard, ve a **Domains**
2. Añade `interser.org.mx`
3. Agrega los registros DNS que te proporciona Resend:
   - SPF record
   - DKIM record
   - DMARC record (opcional)
4. Espera a que se verifique (puede tomar hasta 48 horas)

### Mientras tanto (desarrollo):

Puedes usar el dominio de prueba de Resend:
- Cambia `from: "InterSer <noreply@interser.org.mx>"` 
- A `from: "InterSer <onboarding@resend.dev>"`
- En el archivo `src/lib/email.ts`

## 6. Probar el sistema

1. Reinicia el servidor de desarrollo: `npm run dev`
2. Reserva una cita como usuario
3. Verifica que lleguen los correos a:
   - Cliente (usuario que reservó)
   - Terapeuta
   - Administrador

## 7. Estructura de correos

El sistema envía 3 correos diferentes:

### Cliente:
- ✅ Confirmación de cita
- 📅 Detalles completos
- 📍 Instrucciones (presencial/online)
- 🔗 Botón para contactar

### Terapeuta:
- 📅 Nueva cita asignada
- 👤 Datos del paciente
- 📝 Notas del paciente
- 🆔 ID de la cita

### Administrador:
- 📊 Resumen de la cita
- 👥 Cliente y terapeuta
- 🆔 ID para referencia

## 8. Personalización

Puedes editar los templates HTML en `src/lib/email.ts`:
- Colores
- Logos (agregar imágenes)
- Textos
- Estructura

## 9. Monitoreo

En el dashboard de Resend puedes ver:
- Correos enviados
- Tasa de entrega
- Errores
- Logs detallados

## 10. Solución de problemas

### "Error sending emails"
- Verifica que `RESEND_API_KEY` esté configurada
- Verifica que la API key sea válida
- Revisa los logs del servidor

### Correos no llegan
- Verifica spam/correo no deseado
- Verifica que el dominio esté verificado en Resend
- Usa el dominio de prueba `onboarding@resend.dev` para testing

### Error 401 Unauthorized
- La API key no está configurada o es inválida
- Regenera la API key en Resend

## Archivos relacionados

- `src/lib/email.ts` - Lógica de envío de correos
- `src/app/api/send-appointment-email/route.ts` - API endpoint
- `src/utils/appointments.ts` - Integración con creación de citas
