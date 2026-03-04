const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {

  const { codigo } = JSON.parse(event.body);

  // Buscar invitación por codigo_invitacion
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
        mensaje: "Invitación no válida"
      })
    };
  }

  // Validar disponibilidad
  if (invitacion.numero_veces_usado >= invitacion.numero_pases) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        estado: "agotado",
        mensaje: "Pases agotados",
        nombre: invitacion.nombre_familia,
        usados: invitacion.numero_veces_usado,
        permitidos: invitacion.numero_pases
      })
    };
  }

  // Incrementar uso (MUY IMPORTANTE)
  const { error: updateError } = await supabase
    .from('invitacion')
    .update({
      numero_veces_usado: invitacion.numero_veces_usado + 1
    })
    .eq('codigo_invitacion', codigo);

  if (updateError) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        estado: "error",
        mensaje: "Error al actualizar"
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      estado: "ok",
      mensaje: "Acceso permitido",
      nombre: invitacion.nombre_familia,
      usados: invitacion.numero_veces_usado + 1,
      permitidos: invitacion.numero_pases
    })
  };
};