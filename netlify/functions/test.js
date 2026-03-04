const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async () => {

  const { data, error } = await supabase
    .from('invitacion')
    .select('*')
    .limit(1);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        conectado: false,
        error: error.message
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      conectado: true,
      data: data
    })
  };
};