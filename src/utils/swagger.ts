import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FleetNote API Documentation',
            version: '1.0.0',
            description: 'API documentation for FleetNote - A minimalist note-taking application',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
    },
    apis: ['./src/routes/*.ts', './src/models/*.ts'], // files containing annotations
};

export const specs = swaggerJsdoc(options); 