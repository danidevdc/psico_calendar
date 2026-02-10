// ========================================
// CONFIGURACIÓN - REEMPLAZAR CON TU URL
// ========================================
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxamQJGN4pb_4apwlMb9uPorezns5g9Qgm4fpBPiRsO9EphxzyMsCuzTPUMUoNxV0gmnw/exec';

// ========================================
// VARIABLES GLOBALES
// ========================================
let horariosOcupados = [];
let mesActual = new Date().getMonth();
let anioActual = new Date().getFullYear();
let fechaSeleccionada = null;

// Días feriados: Array de fechas en formato YYYY-MM-DD que se pueden configurar desde admin
let diasFeriados = [
    // Ejemplos (puedes personalizar):
    // '2025-01-01', // Año Nuevo
    // '2025-02-20', // Carnaval
    // '2025-03-21', // Equinoccio
];

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Cargar días feriados desde localStorage
    const feriados = localStorage.getItem('diasFeriados');
    if (feriados) {
        try {
            diasFeriados = JSON.parse(feriados);
        } catch (e) {
            console.error('Error al cargar feriados:', e);
        }
    }

    cargarHorariosOcupados();
    configurarEventos();
    renderizarCalendario();
    
    // Inicializar iconos de Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// ========================================
// CONFIGURAR EVENTOS
// ========================================
function configurarEventos() {
    const form = document.getElementById('form-cita');
    const horaSelect = document.getElementById('hora');
    const whatsappInput = document.getElementById('whatsapp');
    const btnMesAnterior = document.getElementById('btn-mes-anterior');
    const btnMesSiguiente = document.getElementById('btn-mes-siguiente');

    // Evento de envío del formulario
    form.addEventListener('submit', manejarEnvioFormulario);

    // Validar hora al cambiar
    horaSelect.addEventListener('change', validarHora);

    // Validar WhatsApp (solo números, 8 dígitos)
    whatsappInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 8);
    });

    // Navegación del calendario
    btnMesAnterior.addEventListener('click', () => {
        mesActual--;
        if (mesActual < 0) {
            mesActual = 11;
            anioActual--;
        }
        renderizarCalendario();
    });

    btnMesSiguiente.addEventListener('click', () => {
        mesActual++;
        if (mesActual > 11) {
            mesActual = 0;
            anioActual++;
        }
        renderizarCalendario();
    });
}

// ========================================
// RENDERIZAR CALENDARIO
// ========================================
function renderizarCalendario() {
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Actualizar título
    document.getElementById('mes-anio-actual').textContent = `${meses[mesActual]} ${anioActual}`;

    // Obtener primer día del mes y total de días
    const primerDia = new Date(anioActual, mesActual, 1).getDay();
    const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();

    // Limpiar días anteriores
    const diasGrid = document.getElementById('calendario-dias');
    diasGrid.innerHTML = '';

    // Fecha de hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Agregar espacios vacíos
    for (let i = 0; i < primerDia; i++) {
        const diaVacio = document.createElement('div');
        diaVacio.className = 'calendario-dia-vacio';
        diasGrid.appendChild(diaVacio);
    }

    // Fecha límite: 12 de diciembre de 2025
    const fechaLimite = new Date(2025, 11, 12); // Mes 11 = diciembre (0-indexed)
    fechaLimite.setHours(23, 59, 59, 999);

    // Agregar días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
        const diaElemento = document.createElement('div');
        diaElemento.className = 'calendario-dia-item';
        diaElemento.textContent = dia;

        const fechaDia = new Date(anioActual, mesActual, dia);
        fechaDia.setHours(0, 0, 0, 0);

        const diaSemana = fechaDia.getDay(); // 0 = Domingo, 6 = Sábado

        // Convertir fecha a string para comparación de feriados
        const fechaStr = fechaDia.toISOString().split('T')[0]; // YYYY-MM-DD
        const esFeriado = diasFeriados.includes(fechaStr);

        // Verificar tipo de día
        const esPasado = fechaDia < hoy;
        const esFinDeSemana = diaSemana === 0 || diaSemana === 6;
        const despuesDeLimite = fechaDia > fechaLimite;

        // Marcar día de hoy primero
        const esHoy = fechaDia.getTime() === hoy.getTime();
        if (esHoy) {
            diaElemento.classList.add('dia-hoy');
        }

        // LÓGICA CORRECTA:
        if (esPasado) {
            // DÍAS PASADOS - siempre grises, no clickeables
            diaElemento.classList.add('dia-pasado');
        } else if (esFeriado) {
            // FERIADOS - dorados, no clickeables
            diaElemento.classList.add('dia-feriado');
            if (esHoy) {
                diaElemento.classList.add('hoy');
            }
        } else if (despuesDeLimite) {
            // DESPUÉS DEL LÍMITE DE RESERVA - grises, no clickeables
            diaElemento.classList.add('dia-pasado');
        } else if (esFinDeSemana) {
            // SÁBADOS Y DOMINGOS FUTUROS - azules, NO clickeables
            diaElemento.classList.add('fin-de-semana');
        } else {
            // DÍAS NORMALES DISPONIBLES (Lunes-Viernes, futuros, no feriado) - CLICKEABLES
            diaElemento.classList.add('disponible');
            diaElemento.addEventListener('click', () => seleccionarFecha(dia));

            // Marcar día seleccionado
            if (fechaSeleccionada &&
                fechaSeleccionada.getDate() === dia &&
                fechaSeleccionada.getMonth() === mesActual &&
                fechaSeleccionada.getFullYear() === anioActual) {
                diaElemento.classList.add('dia-seleccionado');
            }
        }

        diasGrid.appendChild(diaElemento);
    }
}

