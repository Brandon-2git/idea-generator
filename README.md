#generador de ideas

# Configuración del endpoint de API Gateway

Por motivos de seguridad, el endpoint público de API Gateway no se incluye directamente en este repositorio.

Después de desplegar la infraestructura con AWS CDK, es necesario obtener manualmente la URL generada por API Gateway y agregarla en el frontend.

## Pasos para configurar el proyecto

### 1. Instalar dependencias

Backend e infraestructura:

```bash
npm install
```

Frontend:

```bash
npm install
```

---

### 2. Configurar credenciales AWS

Configurar AWS CLI con una cuenta válida:

```bash
aws configure
```

Ingresar:
- Access Key
- Secret Access Key
- Región (`us-east-1`)
- Formato de salida (`json`)

---

### 3. Desplegar infraestructura con CDK

Entrar a la carpeta de infraestructura:

```bash
cd infra
```

Inicializar CDK (solo la primera vez):

```bash
cdk bootstrap
```

Desplegar el stack:

```bash
cdk deploy
```

---

### 4. Obtener endpoint de API Gateway

Después del despliegue:

1. Entrar a la consola de AWS.
2. Buscar el servicio **API Gateway**.
3. Abrir la API creada por CDK:
   - `GeneradorIdeasAPI`
4. Ir a:
   - Stages
   - prod
5. Copiar la URL del endpoint.

El endpoint tendrá un formato similar a:

```text
https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/generar
```

---

### 5. Configurar frontend

Abrir:

```text
frontend/script.js
```

Reemplazar:

```javascript
const API_URL = "URL_DEL_ENDPOINT";
```

por:

```javascript
const API_URL = "https://TU_ENDPOINT/prod/generar";
```

---

### 6. Ejecutar frontend

Iniciar servidor local:

```bash
node servidor.js
```

Abrir en navegador:

```text
http://localhost:3000
```

---

## Notas de seguridad

El endpoint no se incluye en el repositorio para evitar uso no autorizado del servicio y consumo innecesario de recursos AWS.