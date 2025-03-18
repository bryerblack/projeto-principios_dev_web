import request from "supertest";
import app from "../../server";

describe("Validação de Autenticação", () => {
  it("Deve retornar erro se o email for inválido", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Usuário Teste",
      email: "email-invalido",
      password: "Senha123#",
      phone: "(11) 98765-4321",
      profession: "Médico",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe("INVALID_EMAIL_FORMAT");
  });

  it("Deve retornar erro se o email não for informado", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Usuário Teste",
      password: "Senha123#",
      phone: "(11) 98765-4321",
      profession: "Médico",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe("INVALID_EMAIL_FORMAT");
  });

  it("Deve retornar erro se a senha for menor que 8 caracteres", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Usuário Teste",
      email: "teste@email.com",
      password: "Aa1#",
      phone: "(11) 98765-4321",
      profession: "Médico",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe("INVALID_PASSWORD");
  });

  it("Deve retornar erro se a senha não contiver pelo menos uma letra maiúscula", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Usuário Teste",
      email: "teste@email.com",
      password: "senha123#",
      phone: "(11) 98765-4321",
      profession: "Médico",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe("INVALID_PASSWORD");
  });

  it("Deve retornar erro se a senha não contiver pelo menos uma letra minúscula", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Usuário Teste",
      email: "teste@email.com",
      password: "SENHA123#",
      phone: "(11) 98765-4321",
      profession: "Médico",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe("INVALID_PASSWORD");
  });

  it("Deve retornar erro se a senha não contiver pelo menos um número", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Usuário Teste",
      email: "teste@email.com",
      password: "SenhaForte#",
      phone: "(11) 98765-4321",
      profession: "Médico",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe("INVALID_PASSWORD");
  });

  it("Deve retornar erro se a senha não contiver pelo menos um caractere especial", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Usuário Teste",
      email: "teste@email.com",
      password: "Senha123",
      phone: "(11) 98765-4321",
      profession: "Médico",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.code).toBe("INVALID_PASSWORD");
  });

  it("Deve permitir registro se email e senha forem válidos", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Usuário Teste",
      email: "usuario@email.com",
      password: "Senha123#",
      phone: "(11) 98765-4321",
      profession: "Médico",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
  });
});