// ========================================
// SELECCIONAR FECHA
// ========================================
function seleccionarFecha(dia) {
    fechaSeleccionada = new Date(anioActual, mesActual, dia);

    // Validar que no sea fin de semana
    const diaSemana = fechaSeleccionada.getDay();
    if (diaSemana === 0 || diaSemana === 6) {
        mostrarMensaje('No se pueden reservar citas en fines de semana (sábados y domingos)', 'error');
        fechaSeleccionada = null;
        return;
    }

    // Validar que no sea después del 12 de diciembre 2025
    const fechaLimite = new Date(2025, 11, 12, 23, 59, 59);
    if (fechaSeleccionada > fechaLimite) {
        mostrarMensaje('No se pueden reservar citas después del 12 de diciembre de 2025', 'error');
        fechaSeleccionada = null;
        return;
    }

    // Formatear fecha DD/MM/AAAA
    const diaStr = String(dia).padStart(2, '0');
    const mesStr = String(mesActual + 1).padStart(2, '0');
    const fechaFormateada = `${diaStr}/${mesStr}/${anioActual}`;

    // Actualizar campo oculto
    document.getElementById('fecha').value = fechaFormateada;

    // Mostrar fecha seleccionada
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    const nombreDia = dias[fechaSeleccionada.getDay()];
    const nombreMes = meses[mesActual];

    document.getElementById('fecha-seleccionada').innerHTML =
        `<strong>Fecha seleccionada:</strong> ${nombreDia}, ${dia} de ${nombreMes} de ${anioActual}`;

    // Re-renderizar calendario para mostrar selección
    renderizarCalendario();

    // Validar hora si ya está seleccionada
    validarHora();
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

    // 📊 Solo mostrar estadísticas generales (sin datos personales)
    console.log('📊 Horarios ocupados cargados:', citas.length);

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
    const mes = parseInt(partes[1], 10) - 1;
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
    // Si la hora viene como objeto Date o string ISO, convertir primero
    let horaStr = hora;

    if (!hora) {
        console.error('Hora inválida: valor vacío');
        return hora;
    }

    // Si viene en formato ISO (1899-12-30T16:37:36.000Z), extraer solo HH:MM
    if (typeof hora === 'string' && hora.includes('T')) {
        try {
            const fecha = new Date(hora);
            const h = fecha.getUTCHours();
            const m = fecha.getUTCMinutes();
            horaStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            console.log(`🔄 Hora convertida de ISO: ${hora} → ${horaStr}`);
        } catch (e) {
            console.error('Error al parsear hora ISO:', hora, e);
            return hora;
        }
    }

    // Validar que tenga formato HH:MM
    if (typeof horaStr !== 'string' || !horaStr.includes(':')) {
        console.error('Hora inválida:', hora);
        return hora;
    }

    const [h, m] = horaStr.split(':');
    const horaNum = parseInt(h, 10);
    const minNum = parseInt(m, 10);

    // Validar que los valores sean números válidos
    if (isNaN(horaNum) || isNaN(minNum)) {
        console.error('Formato de hora inválido:', horaStr);
        return horaStr;
    }

    // Formatear minutos con dos dígitos
    const minutos = minNum.toString().padStart(2, '0');

    if (horaNum < 12) {
        // AM (incluye 00:00 hasta 11:59)
        const horaFormateada = horaNum === 0 ? 12 : horaNum;
        return `${horaFormateada.toString().padStart(2, '0')}:${minutos} AM`;
    } else if (horaNum === 12) {
        // 12 PM
        return `12:${minutos} PM`;
    } else {
        // PM (13:00 en adelante)
        const horaPM = horaNum - 12;
        return `${horaPM.toString().padStart(2, '0')}:${minutos} PM`;
    }
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
        carrera: document.getElementById('carrera').value,
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
                `¡Cita reservada exitosamente! Recibirás un WhatsApp de confirmación al ${formData.whatsapp} y un recordatorio 30 minutos antes.`,
                'exito'
            );
            document.getElementById('form-cita').reset();
            fechaSeleccionada = null;
            document.getElementById('fecha-seleccionada').innerHTML = '';
            renderizarCalendario();
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
    const carrera = document.getElementById('carrera').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    // Validar campos obligatorios
    if (!nombre || !whatsapp || !carrera || !fecha || !hora) {
        mostrarMensaje('Por favor, completa todos los campos obligatorios', 'error');
        return false;
    }

    // Validar WhatsApp (8 dígitos)
    if (whatsapp.length !== 8) {
        mostrarMensaje('El número de WhatsApp debe tener exactamente 8 dígitos', 'error');
        return false;
    }

    // Validar fecha seleccionada
    if (!fechaSeleccionada) {
        mostrarMensaje('Por favor, selecciona una fecha en el calendario', 'error');
        return false;
    }

    // Validar que la fecha no sea pasada
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

    // Ocultar después de 7 segundos
    setTimeout(() => {
        mensajeDiv.classList.remove('show');
    }, 7000);
}
