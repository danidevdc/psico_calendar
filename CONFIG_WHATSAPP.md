# Configuración de WhatsApp para el Sistema de Citas

Este sistema puede enviar mensajes de WhatsApp automáticamente usando dos métodos:

1. **CallMeBot** (GRATIS) - Recomendado para empezar
2. **Twilio** (PROFESIONAL, de pago) - Para uso en producción

---

## 📱 Opción 1: CallMeBot (GRATIS)

CallMeBot es un servicio gratuito para enviar mensajes de WhatsApp. Es perfecto para proyectos pequeños y pruebas.

### Paso 1: Obtener tu API Key

1. **Guarda el número de CallMeBot** en tus contactos:
   ```
   +34 644 34 44 44
   ```
   Nombre sugerido: "CallMeBot API"

2. **Envía un mensaje de WhatsApp** a ese número con el texto exacto:
   ```
   I allow callmebot to send me messages
   ```

3. **Recibirás una respuesta** con tu API Key. Se verá algo así:
   ```
   Your API Key is: 1234567
   ```

4. **Guarda tu API Key**, la necesitarás en el siguiente paso.

### Paso 2: Configurar en Google Apps Script

1. Abre tu Google Apps Script
2. En el archivo `google-apps-script.gs`, ve a la línea 12
3. Reemplaza `TU_API_KEY_AQUI` con tu API Key:
   ```javascript
   const WHATSAPP_API_KEY = '1234567'; // Tu API Key
   ```

4. Asegúrate de que `USAR_CALLMEBOT` esté en `true` (línea 13):
   ```javascript
   const USAR_CALLMEBOT = true;
   ```

### Paso 3: Probar

1. En Google Apps Script, ve a la función `pruebaEnviarWhatsApp` (línea 418)
2. Cambia el número de prueba por el tuyo (solo 8 dígitos):
   ```javascript
   const numeroTest = '71234567'; // Tu número
   ```

3. Haz clic en **Ejecutar** (▶️)
4. Autoriza los permisos si te lo pide
5. Deberías recibir un mensaje de WhatsApp en unos segundos

### Limitaciones de CallMeBot

- ✅ Gratis
- ✅ Fácil de configurar
- ❌ Límite de ~30 mensajes por día
- ❌ A veces tarda 1-2 minutos
- ❌ No es 100% confiable

---

## 🚀 Opción 2: Twilio (PROFESIONAL)

Twilio es un servicio profesional de pago. Es más confiable y rápido.

### Costo Aproximado

- **Cuenta gratuita de prueba**: $15 USD de crédito
- **Mensajes**: ~$0.005 USD por mensaje (muy barato)
- **Para 1000 mensajes/mes**: ~$5 USD

### Paso 1: Crear cuenta en Twilio

