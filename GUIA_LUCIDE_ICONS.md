# Guía de Iconos Lucide

## ¿Qué es Lucide?

Lucide es una librería moderna de iconos SVG con más de 600 iconos diferentes. Ya está integrada en tu proyecto mediante un CDN.

## Cómo usar los iconos

### En HTML

Simplemente reemplaza los emojis con etiquetas de Lucide:

```html
<!-- Ejemplo: Reemplazar emoji por icono -->
<!-- Antes: -->
<h2>📅 Calendario - Horarios Ocupados</h2>

<!-- Después: -->
<h2>
    <i data-lucide="calendar"></i> 
    Calendario - Horarios Ocupados
</h2>
```

### Sintaxis básica

```html
<i data-lucide="nombre-del-icono"></i>
```

Los iconos se inicializan automáticamente cuando carga la página.

## Iconos recomendados para tu app

| Emoji | Lucide Icon | Uso |
|-------|-------------|-----|
| 📅 | `calendar` | Calendario y fechas |
| 📊 | `bar-chart-2` | Estadísticas |
| 📈 | `trending-up` | Gráficos y analítica |
| 📚 | `book` | Carreras/educación |
| 📆 | `calendar-days` | Días del calendario |
| ✅ | `check-circle` | Confirmaciones |
| 🔄 | `refresh-cw` | Actualizar |
| 🚪 | `log-out` | Cerrar sesión |
| 🔒 | `lock` | Seguridad/login |
| ⏳ | `clock` | Tiempo |
| 📱 | `phone` | WhatsApp/contacto |
| ✏️ | `edit` | Editar |
| 🗑️ | `trash-2` | Eliminar |
| ➕ | `plus` | Agregar |
| ➖ | `minus` | Restar |

## Ejemplos de reemplazo en tu proyecto

### En index.html

```html
<!-- Sección de horarios -->
<h2>
    <i data-lucide="calendar"></i>
    Calendario - Horarios Ocupados
</h2>

<!-- Selector de hora -->
<label for="hora">
    <i data-lucide="clock"></i>
    Hora * (Turnos de 45 min)
</label>

<!-- Botón de envío -->
<button type="submit" id="btn-enviar">
    <i data-lucide="check-circle"></i>
    <span class="btn-text">Reservar Cita</span>
</button>
```

### En admin.html

```html
<!-- Header -->
<h1>
    <i data-lucide="bar-chart-2"></i>
    Panel de Administración
</h1>

<!-- Botones de acción -->
<button id="btn-refresh" class="btn-secondary">
    <i data-lucide="refresh-cw"></i>
    Actualizar
</button>

<button id="btn-logout" class="btn-secondary">
    <i data-lucide="log-out"></i>
    Cerrar Sesión
</button>

<!-- Estadísticas -->
<div class="stat-card">
    <div class="stat-icon">
        <i data-lucide="calendar"></i>
    </div>
    <div class="stat-info">
        <div class="stat-value" id="stat-total">0</div>
        <div class="stat-label">Total de Citas</div>
    </div>
</div>
```

## Personalizar tamaño y color

### Por CSS

```css
[data-lucide] {
    width: 24px;
    height: 24px;
    color: #2563EB; /* Tu color principal */
    stroke-width: 2;
}

/* Tamaño grande */
.icon-lg {
    width: 32px;
    height: 32px;
}

/* Tamaño pequeño */
.icon-sm {
    width: 16px;
    height: 16px;
}
```

### En HTML

```html
<style>
    .btn-text {
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }
    
    .btn-text i {
        width: 20px;
        height: 20px;
    }
</style>

<!-- Uso -->
<button>
    <span class="btn-text">
        <i data-lucide="plus"></i>
        Nuevo
    </span>
</button>
```

## Lista completa de iconos disponibles

Puedes ver todos los iconos en: https://lucide.dev

Algunos iconos populares:
- `home`, `settings`, `search`, `menu`, `x` (cerrar)
- `alert-circle`, `info`, `help-circle`
- `user`, `users`, `user-check`
- `mail`, `message-square`, `phone`
- `download`, `upload`, `external-link`
- `play`, `pause`, `stop`, `rewind`
- `save`, `copy`, `share-2`

## Tips

1. **Animaciones**: Puedes agregar animaciones CSS a los iconos
   ```css
   [data-lucide="refresh-cw"] {
       animation: spin 1s linear infinite;
   }
   
   @keyframes spin {
       to { transform: rotate(360deg); }
   }
   ```

2. **Iconos en botones**: Alinea con flexbox
   ```html
   <button style="display: flex; align-items: center; gap: 8px;">
       <i data-lucide="save"></i>
       Guardar
   </button>
   ```

3. **Accessibility**: Agrega `aria-label` para descripción
   ```html
   <i data-lucide="trash-2" aria-label="Eliminar cita"></i>
   ```

## Soporte técnico

Si los iconos no aparecen:
1. Verifica que la línea `<script src="https://cdn.jsdelivr.net/npm/lucide@latest"></script>` esté en el `<head>`
2. Asegúrate de que `lucide.createIcons()` se llama en JavaScript después de cargar el DOM
3. Usa nombres de icono válidos (en minúsculas, con guiones)

---

**Nota**: Los cambios de color en los iconos ya están implementados en tu paleta nueva. Los iconos usarán automáticamente el color `--azul-principal: #2563EB` 🚀
