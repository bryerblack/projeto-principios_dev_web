import { Sequelize } from "sequelize";
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
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

export default sequelize;
