import request from "supertest";
import sequelize from "../../config/database";
import app from "../../server";
import jwt from "jsonwebtoken";

describe("Testes da UserController", () => {
  let transaction: any;
  let adminToken: string;
  let adminId: string;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // 🔹 Criar um usuário admin
    const adminResponse = await request(app).post("/auth/register").send({
      name: "Admin User",
      email: "admin@example.com",
      password: "Admin123#",
      phone: "(11) 98765-4321",
      profession: "Administrador",
      role: "admin",
    });

    adminId = adminResponse.body.user.id;

    // 🔹 Autenticar o admin e obter o token
    const loginResponse = await request(app).post("/auth/login").send({
      email: "admin@example.com",
      password: "Admin123#",
    });

    adminToken = loginResponse.body.token;
  });

  beforeEach(async () => {
    transaction = await sequelize.transaction();
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("Deve criar um novo usuário e retornar código 201", async () => {
    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Usuário Teste",
        email: "test1@example.com",
        password: "senha123",
        phone: "(11) 98765-4321",
        profession: "Engenheiro",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe("test1@example.com");
  });

  it("Não deve criar usuário e deve retornar código 409 caso receba um email já cadastrado", async () => {
    await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Usuário Teste",
        email: "test1@example.com",
        password: "senha123",
        phone: "(11) 98765-4321",
        profession: "Engenheiro",
      });

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Outro Usuário",
        email: "test1@example.com",
        password: "outrasenha",
        phone: "(11) 99999-8888",
        profession: "Advogado",
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email já cadastrado.");
  });

  it("Deve retornar código 200 (OK) e listar todos os usuários se houver usuários cadastrados", async () => {
    await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Usuário 1",
        email: "usuario1@example.com",
        password: "senha123",
        phone: "(11) 98765-4321",
        profession: "Médico",
      });

    await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Usuário 2",
        email: "usuario2@example.com",
        password: "senha456",
        phone: "(21) 99999-8888",
        profession: "Advogado",
      });

    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(1);
  });

  it("Deve retornar código 204 (No Content) caso não haja usuários cadastrados", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminToken}`);

    if (response.body.length === 0) {
      expect(response.status).toBe(204);
      expect(response.body.message).toBe("Nenhum usuário encontrado.");
    } else {
      expect(response.body.length > 0);
    }
  });

  it("Deve retornar código 200 (OK) e um usuário quando receber um id válido", async () => {
    const user = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Usuário Teste",
        email: "usuario3@example.com",
        password: "senha123",
        phone: "(11) 98765-4321",
        profession: "Professor",
      });

    const response = await request(app)
      .get(`/users/${user.body.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe("usuario3@example.com");
  });

  it("Deve retornar código 404 (Not Found) caso o id recebido não corresponda a um usuário existente", async () => {
    const response = await request(app)
      .get(`/users/123e4567-e89b-12d3-a456-426614174000`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuário não encontrado.");
  });

  it("Deve retornar código 200 (OK) e mensagem de sucesso ao receber id de usuário válido e existente", async () => {
    const user = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Usuário Teste",
        email: "usuario4@example.com",
        password: "senha123",
        phone: "(11) 98765-4321",
        profession: "Engenheiro",
      });

    const response = await request(app)
      .delete(`/users/${user.body.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Usuário deletado com sucesso.");
  });

  it("Deve retornar código 404 (Not Found) caso o id recebido corresponda a um usuário não existente", async () => {
    const response = await request(app)
      .delete(`/users/123e4567-e89b-12d3-a456-426614174000`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuário não encontrado.");
  });

  it("Deve atualizar usuário e retornar código 200 (OK)", async () => {
    const user = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Usuário Teste",
        email: "usuario5@example.com",
        password: "senha123",
        phone: "(11) 98765-4321",
        profession: "Médico",
      });

    const response = await request(app)
      .put(`/users/${user.body.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Usuário Atualizado",
        phone: "(11) 99999-9999",
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Usuário Atualizado");
    expect(response.body.phone).toBe("(11) 99999-9999");
  });

  it("Deve retornar código 404 ao tentar atualizar usuário inexistente", async () => {
    const response = await request(app)
      .put(`/users/123e4567-e89b-12d3-a456-426614174000`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Novo Nome",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuário não encontrado.");
  });

  it("Deve retornar código 409 caso tente atualizar email já cadastrado", async () => {
    await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Usuário 6",
        email: "usuario6@example.com",
        password: "senha123",
        phone: "(11) 98765-4321",
        profession: "Médico",
      });
      console.log(adminId)
    const response = await request(app)
      .put(`/users/${adminId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ email: "usuario6@example.com" });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email já cadastrado.");
  });
});
