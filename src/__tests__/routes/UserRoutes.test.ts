import request from "supertest";
import app from "../../server";

describe("Usuários", () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const adminResponse = await request(app).post("/auth/register").send({
      name: "Admin Teste",
      email: "admin@email.com",
      password: "Admin123#",
      phone: "(11) 98765-4321",
      profession: "Admin",
      role: "admin",
    });

    token = adminResponse.body.token;
  });

  it("Deve criar um novo usuário (Apenas Admins)", async () => {
    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Usuário Teste",
        email: "usuario@email.com",
        password: "Senha123#",
        phone: "(11) 99999-8888",
        profession: "Engenheiro",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");

    userId = response.body.id;
  });

  it("Deve listar todos os usuários (Apenas Admins)", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("Deve buscar um usuário por ID (Apenas Admins)", async () => {
    const response = await request(app)
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", userId);
  });

  it("Deve atualizar um usuário (Apenas Admins)", async () => {
    const response = await request(app)
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Usuário Atualizado",
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Usuário Atualizado");
  });

  it("Deve deletar um usuário (Apenas Admins)", async () => {
    const response = await request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("Deve obter informações do próprio usuário", async () => {
    const response = await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
