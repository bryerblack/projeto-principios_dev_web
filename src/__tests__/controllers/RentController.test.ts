import request from "supertest";
import sequelize from "../../config/database";
import app from "../../server";
import Address from "../../models/Address";
import { RentRepository } from "../../repositories/RentRepository";
import { PlaceRepository } from "../../repositories/PlaceRepository";
import { UserRepository } from "../../repositories/UserRepository";

describe("Testes de RentController", () => {
  let transaction: any;
  let token: string;
  let userId: string;
  let placeId: string;
  let renterId: string;
  let address: Address;
  const rentRepository = new RentRepository();
  const placeRepository = new PlaceRepository();
  const userRepository = new UserRepository();

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Criação de um usuário para ser o proprietário e outro para ser o locatário
    const ownerResponse = await request(app).post("/auth/register").send({
      name: "Proprietário Teste",
      email: "owner@example.com",
      password: "senha123",
      phone: "(11) 98765-4321",
      profession: "Empresário",
      role: "user",
    });

    const renterResponse = await request(app).post("/auth/register").send({
      name: "Locatário Teste",
      email: "renter@example.com",
      password: "senha123",
      phone: "(11) 91234-5678",
      profession: "Arquiteto",
      role: "user",
    });

    console.log(ownerResponse);

    userId = ownerResponse.body.user.id;
    renterId = renterResponse.body.user.id;

    // Criar um lugar para ser alugado
    const placeResponse = await placeRepository.createPlace({
        name: "someplace",
        addressId: "adress",
        description: "a place for work",
        pricePerHour: 19.0,
        availability: ["afternoon"],
        ownerId: userId,
    });

    placeId = placeResponse.dataValues.id;

    // 🔹 Autenticar o proprietário e obter o token
    const loginResponse = await request(app).post("/auth/login").send({
      email: "owner@example.com",
      password: "senha123",
    });

    token = loginResponse.body.token;
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

  it("Deve criar um aluguel e retornar código 201", async () => {
    const response = await request(app)
      .post("/rents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        placeId: placeId,
        ownerId: userId,
        renterId: renterId,
        totalValue: 50.0,
        status: "em andamento",
        paymentMethod: "cartão",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.placeId).toBe(placeId);
    expect(response.body.ownerId).toBe(userId);
    expect(response.body.renterId).toBe(renterId);
    expect(response.body.totalValue).toBe(50.0);
    expect(response.body.status).toBe("em andamento");
    expect(response.body.paymentMethod).toBe("cartão");
  });

  it("Não deve criar um aluguel e deve retornar código 409 caso o aluguel já exista", async () => {
    await request(app)
      .post("/rents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        placeId: placeId,
        ownerId: userId,
        renterId: renterId,
        totalValue: 50.0,
        status: "em andamento",
        paymentMethod: "cartão",
      });

    const response = await request(app)
      .post("/rents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        placeId: placeId,
        ownerId: userId,
        renterId: renterId,
        totalValue: 50.0,
        status: "em andamento",
        paymentMethod: "cartão",
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Aluguel já existe para esse espaço.");
  });

  it("Deve retornar código 400 (Bad Request) caso os dados sejam inválidos ou incompletos", async () => {
    const response = await request(app)
      .post("/rents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        placeId: null,
        ownerId: userId,
        renterId: renterId,
        totalValue: 50.0,
        status: "em andamento",
        paymentMethod: "cartão",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Dados do aluguel inválidos.");
  });

  it("Deve retornar código 200 (OK) e a lista de aluguéis caso existam aluguéis cadastrados", async () => {
    await request(app)
      .post("/rents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        placeId: placeId,
        ownerId: userId,
        renterId: renterId,
        totalValue: 50.0,
        status: "em andamento",
        paymentMethod: "cartão",
      });

    const response = await request(app)
      .get("/rents")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("Deve retornar código 204 (No Content) caso não existam aluguéis cadastrados", async () => {
    const response = await request(app)
      .get("/rents")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
    expect(response.body.message).toBe("Nenhum aluguel cadastrado.");
  });

  it("Deve retornar código 200 (OK) e um aluguel específico ao buscar por ID", async () => {
    const rentResponse = await request(app)
      .post("/rents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        placeId: placeId,
        ownerId: userId,
        renterId: renterId,
        totalValue: 50.0,
        status: "em andamento",
        paymentMethod: "cartão",
      });

    const rentId = rentResponse.body.id;

    const response = await request(app)
      .get(`/rents/${rentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(rentId);
    expect(response.body.placeId).toBe(placeId);
    expect(response.body.ownerId).toBe(userId);
    expect(response.body.renterId).toBe(renterId);
  });

  it("Deve retornar código 404 (Not Found) ao tentar buscar aluguel por ID inexistente", async () => {
    const response = await request(app)
      .get("/rents/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Aluguel não encontrado.");
  });

  it("Deve atualizar a locação e retornar código 200 (OK) quando receber dados válidos", async () => {
    const rent = await request(app)
      .post("/rents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        placeId: placeId,
        ownerId: userId,
        renterId: renterId,
        totalValue: 50.0,
        status: "em andamento",
        paymentMethod: "cartão",
      });
      const rentId = rent.body.id;
    
    const response = await request(app)
      .put(`/rents/${rentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        totalValue: 75.0,
        status: "finalizado",
        paymentMethod: "dinheiro",
      });

    expect(response.status).toBe(200);
    expect(response.body.totalValue).toBe(75.0);
    expect(response.body.status).toBe("finalizado");
    expect(response.body.paymentMethod).toBe("dinheiro");
  });

  it("Deve retornar código 400 (Bad Request) caso os dados sejam inválidos ao tentar atualizar", async () => {
    const rent = await request(app)
      .post("/rents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        placeId: placeId,
        ownerId: userId,
        renterId: renterId,
        totalValue: 50.0,
        status: "em andamento",
        paymentMethod: "cartão",
      });
      const rentId = rent.body.id;
    
    const response = await request(app)
      .put(`/rents/${rentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        totalValue: -25.0, // Valor inválido
        status: "em andamento",
        paymentMethod: "cartão",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Dados inválidos para atualização do aluguel.");
  });

  it("Deve retornar código 404 (Not Found) caso o ID não corresponda a uma locação existente", async () => {
    const response = await request(app)
      .put("/rents/invalid-id")
      .set("Authorization", `Bearer ${token}`)
      .send({
        totalValue: 75.0,
        status: "finalizado",
        paymentMethod: "dinheiro",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Locação não encontrada.");
  });

  it("Deve deletar a locação e retornar código 200 (OK) quando o ID for válido", async () => {
    const rent = await request(app)
      .post("/rents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        placeId: placeId,
        ownerId: userId,
        renterId: renterId,
        totalValue: 50.0,
        status: "em andamento",
        paymentMethod: "cartão",
      });
      const rentId = rent.body.id;
    
    const response = await request(app)
      .delete(`/rents/${rentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Locação deletada com sucesso.");
  });

  it("Deve retornar código 400 (Bad Request) caso o ID seja inválido, nulo ou vazio ao tentar deletar", async () => {
    const response = await request(app)
      .delete("/rents/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("ID inválido ou não fornecido.");
  });

  it("Deve retornar código 404 (Not Found) caso o ID não corresponda a uma locação existente ao tentar deletar", async () => {
    const response = await request(app)
      .delete("/rents/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Locação não encontrada.");
  });
});
