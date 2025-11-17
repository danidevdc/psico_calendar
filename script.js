// ========================================
// CONFIGURACIÓN - REEMPLAZAR CON TU URL
// ========================================
const APPS_SCRIPT_URL = 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI';
// Ejemplo: https://script.google.com/macros/s/AKfycby.../exec

// ========================================
// VARIABLES GLOBALES
// ========================================
let horariosOcupados = [];

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    inicializarFecha();
    cargarHorariosOcupados();
    configurarEventos();
});

// ========================================
// CONFIGURAR EVENTOS
// ========================================
function configurarEventos() {
    const form = document.getElementById('form-cita');
    const fechaInput = document.getElementById('fecha');
    const horaInput = document.getElementById('hora');
    const whatsappInput = document.getElementById('whatsapp');

    // Evento de envío del formulario
    form.addEventListener('submit', manejarEnvioFormulario);

    // Validar fecha al cambiar
    fechaInput.addEventListener('change', validarFecha);

    // Validar hora al cambiar
    horaInput.addEventListener('change', validarHora);

    // Validar WhatsApp (solo números)
    whatsappInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
}

// ========================================
// INICIALIZAR FECHA MÍNIMA
// ========================================
function inicializarFecha() {
    const fechaInput = document.getElementById('fecha');
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    fechaInput.min = `${año}-${mes}-${dia}`;
}

// ========================================
// CARGAR HORARIOS OCUPADOS
// ========================================
async function cargarHorariosOcupados() {
    const loadingDiv = document.getElementById('loading-horarios');
    const containerDiv = document.getElementById('horarios-container');

    try {
        loadingDiv.style.display = 'block';
        containerDiv.classList.remove('show');

        const response = await fetch(`${APPS_SCRIPT_URL}?action=getCitas`);

        if (!response.ok) {
            throw new Error('Error al cargar horarios');
        }

        const data = await response.json();
        horariosOcupados = data.citas || [];

        mostrarHorariosOcupados(horariosOcupados);

    } catch (error) {
        console.error('Error:', error);
        containerDiv.innerHTML = '<p class="error">Error al cargar los horarios. Por favor, recarga la página.</p>';
        containerDiv.classList.add('show');
    } finally {
        loadingDiv.style.display = 'none';
    }
}

