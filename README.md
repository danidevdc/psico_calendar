# Sistema de Reserva de Citas - GitHub Pages + Google Sheets

Sistema completo de reservas de citas que funciona 100% en GitHub Pages y utiliza Google Sheets como base de datos mediante Google Apps Script.

## Características

- Formulario de reserva de citas con validaciones
- Visualización de horarios ocupados en tiempo real
- Validación de fechas pasadas
- Validación de horarios duplicados
- Interfaz responsive y moderna
- Base de datos en Google Sheets
- Backend con Google Apps Script

## Archivos del Proyecto

- `index.html` - Estructura HTML del formulario y visualización
- `style.css` - Estilos CSS del sistema
- `script.js` - Lógica JavaScript del frontend
- `google-apps-script.gs` - Código del backend en Google Apps Script
- `README.md` - Este archivo de instrucciones

## Instrucciones de Instalación

### PASO 1: Configurar Google Sheets

1. Abre [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala como prefieras (ej: "Sistema de Citas")
4. **No es necesario crear columnas**, el script las creará automáticamente

### PASO 2: Configurar Google Apps Script

1. En tu Google Sheet, ve a **Extensiones** > **Apps Script**
2. Elimina el código por defecto que aparece
3. Copia TODO el contenido del archivo `google-apps-script.gs`
4. Pégalo en el editor de Apps Script
5. Haz clic en el icono de **disquete** para guardar
6. Nombra el proyecto (ej: "Backend Citas")

### PASO 3: Desplegar como Web App

1. En Apps Script, haz clic en **Implementar** > **Nueva implementación**
2. Haz clic en el icono de **engranaje** junto a "Selecciona el tipo"
3. Selecciona **Aplicación web**
4. Configura lo siguiente:
   - **Descripción**: Backend Sistema de Citas
   - **Ejecutar como**: Yo (tu email)
   - **Quién tiene acceso**: Cualquier persona
5. Haz clic en **Implementar**
6. **IMPORTANTE**: Copia la URL que aparece (termina en `/exec`)
   - Ejemplo: `https://script.google.com/macros/s/AKfycby.../exec`
7. Autoriza la aplicación si te lo pide

### PASO 4: Configurar el Frontend

1. Abre el archivo `script.js`
2. En la línea 4, reemplaza `'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI'` con la URL que copiaste:

```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```

3. Guarda el archivo

### PASO 5: Subir a GitHub Pages

#### Opción A: Repositorio nuevo

1. Crea un nuevo repositorio en GitHub
2. Sube los archivos: `index.html`, `style.css` y `script.js`
3. Ve a **Settings** > **Pages**
4. En **Source**, selecciona la rama principal (main/master)
5. Haz clic en **Save**
6. Espera unos minutos y accede a tu sitio: `https://tu-usuario.github.io/nombre-repo/`

#### Opción B: Este repositorio

1. Los archivos ya están en el repositorio
2. Asegúrate de haber configurado la URL en `script.js`
3. Haz commit y push de los cambios
4. Activa GitHub Pages en la configuración del repositorio

### PASO 6: Probar el Sistema

1. Accede a tu sitio de GitHub Pages
2. Verás el formulario de reservas
3. Prueba reservando una cita:
   - Completa todos los campos
   - Selecciona una fecha futura
   - Selecciona una hora
   - Haz clic en "Reservar Cita"
4. Verifica en Google Sheets que la cita se guardó correctamente
5. Recarga la página y verás la cita en "Horarios Ocupados"

## Estructura de Google Sheets

El sistema creará automáticamente una hoja llamada "Citas" con las siguientes columnas:

| Timestamp | Nombre | WhatsApp | Servicio | Fecha | Hora | Comentarios |
|-----------|--------|----------|----------|-------|------|-------------|
| Fecha/hora de registro | Nombre completo | Número de teléfono | Tipo de servicio | Fecha de la cita | Hora de la cita | Comentarios adicionales |

## Personalización

### Modificar los servicios disponibles

Edita el archivo `index.html`, línea 42-48:

```html
<option value="Consulta Psicológica">Consulta Psicológica</option>
<option value="Terapia Individual">Terapia Individual</option>
<!-- Agrega más opciones aquí -->
```

### Cambiar colores

Edita el archivo `style.css`:

- Color principal: busca `#667eea` y reemplázalo
- Color secundario: busca `#764ba2` y reemplázalo

### Activar notificaciones por email

En `google-apps-script.gs`, descomenta y personaliza la función `enviarEmailConfirmacion` (líneas 188-209).

## Solución de Problemas

### Los horarios ocupados no se cargan

- Verifica que la URL de Apps Script esté correctamente configurada en `script.js`
- Asegúrate de que el Web App esté desplegado con acceso "Cualquier persona"
- Revisa la consola del navegador (F12) para ver errores

### Las citas no se guardan

- Verifica que hayas autorizado el script en Google Apps Script
- Revisa que el Web App esté implementado correctamente
- Comprueba que la hoja de cálculo no esté protegida

### Error de CORS

- Esto es normal. El script usa `mode: 'no-cors'` para evitar problemas
- El sistema verifica el guardado recargando los horarios después de enviar

## Funcionalidades Implementadas

- ✅ Formulario HTML con todos los campos requeridos
- ✅ Validación de fechas pasadas
- ✅ Validación de horarios duplicados
- ✅ Validación de teléfono (solo números)
- ✅ Verificación de disponibilidad en tiempo real
- ✅ Visualización de horarios ocupados
- ✅ Mensajes de éxito/error
- ✅ Interfaz responsive
- ✅ Backend en Google Apps Script
- ✅ Base de datos en Google Sheets
- ✅ Compatible 100% con GitHub Pages

## Seguridad

El sistema valida:
- Datos obligatorios en el frontend
- Datos obligatorios en el backend
- Horarios duplicados antes de guardar
- Formato de teléfono
- Fechas válidas

## Soporte

Para reportar problemas o sugerencias, abre un issue en el repositorio de GitHub.

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**¡Sistema listo para usar!** Solo configura Google Apps Script y actualiza la URL en `script.js`.
