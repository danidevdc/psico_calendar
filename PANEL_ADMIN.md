# 📊 Panel de Administración - Guía Completa

## 🎯 Descripción

El Panel de Administración permite al psicólogo ver, gestionar y analizar todas las citas del sistema desde una interfaz segura y profesional.

## 🔒 Seguridad

### Contraseña de Acceso

**Contraseña predeterminada:** `psico2025`

⚠️ **IMPORTANTE:** Debes cambiar esta contraseña antes de usar el sistema en producción.

### Cómo Cambiar la Contraseña

1. Abre el archivo `admin.js`
2. Busca la línea 8:
   ```javascript
   const ADMIN_PASSWORD = 'psico2025'; // ⚠️ CAMBIAR ESTA CONTRASEÑA
   ```
3. Reemplaza `'psico2025'` por tu contraseña segura
4. Guarda el archivo
5. Sube los cambios a GitHub

**Ejemplo:**
```javascript
const ADMIN_PASSWORD = 'MiContraseñaSegura2025!';
```

---

## 🚀 Cómo Acceder

### Opción 1: Desde la página principal
1. Ve a tu página de citas: `https://tu-usuario.github.io/psico_calendar/`
2. Busca el enlace "Panel de Administración" en el pie de página (footer)
3. Haz clic en el enlace

### Opción 2: URL directa
Accede directamente a: `https://tu-usuario.github.io/psico_calendar/admin.html`

---

## 📋 Funcionalidades

### 1️⃣ Estadísticas en Tiempo Real

El panel muestra 4 estadísticas principales:

- **Total de Citas:** Cantidad total de citas registradas
- **Carreras Atendidas:** Número de carreras diferentes
- **Próxima Cita:** Fecha de la próxima cita programada
- **Citas Hoy:** Cantidad de citas para el día actual

### 2️⃣ Tabla Completa de Citas

Muestra TODA la información de cada cita:
- ✅ Fecha
- ✅ Hora (formato 12 horas con AM/PM)
- ✅ Nombre del estudiante
- ✅ WhatsApp (con enlace directo para abrir chat)
- ✅ Carrera
- ✅ Comentarios
- ✅ Botón para eliminar

**Características especiales:**
- Las citas pasadas aparecen en gris y semitransparentes
- Las citas están ordenadas de más reciente a más antigua
- El número de WhatsApp es clickeable y abre WhatsApp Web directamente

### 3️⃣ Filtros de Búsqueda

Puedes filtrar las citas por:

- **Fecha:** Escribe DD/MM/AAAA (ejemplo: 18/11/2025)
- **Carrera:** Selecciona una carrera del menú desplegable
- **Nombre:** Busca por nombre del estudiante

Los filtros se aplican automáticamente mientras escribes.

**Botón "Limpiar Filtros":** Elimina todos los filtros y muestra todas las citas.

### 4️⃣ Eliminar Citas

Para eliminar una cita:

1. Encuentra la cita en la tabla
2. Haz clic en el botón 🗑️ (basura) en la columna "Acciones"
3. Confirma la eliminación en el diálogo que aparece
4. La cita se elimina de Google Sheets automáticamente
5. La tabla se actualiza mostrando los cambios

⚠️ **ADVERTENCIA:** Esta acción NO se puede deshacer.

### 5️⃣ Exportar a CSV

Exporta las citas filtradas a un archivo CSV (Excel):

1. Aplica los filtros que desees (o deja todos para exportar todo)
2. Haz clic en el botón "📥 Exportar a CSV"
3. Se descargará un archivo llamado `citas_FECHA.csv`
4. Abre el archivo con Excel, Google Sheets, o cualquier software de hojas de cálculo

**Contenido del CSV:**
- Fecha
- Hora (formato 12h)
- Nombre
- WhatsApp
- Carrera
- Comentarios

### 6️⃣ Actualizar Datos

Haz clic en el botón "🔄 Actualizar" para recargar las citas desde Google Sheets.

Útil cuando:
- Sospechas que hay nuevas citas
- Otra persona eliminó/agregó una cita
- Quieres verificar cambios recientes

### 7️⃣ Cerrar Sesión

Haz clic en "🚪 Cerrar Sesión" para salir del panel de forma segura.

La sesión se cierra automáticamente al cerrar el navegador.

---

## 🔧 Configuración Inicial

### Paso 1: Actualizar Google Apps Script

1. Abre tu Google Sheets
2. Ve a **Extensiones** → **Apps Script**
3. Copia TODO el contenido actualizado de `google-apps-script.gs`
4. Pega en el editor (reemplaza todo el código anterior)
5. Haz clic en **Guardar** (💾)
6. Haz clic en **Implementar** → **Administrar implementaciones**
7. Haz clic en el ícono de lápiz ✏️ junto a tu implementación
8. En "Versión", selecciona **Nueva versión**
9. Haz clic en **Implementar**

