//función principal que recibe y responde la entrada de un prompt
exports.handler = async (event) => {
  try {
    //Se convierte el body de la petición de formato JSON a objeto
    const body = JSON.parse(event.body);
    const prompt = body.prompt;

    //Respuesta simulada en lugar de llamar a Bedrock
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        result: `Recibí tu prompt: ${prompt}`
      })
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error procesando el prompt"
      })
    };
  }
};