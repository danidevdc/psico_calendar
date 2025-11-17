// ========================================
// CONFIGURACIÓN - REEMPLAZAR CON TU URL
// ========================================
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxamQJGN4pb_4apwlMb9uPorezns5g9Qgm4fpBPiRsO9EphxzyMsCuzTPUMUoNxV0gmnw/exec';

// ========================================
// CONTRASEÑA DE ADMINISTRADOR
// ========================================
// CAMBIA ESTA CONTRASEÑA A UNA SEGURA
const ADMIN_PASSWORD = 'psico2025'; // ⚠️ CAMBIAR ESTA CONTRASEÑA

// ========================================
// VARIABLES GLOBALES
// ========================================
let todasLasCitas = [];
let citasFiltradas = [];

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
    configurarEventos();
});

// ========================================
// VERIFICAR SESIÓN
// ========================================
function verificarSesion() {
    const sesionActiva = sessionStorage.getItem('admin_logged_in');

    if (sesionActiva === 'true') {
        mostrarPanel();
        cargarCitas();
    } else {
        mostrarLogin();
    }
}

// ========================================
// MOSTRAR PANTALLAS
// ========================================
function mostrarLogin() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
}

function mostrarPanel() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
}

// ========================================
// CONFIGURAR EVENTOS
// ========================================
function configurarEventos() {
    // Login
    document.getElementById('login-form').addEventListener('submit', manejarLogin);

    // Panel
    document.getElementById('btn-logout').addEventListener('click', cerrarSesion);
    document.getElementById('btn-refresh').addEventListener('click', cargarCitas);
    document.getElementById('btn-export').addEventListener('click', exportarCSV);
    document.getElementById('btn-clear-filters').addEventListener('click', limpiarFiltros);

    // Filtros
    document.getElementById('filter-fecha').addEventListener('input', aplicarFiltros);
    document.getElementById('filter-carrera').addEventListener('change', aplicarFiltros);
    document.getElementById('filter-nombre').addEventListener('input', aplicarFiltros);
}

// ========================================
// MANEJAR LOGIN
// ========================================
function manejarLogin(e) {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    const btnLogin = document.querySelector('.btn-login');
    const btnText = btnLogin.querySelector('.btn-text');
    const btnLoader = btnLogin.querySelector('.btn-loader');

    // Deshabilitar botón
    btnLogin.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    errorDiv.style.display = 'none';

    // Simular delay de autenticación
    setTimeout(() => {
        if (password === ADMIN_PASSWORD) {
            // Login exitoso
            sessionStorage.setItem('admin_logged_in', 'true');
            mostrarPanel();
            cargarCitas();
            document.getElementById('password').value = '';
        } else {
            // Login fallido
            errorDiv.textContent = '❌ Contraseña incorrecta';
            errorDiv.style.display = 'block';
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        }

        // Rehabilitar botón
        btnLogin.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
    }, 500);
}

// ========================================
// CERRAR SESIÓN
// ========================================
function cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        sessionStorage.removeItem('admin_logged_in');
        todasLasCitas = [];
        citasFiltradas = [];
        mostrarLogin();
    }
}

// ========================================
// CARGAR TODAS LAS CITAS
// ========================================
async function cargarCitas() {
    const loadingDiv = document.getElementById('loading-citas');
    const tableContainer = document.getElementById('citas-table-container');

    try {
        loadingDiv.style.display = 'block';
        tableContainer.innerHTML = '';

        const response = await fetch(`${APPS_SCRIPT_URL}?action=getCitas`);

        if (!response.ok) {
            throw new Error('Error al cargar citas');
        }

        const data = await response.json();
        todasLasCitas = data.citas || [];
        citasFiltradas = [...todasLasCitas];

        actualizarEstadisticas();
        poblarFiltroCarreras();
        mostrarTabla();

    } catch (error) {
        console.error('Error:', error);
        tableContainer.innerHTML = '<p class="error">❌ Error al cargar las citas. Por favor, recarga la página.</p>';
        mostrarMensaje('Error al cargar las citas', 'error');
    } finally {
        loadingDiv.style.display = 'none';
    }
}

