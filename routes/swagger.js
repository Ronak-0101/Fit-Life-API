const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fit-Life API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "https://fit-life-api.onrender.com",
      },
    ],
  },
  apis: ["./routes/*.js"], // very important
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;