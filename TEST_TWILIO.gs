// ============================================
// SCRIPT DE PRUEBA RÁPIDA PARA TWILIO
// ============================================
// Copia este código completo en Google Apps Script

// 📝 PASO 1: CONFIGURA TUS DATOS AQUÍ
const MI_NUMERO_WHATSAPP = '71234567'; // ← CAMBIA ESTO por tu número (8 dígitos)
const TWILIO_ACCOUNT_SID = 'ACxxxxxxxxxxxxxxxxxxxxx'; // ← Tu Account SID de Twilio
const TWILIO_AUTH_TOKEN = 'tu_token_aqui'; // ← Tu Auth Token de Twilio
const TWILIO_NUMERO = 'whatsapp:+14155238886'; // ← El número de WhatsApp Sandbox de Twilio

// ============================================
// 🚀 FUNCIÓN PRINCIPAL DE PRUEBA
// ============================================
function PROBAR_TWILIO_AHORA() {
  Logger.log('🔄 Iniciando prueba de Twilio...');

  // Construir número completo para Bolivia
  const numeroCompleto = `whatsapp:+591${MI_NUMERO_WHATSAPP}`;
  Logger.log(`📱 Enviando a: ${numeroCompleto}`);

  // Mensaje de prueba
  const mensaje = `🧪 PRUEBA DE TWILIO

¡Funciona! Tu configuración de Twilio es correcta.

Hora de prueba: ${new Date().toLocaleString('es-BO')}

✅ Sistema listo para enviar confirmaciones automáticas.`;

  // URL de la API de Twilio
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

  // Datos del mensaje
  const payload = {
    From: TWILIO_NUMERO,
    To: numeroCompleto,
    Body: mensaje
  };

  // Credenciales en Base64
  const credenciales = Utilities.base64Encode(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

  // Opciones de la petición
  const opciones = {
    method: 'post',
    headers: {
      'Authorization': `Basic ${credenciales}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    payload: payload,
    muteHttpExceptions: true
  };

  try {
    // Enviar mensaje
    Logger.log('📤 Enviando mensaje...');
    const respuesta = UrlFetchApp.fetch(url, opciones);
    const codigo = respuesta.getResponseCode();
    const contenido = respuesta.getContentText();

    Logger.log(`📊 Código de respuesta: ${codigo}`);
    Logger.log(`📄 Respuesta completa: ${contenido}`);

    if (codigo === 201) {
      Logger.log('✅ ¡ÉXITO! Mensaje enviado correctamente');
      Logger.log('📱 Revisa tu WhatsApp en unos segundos');

      // Parsear respuesta
      const datos = JSON.parse(contenido);
      Logger.log(`🆔 SID del mensaje: ${datos.sid}`);
      Logger.log(`📊 Estado: ${datos.status}`);

      return '✅ Mensaje enviado exitosamente. Revisa tu WhatsApp!';
    } else {
      Logger.log('❌ ERROR al enviar mensaje');

      // Intentar parsear el error
      try {
        const error = JSON.parse(contenido);
        Logger.log(`❌ Código de error: ${error.code}`);
        Logger.log(`❌ Mensaje de error: ${error.message}`);
        return `❌ Error: ${error.message}`;
      } catch (e) {
        Logger.log(`❌ Respuesta: ${contenido}`);
        return `❌ Error desconocido: ${contenido}`;
      }
    }
  } catch (error) {
    Logger.log(`❌ EXCEPCIÓN: ${error.toString()}`);
    return `❌ Error: ${error.toString()}`;
  }
}

// ============================================
// 🔍 VERIFICAR CONFIGURACIÓN
// ============================================
function VERIFICAR_CONFIGURACION() {
  Logger.log('🔍 Verificando configuración...');
  Logger.log('');

  let errores = 0;

  // Verificar número de WhatsApp
  Logger.log('1️⃣ Verificando número de WhatsApp...');
  if (MI_NUMERO_WHATSAPP === '71234567') {
    Logger.log('   ⚠️ ADVERTENCIA: Estás usando el número de ejemplo');
    Logger.log('   📝 Cámbialo por tu número real (8 dígitos)');
    errores++;
  } else if (MI_NUMERO_WHATSAPP.length !== 8) {
    Logger.log(`   ❌ ERROR: El número debe tener 8 dígitos (tienes ${MI_NUMERO_WHATSAPP.length})`);
    errores++;
  } else {
    Logger.log('   ✅ Número de WhatsApp OK: ' + MI_NUMERO_WHATSAPP);
  }

  Logger.log('');

  // Verificar Account SID
  Logger.log('2️⃣ Verificando Account SID...');
  if (TWILIO_ACCOUNT_SID === 'ACxxxxxxxxxxxxxxxxxxxxx' || !TWILIO_ACCOUNT_SID.startsWith('AC')) {
    Logger.log('   ❌ ERROR: Debes configurar tu Account SID de Twilio');
    Logger.log('   📝 Debe empezar con "AC" y tener 34 caracteres');
    errores++;
  } else {
    Logger.log('   ✅ Account SID OK: ' + TWILIO_ACCOUNT_SID.substring(0, 10) + '...');
  }

  Logger.log('');

  // Verificar Auth Token
  Logger.log('3️⃣ Verificando Auth Token...');
  if (TWILIO_AUTH_TOKEN === 'tu_token_aqui' || TWILIO_AUTH_TOKEN.length < 20) {
    Logger.log('   ❌ ERROR: Debes configurar tu Auth Token de Twilio');
    Logger.log('   📝 Es una cadena larga de 32 caracteres');
    errores++;
  } else {
    Logger.log('   ✅ Auth Token OK: ' + TWILIO_AUTH_TOKEN.substring(0, 10) + '...');
  }

  Logger.log('');

  // Verificar número de Twilio
  Logger.log('4️⃣ Verificando número de Twilio...');
  if (TWILIO_NUMERO.includes('+1415')) {
    Logger.log('   ✅ Número de Twilio OK: ' + TWILIO_NUMERO);
  } else {
    Logger.log('   ⚠️ El número de Twilio parece diferente');
    Logger.log('   📝 Verifica que sea el correcto del sandbox');
  }

  Logger.log('');
  Logger.log('═══════════════════════════════════════');

  if (errores === 0) {
    Logger.log('✅ ¡TODO CONFIGURADO CORRECTAMENTE!');
    Logger.log('🚀 Ahora ejecuta: PROBAR_TWILIO_AHORA()');
  } else {
    Logger.log(`❌ Hay ${errores} error(es) en la configuración`);
    Logger.log('📝 Corrige los errores y vuelve a verificar');
  }

  Logger.log('═══════════════════════════════════════');
}

// ============================================
// 📋 INSTRUCCIONES DE USO
// ============================================
function INSTRUCCIONES() {
  Logger.log('📋 CÓMO USAR ESTE SCRIPT:');
  Logger.log('');
  Logger.log('1️⃣ Configura tus datos en las líneas 6-9:');
  Logger.log('   - MI_NUMERO_WHATSAPP: Tu número de 8 dígitos');
  Logger.log('   - TWILIO_ACCOUNT_SID: De tu dashboard de Twilio');
  Logger.log('   - TWILIO_AUTH_TOKEN: De tu dashboard de Twilio');
  Logger.log('   - TWILIO_NUMERO: El número del sandbox de WhatsApp');
  Logger.log('');
  Logger.log('2️⃣ IMPORTANTE: Asegúrate de haber enviado el mensaje "join" al sandbox de Twilio');
  Logger.log('');
  Logger.log('3️⃣ Ejecuta primero: VERIFICAR_CONFIGURACION()');
  Logger.log('   Para comprobar que todo esté bien configurado');
  Logger.log('');
  Logger.log('4️⃣ Si todo está OK, ejecuta: PROBAR_TWILIO_AHORA()');
  Logger.log('   Deberías recibir un WhatsApp en 5-10 segundos');
  Logger.log('');
  Logger.log('5️⃣ Revisa los logs (View → Logs) para ver el resultado');
  Logger.log('');
  Logger.log('❓ Si tienes problemas, copia los logs y pide ayuda');
}
