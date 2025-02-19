import * as swaggerUi from "swagger-ui-express";
import * as fs from "fs";
import * as path from "path";
import { Express } from "express";

const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../swagger.json"), "utf8"));

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
