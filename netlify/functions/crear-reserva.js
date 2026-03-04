const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {

  const { nombre, pases } = JSON.parse(event.body);

  const id = Math.random().toString(36).substring(2,6).toUpperCase();

  const { data, error } = await supabase
    .from('invitacion')
    .insert([
      {
        nombre_familia: nombre,
        codigo_invitacion: id,
        numero_pases: pases,
        numero_veces_usado: 0
      }
    ]);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      mensaje: "Reserva creada",
      id: id,
      link: `https://tudominio.com/?id=${id}`
    })
  };
};