import { Sequelize } from "sequelize";
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
const dbName = process.env.NODE_ENV === "test" ? "projeto_pweb_test" : "projeto_pweb";
dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3307,
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASS || 'admin123',
  database: dbName,
  logging: false,
});

export default sequelize;
