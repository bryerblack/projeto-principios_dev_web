import app from "./server";
import sequelize from "./config/database";

const PORT = process.env.PORT || 3000;

// Testando a conexão com o banco e iniciando o servidor
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Conexão com o MySQL estabelecida!");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(
        `📚 Documentação disponível em http://localhost:${PORT}/api-docs`
      );
    });
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  });
