import request from "supertest";
import app from "../../server";

describe("Autenticação", () => {
  it("Deve registrar um usuário", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Usuário Teste",
      email: "teste@email.com",
      password: "Senha123#",
      phone: "(11) 98765-4321",
      profession: "Médico",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
  });

  it("Deve autenticar um usuário e retornar um token", async () => {
    await request(app).post("/users").send({
      name: "Usuário Teste",
      email: "teste@email.com",
      password: "Senha123#",
      phone: "(11) 98765-4321",
      profession: "Médico",
    });

    const response = await request(app).post("/auth/login").send({
      email: "teste@email.com",
      password: "Senha123#",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("Deve retornar erro ao autenticar com senha errada", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "teste@email.com",
      password: "senhaErrada#1",
    });

    expect(response.status).toBe(401);
  });
});
