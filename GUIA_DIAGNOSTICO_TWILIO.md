# 🔧 Guía de Diagnóstico: No llegan mensajes de Twilio

## 🎯 Problema Identificado

Tu configuración actual tiene:
```javascript
const USAR_CALLMEBOT = true;  // ← ESTÁ USANDO CALLMEBOT, NO TWILIO
```

**Por eso no te llegan mensajes de Twilio.** El sistema está intentando usar CallMeBot (gratis) en lugar de Twilio.

---

## ✅ Solución Rápida (5 minutos)

### Paso 1: Cambiar a Twilio

1. Abre tu Google Sheets
2. Ve a **Extensiones** → **Apps Script**
3. Busca la **línea 13** que dice:
   ```javascript
   const USAR_CALLMEBOT = true;
   ```
4. Cámbiala a:
   ```javascript
   const USAR_CALLMEBOT = false;  // ✅ USAR TWILIO
   ```

### Paso 2: Configurar Credenciales de Twilio

Busca las **líneas 16-18** y reemplaza con tus credenciales reales:

```javascript
const TWILIO_ACCOUNT_SID = 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';  // Tu Account SID
const TWILIO_AUTH_TOKEN = 'tu_token_secreto_aqui';              // Tu Auth Token
const TWILIO_WHATSAPP_FROM = 'whatsapp:+14155238886';           // Número de Twilio
```

