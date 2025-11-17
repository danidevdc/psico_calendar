// ========================================
// CONFIGURACIÓN - REEMPLAZAR CON TU URL
// ========================================
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby5-r-3ZLOwGDxI4QhQJ2TZ8bsfRuVpunG2_yZzmK3PCnBdztXrI70650vQP1cjmg2gNA/exec';

// ========================================
// VARIABLES GLOBALES
// ========================================
let horariosOcupados = [];

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    cargarHorariosOcupados();
    configurarEventos();
});

// ========================================
// CONFIGURAR EVENTOS
// ========================================
function configurarEventos() {
    const form = document.getElementById('form-cita');
    const fechaInput = document.getElementById('fecha');
    const horaSelect = document.getElementById('hora');
    const whatsappInput = document.getElementById('whatsapp');

    // Evento de envío del formulario
    form.addEventListener('submit', manejarEnvioFormulario);

    // Formatear fecha automáticamente
    fechaInput.addEventListener('input', formatearFecha);

    // Validar fecha al cambiar
    fechaInput.addEventListener('blur', validarFecha);

    // Validar hora al cambiar
    horaSelect.addEventListener('change', validarHora);

    // Validar WhatsApp (solo números, 8 dígitos)
    whatsappInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 8);
    });
}

// ========================================
// FORMATEAR FECHA DD/MM/AAAA
// ========================================
function formatearFecha(e) {
    let valor = e.target.value.replace(/[^0-9]/g, '');

    if (valor.length >= 2) {
        valor = valor.substring(0, 2) + '/' + valor.substring(2);
    }
    if (valor.length >= 5) {
        valor = valor.substring(0, 5) + '/' + valor.substring(5);
    }

    e.target.value = valor.substring(0, 10);
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

        mostrarCalendarioHorarios(horariosOcupados);

    } catch (error) {
        console.error('Error:', error);
        containerDiv.innerHTML = '<p class="error">Error al cargar los horarios. Por favor, recarga la página.</p>';
        containerDiv.classList.add('show');
    } finally {
        loadingDiv.style.display = 'none';
    }
}

// ========================================
// MOSTRAR CALENDARIO CON HORARIOS
// ========================================
function mostrarCalendarioHorarios(citas) {
    const container = document.getElementById('horarios-container');

    if (!citas || citas.length === 0) {
        container.innerHTML = '<p class="no-horarios">✓ No hay horarios ocupados. ¡Todos los horarios disponibles!</p>';
        container.classList.add('show');
        return;
    }

    // Agrupar citas por fecha
    const citasPorFecha = {};
    citas.forEach(cita => {
        if (!citasPorFecha[cita.fecha]) {
            citasPorFecha[cita.fecha] = [];
        }
        citasPorFecha[cita.fecha].push(cita.hora);
    });

    // Ordenar fechas
    const fechasOrdenadas = Object.keys(citasPorFecha).sort((a, b) => {
        return parsearFecha(a) - parsearFecha(b);
    });

    // Crear calendario visual
    let html = '<div class="calendario-grid">';

    fechasOrdenadas.forEach(fecha => {
        const horas = citasPorFecha[fecha].sort();
        const fechaObj = parsearFecha(fecha);
        const nombreDia = obtenerNombreDia(fechaObj);

        html += `
            <div class="calendario-dia">
                <div class="calendario-fecha">
                    <div class="dia-nombre">${nombreDia}</div>
                    <div class="fecha-completa">${fecha}</div>
                </div>
                <div class="calendario-horas">
                    ${horas.map(hora => `
                        <div class="hora-ocupada">
                            🕐 ${formatearHora(hora)}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    html += '</div>';

    container.innerHTML = html;
    container.classList.add('show');
}

// ========================================
// PARSEAR FECHA DD/MM/AAAA
// ========================================
function parsearFecha(fechaStr) {
    const partes = fechaStr.split('/');
    if (partes.length !== 3) return null;

    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // Meses en JS van de 0-11
    const año = parseInt(partes[2], 10);

    return new Date(año, mes, dia);
}

// ========================================
// OBTENER NOMBRE DEL DÍA
// ========================================
function obtenerNombreDia(fecha) {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[fecha.getDay()];
}

// ========================================
// FORMATEAR HORA
// ========================================
function formatearHora(hora) {
    const [h, m] = hora.split(':');
    const horaNum = parseInt(h, 10);

    if (horaNum < 12) {
        return `${hora} AM`;
    } else if (horaNum === 12) {
        return `${hora} PM`;
    } else {
        return `${horaNum - 12}:${m} PM`;
    }
}

// ========================================
// VALIDAR FECHA
// ========================================
function validarFecha(e) {
    const fechaStr = e.target.value;

    // Validar formato DD/MM/AAAA
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = fechaStr.match(regex);

    if (!match) {
        mostrarMensaje('Formato de fecha inválido. Use DD/MM/AAAA', 'error');
        e.target.value = '';
        return false;
    }

    const dia = parseInt(match[1], 10);
    const mes = parseInt(match[2], 10);
    const año = parseInt(match[3], 10);

    // Validar rangos
    if (mes < 1 || mes > 12) {
        mostrarMensaje('Mes inválido (debe ser entre 01 y 12)', 'error');
        e.target.value = '';
        return false;
    }

    if (dia < 1 || dia > 31) {
        mostrarMensaje('Día inválido (debe ser entre 01 y 31)', 'error');
        e.target.value = '';
        return false;
    }

    // Crear fecha y validar
    const fechaSeleccionada = new Date(año, mes - 1, dia);

    // Verificar que la fecha sea válida (por ejemplo, 31/02 no es válido)
    if (fechaSeleccionada.getDate() !== dia ||
        fechaSeleccionada.getMonth() !== (mes - 1) ||
        fechaSeleccionada.getFullYear() !== año) {
        mostrarMensaje('Fecha inválida', 'error');
        e.target.value = '';
        return false;
    }

    // Verificar que no sea una fecha pasada
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
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        comentarios: document.getElementById('comentarios').value.trim()
    };

    try {
        // Enviar a Google Apps Script
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // Esperar un momento para que se procese
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
        } else {
            // Verificar si el horario quedó ocupado
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
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    // Validar campos obligatorios
    if (!nombre || !whatsapp || !fecha || !hora) {
        mostrarMensaje('Por favor, completa todos los campos obligatorios', 'error');
        return false;
    }

    // Validar WhatsApp (8 dígitos)
    if (whatsapp.length !== 8) {
        mostrarMensaje('El número de WhatsApp debe tener exactamente 8 dígitos', 'error');
        return false;
    }

    // Validar formato de fecha
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = fecha.match(regex);

    if (!match) {
        mostrarMensaje('Formato de fecha inválido. Use DD/MM/AAAA', 'error');
        return false;
    }

    const dia = parseInt(match[1], 10);
    const mes = parseInt(match[2], 10);
    const año = parseInt(match[3], 10);

    // Validar fecha
    const fechaSeleccionada = new Date(año, mes - 1, dia);
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
