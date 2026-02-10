# 📅 Guía de Días Feriados - Panel de Admin

## 🎯 ¿Qué es?

Los días feriados son fechas especiales que no estarán disponibles para reservas. Aparecerán en el calendario con un estilo distintivo (fondo dorado/naranja) y no se podrán seleccionar.

## 🎨 Visualización

### En el calendario del usuario:
- **Días normales**: Fondo gris claro, números negros
- **Sábados y Domingos**: Fondo azul suave, números azules
- **Días feriados**: Fondo dorado/naranja, números blancos
- **Hoy**: Borde azul grueso con punto debajo
- **Día seleccionado**: Fondo azul, números blancos

## ⚙️ Implementación Técnica

### 1. Array de Días Feriados

En `script.js` está definido el array `diasFeriados`:

```javascript
let diasFeriados = [
    // Ejemplos (puedes personalizar):
    // '2025-01-01', // Año Nuevo
    // '2025-02-20', // Carnaval
    // '2025-03-21', // Equinoccio
];
```

### 2. Agregar Días Feriados Manualmente

Para agregar un día feriado, edita el array con el formato YYYY-MM-DD:

```javascript
let diasFeriados = [
    '2025-02-20', // Carnaval
    '2025-03-21', // Equinoccio
    '2025-12-25', // Navidad
];
```

## 📱 Próximo: Panel de Admin

El siguiente paso es crear un panel en `admin.html` para:

### Funciones a implementar:

1. **Ver todos los días feriados**
```
┌─────────────────────────────────┐
│ Días Feriados Configurados      │
├─────────────────────────────────┤
│ 2025-02-20  Carnaval       [❌]  │
│ 2025-03-21  Equinoccio     [❌]  │
│ 2025-12-25  Navidad        [❌]  │
└─────────────────────────────────┘
```

2. **Agregar nuevo día feriado**
```
┌─────────────────────────────────┐
│ Agregar Día Feriado             │
├─────────────────────────────────┤
│ Fecha:     [2025-__-__]         │
│ Nombre:    [_____________]      │
│            [Guardar]  [Cancelar]│
└─────────────────────────────────┘
```

3. **Eliminar día feriado**
```
[❌] Botón de eliminar por cada fecha
```

## 🔧 Cómo agregar el panel en admin.html

Añade esta sección en `admin.html` después de la sección de estadísticas:

```html
<!-- Gestión de Días Feriados -->
<section class="feriados-section">
    <h2>📅 Gestión de Días Feriados</h2>
    
    <div class="feriados-form">
        <input type="date" id="fecha-feriado" min="2025-01-01" max="2025-12-31">
        <input type="text" id="nombre-feriado" placeholder="Ej: Carnaval, Navidad...">
        <button id="btn-agregar-feriado" class="btn-primary">
            <i data-lucide="plus"></i> Agregar Feriado
        </button>
    </div>
    
    <div id="lista-feriados" class="feriados-list">
        <!-- Se llena dinámicamente -->
    </div>
</section>
```

## 💾 Almacenamiento de Datos

### Opción 1: LocalStorage (Temporal)
```javascript
// Guardar
localStorage.setItem('diasFeriados', JSON.stringify(diasFeriados));

// Cargar
diasFeriados = JSON.parse(localStorage.getItem('diasFeriados') || '[]');
```

### Opción 2: Google Apps Script (Persistente)
```javascript
// Enviar nuevos feriados al servidor
function guardarFeriados(feriados) {
    fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({
            action: 'guardarFeriados',
            diasFeriados: feriados
        })
    });
}
```

## 🎯 Próximos Pasos

1. ✅ Calendario con estilos para días feriados (HECHO)
2. ⏳ Panel de admin para gestionar feriados (PRÓXIMO)
3. ⏳ Sincronización con Google Sheets/Apps Script (FUTURO)

## 📝 Ejemplo: Configurar Feriados de Bolivia 2025

```javascript
let diasFeriados = [
    '2025-01-01', // Año Nuevo
    '2025-02-12', // Carnaval
    '2025-02-13', // Carnaval
    '2025-03-19', // Miércoles de Ceniza
    '2025-04-18', // Viernes Santo
    '2025-05-01', // Día del Trabajo
    '2025-06-21', // Aymara
    '2025-01-15', // Día del Campesino (varia según región)
    '2025-10-12', // Día de la Raza
    '2025-11-01', // Día de Difuntos
    '2025-12-25', // Navidad
];
```

## 🔍 Verificación

Para verificar que los feriados se aplican correctamente:

1. Abre el navegador desde `index.html`
2. Navega al mes con un día feriado
3. Deberías ver el día con:
   - Fondo dorado/naranja
   - Números blancos
   - No ser clickeable
   - Texto gris si es pasado

---

**Estado**: 🟡 Parcialmente implementado
- ✅ Estilos CSS listos
- ✅ Lógica de aplicación lista
- ⏳ Panel de admin (próximo)