**¿Dónde encuentro estas credenciales?**
1. Ve a [Twilio Console](https://console.twilio.com/)
2. En el Dashboard verás:
   - **Account SID** (empieza con "AC")
   - **Auth Token** (haz clic en "Show" para verlo)

### Paso 3: Guardar y Desplegar

1. Haz clic en **Guardar** (💾)
2. Haz clic en **Implementar** → **Administrar implementaciones**
3. Haz clic en el ícono de lápiz ✏️ junto a tu implementación
4. En "Versión", selecciona **Nueva versión**
5. Haz clic en **Implementar**

### Paso 4: Probar

Crea una cita de prueba en tu sistema y verifica que llegue el mensaje.

---

## 🧪 Diagnóstico Completo con Script

Si la solución rápida no funciona, usa el script de diagnóstico:

### 1. Configurar el Script de Diagnóstico

1. Abre tu Google Sheets
2. Ve a **Extensiones** → **Apps Script**
3. Haz clic en el botón **+** junto a "Archivos"
4. Selecciona **Script**
5. Nómbralo `DIAGNOSTICO_TWILIO`
6. Copia TODO el contenido del archivo `DIAGNOSTICO_TWILIO.gs`
7. Pega en el editor

### 2. Configurar tus Credenciales en el Script

En las **líneas 6-9** del script de diagnóstico, reemplaza:

```javascript
const TWILIO_ACCOUNT_SID = 'TU_ACCOUNT_SID';  // ← Pon tu Account SID real
const TWILIO_AUTH_TOKEN = 'TU_AUTH_TOKEN';    // ← Pon tu Auth Token real
const TWILIO_WHATSAPP_FROM = 'whatsapp:+14155238886'; // ← Número de Twilio
const NUMERO_PRUEBA = '71234567';             // ← Tu número de WhatsApp (8 dígitos)
```

### 3. Ejecutar el Diagnóstico

1. Selecciona la función `DIAGNOSTICO_COMPLETO` en el menú desplegable
2. Haz clic en **Ejecutar** ▶️
3. Si es la primera vez, autoriza los permisos
4. Ve a **Ver** → **Registros** (o presiona Ctrl/Cmd + Enter)

### 4. Interpretar los Resultados

El script verificará:

✅ **Paso 1: Configuración**
- Account SID correcto (empieza con "AC", 34 caracteres)
- Auth Token configurado
- Número FROM en formato correcto

✅ **Paso 2: Conexión a Twilio**
- Envía un mensaje de prueba
- Verifica credenciales
- Muestra códigos de error detallados

✅ **Paso 3: Sandbox**
- Instrucciones para verificar tu número

✅ **Paso 4: Configuración Final**
- Resumen de cambios necesarios en `google-apps-script.gs`

---

## ❌ Errores Comunes y Soluciones

### Error 401: Credenciales Incorrectas

```
❌ ERROR 401: Credenciales incorrectas
```

**Solución:**
- Verifica que el Account SID empiece con "AC"
- Verifica que el Auth Token sea el correcto
- En Twilio Console, haz clic en "Show" para ver el Auth Token

### Error 400: Número no verificado

```
❌ ERROR 400: Solicitud incorrecta
```

**Causa:** Tu número no está verificado en Twilio Sandbox.

**Solución:**
1. Ve a [Twilio Console → Messaging → Try it out](https://www.twilio.com/console/sms/whatsapp/sandbox)
2. Sigue las instrucciones para "Join Sandbox"
3. Desde tu WhatsApp, envía un mensaje a **+1 (415) 523-8886**:
   ```
   join <tu-codigo-sandbox>
   ```
   Ejemplo: `join happy-dog`
4. Espera el mensaje de confirmación de Twilio
5. Ahora tu número está autorizado

### Error 403: Sin permisos o sin saldo

```
❌ ERROR 403: Acceso denegado
```

**Posibles causas:**
- Tu cuenta de Twilio no tiene saldo (revisa en Twilio Console)
- Tu cuenta está suspendida
- Necesitas agregar crédito a tu cuenta

### Error: You do not have permission to call UrlFetchApp

```
Exception: You do not have permission to call UrlFetchApp.fetch
```

**Solución:**
1. En Apps Script, haz clic en **Ejecutar** (▶️)
2. Aparecerá un diálogo de permisos
3. Haz clic en **Revisar permisos**
4. Selecciona tu cuenta de Google
5. Haz clic en **Opciones avanzadas**
6. Haz clic en **Ir a [nombre del proyecto] (no seguro)**
7. Haz clic en **Permitir**

---

## 🔍 Verificar que Twilio está Activo

Después de configurar, verifica que Twilio esté activo:

### En google-apps-script.gs:

```javascript
// Línea 13 - DEBE SER false
const USAR_CALLMEBOT = false;  // ✅ CORRECTO - Usa Twilio

// Líneas 16-18 - Con credenciales reales
const TWILIO_ACCOUNT_SID = 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const TWILIO_AUTH_TOKEN = 'tu_token_secreto';
const TWILIO_WHATSAPP_FROM = 'whatsapp:+14155238886';
```

### En los Logs de Google Apps Script:

Cuando creas una cita, deberías ver en los logs:

```
Respuesta Twilio: {"sid":"SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxx","status":"queued",...}
```

Si ves esto, ¡Twilio está funcionando! 🎉

---

## 📱 Twilio Sandbox vs Cuenta de Producción

### Twilio Sandbox (GRATIS - Para pruebas)

**Limitaciones:**
- ❌ Solo puedes enviar a números verificados
- ❌ Cada número debe unirse al sandbox con el código
- ❌ Máximo 5 números verificados
- ✅ Perfecto para desarrollo y pruebas

**Cómo verificar un número:**
1. Ir a Twilio Console → Messaging → Try WhatsApp
2. Seguir instrucciones
3. Enviar `join codigo-sandbox` desde WhatsApp

### Cuenta de Producción (PAGO)

**Ventajas:**
- ✅ Envías a cualquier número sin verificación previa
- ✅ Sin límite de números
- ✅ Mensajes más confiables
- ✅ Números propios personalizados

**Costo aproximado:**
- ~$1 USD por mensaje
- Requiere recargar saldo en Twilio

---

## 🧪 Funciones de Prueba

### Prueba Rápida (Solo enviar un mensaje)

```javascript
// En Apps Script, ejecuta:
PRUEBA_RAPIDA()
```

Revisa los logs para ver el resultado.

### Diagnóstico Completo

```javascript
// En Apps Script, ejecuta:
DIAGNOSTICO_COMPLETO()
```

Ejecuta todos los pasos de verificación automáticamente.

---

## 📋 Checklist de Verificación

Antes de crear una cita de prueba, verifica:

- [ ] `USAR_CALLMEBOT = false` en google-apps-script.gs
- [ ] Account SID configurado (empieza con "AC")
- [ ] Auth Token configurado
- [ ] Número FROM configurado (`whatsapp:+14155238886`)
- [ ] Tu número está verificado en Twilio Sandbox
- [ ] Apps Script tiene permisos de UrlFetchApp
- [ ] Nueva versión implementada (Deploy)
- [ ] URL de Apps Script actualizada en script.js y admin.js

---

## 💡 Alternativa: Usar CallMeBot (GRATIS)

Si Twilio es muy complicado o costoso, puedes usar CallMeBot:

1. Deja `USAR_CALLMEBOT = true`
2. Obtén tu API Key en: https://www.callmebot.com/blog/free-api-whatsapp-messages/
3. Configura `WHATSAPP_API_KEY` en google-apps-script.gs

**Ventajas de CallMeBot:**
- ✅ Completamente gratis
- ✅ Sin límite de mensajes
- ✅ No requiere verificación de números

**Desventajas:**
- ❌ Menos confiable que Twilio
- ❌ Puede tener delays
- ❌ Depende de un servicio externo

---

## 🆘 Si Nada Funciona

1. **Revisa los logs de Apps Script:**
   - Ve a **Extensiones** → **Apps Script**
   - Haz clic en **Ejecuciones** (en el menú izquierdo)
   - Busca errores en ejecuciones recientes

2. **Verifica que la cita se guarde:**
   - Abre tu Google Sheets
   - Verifica que la cita aparezca en la hoja "Citas"
   - Si no aparece, el problema es antes de WhatsApp

3. **Prueba el script de diagnóstico:**
   - Ejecuta `DIAGNOSTICO_COMPLETO()`
   - Copia TODO el output de los logs
   - Busca líneas con ❌ (errores)

4. **Envíame los logs:**
   - Copia el output completo del diagnóstico
   - Incluye cualquier error que veas
   - Te ayudaré a interpretarlos

---

## ✅ Cuando Todo Funcione

Deberías:

1. ✅ Ver la cita en Google Sheets
2. ✅ Recibir un WhatsApp de confirmación inmediatamente
3. ✅ Recibir un recordatorio 30 minutos antes de la cita
4. ✅ Ver en los logs: `Respuesta Twilio: {"sid":"SM..."}`

¡Listo! 🎉
