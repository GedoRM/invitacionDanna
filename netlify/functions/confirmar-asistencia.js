const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ mensaje: "Método no permitido" })
    };
  }

  try {

    const { codigo } = JSON.parse(event.body);

    if (!codigo) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          estado: "error",
          mensaje: "Código requerido"
        })
      };
    }

    // 🔎 Buscar invitación
    const { data: invitacion, error } = await supabase
      .from('invitacion')
      .select('*')
      .eq('codigo_invitacion', codigo)
      .single();

    if (error || !invitacion) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          estado: "error",
          mensaje: "Código inválido"
        })
      };
    }

    // 🚫 Si ya confirmó antes
    if (invitacion.confirmado) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          estado: "ok",
          mensaje: "Asistencia ya confirmada",
          nombre: invitacion.nombre_familia,
          codigo: codigo
        })
      };
    }

    // ✅ Marcar como confirmado
    const { error: updateError } = await supabase
      .from('invitacion')
      .update({ status: true })
      .eq('codigo_invitacion', codigo);

    if (updateError) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          estado: "error",
          mensaje: "Error al confirmar asistencia"
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        estado: "ok",
        mensaje: "Asistencia confirmada con éxito",
        nombre: invitacion.nombre_familia,
        codigo: codigo
      })
    };

  } catch (err) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        estado: "error",
        mensaje: "Error interno",
        detalle: err.message
      })
    };

  }
};