# 🔗 Verificación de Conexión Google Sheets - Guía Completa

## ✅ Estado de Conexión

Tu aplicación está configurada para conectarse con Google Sheets a través de Google Apps Script.

### URL de Conexión Actual:
```
https://script.google.com/macros/s/AKfycbxamQJGN4pb_4apwlMb9uPorezns5g9Qgm4fpBPiRsO9EphxzyMsCuzTPUMUoNxV0gmnw/exec
```

## 🔍 Cómo Verificar Que Funciona

### Opción 1: Método Rápido en Cliente
1. Abre tu navegador (F12 para herramientas de desarrollador)
2. Ve a la pestaña "Network" 
3. Intenta crear una cita desde `index.html`
4. Busca la solicitud a `exec` (Google Apps Script)
5. Verifica que responda con status 200 o 204

### Opción 2: Ver en Logs de Google Apps Script
1. Ve a tu [Google Apps Script](https://script.google.com)
2. Abre el editor (copia el URL de Apps Script)
3. Haz clic en "Ejecuciones" en la navegación lateral
4. Deberías ver tus ejecuciones con status ✅ o ❌

### Opción 3: Verifica que Google Sheets existe
1. Ve a Google Drive
2. Busca la hoja de cálculo creada para el script
3. Debe tener una pestaña llamada "Citas" con las columnas:
   - Timestamp
   - Nombre
   - WhatsApp
   - Carrera
   - Fecha
   - Hora
   - Comentarios

## 🚀 Lo que Está Funcionando Ahora

### ✅ Implementado:

1. **Función GET - obtenerCitas()**
   - Endpoint: `?action=getCitas`
   - Devuelve todas las citas en formato JSON
   - Usado en: `script.js` y `admin.js`

2. **Función POST - guardarCita()**
   - Recibe datos del formulario
   - Guarda en Google Sheets
   - Envía confirmación por WhatsApp
   - Programa recordatorio 30 min antes

3. **Función POST - eliminarCita()**
   - Endpoint: `action=eliminarCita`
   - Elimina cita de la hoja
   - Usado en: Panel de admin

4. **Modal para crear cita desde Admin**
   - 🆕 Botón "Nueva Cita" en header
   - Modal con formulario completo
   - Valida antes de guardar
   - Actualiza tabla automáticamente

## ⚠️ Si NO Funciona

### Checklist de Diagnóstico:

1. **¿La URL es válida?**
   ```javascript
   // Verificar en console del navegador:
   console.log(APPS_SCRIPT_URL); // Debería mostrar la URL
   ```

2. **¿El Apps Script está publicado?**
   - En Google Apps Script, ve a "Implementaciones"
   - Debe haber una versión publicada
   - URL debe empezar con `/macros/s/`

3. **¿Existen las funciones doGet() y doPost()?**
   - En `google-apps-script.gs`
   - Deben ser públicas (anyone)

4. **¿Hay permisos en Google Sheets?**
   - La hoja debe ser accesible
   - El script debe tener permisos

## 🔧 Cómo Re-publicar Google Apps Script

Si nada funciona, sigue estos pasos:

### Paso 1: Abre Google Apps Script
1. Ve a [script.google.com](https://script.google.com)
2. Si tienes varios scripts, busca el que contiene "Citas Psicología"

### Paso 2: Verifica el código
1. Copia el contenido de [google-apps-script.gs](./google-apps-script.gs)
2. Pegatelo en el editor de Apps Script
3. Asegúrate de tener funciones:
   - `doGet(e)`
   - `doPost(e)`
   - `obtenerCitas()`
   - `guardarCita(datos)`

### Paso 3: Configura WhatsApp (Opcional)
Si quieres confirmaciones por WhatsApp:

```javascript
// En google-apps-script.gs, línea ~15
const USAR_CALLMEBOT = true; // Cambia a true
const WHATSAPP_API_KEY = 'TU_API_KEY'; // Obtén en callmebot.com
```

### Paso 4: Publica el Script
1. Haz clic en "Implementaciones" (arriba a la derecha)
2. Haz clic en "Crear implementación"
3. Tipo: "API ejecutable"
4. Ejecutar como: Tu cuenta
5. Acceso: "Cualquiera"
6. Copia la URL de implementación
7. Pega en `script.js` línea 4 y `admin.js` línea 4

**Ejemplo:**
```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/[TU_ID]/exec';
```

### Paso 5: Crea la Hoja de Cálculo
1. La hoja se creará automáticamente al recibir la primera cita
2. O créala manualmente:
   - Nombre de la hoja: `Citas`
   - Columnas: Timestamp | Nombre | WhatsApp | Carrera | Fecha | Hora | Comentarios

## 📊 Flujo de Datos

```
Usuario (index.html)
    ↓
[Formulario de cita]
    ↓
script.js → fetch(APPS_SCRIPT_URL, POST)
    ↓
Google Apps Script (doPost)
    ↓
Valida datos
    ↓
Guarda en Google Sheets
    ↓
Envía WhatsApp (opcional)
    ↓
Retorna JSON success
    ↓
Recarga horarios en index.html
```

```
Admin (admin.html)
    ↓
[Click "Nueva Cita"]
    ↓
Modal abierto
    ↓
[Llenar formulario + Guardar]
    ↓
admin.js → fetch(APPS_SCRIPT_URL, POST)
    ↓
Google Apps Script (doPost)
    ↓
Guarda en Google Sheets
    ↓
admin.js → cargarCitas()
    ↓
Se actualiza tabla de admin
```

## 🧪 Test Rápido

### Test 1: Verificar conexión (en Console del navegador)
```javascript
fetch('https://script.google.com/macros/s/[TU_ID]/exec?action=getCitas')
    .then(r => r.json())
    .then(data => console.log(data))
    .catch(e => console.error('Error:', e));
```

**Si ves:** `{status: 'success', citas: [...]}` → ✅ Funciona
**Si ves:** Error/timeout → ❌ Problema de conexión

### Test 2: Crear cita de prueba (en Console)
```javascript
fetch('https://script.google.com/macros/s/[TU_ID]/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        nombre: 'Test Usuario',
        whatsapp: '71234567',
        carrera: 'Psicología',
        fecha: '2025-02-20',
        hora: '10:15',
        comentarios: 'Prueba'
    })
})
.then(() => alert('Enviado'))
.catch(e => alert('Error: ' + e));
```

## 📞 Soporte

Si tienes problemas:

1. **Revisa la console** (F12) por errores JavaScript
2. **Verifica logs** en Google Apps Script
3. **Comprueba permisos** en Google Drive
4. **Prueba test** desde Console del navegador

---

**Documentación relacionada:**
- [GUIA_INSTALACION.md](./GUIA_INSTALACION.md) - Instalación general
- [google-apps-script.gs](./google-apps-script.gs) - Código de backend
- [CONFIG_WHATSAPP.md](./CONFIG_WHATSAPP.md) - Configuración de WhatsApp

**Última actualización:** Feb 10, 2025
