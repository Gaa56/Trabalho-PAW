const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PAW Market API',
      version: '1.0.0',
      description: 'API de Supermercado - Gestão de Produtos, Pedidos e Entregas',
      contact: {
        name: 'PAW Market Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
          description: 'Session cookie for authentication'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User name'
            },
            email: {
              type: 'string',
              description: 'User email'
            },
            password: {
              type: 'string',
              description: 'User password'
            },
            role: {
              type: 'string',
              enum: ['client', 'supermarket', 'delivery', 'admin'],
              description: 'User role'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            price: {
              type: 'number'
            },
            category: {
              type: 'string'
            },
            supermarket: {
              type: 'string'
            },
            stock: {
              type: 'number'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            client: {
              type: 'string'
            },
            items: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
            status: {
              type: 'string'
            },
            totalPrice: {
              type: 'number'
            }
          }
        },
        Supermarket: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            location: {
              type: 'string'
            },
            user: {
              type: 'string'
            }
          }
        }
      }
    },
    security: [
      {
        sessionAuth: []
      }
    ]
  },
  apis: [
    './routes/auth.js',
    './routes/cliente.js',
    './routes/supermarket.js',
    './routes/estafeta.js',
    './routes/admin.js',
    './routes/users.js',
    './routes/index.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