// ========================================
// ACTUALIZAR ESTADÍSTICAS
// ========================================
function actualizarEstadisticas() {
    // Total de citas
    document.getElementById('stat-total').textContent = todasLasCitas.length;

    // Carreras únicas
    const carrerasUnicas = new Set(todasLasCitas.map(c => c.carrera));
    document.getElementById('stat-carreras').textContent = carrerasUnicas.size;

    // Próxima cita
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const citasFuturas = todasLasCitas
        .filter(c => {
            const fechaCita = parsearFecha(c.fecha);
            return fechaCita >= hoy;
        })
        .sort((a, b) => {
            const fechaA = parsearFecha(a.fecha);
            const fechaB = parsearFecha(b.fecha);
            return fechaA - fechaB;
        });

    if (citasFuturas.length > 0) {
        document.getElementById('stat-proxima').textContent = citasFuturas[0].fecha;
    } else {
        document.getElementById('stat-proxima').textContent = '-';
    }

    // Citas hoy
    const hoyStr = formatearFechaHoy();
    const citasHoy = todasLasCitas.filter(c => c.fecha === hoyStr).length;
    document.getElementById('stat-hoy').textContent = citasHoy;
}

// ========================================
// POBLAR FILTRO DE CARRERAS
// ========================================
function poblarFiltroCarreras() {
    const selectCarrera = document.getElementById('filter-carrera');
    const carrerasUnicas = new Set(todasLasCitas.map(c => c.carrera));

    // Limpiar opciones existentes (excepto "Todas")
    selectCarrera.innerHTML = '<option value="">Todas</option>';

    // Agregar carreras
    Array.from(carrerasUnicas).sort().forEach(carrera => {
        const option = document.createElement('option');
        option.value = carrera;
        option.textContent = carrera;
        selectCarrera.appendChild(option);
    });
}

// ========================================
// MOSTRAR TABLA DE CITAS
// ========================================
function mostrarTabla() {
    const container = document.getElementById('citas-table-container');

    if (citasFiltradas.length === 0) {
        container.innerHTML = '<p class="no-citas">📭 No hay citas que mostrar</p>';
        return;
    }

    // Ordenar por fecha y hora (más recientes primero)
    const citasOrdenadas = [...citasFiltradas].sort((a, b) => {
        const fechaA = parsearFecha(a.fecha);
        const fechaB = parsearFecha(b.fecha);

        if (fechaA.getTime() !== fechaB.getTime()) {
            return fechaB - fechaA; // Más reciente primero
        }

        // Si misma fecha, ordenar por hora
        return compararHoras(b.hora, a.hora);
    });

    let html = `
        <div class="table-responsive">
            <table class="citas-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Nombre</th>
                        <th>WhatsApp</th>
                        <th>Carrera</th>
                        <th>Comentarios</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;

    citasOrdenadas.forEach((cita, index) => {
        const esPasada = esCitaPasada(cita.fecha, cita.hora);
        const claseFila = esPasada ? 'cita-pasada' : '';

        html += `
            <tr class="${claseFila}">
                <td>${cita.fecha}</td>
                <td>${formatearHora(cita.hora)}</td>
                <td>${cita.nombre}</td>
                <td>
                    <a href="https://wa.me/591${cita.whatsapp}" target="_blank" class="whatsapp-link">
                        📱 ${cita.whatsapp}
                    </a>
                </td>
                <td>${cita.carrera}</td>
                <td class="comentarios-cell">${cita.comentarios || '-'}</td>
                <td>
                    <button
                        class="btn-delete"
                        onclick="eliminarCita('${cita.fecha}', '${cita.hora}', '${cita.nombre}')"
                        title="Eliminar cita"
                    >
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
        <div class="table-footer">
            Mostrando ${citasFiltradas.length} de ${todasLasCitas.length} citas
        </div>
    `;

    container.innerHTML = html;
}

// ========================================
// ELIMINAR CITA
// ========================================
async function eliminarCita(fecha, hora, nombre) {
    const confirmar = confirm(
        `¿Estás seguro de eliminar esta cita?\n\n` +
        `Nombre: ${nombre}\n` +
        `Fecha: ${fecha}\n` +
        `Hora: ${hora}`
    );

    if (!confirmar) return;

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'eliminarCita',
                fecha: fecha,
                hora: hora
            })
        });

        // Esperar un momento para que se procese
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Recargar citas
        await cargarCitas();

        mostrarMensaje('✅ Cita eliminada correctamente', 'exito');

    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('❌ Error al eliminar la cita', 'error');
    }
}

// ========================================
// APLICAR FILTROS
// ========================================
function aplicarFiltros() {
    const filtroFecha = document.getElementById('filter-fecha').value.trim().toLowerCase();
    const filtroCarrera = document.getElementById('filter-carrera').value;
    const filtroNombre = document.getElementById('filter-nombre').value.trim().toLowerCase();

    citasFiltradas = todasLasCitas.filter(cita => {
        const cumpleFecha = !filtroFecha || cita.fecha.toLowerCase().includes(filtroFecha);
        const cumpleCarrera = !filtroCarrera || cita.carrera === filtroCarrera;
        const cumpleNombre = !filtroNombre || cita.nombre.toLowerCase().includes(filtroNombre);

        return cumpleFecha && cumpleCarrera && cumpleNombre;
    });

    mostrarTabla();
}

// ========================================
// LIMPIAR FILTROS
// ========================================
function limpiarFiltros() {
    document.getElementById('filter-fecha').value = '';
    document.getElementById('filter-carrera').value = '';
    document.getElementById('filter-nombre').value = '';

    citasFiltradas = [...todasLasCitas];
    mostrarTabla();
}

// ========================================
// EXPORTAR A CSV
// ========================================
function exportarCSV() {
    if (citasFiltradas.length === 0) {
        mostrarMensaje('⚠️ No hay citas para exportar', 'error');
        return;
    }

    // Crear CSV
    let csv = 'Fecha,Hora,Nombre,WhatsApp,Carrera,Comentarios\n';

    citasFiltradas.forEach(cita => {
        csv += `"${cita.fecha}","${formatearHora(cita.hora)}","${cita.nombre}","${cita.whatsapp}","${cita.carrera}","${cita.comentarios || ''}"\n`;
    });

    // Descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const fechaHoy = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `citas_${fechaHoy}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    mostrarMensaje('✅ CSV exportado correctamente', 'exito');
}

