import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASS || 'admin123',
  database: process.env.DB_NAME || 'projeto_pweb',
  logging: false,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com o MySQL estabelecida com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco:", error);
  }
}

testConnection();

export default sequelize;
