import express from "express";
import * as dotenv from "dotenv";
import sequelize from "./config/database";
import { UserService } from "./services/UserService";
import * as swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

dotenv.config();

const app = express();
app.use(express.json());

// app.use("/users", UserRouter);

const swaggerOptions = {
  swaggerDefinition: {
    myapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.ts'], // files containing annotations as above
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Testando a conexão e inicializando o servidor
sequelize
  .sync({ alter: true }) // Agora apenas altera a estrutura do banco sem apagar os dados
  .then(() => {
    console.log("✅ Banco de dados sincronizado!");
    app.listen(3000, () => console.log("🚀 Servidor rodando na porta 3000"));
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
  });
