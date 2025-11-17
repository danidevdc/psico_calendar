// ========================================
// GOOGLE APPS SCRIPT - BACKEND CON WHATSAPP
// ========================================

// ========================================
// CONFIGURACIÓN
// ========================================
const NOMBRE_HOJA = 'Citas';

// CONFIGURACIÓN DE WHATSAPP - CallMeBot (GRATIS)
// Obtén tu API Key en: https://www.callmebot.com/blog/free-api-whatsapp-messages/
const WHATSAPP_API_KEY = 'TU_API_KEY_AQUI'; // Reemplazar con tu API Key
const USAR_CALLMEBOT = true; // true = CallMeBot (gratis), false = Twilio (pago)

// CONFIGURACIÓN ALTERNATIVA - Twilio (MÁS PROFESIONAL)
const TWILIO_ACCOUNT_SID = 'TU_ACCOUNT_SID';
const TWILIO_AUTH_TOKEN = 'TU_AUTH_TOKEN';
const TWILIO_WHATSAPP_FROM = 'whatsapp:+14155238886'; // Número de Twilio

// ========================================
// FUNCIÓN PRINCIPAL - doGet
// ========================================
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
function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);

    if (!validarDatos(datos)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'error',
          mensaje: 'Datos incompletos'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (horarioOcupado(datos.fecha, datos.hora)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'horario-ocupado',
          mensaje: 'Este horario ya está reservado'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Guardar la cita
    const fila = guardarCita(datos);

    // Enviar confirmación por WhatsApp
    enviarWhatsAppConfirmacion(datos);

    // Programar recordatorio 30 minutos antes
    programarRecordatorio(datos, fila);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'reserva-exitosa',
        mensaje: 'Cita reservada correctamente'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error en doPost: ' + error.toString());
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

  if (!hoja) {
    hoja = crearHojaCitas(ss);
  }

  const datos = hoja.getDataRange().getValues();

  if (datos.length <= 1) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        citas: []
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const citas = [];
  for (let i = 1; i < datos.length; i++) {
    citas.push({
      timestamp: datos[i][0],
      nombre: datos[i][1],
      whatsapp: datos[i][2],
      carrera: datos[i][3],
      fecha: datos[i][4],
      hora: datos[i][5],
      comentarios: datos[i][6]
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
         datos.carrera &&
         datos.fecha &&
         datos.hora;
}

// ========================================
// VERIFICAR SI HORARIO ESTÁ OCUPADO
// ========================================
function horarioOcupado(fecha, hora) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(NOMBRE_HOJA);

  if (!hoja) {
    return false;
  }

  const datos = hoja.getDataRange().getValues();

  for (let i = 1; i < datos.length; i++) {
    if (datos[i][4] === fecha && datos[i][5] === hora) {
      return true;
    }
  }

  return false;
}

// ========================================
// GUARDAR CITA
// ========================================
function guardarCita(datos) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(NOMBRE_HOJA);

  if (!hoja) {
    hoja = crearHojaCitas(ss);
  }

  const timestamp = new Date();
  const fila = [
    timestamp,
    datos.nombre,
    datos.whatsapp,
    datos.carrera,
    datos.fecha,
    datos.hora,
    datos.comentarios || ''
  ];

  hoja.appendRow(fila);

  // Retornar número de fila para programar recordatorio
  return hoja.getLastRow();
}

// ========================================
// CREAR HOJA DE CITAS
// ========================================
function crearHojaCitas(ss) {
  const hoja = ss.insertSheet(NOMBRE_HOJA);

  const encabezados = [
    'Timestamp',
    'Nombre',
    'WhatsApp',
    'Carrera',
    'Fecha',
    'Hora',
    'Comentarios'
  ];

  hoja.appendRow(encabezados);

  const rangoEncabezado = hoja.getRange(1, 1, 1, encabezados.length);
  rangoEncabezado.setFontWeight('bold');
  rangoEncabezado.setBackground('#667eea');
  rangoEncabezado.setFontColor('#ffffff');

  hoja.setColumnWidth(1, 150);
  hoja.setColumnWidth(2, 200);
  hoja.setColumnWidth(3, 100);
  hoja.setColumnWidth(4, 120);
  hoja.setColumnWidth(5, 120);
  hoja.setColumnWidth(6, 80);
  hoja.setColumnWidth(7, 300);

  hoja.setFrozenRows(1);

  return hoja;
}

// ========================================
// ENVIAR WHATSAPP DE CONFIRMACIÓN
// ========================================
function enviarWhatsAppConfirmacion(datos) {
  const mensaje = `✅ *Cita Confirmada*

Hola ${datos.nombre},

Tu cita ha sido reservada exitosamente:

📅 Fecha: ${datos.fecha}
🕐 Hora: ${datos.hora}
🎓 Carrera: ${datos.carrera}

Recibirás un recordatorio 30 minutos antes de tu cita.

¡Te esperamos!`;

  enviarWhatsApp(datos.whatsapp, mensaje);
}

// ========================================
// ENVIAR WHATSAPP - MÉTODO PRINCIPAL
// ========================================
function enviarWhatsApp(numeroWhatsApp, mensaje) {
  try {
    if (USAR_CALLMEBOT) {
      enviarWhatsAppCallMeBot(numeroWhatsApp, mensaje);
    } else {
      enviarWhatsAppTwilio(numeroWhatsApp, mensaje);
    }
  } catch (error) {
    Logger.log('Error al enviar WhatsApp: ' + error.toString());
  }
}

// ========================================
// ENVIAR WHATSAPP CON CALLMEBOT (GRATIS)
// ========================================
function enviarWhatsAppCallMeBot(numeroWhatsApp, mensaje) {
  // CallMeBot requiere: +591 (código país Bolivia) + número sin espacios
  const numerCompleto = `+591${numeroWhatsApp}`;
  const mensajeCodificado = encodeURIComponent(mensaje);

  const url = `https://api.callmebot.com/whatsapp.php?phone=${numerCompleto}&text=${mensajeCodificado}&apikey=${WHATSAPP_API_KEY}`;

  const opciones = {
    method: 'get',
    muteHttpExceptions: true
  };

  const respuesta = UrlFetchApp.fetch(url, opciones);
  Logger.log('Respuesta CallMeBot: ' + respuesta.getContentText());
}

// ========================================
// ENVIAR WHATSAPP CON TWILIO (PROFESIONAL)
// ========================================
function enviarWhatsAppTwilio(numeroWhatsApp, mensaje) {
  const numeroCompleto = `whatsapp:+591${numeroWhatsApp}`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

  const payload = {
    From: TWILIO_WHATSAPP_FROM,
    To: numeroCompleto,
    Body: mensaje
  };

  const opciones = {
    method: 'post',
    headers: {
      'Authorization': 'Basic ' + Utilities.base64Encode(TWILIO_ACCOUNT_SID + ':' + TWILIO_AUTH_TOKEN)
    },
    payload: payload,
    muteHttpExceptions: true
  };

  const respuesta = UrlFetchApp.fetch(url, opciones);
  Logger.log('Respuesta Twilio: ' + respuesta.getContentText());
}

// ========================================
// PROGRAMAR RECORDATORIO
// ========================================
function programarRecordatorio(datos, fila) {
  try {
    // Parsear fecha y hora
    const partesFecha = datos.fecha.split('/');
    const dia = parseInt(partesFecha[0], 10);
    const mes = parseInt(partesFecha[1], 10) - 1; // Meses en JS: 0-11
    const anio = parseInt(partesFecha[2], 10);

    const partesHora = datos.hora.split(':');
    const hora = parseInt(partesHora[0], 10);
    const minutos = parseInt(partesHora[1], 10);

    // Crear fecha/hora de la cita
    const fechaCita = new Date(anio, mes, dia, hora, minutos);

    // Calcular 30 minutos antes
    const fechaRecordatorio = new Date(fechaCita.getTime() - (30 * 60 * 1000));

    // Verificar que sea en el futuro
    if (fechaRecordatorio > new Date()) {
      // Crear trigger
      ScriptApp.newTrigger('enviarRecordatorioAutomatico')
        .timeBased()
        .at(fechaRecordatorio)
        .create();

      // Guardar info del recordatorio en propiedades
      const propiedades = PropertiesService.getScriptProperties();
      const key = `recordatorio_${fechaRecordatorio.getTime()}`;

      propiedades.setProperty(key, JSON.stringify({
        nombre: datos.nombre,
        whatsapp: datos.whatsapp,
        fecha: datos.fecha,
        hora: datos.hora,
        fila: fila
      }));

      Logger.log('Recordatorio programado para: ' + fechaRecordatorio);
    }
  } catch (error) {
    Logger.log('Error al programar recordatorio: ' + error.toString());
  }
}

// ========================================
// ENVIAR RECORDATORIO AUTOMÁTICO
// ========================================
function enviarRecordatorioAutomatico(e) {
  try {
    const propiedades = PropertiesService.getScriptProperties();
    const ahora = new Date().getTime();

    // Buscar recordatorios pendientes (margen de 5 minutos)
    const allKeys = propiedades.getKeys();

    allKeys.forEach(key => {
      if (key.startsWith('recordatorio_')) {
        const tiempo = parseInt(key.replace('recordatorio_', ''));

        // Si es el momento correcto (margen de 5 minutos)
        if (Math.abs(ahora - tiempo) < 5 * 60 * 1000) {
          const datosStr = propiedades.getProperty(key);
          const datos = JSON.parse(datosStr);

          const mensaje = `⏰ *Recordatorio de Cita*

Hola ${datos.nombre},

Tienes una cita en 30 minutos:

📅 Fecha: ${datos.fecha}
🕐 Hora: ${datos.hora}

¡No olvides asistir!`;

          enviarWhatsApp(datos.whatsapp, mensaje);

          // Eliminar recordatorio ya enviado
          propiedades.deleteProperty(key);

          Logger.log('Recordatorio enviado a: ' + datos.whatsapp);
        }
      }
    });
  } catch (error) {
    Logger.log('Error en recordatorio automático: ' + error.toString());
  }
}

// ========================================
// FUNCIÓN DE PRUEBA - ENVIAR WHATSAPP
// ========================================
function pruebaEnviarWhatsApp() {
  const numeroTest = '71234567'; // Tu número de prueba

  const mensaje = `🧪 *Mensaje de Prueba*

Este es un mensaje de prueba del sistema de citas.

Si recibes este mensaje, ¡la configuración es correcta!`;

  enviarWhatsApp(numeroTest, mensaje);

  Logger.log('Mensaje de prueba enviado');
}

// ========================================
// FUNCIÓN DE PRUEBA - CREAR CITA
// ========================================
function pruebaCrearCita() {
  const datosTest = {
    nombre: 'Juan Pérez',
    whatsapp: '71234567',
    carrera: 'Psicología',
    fecha: '20/11/2024',
    hora: '10:00',
    comentarios: 'Prueba del sistema'
  };

  const fila = guardarCita(datosTest);
  enviarWhatsAppConfirmacion(datosTest);

  Logger.log('Cita de prueba creada en fila: ' + fila);
}