### Paso 2: Verificar la URL de Apps Script

En ambos archivos (`script.js` y `admin.js`), verifica que la URL de Apps Script sea la correcta:

```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/TU_URL_AQUI/exec';
```

### Paso 3: Cambiar la Contraseña

Sigue las instrucciones en la sección "Cómo Cambiar la Contraseña" arriba.

### Paso 4: Subir a GitHub

```bash
git add .
git commit -m "Agregar panel de administración"
git push
```

### Paso 5: Probar

1. Accede a `https://tu-usuario.github.io/psico_calendar/admin.html`
2. Ingresa tu contraseña
3. Verifica que veas todas las citas
4. Prueba los filtros y la función de eliminar

---

## 🔐 Diferencias entre Vista Pública vs Admin

### Vista Pública (index.html)
**Lo que ven los estudiantes:**
- ✅ Calendario interactivo
- ✅ Solo FECHAS y HORAS ocupadas (sin nombres)
- ✅ Formulario para agendar citas
- ✅ No requiere contraseña
- ❌ NO pueden ver nombres de otros estudiantes
- ❌ NO pueden eliminar citas
- ❌ NO ven estadísticas

### Panel de Admin (admin.html)
**Lo que ve el psicólogo:**
- ✅ Tabla completa con TODOS los datos
- ✅ Nombres, WhatsApp, carreras, comentarios
- ✅ Estadísticas y análisis
- ✅ Eliminar citas
- ✅ Exportar a CSV
- ✅ Filtros avanzados
- ✅ Protegido con contraseña

---

## 🛡️ Seguridad y Privacidad

### ¿Es seguro?

**Autenticación del lado del cliente:**
- La contraseña se valida en el navegador (no en el servidor)
- Cualquiera que vea el código fuente puede ver la contraseña
- Es suficiente para uso interno, pero NO para datos extremadamente sensibles

**Recomendaciones:**
- ✅ Cambia la contraseña regularmente
- ✅ No compartas el enlace del panel de admin públicamente
- ✅ Cierra sesión después de usar el panel
- ✅ No uses esta contraseña para otras cuentas

**Para mayor seguridad:**
Si necesitas mayor seguridad, considera:
- Usar Google Apps Script para validación de contraseña en el backend
- Implementar autenticación con Google OAuth
- Usar un sistema backend real (Node.js, PHP, etc.)

---

## ❓ Preguntas Frecuentes

### ¿Puedo tener múltiples administradores?

Sí, solo comparte la contraseña con las personas autorizadas. Todos usarán la misma contraseña.

### ¿La eliminación de citas afecta los recordatorios?

Las citas eliminadas se borran de Google Sheets, pero los recordatorios programados (triggers) NO se eliminan automáticamente. Los recordatorios programados se ejecutarán de todas formas (pero no encontrarán la cita).

### ¿Puedo restaurar una cita eliminada?

No. La eliminación es permanente. Asegúrate antes de eliminar.

### ¿Puedo editar una cita?

Actualmente no. Debes eliminar la cita incorrecta y pedirle al estudiante que cree una nueva.

### ¿El panel funciona en móviles?

Sí, el diseño es responsive y funciona perfectamente en smartphones y tablets.

### ¿Cuántas citas puede manejar el sistema?

Google Sheets puede manejar hasta 5 millones de celdas. Con 7 columnas, puedes tener aproximadamente 700,000 citas antes de tener problemas de rendimiento.

---

## 📞 Soporte

Si encuentras problemas:

1. Verifica que Google Apps Script esté actualizado
2. Revisa la consola del navegador (F12) en busca de errores
3. Asegúrate de que la URL de Apps Script sea correcta
4. Verifica que la contraseña sea la correcta

---

## 🎨 Personalización

### Cambiar colores del panel

Edita `admin.css` y busca:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Reemplaza `#667eea` y `#764ba2` por tus colores preferidos.

### Cambiar el logo o título

Edita `admin.html` línea 45:

```html
<h1>📊 Panel de Administración</h1>
```

---

## ✅ Checklist de Implementación

- [ ] Actualizar Google Apps Script con la nueva versión
- [ ] Implementar nueva versión en Apps Script
- [ ] Cambiar la contraseña en `admin.js`
- [ ] Verificar que la URL de Apps Script sea correcta
- [ ] Subir archivos a GitHub
- [ ] Probar acceso al panel
- [ ] Probar eliminación de citas
- [ ] Probar exportación a CSV
- [ ] Verificar que la vista pública NO muestre nombres

---

¡Listo! Ahora tienes un sistema completo de gestión de citas con dos vistas separadas: una para estudiantes y otra para el psicólogo. 🎉
