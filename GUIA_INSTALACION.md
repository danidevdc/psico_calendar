# Guía de Instalación Paso a Paso

Esta guía te llevará paso a paso para configurar el sistema de citas desde cero.

## 📋 Requisitos Previos

- Una cuenta de Google (Gmail)
- Una cuenta de GitHub
- Navegador web moderno (Chrome, Firefox, Edge, Safari)

---

## 🚀 PASO 1: Preparar Google Sheets (5 minutos)

### 1.1 Crear la hoja de cálculo

1. Ve a [sheets.google.com](https://sheets.google.com)
2. Haz clic en el botón **+** (Crear hoja en blanco)
3. Nombra la hoja: "Sistema de Citas" (haz clic en "Hoja de cálculo sin título")
4. **No agregues ninguna columna**, el script lo hará automáticamente

### 1.2 Abrir el editor de Apps Script

1. En el menú superior, haz clic en **Extensiones**
2. Selecciona **Apps Script**
3. Se abrirá una nueva pestaña con el editor

### 1.3 Pegar el código del backend

1. Verás un archivo llamado `Código.gs` con código por defecto
2. **Selecciona todo el código** (Ctrl+A o Cmd+A)
3. **Bórralo**
4. Abre el archivo `google-apps-script.gs` de este proyecto
5. **Copia TODO** su contenido
6. **Pégalo** en el editor de Apps Script
7. Haz clic en el icono del **disquete** 💾 para guardar
8. Cambia el nombre del proyecto a "Backend Citas" (haz clic en "Proyecto sin título")

---

## 🌐 PASO 2: Desplegar el Web App (5 minutos)

### 2.1 Crear la implementación

1. En Apps Script, haz clic en el botón **Implementar** (arriba a la derecha)
2. Selecciona **Nueva implementación**
3. Haz clic en el icono de **engranaje** ⚙️ junto a "Selecciona el tipo"
4. Selecciona **Aplicación web**

### 2.2 Configurar la implementación

Completa los campos:

- **Descripción**: `Backend Sistema de Citas`
- **Ejecutar como**: `Yo (tu-email@gmail.com)`
- **Quién tiene acceso**: `Cualquier persona`

### 2.3 Implementar

1. Haz clic en **Implementar**
2. Te pedirá autorización. Haz clic en **Autorizar acceso**
3. Selecciona tu cuenta de Google
4. Aparecerá "Esta app no está verificada"
   - Haz clic en **Opciones avanzadas**
   - Haz clic en **Ir a [nombre del proyecto] (no seguro)**
   - Haz clic en **Permitir**

### 2.4 Copiar la URL

1. Aparecerá un mensaje de éxito con una **URL**
2. **COPIA ESTA URL COMPLETA** (termina en `/exec`)
   ```
   Ejemplo: https://script.google.com/macros/s/AKfycby1234567890abcdefg.../exec
   ```
3. **Guárdala en un lugar seguro** (la necesitarás en el siguiente paso)
4. Haz clic en **Listo**

---

## 💻 PASO 3: Configurar el Frontend (2 minutos)

### 3.1 Editar script.js

1. Abre el archivo `script.js` de este proyecto
2. Ve a la **línea 4**
3. Encontrarás esto:
   ```javascript
   const APPS_SCRIPT_URL = 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI';
   ```
4. Reemplázalo con la URL que copiaste:
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```
5. **Guarda el archivo** (Ctrl+S o Cmd+S)

---

## 📤 PASO 4: Subir a GitHub Pages (10 minutos)

### Opción A: Si ya tienes el repositorio clonado

```bash
# 1. Ver el estado de los archivos
git status

# 2. Agregar todos los archivos
git add index.html style.css script.js README.md

# 3. Hacer commit
git commit -m "Añadir sistema de reserva de citas"

# 4. Hacer push
git push origin main
```

### Opción B: Crear un nuevo repositorio

1. Ve a [github.com](https://github.com)
2. Haz clic en **New repository**
3. Nombre: `sistema-citas` (o el que prefieras)
4. Público o privado: **Público** (para usar GitHub Pages gratis)
5. Haz clic en **Create repository**
6. Sube los siguientes archivos:
   - `index.html`
   - `style.css`
   - `script.js`

### 4.1 Activar GitHub Pages

1. En tu repositorio, ve a **Settings** (Configuración)
2. En el menú izquierdo, busca **Pages**
3. En **Source** (Fuente), selecciona:
   - Branch: **main** (o master)
   - Folder: **/ (root)**
4. Haz clic en **Save**
5. Espera 1-2 minutos
6. Aparecerá un mensaje: "Your site is published at..."
7. **Copia esta URL** (ej: `https://tu-usuario.github.io/sistema-citas/`)

---

## ✅ PASO 5: Probar el Sistema (5 minutos)

### 5.1 Primera prueba

1. Abre la URL de GitHub Pages en tu navegador
2. Deberías ver el formulario de reservas
3. En la sección "Horarios Ocupados" debería decir: "No hay horarios ocupados aún"

### 5.2 Hacer una reserva de prueba

1. Completa el formulario:
   - **Nombre**: Tu nombre
   - **WhatsApp**: 3001234567
   - **Servicio**: Consulta Psicológica
   - **Fecha**: Mañana
   - **Hora**: 10:00
   - **Comentarios**: Prueba del sistema
2. Haz clic en **Reservar Cita**
3. Deberías ver: "¡Cita reservada exitosamente!"

### 5.3 Verificar en Google Sheets

1. Ve a tu Google Sheet
2. Deberías ver una nueva hoja llamada **"Citas"**
3. Verás tu reserva con todos los datos
4. ¡Funciona! 🎉

### 5.4 Verificar visualización

1. Recarga la página de GitHub Pages (F5)
2. En "Horarios Ocupados" deberías ver tu cita
3. Intenta reservar el mismo horario de nuevo
4. Deberías ver: "Este horario ya está ocupado"

---

## 🎨 PASO 6: Personalización (Opcional)

### Cambiar los servicios disponibles

Edita `index.html`, líneas 42-48:

```html
<option value="Tu Servicio">Tu Servicio</option>
<option value="Otro Servicio">Otro Servicio</option>
```

### Cambiar los colores

Edita `style.css`:

- Busca `#667eea` (color morado principal)
- Busca `#764ba2` (color morado oscuro)
- Reemplázalos con tus colores preferidos

### Activar notificaciones por email

En `google-apps-script.gs`:

1. Ve a las líneas 188-209
2. Descomenta el código (quita los `/*` y `*/`)
3. En la línea 193, cambia `'tu-email@ejemplo.com'` por tu email real
4. Guarda y vuelve a implementar en Apps Script

---

## 🔧 Solución de Problemas Comunes

### ❌ "Error al cargar los horarios"

**Causa**: La URL de Apps Script no está configurada correctamente

**Solución**:
1. Verifica que copiaste la URL completa (debe terminar en `/exec`)
2. Asegúrate de que la URL está entre comillas en `script.js`
3. No debe tener espacios antes o después

### ❌ "Cita procesada. Si no aparece en la lista..."

**Causa**: El script no tiene permisos o no está autorizado

**Solución**:
1. Ve a Apps Script
2. Ejecuta manualmente la función `pruebaCrearCita`
3. Autoriza los permisos
4. Vuelve a intentar desde la web

### ❌ Las citas no se guardan en Google Sheets

**Causa**: El Web App no está implementado correctamente

**Solución**:
1. Ve a Apps Script → Implementar → Administrar implementaciones
2. Verifica que "Ejecutar como" sea "Yo"
3. Verifica que "Quién tiene acceso" sea "Cualquier persona"
4. Si está mal, crea una nueva implementación

### ❌ Error 403 al hacer reserva

**Causa**: Permisos de Google Apps Script

**Solución**:
1. Ve a Apps Script
2. Implementar → Nueva implementación
3. Asegúrate de seleccionar "Cualquier persona" en acceso
4. Actualiza la URL en `script.js`

---

## 📊 Administrar las Citas

### Ver todas las citas

Simplemente abre tu Google Sheet. Todas las citas estarán en la hoja "Citas".

### Exportar citas

1. En Google Sheets, ve a **Archivo** → **Descargar**
2. Selecciona el formato (Excel, CSV, PDF, etc.)

### Eliminar una cita

1. En Google Sheets, localiza la fila de la cita
2. Haz clic derecho en el número de la fila
3. Selecciona "Eliminar fila"
4. La cita desaparecerá también de la web (al recargar)

### Filtrar citas

1. En Google Sheets, selecciona la fila de encabezados
2. Haz clic en **Datos** → **Crear un filtro**
3. Usa los embudos para filtrar por fecha, servicio, etc.

---

## 🔐 Seguridad y Privacidad

### ¿Es seguro?

- ✅ Los datos se almacenan en TU Google Sheet privado
- ✅ Solo tú tienes acceso a los datos completos
- ✅ El Web App solo permite crear y leer citas
- ✅ No se pueden modificar o eliminar citas desde la web

### ¿Quién puede ver los datos?

- **Tú**: Todos los datos (nombre, teléfono, comentarios)
- **Usuarios web**: Solo fecha, hora y tipo de servicio de citas ocupadas
- **Nadie más**: Google Sheet es privado

### Recomendaciones

- No compartas la URL de edición de Google Sheets
- Cambia regularmente la implementación de Apps Script
- Activa la verificación en dos pasos en tu cuenta de Google

---

## 📱 Próximos Pasos

Una vez que el sistema funciona, puedes:

1. **Compartir la URL** de GitHub Pages con tus clientes/usuarios
2. **Personalizar** los colores y servicios
3. **Activar** las notificaciones por email
4. **Agregar** tu logo en el header
5. **Crear** una sección de preguntas frecuentes

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:

1. Revisa la sección "Solución de Problemas" arriba
2. Verifica que seguiste todos los pasos en orden
3. Abre la consola del navegador (F12) y busca errores
4. Abre un issue en el repositorio de GitHub

---

## ✨ ¡Listo!

Tu sistema de citas está funcionando. Ahora puedes:

- ✅ Recibir reservas 24/7
- ✅ Evitar horarios duplicados automáticamente
- ✅ Visualizar todas las citas en Google Sheets
- ✅ Compartir un enlace profesional

**¡Disfruta tu nuevo sistema de reservas!** 🎉
