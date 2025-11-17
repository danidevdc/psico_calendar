// ========================================
// SCRIPT DE DIAGNÓSTICO COMPLETO DE TWILIO
// ========================================

// ⚠️ IMPORTANTE: Reemplaza estos valores con tus credenciales reales
const TWILIO_ACCOUNT_SID = 'TU_ACCOUNT_SID'; // Ejemplo: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
const TWILIO_AUTH_TOKEN = 'TU_AUTH_TOKEN';   // Ejemplo: tu_token_secreto
const TWILIO_WHATSAPP_FROM = 'whatsapp:+14155238886'; // Número de Twilio Sandbox
const NUMERO_PRUEBA = '71234567'; // ⚠️ Reemplaza con tu número de WhatsApp de prueba (8 dígitos)

// ========================================
// PASO 1: VERIFICAR CONFIGURACIÓN
// ========================================
function PASO_1_VERIFICAR_CONFIGURACION() {
  Logger.log('========================================');
  Logger.log('PASO 1: VERIFICAR CONFIGURACIÓN');
  Logger.log('========================================');

  let errores = 0;

  // Verificar ACCOUNT_SID
  if (TWILIO_ACCOUNT_SID === 'TU_ACCOUNT_SID' || !TWILIO_ACCOUNT_SID || TWILIO_ACCOUNT_SID.length < 30) {
    Logger.log('❌ ERROR: TWILIO_ACCOUNT_SID no está configurado correctamente');
    Logger.log('   Valor actual: ' + TWILIO_ACCOUNT_SID);
    Logger.log('   Debe empezar con "AC" y tener 34 caracteres');
    errores++;
  } else {
    Logger.log('✅ TWILIO_ACCOUNT_SID configurado: ' + TWILIO_ACCOUNT_SID.substring(0, 10) + '...');
  }

  // Verificar AUTH_TOKEN
  if (TWILIO_AUTH_TOKEN === 'TU_AUTH_TOKEN' || !TWILIO_AUTH_TOKEN || TWILIO_AUTH_TOKEN.length < 30) {
    Logger.log('❌ ERROR: TWILIO_AUTH_TOKEN no está configurado correctamente');
    Logger.log('   Valor actual: ' + TWILIO_AUTH_TOKEN);
    errores++;
  } else {
    Logger.log('✅ TWILIO_AUTH_TOKEN configurado: ' + TWILIO_AUTH_TOKEN.substring(0, 5) + '...(oculto)');
  }

  // Verificar número FROM
  if (!TWILIO_WHATSAPP_FROM.startsWith('whatsapp:+')) {
    Logger.log('❌ ERROR: TWILIO_WHATSAPP_FROM debe empezar con "whatsapp:+"');
    Logger.log('   Valor actual: ' + TWILIO_WHATSAPP_FROM);
    errores++;
  } else {
    Logger.log('✅ TWILIO_WHATSAPP_FROM configurado: ' + TWILIO_WHATSAPP_FROM);
  }

  // Verificar número de prueba
  if (NUMERO_PRUEBA === '71234567' || NUMERO_PRUEBA.length !== 8) {
    Logger.log('⚠️  ADVERTENCIA: Debes cambiar NUMERO_PRUEBA por tu número real (8 dígitos)');
    Logger.log('   Valor actual: ' + NUMERO_PRUEBA);
  } else {
    Logger.log('✅ Número de prueba configurado: ' + NUMERO_PRUEBA);
  }

  Logger.log('');

  if (errores > 0) {
    Logger.log('❌ CONFIGURACIÓN INCOMPLETA - Corrige los errores y vuelve a ejecutar');
    return false;
  } else {
    Logger.log('✅ CONFIGURACIÓN CORRECTA - Puedes continuar al Paso 2');
    return true;
  }
}