1. Ve a [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Regístrate (email, nombre, teléfono)
3. Verifica tu número de teléfono

### Paso 2: Activar WhatsApp Sandbox

1. En el dashboard de Twilio, ve a **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Guarda el número que te dan (ej: +1 415 523 8886)
3. Desde tu WhatsApp, envía el código que te indican a ese número:
   ```
   join [código-único]
   ```
4. Recibirás un mensaje de confirmación

### Paso 3: Obtener credenciales

1. En el Dashboard de Twilio, copia:
   - **Account SID** (algo como: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)
   - **Auth Token** (haz clic en "Show" para verlo)

### Paso 4: Configurar en Google Apps Script

1. En `google-apps-script.gs`, cambia la línea 13:
   ```javascript
   const USAR_CALLMEBOT = false; // Cambiar a false
   ```

2. Actualiza las líneas 16-18 con tus datos:
   ```javascript
   const TWILIO_ACCOUNT_SID = 'ACxxxxxx...'; // Tu Account SID
   const TWILIO_AUTH_TOKEN = 'tu_auth_token'; // Tu Auth Token
   const TWILIO_WHATSAPP_FROM = 'whatsapp:+14155238886'; // El número de Twilio
   ```

### Paso 5: Probar

1. Ejecuta la función `pruebaEnviarWhatsApp`
2. Deberías recibir el mensaje inmediatamente

### Ventajas de Twilio

- ✅ Muy confiable (99.99% uptime)
- ✅ Rápido (mensajes llegan en segundos)
- ✅ Sin límite de mensajes (solo pagas por uso)
- ✅ Soporte profesional
- ❌ De pago (pero muy económico)

---

## ⚙️ Configuración del Código

Ya sea que uses CallMeBot o Twilio, el sistema está listo. El código automáticamente:

### Al reservar una cita:
- ✅ Guarda la cita en Google Sheets
- ✅ Envía WhatsApp de confirmación al usuario
- ✅ Programa un recordatorio automático para 30 min antes

### Mensajes automáticos:

**Confirmación (al reservar):**
```
✅ Cita Confirmada

Hola Juan Pérez,

Tu cita ha sido reservada exitosamente:

📅 Fecha: 18/11/2024
🕐 Hora: 10:00
🎓 Carrera: Psicología

Recibirás un recordatorio 30 minutos antes de tu cita.

¡Te esperamos!
```

**Recordatorio (30 min antes):**
```
⏰ Recordatorio de Cita

Hola Juan Pérez,

Tienes una cita en 30 minutos:

📅 Fecha: 18/11/2024
🕐 Hora: 10:00

¡No olvides asistir!
```

---

## 🔧 Solución de Problemas

### No llegan mensajes con CallMeBot

1. **Verifica tu API Key** en el código
2. **Asegúrate de que el número de CallMeBot** esté en tus contactos
3. **Espera 1-2 minutos**, a veces tarda
4. **Revisa los logs** en Google Apps Script:
   - Ve a **Ejecuciones** (ícono de reloj)
   - Busca errores en rojo

### No llegan mensajes con Twilio

1. **Verifica que enviaste el código `join`** al sandbox de WhatsApp
2. **Revisa tus credenciales** (Account SID y Auth Token)
3. **Verifica el saldo** de tu cuenta de Twilio
4. **Revisa los logs** en Apps Script y en el dashboard de Twilio

### Los recordatorios no se envían

1. Ve a **Ejecuciones** en Google Apps Script
2. Verifica que se creó un trigger (Activadores/Triggers)
3. Los triggers aparecen con la función `enviarRecordatorioAutomatico`
4. Si no aparecen, revisa que la fecha/hora de la cita sea futura

### Mensajes llegan duplicados

- Esto puede pasar si ejecutas el script múltiples veces
- Elimina los triggers duplicados:
  1. Ve a **Activadores** (ícono de reloj con engranaje)
  2. Elimina los triggers duplicados

---

## 📊 Estructura de Google Sheets

El sistema crea automáticamente una hoja "Citas" con estas columnas:

| Timestamp | Nombre | WhatsApp | Carrera | Fecha | Hora | Comentarios |
|-----------|--------|----------|---------|-------|------|-------------|
| 2024-11-17 10:30 | Juan Pérez | 71234567 | Psicología | 18/11/2024 | 10:00 | Primera consulta |

---

## 🎯 Recomendación

**Para empezar:** Usa CallMeBot (gratis)

**Para producción:** Usa Twilio (más confiable)

**Migración:** Puedes cambiar de CallMeBot a Twilio en cualquier momento sin modificar el resto del código.

---

## 📝 Notas Importantes

1. **Bolivia (+591)**: El código ya está configurado para números de Bolivia
2. **Formato de números**: Solo ingresa los 8 dígitos (ej: 71234567)
3. **Zona horaria**: Los recordatorios usan la zona horaria de tu Google Account
4. **Límite de triggers**: Google Apps Script permite hasta 20 triggers por script

---

## ✅ Checklist Final

- [ ] API de WhatsApp configurada (CallMeBot o Twilio)
- [ ] Prueba enviada y recibida
- [ ] URL de Apps Script actualizada en `script.js`
- [ ] Web App desplegado con acceso "Cualquier persona"
- [ ] GitHub Pages activado
- [ ] Primera cita de prueba creada
- [ ] Confirmación recibida por WhatsApp
- [ ] Recordatorio programado correctamente

¡Tu sistema está listo para recibir citas con confirmaciones automáticas por WhatsApp!
