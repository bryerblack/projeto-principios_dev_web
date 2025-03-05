import request from "supertest";
import sequelize from "../../config/database";
import app from "../../server";

describe("Testes da UserController", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("Deve criar um novo usuário", async () => {
    const response = await request(app).post("/users").send({
      name: "Usuário Teste",
      email: "test@example.com",
      password: "senha123",
      phone: "(11) 98765-4321",
      profession: "Engenheiro",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe("test@example.com");
  });

  it("Deve falhar ao criar um usuário com e-mail duplicado", async () => {
    await request(app).post("/users").send({
      name: "Usuário Teste",
      email: "test@example.com",
      password: "senha123",
      phone: "(11) 98765-4321",
      profession: "Engenheiro",
    });

    const response = await request(app).post("/users").send({
      name: "Outro Usuário",
      email: "test@example.com",
      password: "outrasenha",
      phone: "(11) 99999-8888",
      profession: "Advogado",
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email já cadastrado.");
  });
});