// ========================================
// PASO 2: PROBAR CONEXIÓN A TWILIO
// ========================================
function PASO_2_PROBAR_CONEXION() {
  Logger.log('========================================');
  Logger.log('PASO 2: PROBAR CONEXIÓN A TWILIO');
  Logger.log('========================================');

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

    Logger.log('🔗 URL de Twilio: ' + url);
    Logger.log('📱 Enviando mensaje de prueba a: +591' + NUMERO_PRUEBA);
    Logger.log('');

    const mensaje = `🧪 PRUEBA DE TWILIO

Este es un mensaje de prueba del sistema de citas.

Fecha: ${new Date().toLocaleString('es-BO')}

Si recibes este mensaje, ¡Twilio está funcionando correctamente! ✅`;

    const payload = {
      From: TWILIO_WHATSAPP_FROM,
      To: `whatsapp:+591${NUMERO_PRUEBA}`,
      Body: mensaje
    };

    const auth = Utilities.base64Encode(TWILIO_ACCOUNT_SID + ':' + TWILIO_AUTH_TOKEN);

    const opciones = {
      method: 'post',
      headers: {
        'Authorization': 'Basic ' + auth
      },
      payload: payload,
      muteHttpExceptions: true
    };

    Logger.log('📤 Enviando solicitud a Twilio...');
    const respuesta = UrlFetchApp.fetch(url, opciones);
    const codigo = respuesta.getResponseCode();
    const contenido = respuesta.getContentText();

    Logger.log('📨 Código de respuesta: ' + codigo);
    Logger.log('📄 Respuesta completa:');
    Logger.log(contenido);
    Logger.log('');

    if (codigo === 201) {
      Logger.log('✅ ¡ÉXITO! Mensaje enviado correctamente');
      Logger.log('   Revisa tu WhatsApp (+591' + NUMERO_PRUEBA + ')');
      Logger.log('   Puede tardar unos segundos en llegar');

      try {
        const json = JSON.parse(contenido);
        if (json.sid) {
          Logger.log('   Message SID: ' + json.sid);
        }
      } catch (e) {
        // Ignorar error de parsing
      }

      return true;
    } else if (codigo === 401) {
      Logger.log('❌ ERROR 401: Credenciales incorrectas');
      Logger.log('   Verifica tu ACCOUNT_SID y AUTH_TOKEN');
      return false;
    } else if (codigo === 400) {
      Logger.log('❌ ERROR 400: Solicitud incorrecta');
      Logger.log('   Posibles causas:');
      Logger.log('   - El número TO no está verificado en Twilio Sandbox');
      Logger.log('   - El número FROM es incorrecto');
      Logger.log('   - El formato del mensaje no es válido');
      return false;
    } else if (codigo === 403) {
      Logger.log('❌ ERROR 403: Acceso denegado');
      Logger.log('   Tu cuenta de Twilio puede estar suspendida o sin saldo');
      return false;
    } else {
      Logger.log('❌ ERROR ' + codigo + ': Error desconocido');
      return false;
    }

  } catch (error) {
    Logger.log('❌ EXCEPCIÓN: ' + error.toString());
    Logger.log('');
    Logger.log('Posibles causas:');
    Logger.log('1. No tienes permisos para usar UrlFetchApp');
    Logger.log('2. Hay un error en las credenciales');
    Logger.log('3. Problema de red o conectividad');
    return false;
  }
}

