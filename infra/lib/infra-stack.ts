import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

//importación de constructores de los servicios de aws que se utilizaran
//Se importa TODO el contenido de x modulo y se agrupa todo dentro de un objeto llamado (lambda, apigateway, iam) 
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';


//Stack es el contenedor de la infraestrucura
export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Creación de la función lambda
    const generadorIdeasLambda = new lambda.Function(this, 'GeneradorIdeasLambda', {
      functionName: 'generador-ideas',
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset('../backend/lambda'),
      timeout: cdk.Duration.seconds(30),
      description: 'Funcion que recibe un prompt y se lo pasa a la ia, y despues devuelve la respuesta al cliente'

    });

    // Politica IAM para que la funcion lambda pueda llamar a bedrock
    generadorIdeasLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['bedrock:InvokeModel'],
        resources: ['*'],
      })
    );

    //Creación de la  API Gateway de tipo rest API
    const api = new apigateway.RestApi(this, 'IdeasApi', {
      restApiName: 'GeneradorIdeasAPI',
      description: 'API Rest para generar ideas con Bedrock',
      
      // Se habilita CORS para permitir llamadas desde el navegador
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS
      }
    });

    // Se crea el endpont 
    // https://api/.../generar
    const generar = api.root.addResource('generar');
    //Se conecta el endpoint con la funcion lambda creada arriba
    generar.addMethod(
      'POST',
      // Se integra la API con lambda
      new apigateway.LambdaIntegration(generadorIdeasLambda)
    );
  }
}