// ========================================
// UTILIDADES
// ========================================

function parsearFecha(fechaStr) {
    const partes = fechaStr.split('/');
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const año = parseInt(partes[2], 10);
    return new Date(año, mes, dia);
}

function formatearFechaHoy() {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const año = hoy.getFullYear();
    return `${dia}/${mes}/${año}`;
}

function formatearHora(hora) {
    if (!hora || typeof hora !== 'string') return hora;

    // Si viene en formato ISO, convertir
    if (hora.includes('T')) {
        try {
            const fecha = new Date(hora);
            const h = fecha.getUTCHours();
            const m = fecha.getUTCMinutes();
            hora = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        } catch (e) {
            return hora;
        }
    }

    if (!hora.includes(':')) return hora;

    const [h, m] = hora.split(':');
    const horaNum = parseInt(h, 10);
    const minNum = parseInt(m, 10);

    if (isNaN(horaNum) || isNaN(minNum)) return hora;

    const minutos = minNum.toString().padStart(2, '0');

    if (horaNum < 12) {
        const horaFormateada = horaNum === 0 ? 12 : horaNum;
        return `${horaFormateada.toString().padStart(2, '0')}:${minutos} AM`;
    } else if (horaNum === 12) {
        return `12:${minutos} PM`;
    } else {
        const horaPM = horaNum - 12;
        return `${horaPM.toString().padStart(2, '0')}:${minutos} PM`;
    }
}

function compararHoras(hora1, hora2) {
    const [h1, m1] = hora1.split(':').map(n => parseInt(n, 10));
    const [h2, m2] = hora2.split(':').map(n => parseInt(n, 10));

    if (h1 !== h2) return h1 - h2;
    return m1 - m2;
}

function esCitaPasada(fecha, hora) {
    const ahora = new Date();
    const fechaCita = parsearFecha(fecha);

    const [h, m] = hora.split(':');
    fechaCita.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);

    return fechaCita < ahora;
}

function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje-admin');

    mensajeDiv.className = 'mensaje-admin show ' + tipo;
    mensajeDiv.textContent = texto;

    setTimeout(() => {
        mensajeDiv.classList.remove('show');
    }, 5000);
}
