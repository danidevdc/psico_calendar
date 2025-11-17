// ========================================
// GOOGLE APPS SCRIPT - BACKEND
// ========================================
// Este código debe copiarse en Google Apps Script
// y desplegarse como Web App

// ========================================
// CONFIGURACIÓN
// ========================================
const NOMBRE_HOJA = 'Citas';

// ========================================
// FUNCIÓN PRINCIPAL - doGet
// ========================================
// Maneja las peticiones GET (obtener citas)
function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === 'getCitas') {
      return obtenerCitas();
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        mensaje: 'Acción no válida'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        mensaje: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ========================================
// FUNCIÓN PRINCIPAL - doPost
// ========================================
// Maneja las peticiones POST (crear nueva cita)
function doPost(e) {
  try {
    // Parsear los datos recibidos
    const datos = JSON.parse(e.postData.contents);

    // Validar datos
    if (!validarDatos(datos)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'error',
          mensaje: 'Datos incompletos'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Verificar si el horario está ocupado
    if (horarioOcupado(datos.fecha, datos.hora)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'horario-ocupado',
          mensaje: 'Este horario ya está reservado'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Guardar la cita
    guardarCita(datos);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'reserva-exitosa',
        mensaje: 'Cita reservada correctamente'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        mensaje: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ========================================
// OBTENER TODAS LAS CITAS
// ========================================
function obtenerCitas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(NOMBRE_HOJA);

  // Si la hoja no existe, crearla
  if (!hoja) {
    hoja = crearHojaCitas(ss);
  }

  const datos = hoja.getDataRange().getValues();

  // Si solo existe el encabezado o está vacía
  if (datos.length <= 1) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        citas: []
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Convertir datos a objetos
  const citas = [];
  for (let i = 1; i < datos.length; i++) {
    citas.push({
      timestamp: datos[i][0],
      nombre: datos[i][1],
      whatsapp: datos[i][2],
      fecha: datos[i][3],
      hora: datos[i][4],
      comentarios: datos[i][5]
    });
  }

  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      citas: citas
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========================================
// VALIDAR DATOS
// ========================================
function validarDatos(datos) {
  return datos.nombre &&
         datos.whatsapp &&
         datos.fecha &&
         datos.hora;
}

// ========================================
// VERIFICAR SI HORARIO ESTÁ OCUPADO
// ========================================
function horarioOcupado(fecha, hora) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(NOMBRE_HOJA);

  // Si la hoja no existe, el horario está libre
  if (!hoja) {
    return false;
  }

  const datos = hoja.getDataRange().getValues();

  // Buscar en todas las filas (excepto encabezado)
  for (let i = 1; i < datos.length; i++) {
    const fechaExistente = datos[i][3];
    const horaExistente = datos[i][4];

    if (fechaExistente === fecha && horaExistente === hora) {
      return true; // Horario ocupado
    }
  }

  return false; // Horario libre
}

// ========================================
// GUARDAR CITA
// ========================================
function guardarCita(datos) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(NOMBRE_HOJA);

  // Si la hoja no existe, crearla
  if (!hoja) {
    hoja = crearHojaCitas(ss);
  }

  // Preparar fila de datos
  const timestamp = new Date();
  const fila = [
    timestamp,
    datos.nombre,
    datos.whatsapp,
    datos.fecha,
    datos.hora,
    datos.comentarios || ''
  ];

  // Agregar fila al final
  hoja.appendRow(fila);

  // Opcional: Enviar confirmación por email
  // enviarEmailConfirmacion(datos);
}

// ========================================
// CREAR HOJA DE CITAS
// ========================================
function crearHojaCitas(ss) {
  const hoja = ss.insertSheet(NOMBRE_HOJA);

  // Crear encabezados
  const encabezados = [
    'Timestamp',
    'Nombre',
    'WhatsApp',
    'Fecha',
    'Hora',
    'Comentarios'
  ];

  hoja.appendRow(encabezados);

  // Formatear encabezados
  const rangoEncabezado = hoja.getRange(1, 1, 1, encabezados.length);
  rangoEncabezado.setFontWeight('bold');
  rangoEncabezado.setBackground('#667eea');
  rangoEncabezado.setFontColor('#ffffff');

  // Ajustar ancho de columnas
  hoja.setColumnWidth(1, 150); // Timestamp
  hoja.setColumnWidth(2, 200); // Nombre
  hoja.setColumnWidth(3, 100); // WhatsApp
  hoja.setColumnWidth(4, 120); // Fecha
  hoja.setColumnWidth(5, 80);  // Hora
  hoja.setColumnWidth(6, 300); // Comentarios

  // Congelar primera fila
  hoja.setFrozenRows(1);

  return hoja;
}

// ========================================
// FUNCIÓN OPCIONAL: ENVIAR EMAIL
// ========================================
// Descomenta y personaliza si quieres enviar confirmaciones por email
/*
function enviarEmailConfirmacion(datos) {
  const asunto = 'Confirmación de Cita';
  const destinatario = 'tu-email@ejemplo.com'; // Tu email

  const mensaje = `
    Nueva cita reservada:

    Nombre: ${datos.nombre}
    WhatsApp: ${datos.whatsapp}
    Fecha: ${datos.fecha}
    Hora: ${datos.hora}
    Comentarios: ${datos.comentarios || 'Sin comentarios'}

    ---
    Sistema de Reservas de Citas
  `;

  MailApp.sendEmail(destinatario, asunto, mensaje);
}
*/

// ========================================
// FUNCIÓN DE PRUEBA
// ========================================
// Ejecuta esta función para verificar que todo funciona
function pruebaCrearCita() {
  const datosTest = {
    nombre: 'Juan Pérez',
    whatsapp: '71234567',
    fecha: '20/11/2024',
    hora: '10:00',
    comentarios: 'Prueba del sistema'
  };

  guardarCita(datosTest);
  Logger.log('Cita de prueba creada correctamente');
}