// ========================================
// PASO 3: VERIFICAR NÚMERO EN SANDBOX
// ========================================
function PASO_3_VERIFICAR_SANDBOX() {
  Logger.log('========================================');
  Logger.log('PASO 3: VERIFICAR SANDBOX DE TWILIO');
  Logger.log('========================================');
  Logger.log('');
  Logger.log('Si estás usando Twilio Sandbox (gratis), debes:');
  Logger.log('');
  Logger.log('1. Ir a Twilio Console → Messaging → Try it out → Send a WhatsApp message');
  Logger.log('2. Seguir las instrucciones para unir tu número al Sandbox');
  Logger.log('3. Enviar el código de activación desde tu WhatsApp');
  Logger.log('');
  Logger.log('Mensaje que debes enviar a +1 (415) 523-8886:');
  Logger.log('   join <tu-codigo-sandbox>');
  Logger.log('');
  Logger.log('Ejemplo: join happy-dog');
  Logger.log('');
  Logger.log('4. Esperar confirmación de Twilio');
  Logger.log('5. Ahora tu número está autorizado para recibir mensajes');
  Logger.log('');
  Logger.log('⚠️  IMPORTANTE: En Sandbox solo puedes enviar a números verificados');
  Logger.log('⚠️  Para producción, necesitas una cuenta paga de Twilio');
}

// ========================================
// PASO 4: VERIFICAR EN GOOGLE APPS SCRIPT
// ========================================
function PASO_4_VERIFICAR_EN_APPS_SCRIPT() {
  Logger.log('========================================');
  Logger.log('PASO 4: CONFIGURAR EN google-apps-script.gs');
  Logger.log('========================================');
  Logger.log('');
  Logger.log('En tu archivo google-apps-script.gs, asegúrate de:');
  Logger.log('');
  Logger.log('1. Cambiar la línea 13:');
  Logger.log('   ❌ const USAR_CALLMEBOT = true;');
  Logger.log('   ✅ const USAR_CALLMEBOT = false;');
  Logger.log('');
  Logger.log('2. Configurar las credenciales (líneas 16-18):');
  Logger.log('   const TWILIO_ACCOUNT_SID = \'' + TWILIO_ACCOUNT_SID + '\';');
  Logger.log('   const TWILIO_AUTH_TOKEN = \'(tu token secreto)\';');
  Logger.log('   const TWILIO_WHATSAPP_FROM = \'' + TWILIO_WHATSAPP_FROM + '\';');
  Logger.log('');
  Logger.log('3. Guardar los cambios');
  Logger.log('4. Implementar nueva versión (Deploy → Manage deployments → Edit → New version)');
}

// ========================================
// EJECUTAR TODOS LOS PASOS
// ========================================
function DIAGNOSTICO_COMPLETO() {
  Logger.log('╔════════════════════════════════════════════╗');
  Logger.log('║   DIAGNÓSTICO COMPLETO DE TWILIO           ║');
  Logger.log('╚════════════════════════════════════════════╝');
  Logger.log('');

  // Paso 1
  if (!PASO_1_VERIFICAR_CONFIGURACION()) {
    Logger.log('');
    Logger.log('⛔ DIAGNÓSTICO DETENIDO - Corrige la configuración primero');
    return;
  }

  Logger.log('');
  Logger.log('⏳ Esperando 2 segundos...');
  Utilities.sleep(2000);

  // Paso 2
  const exito = PASO_2_PROBAR_CONEXION();

  Logger.log('');
  Logger.log('⏳ Esperando 2 segundos...');
  Utilities.sleep(2000);

  // Paso 3
  if (!exito) {
    PASO_3_VERIFICAR_SANDBOX();
  }

  Logger.log('');

  // Paso 4
  PASO_4_VERIFICAR_EN_APPS_SCRIPT();

  Logger.log('');
  Logger.log('╔════════════════════════════════════════════╗');
  Logger.log('║   FIN DEL DIAGNÓSTICO                      ║');
  Logger.log('╚════════════════════════════════════════════╝');

  if (exito) {
    Logger.log('');
    Logger.log('✅ TODO CORRECTO - Twilio está funcionando');
    Logger.log('   Ahora configura google-apps-script.gs según el Paso 4');
  }
}

// ========================================
// PRUEBA RÁPIDA (Solo enviar mensaje)
// ========================================
function PRUEBA_RAPIDA() {
  Logger.log('Enviando mensaje de prueba...');
  PASO_2_PROBAR_CONEXION();
}
