import request from "supertest";
import sequelize from "../../config/database";
import app from "../../server";
import { response } from "express";

describe("Testes de PlaceController", () => {
  let transaction: any;

  beforeAll(async () => {
    await sequelize.sync({ force: true }); // 🔹 Garante que o banco de testes seja criado
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

  it("Deve criar um espaço e retornar código 201", async () => {
    const response = await request(app).post("/places").send({
        name: "someplace",
        address: "somewhere",
        description: "a place for work",
        pricePerHour: "R$19,00",
        availability: "afternoon",
        ownerId: "testId",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.ownerId).toBe("testId");
  });

  it("Não deve criar um espaço e deve retornar código 409 caso receba um endereço já cadastrado", async () => {
    await request(app).post("/olaces").send({
        name: "someplace",
        address: "somewhere",
        description: "a place for work",
        pricePerHour: "R$19,00",
        availability: "afternoon",
        ownerId: "testId",
    });

    const response = await request(app).post("/places").send({
        name: "another lace",
        address: "somewhere",
        description: "a place for work, again",
        pricePerHour: "R$20,00",
        availability: "night",
        ownerId: "testId",
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Endereço já cadastrado.")
  });

  it("Deve retornar código 400 (Bad Request) caso os dados sejam inválidos ou incompletos", async () => {
    const response = await request(app).post("/places").send({
        name: "someplace",
        address: null,
        description: "a place for work",
        pricePerHour: "R$19,00",
        availability: "afternoon",
        ownerId: "testId",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Dados do espaço inválidos")
  });

  it("Deve retornar código 200 (OK) e a lista de espaços cadastrados caso existam espaços.", async () => {
    await request(app).post("/olaces").send({
        name: "someplace",
        address: "somewhere",
        description: "a place for work",
        pricePerHour: "R$19,00",
        availability: "afternoon",
        ownerId: "testId",
    });

    await request(app).post("/places").send({
        name: "another place",
        address: "elsewhere",
        description: "a place for work, again",
        pricePerHour: "R$20,00",
        availability: "night",
        ownerId: "testId2",
    });

    const response = await request(app).get("/places");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(1);
  });

  it("Deve retornar código 204 (No Content) caso não existam espaços cadastrados.", async () => {
    const response = await request(app).get("/places");

    expect(response.status).toBe(204);
    expect(response.body.message).toBe("Nenhum espaço cadastrado");
  });

  it("Deve retornar código 200 (OK) e os detalhes do espaço caso o ID seja válido e corresponda a um espaço existente.", async () => {
    const place = await request(app).post("/places").send({
        name: "someplace",
        address: "somewhere",
        description: "a place for work",
        pricePerHour: "R$19,00",
        availability: "afternoon",
        ownerId: "testId",
    });
    const id = place.body.id;

    const response = await request(app).get(`/places/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.ownerId).toBe("testId");
  });

  it("Deve retornar código 400 (Bad Request) caso o ID seja inválido, nulo ou vazio.", async () => {
    const place = await request(app).post("/places").send({
        name: "someplace",
        address: "somewhere",
        description: "a place for work",
        pricePerHour: "R$19,00",
        availability: "afternoon",
        ownerId: "testId",
    });

    const response = await request(app).get("/places/");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Id de espaço inválido");
  });

  it("Deve retornar código 404 (Not Found) caso o ID não corresponda a um espaço existente.", async () => {
    const response = await request(app).get("/places/id");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Espaço não encontrado");
  });

  it("Deve atualizar o espaço e retornar código 200 (OK) quando receber dados válidos.", async () => {
    const place = await request(app).post("/places").send({
        name: "someplace",
        address: "somewhere",
        description: "a place for work",
        pricePerHour: "R$19,00",
        availability: "afternoon",
        ownerId: "testId",
    });
    const id = place.body.id;

    const response = await request(app).put(`/places/${id}`).send({
        name: "someplaceNew",
        address: "somewhereNew",
        description: "a new place for work",
        pricePerHour: "R$12,00",
        availability: "afternoon",
        ownerId: "testId",
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("someplaceNew");
  });

  it("Deve retornar código 400 (Bad Request) caso o ID seja inválido ou os dados sejam inválidos.", async () => {
    const place = await request(app).post("/places").send({
        name: "someplace",
        address: "somewhere",
        description: "a place for work",
        pricePerHour: "R$19,00",
        availability: "afternoon",
        ownerId: "testId",
    });
    const id = place.body.id;

    const response = await request(app).put(`/places/${id}`).send({
        name: "someplaceNew",
        description: "a new place for work",
        pricePerHour: "R$12,00",
        availability: "afternoon",
        ownerId: "testId",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Dados inválidos");
  });

  it("Deve retornar código 400 (Bad Request) caso o ID seja inválido ou os dados sejam inválidos.", async () => {
    const response = await request(app).put("/places/id").send({
        name: "someplaceNew",
        address: "somewhereNew",
        description: "a new place for work",
        pricePerHour: "R$12,00",
        availability: "afternoon",
        ownerId: "testId",
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Espaço não encontrado");
  });
});
