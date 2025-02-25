const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "Portfolio API",
        description: "API documentation for the Project Management System",
        version: "1.0.0",
    },
    servers: [
        {
            url: "http://localhost:3000/api",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    security: [{ bearerAuth: [] }],
};

const outputFile = "../swagger-output.json";
const endpointsFiles = ["./src/routes/project.ts", "./src/routes/user.ts"]; // Add more route files if needed

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log("Swagger JSON generated! Run the server to view docs.");
});
