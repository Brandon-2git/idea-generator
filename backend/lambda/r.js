//importo las clases del sdk de aws para poder usar bedrock
const { BedrockRuntimeClient, InvokeModelCommand } = require ("@aws-sdk/client-bedrock-runtime");

//Se crea un cliente que conectara con el servicio de bedrock
const client = new BedrockRuntimeClient({
  region: "us-east-1"
});

//Esta es la función principal que recibe y reponde la entrada de un prompt
exports.handler = async (event) => {

  try {

    //Se convierte el body de la petición de formato json a objeto
    const body = JSON.parse(event.body);
    //se obtiene el prompt de la petición
    const prompt = body.prompt;

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
              { text: prompt }
            ]
          }
        ],
        inferenceConfig: {
          maxTokens: 50,
          temperature: 0.7
        }
      })
    });

    //SE envía la solicitud al modelo de ia con el cliente de bedrock que se creo antes
    const response = await client.send(command);

    //Se convierte la respuesta del modelo en un objeto json
    const responseBody = JSON.parse(
      new TextDecoder().decode(response.body)
    );

    //Se devuelve la respuesta en HTTP si tuvo exito a la pagina web
    return {
      statusCode: 200,
      body: JSON.stringify({
        result: responseBody
      })
    };

  } catch (error) {

    //Muestra el error en los logs de aws cloudWatch
    console.error(error);
    //Devuelve la respuesta http con el error a la pagina web
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error generando respuesta"
      })
    };

  }
};