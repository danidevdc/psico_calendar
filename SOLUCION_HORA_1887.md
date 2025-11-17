# 🔧 Solución: Hora mostrando "1887:37 PM"

## 🎯 Problema Identificado

El valor "1887:37 PM" **NO está en el código**, está guardado como **dato** en tu Google Sheets.

El código JavaScript está funcionando correctamente. El problema es que hay una o más filas en tu hoja de cálculo con el valor "1887:37" en la columna "Hora".

## ✅ Solución Paso a Paso

### Paso 1: Abrir tu Google Sheets
1. Ve a Google Sheets
2. Abre el archivo donde están las citas (el que conectaste con Apps Script)
3. Busca la pestaña llamada "Citas"

### Paso 2: Encontrar el dato incorrecto
En la columna "Hora" (columna F), busca cualquier celda que contenga:
- `1887:37`
- `18:87`
- Cualquier valor extraño que no sea una hora válida

### Paso 3: Limpiar los datos
**Opción A - Eliminar fila específica:**
- Haz clic derecho en el número de la fila → "Eliminar fila"

**Opción B - Limpiar todas las citas de prueba:**
- Selecciona todas las filas desde la fila 2 hasta la última con datos
- Presiona Delete
- Esto dejará solo los encabezados (fila 1) y limpiará todos los datos

### Paso 4: Verificar
1. Guarda los cambios en Google Sheets
2. Recarga tu página web (F5 o Ctrl+R)
3. Abre la Consola del navegador (F12)
4. Verás logs como estos:

```
📊 TOTAL DE CITAS RECIBIDAS: 2
📌 Cita 1: {nombre: "Juan", fecha: "15/11/2025", hora: "10:15", horaFormateada: "10:15 AM"}
📌 Cita 2: {nombre: "María", fecha: "16/11/2025", hora: "14:00", horaFormateada: "02:00 PM"}
```

5. Revisa el campo "hora" y "horaFormateada" - el primero te muestra lo que está guardado en Sheets, el segundo cómo se está formateando

## 🔍 Cómo ver los logs

1. Abre tu página web
2. Presiona **F12** (o clic derecho → Inspeccionar)
3. Ve a la pestaña **Console**
4. Recarga la página (F5)
5. Verás todos los logs con 📊 y 📌

## 📋 Formatos de hora correctos

Solo usa estos formatos en la columna "Hora" de Google Sheets:
- `10:15` (se mostrará como "10:15 AM")
- `11:10` (se mostrará como "11:10 AM")
- `12:05` (se mostrará como "12:05 PM")
- `14:00` (se mostrará como "02:00 PM")
- `14:55` (se mostrará como "02:55 PM")
- `15:50` (se mostrará como "03:50 PM")
- `16:45` (se mostrará como "04:45 PM")
- `17:40` (se mostrará como "05:40 PM")

❌ **NO usar:**
- `1887:37` (hora inválida)
- `18:87` (minutos inválidos - máximo es 59)
- `05:40 PM` (no usar AM/PM, el sistema lo agregará automáticamente)

## 🚀 Si el problema persiste

1. Copia TODOS los logs de la consola que empiecen con 📊 o 📌
2. Envíamelos para revisar exactamente qué datos están llegando desde Google Sheets
3. También toma una captura de pantalla de tu hoja "Citas" en Google Sheets

## 🧹 Después de solucionar

Una vez que confirmes que funciona correctamente, puedes eliminar los logs de debug del archivo `script.js` (líneas 238-247).
