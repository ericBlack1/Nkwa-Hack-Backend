const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express'); 
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NkwaPay API',
      version: '1.0.0',
      description: 'API Documentation with JWT Authentication',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {  // 👈 Add JWT Bearer Auth scheme
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in format: `Bearer <token>`'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [  // 👈 Apply security globally (optional)
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../routes/**/*.js')
  ],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    swaggerOptions: {
      persistAuthorization: true, // 👈 Saves token even after refresh
    },
  }));
  
  // Serve Swagger JSON
  app.get('/api-docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};