// ========================================
// MOSTRAR HORARIOS EN TABLA
// ========================================
function mostrarHorariosOcupados(citas) {
    const container = document.getElementById('horarios-container');

    if (!citas || citas.length === 0) {
        container.innerHTML = '<p class="no-horarios">✓ No hay horarios ocupados aún. ¡Todos los horarios disponibles!</p>';
        container.classList.add('show');
        return;
    }

    // Ordenar por fecha y hora
    citas.sort((a, b) => {
        const fechaA = new Date(a.fecha + ' ' + a.hora);
        const fechaB = new Date(b.fecha + ' ' + b.hora);
        return fechaA - fechaB;
    });

    // Crear tabla
    let html = `
        <table class="horarios-table">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Servicio</th>
                </tr>
            </thead>
            <tbody>
    `;

    citas.forEach(cita => {
        const fecha = formatearFecha(cita.fecha);
        html += `
            <tr>
                <td>${fecha}</td>
                <td>${cita.hora}</td>
                <td>${cita.servicio}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
    container.classList.add('show');
}

// ========================================
// FORMATEAR FECHA
// ========================================
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr + 'T00:00:00');
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
}

// ========================================
// VALIDAR FECHA
// ========================================
function validarFecha(e) {
    const fechaSeleccionada = new Date(e.target.value + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
        mostrarMensaje('No puedes seleccionar una fecha pasada', 'error');
        e.target.value = '';
        return false;
    }

    return true;
}

// ========================================
// VALIDAR HORA
// ========================================
function validarHora() {
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    if (!fecha || !hora) return true;

    // Verificar si el horario está ocupado
    const ocupado = horariosOcupados.some(cita =>
        cita.fecha === fecha && cita.hora === hora
    );

    if (ocupado) {
        mostrarMensaje('Este horario ya está ocupado. Por favor, selecciona otro.', 'error');
        document.getElementById('hora').value = '';
        return false;
    }

    return true;
}

// ========================================
// MANEJAR ENVÍO DEL FORMULARIO
// ========================================
async function manejarEnvioFormulario(e) {
    e.preventDefault();

    // Validaciones finales
    if (!validarFormulario()) {
        return;
    }

    const btnEnviar = document.getElementById('btn-enviar');
    const btnText = btnEnviar.querySelector('.btn-text');
    const btnLoader = btnEnviar.querySelector('.btn-loader');

    // Deshabilitar botón
    btnEnviar.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';

    // Recopilar datos
    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        whatsapp: document.getElementById('whatsapp').value.trim(),
        servicio: document.getElementById('servicio').value,
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        comentarios: document.getElementById('comentarios').value.trim()
    };

    try {
        // Enviar a Google Apps Script
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Importante para Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // Debido a no-cors, no podemos leer la respuesta directamente
        // Esperamos un momento y luego recargamos los horarios
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Recargar horarios para verificar
        await cargarHorariosOcupados();

        // Verificar si la cita se guardó
        const citaGuardada = horariosOcupados.some(cita =>
            cita.fecha === formData.fecha &&
            cita.hora === formData.hora &&
            cita.nombre === formData.nombre
        );

        if (citaGuardada) {
            mostrarMensaje(
                `¡Cita reservada exitosamente! Te contactaremos al ${formData.whatsapp}`,
                'exito'
            );
            document.getElementById('form-cita').reset();
            inicializarFecha();
        } else {
            // Verificar si el horario quedó ocupado por otro usuario
            const horarioOcupado = horariosOcupados.some(cita =>
                cita.fecha === formData.fecha && cita.hora === formData.hora
            );

            if (horarioOcupado) {
                mostrarMensaje(
                    'Lo sentimos, este horario acaba de ser reservado. Por favor, selecciona otro horario.',
                    'error'
                );
            } else {
                mostrarMensaje(
                    'Cita procesada. Si no aparece en la lista, por favor verifica tu conexión.',
                    'info'
                );
            }
        }

    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje(
            'Error al procesar la reserva. Por favor, intenta nuevamente.',
            'error'
        );
    } finally {
        // Rehabilitar botón
        btnEnviar.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
    }
}

// ========================================
// VALIDAR FORMULARIO COMPLETO
// ========================================
function validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const servicio = document.getElementById('servicio').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    // Validar campos obligatorios
    if (!nombre || !whatsapp || !servicio || !fecha || !hora) {
        mostrarMensaje('Por favor, completa todos los campos obligatorios', 'error');
        return false;
    }

    // Validar WhatsApp
    if (whatsapp.length < 10 || whatsapp.length > 15) {
        mostrarMensaje('El número de WhatsApp debe tener entre 10 y 15 dígitos', 'error');
        return false;
    }

    // Validar fecha
    const fechaSeleccionada = new Date(fecha + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
        mostrarMensaje('No puedes seleccionar una fecha pasada', 'error');
        return false;
    }

    // Validar hora ocupada
    const horarioOcupado = horariosOcupados.some(cita =>
        cita.fecha === fecha && cita.hora === hora
    );

    if (horarioOcupado) {
        mostrarMensaje('Este horario ya está ocupado. Por favor, selecciona otro.', 'error');
        return false;
    }

    return true;
}

// ========================================
// MOSTRAR MENSAJES
// ========================================
function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje');

    mensajeDiv.className = 'mensaje show ' + tipo;
    mensajeDiv.textContent = texto;

    // Scroll al mensaje
    mensajeDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Ocultar después de 5 segundos
    setTimeout(() => {
        mensajeDiv.classList.remove('show');
    }, 5000);
}
