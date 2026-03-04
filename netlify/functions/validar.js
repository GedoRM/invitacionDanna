const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {

  const { id } = JSON.parse(event.body);

  // Buscar reserva
  const { data: reserva, error } = await supabase
    .from('invitacion')
    .select('*')
    .eq('id_invitacion', id)
    .single();

  if (error || !reserva) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        estado: "error",
        mensaje: "Invitación no válida"
      })
    };
  }

  // Verificar disponibilidad
  if (reserva.pases_usados >= reserva.pases_permitidos) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        estado: "agotado",
        mensaje: "Pases agotados",
        nombre: reserva.nombre,
        usados: reserva.pases_usados,
        permitidos: reserva.pases_permitidos
      })
    };
  }

  // Descontar 1 pase
  const { error: updateError } = await supabase
    .from('reservas')
    .update({
      pases_usados: reserva.pases_usados + 1
    })
    .eq('id', id);

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
      nombre: reserva.nombre,
      usados: reserva.pases_usados + 1,
      permitidos: reserva.pases_permitidos
    })
  };
};