import { Express, Request, Response } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'jwt'
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    },
    tags: [
      {
        name: 'health-check',
        description: 'Server health check operations'
      },
      {
        name: 'auth',
        description: 'User authentication operations'
      },
      {
        name: 'wallets',
        description: 'Wallet Operations'
      }
    ]
  },
  apis: ['./src/app.ts', './src/*/schemas/*.ts', './src/routes/*.ts']
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

export default swaggerDocs;
