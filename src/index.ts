import * as express from "express";
import * as dotenv from "dotenv";
import sequelize from "./config/database";
import { UserService } from "./services/UserService";

dotenv.config();

const app = express();
app.use(express.json());

const userService = new UserService();

app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userService.createUser(name, email, password);
    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao criar usuário", error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Erro ao obter usuários", error: error.message });
  }
});

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
