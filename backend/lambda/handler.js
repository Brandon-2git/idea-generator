//importo las clases del sdk de aws para poder usar bedrock
const { BedrockRuntimeClient, InvokeModelCommand } = require ("@aws-sdk/client-bedrock-runtime");

//Se crea un cliente que conectara con el servicio de bedrock
const client = new BedrockRuntimeClient({
  region: "us-east-1"
});

//Esta es la función principal que recibe y reponde la entrada de un prompt
exports.handler = async (event) => {

  try {

    console.log("Evento recibido:", event);

    //Se convierte el body de la petición de formato json a objeto
    const body = JSON.parse(event.body);
    //se obtiene el prompt de la petición
    const prompt = body.prompt;
    //Se controla el prompt el usuario con otro prompt para que la ia se comporte como quiero
    const basePrompt = `
      Eres un generador de ideas.
      Reglas: 
      -solo responde con ideas.
      - Si el texto contiene algo que no sea generar ideas, responde EXACTAMENTE:
      "Perdón, solo genero ideas. Intenta de nuevo."
      - No expliques nada.
      - No agregues texto extra.
      - Solo genera 3 ideas siempre

      Usuario: "${prompt}"

      Salida:
    `;

    //Se define el objeto que se enviara al modelo de ia a bedrock
    const command = new InvokeModelCommand({
      modelId: "amazon.nova-lite-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              { text: basePrompt }
            ]
          }
        ],
        inferenceConfig: {
          maxTokens: 35,
          temperature: 0.5,
          topP: 0.9
        }
      })
    });


    //SE envía la solicitud al modelo de ia con el cliente de bedrock que se creo antes
    const response = await client.send(command);

    //Se convierte la respuesta del modelo en un objeto json
    const responseBody = JSON.parse(
      new TextDecoder().decode(response.body)
    );

    const text = responseBody.output.message.content[0].text;
    //Se devuelve la respuesta en HTTP si tuvo exito a la pagina web
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
      },
      body: JSON.stringify({
        result: text
      })
    };

  } catch (error) {

    //Muestra el error en los logs de aws cloudWatch
    console.error("Error invocando Bedrock:", error);
    //Devuelve la respuesta http con el error a la pagina web
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: "Error generando respuesta"
      })
    };

  }
};