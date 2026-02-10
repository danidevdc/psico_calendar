# Sistema de Reserva de Citas

![Logo del Proyecto](./assets/logo/logo-placeholder.png)

## 📋 Descripción
Sistema completo de reservas de citas que funciona 100% en GitHub Pages y utiliza Google Sheets como base de datos mediante Google Apps Script. Diseñado para ser fácil de usar, seguro y eficiente, permite gestionar citas de manera profesional.

## ✨ Características
- Formulario de reserva de citas con validaciones
- Visualización de horarios ocupados en tiempo real
- Validación de fechas pasadas y horarios duplicados
- Interfaz responsive y moderna
- Base de datos en Google Sheets
- Backend con Google Apps Script

## 📸 Capturas de Pantalla
*(Próximamente)*

## 🚀 Instalación
### Prerrequisitos
- Cuenta de Google (Gmail)
- Cuenta de GitHub
- Navegador web moderno (Chrome, Firefox, Edge, Safari)

### Pasos de Instalación
1. **Configurar Google Sheets**:
   - Crea una nueva hoja de cálculo en [Google Sheets](https://sheets.google.com).
   - Nómbrala como prefieras (ej: "Sistema de Citas").
   - No agregues columnas, el script las creará automáticamente.

2. **Configurar Google Apps Script**:
   - Abre el editor de Apps Script desde **Extensiones > Apps Script**.
   - Copia el contenido del archivo `google-apps-script.gs` y pégalo en el editor.
   - Guarda el proyecto y despliega como Web App.

3. **Subir Archivos a GitHub Pages**:
   - Sube los archivos del proyecto a un repositorio de GitHub.
   - Activa GitHub Pages desde la configuración del repositorio.

## 📖 Uso
1. Accede al formulario de citas desde la URL generada en GitHub Pages.
2. Completa el formulario con los datos requeridos.
3. Visualiza las citas registradas y los horarios disponibles en tiempo real.

## 🛠 Stack Tecnológico
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Google Apps Script
- **Base de Datos**: Google Sheets
- **Hosting**: GitHub Pages

## 📁 Estructura del Proyecto
```
psico_calendar/
├── index.html          # Página principal
├── style.css           # Estilos del sistema
├── script.js           # Lógica del frontend
├── google-apps-script.gs # Backend en Google Apps Script
├── admin.html          # Panel de administración
├── admin.js            # Lógica del panel de administración
├── admin.css           # Estilos del panel de administración
├── assets/logo/        # Carpeta para el logo
└── README.md           # Documentación
```

## 🎨 Sistema de Diseño
- **Colores**: Basados en un diseño minimalista y moderno.
- **Tipografía**: Fuentes estándar para accesibilidad.
- **Diseño Responsive**: Optimizado para dispositivos móviles y de escritorio.

## 📄 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## 🙏 Agradecimientos
Agradecemos a todos los colaboradores y usuarios que han apoyado este proyecto. Un agradecimiento especial a las herramientas y plataformas utilizadas: Google Apps Script, GitHub Pages y Google Sheets.

---
Hecho con ❤️ por el equipo de desarrollo.
