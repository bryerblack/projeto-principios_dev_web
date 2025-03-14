import request from "supertest";
import sequelize from "../../config/database";
import app from "../../server";
import { response } from "express";
import { placeService } from "../../services/PlaceService"; // Importa o placeService

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

  it("Deve deletar um espaço e retornar confirmação quando o ID for válido", async () => {
    const place = await request(app).post("/places").send({
      name: "someplace",
      address: "somewhere",
      description: "a place for work",
      pricePerHour: "R$19,00",
      availability: "afternoon",
      ownerId: "testId",
    });
    const id = place.body.id;

    const response = await request(app).delete(`/places/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Espaço deletado com sucesso.");
  });

  it("Deve lançar erro com código 400 (Bad Request) caso o ID seja inválido", async () => {
    const response = await request(app).delete("/places/invalidId");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Id de espaço inválido");
  });

  it("Deve lançar erro com código 404 (Not Found) caso o espaço não exista", async () => {
    const response = await request(app).delete("/places/nonExistentId");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Espaço não encontrado.");
  });

  it("Deve lançar erro com código 409 (Conflict) caso o espaço tenha locações ativas", async () => {
    const place = await request(app).post("/places").send({
      name: "someplace",
      address: "somewhere",
      description: "a place for work",
      pricePerHour: "R$19,00",
      availability: "afternoon",
      ownerId: "testId",
    });
    const id = place.body.id;

    // Simula que o espaço tem locações ativas
    jest.spyOn(placeService, "deletePlace").mockRejectedValueOnce(new Error("Espaço tem locações ativas"));

    const response = await request(app).delete(`/places/${id}`);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Erro ao deletar espaço");
  });

  it("Deve adicionar um equipamento ao espaço e retornar sucesso", async () => {
    const place = await request(app).post("/places").send({
      name: "someplace",
      address: "somewhere",
      description: "a place for work",
      pricePerHour: "R$19,00",
      availability: "afternoon",
      ownerId: "testId",
    });
    const place_id = place.body.id;

    const response = await request(app).post(`/places/${place_id}/equipments`).send({
      name: "Projector",
      description: "High-quality projector",
      pricePerHour: "R$10,00",
      quantityAvailable: 2,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("Deve lançar erro com código 400 (Bad Request) caso os dados do equipamento sejam inválidos", async () => {
    const place = await request(app).post("/places").send({
      name: "someplace",
      address: "somewhere",
      description: "a place for work",
      pricePerHour: "R$19,00",
      availability: "afternoon",
      ownerId: "testId",
    });
    const place_id = place.body.id;

    const response = await request(app).post(`/places/${place_id}/equipments`).send({
      name: null,
      description: "High-quality projector",
      pricePerHour: "R$10,00",
      quantityAvailable: 2,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Dados do equipamento inválidos");
  });

  it("Deve lançar erro com código 404 (Not Found) caso o espaço não exista", async () => {
    const response = await request(app).post("/places/nonExistentId/equipments").send({
      name: "Projector",
      description: "High-quality projector",
      pricePerHour: "R$10,00",
      quantityAvailable: 2,
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Espaço não encontrado");
  });

  it("Deve lançar erro com código 409 (Conflict) caso o equipamento já esteja associado ao espaço", async () => {
    const place = await request(app).post("/places").send({
      name: "someplace",
      address: "somewhere",
      description: "a place for work",
      pricePerHour: "R$19,00",
      availability: "afternoon",
      ownerId: "testId",
    });
    const place_id = place.body.id;

    // Simula que o equipamento já está associado ao espaço
    jest.spyOn(placeService, "addEquipmentToPlace").mockRejectedValueOnce(new Error("Equipamento já associado ao espaço"));

    const response = await request(app).post(`/places/${place_id}/equipments`).send({
      name: "Projector",
      description: "High-quality projector",
      pricePerHour: "R$10,00",
      quantityAvailable: 2,
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Erro ao adicionar equipamento");
  });

  it("Deve remover um equipamento do espaço e retornar sucesso", async () => {
    const place = await request(app).post("/places").send({
      name: "someplace",
      address: "somewhere",
      description: "a place for work",
      pricePerHour: "R$19,00",
      availability: "afternoon",
      ownerId: "testId",
    });
    const place_id = place.body.id;

    const equipment = await request(app).post(`/places/${place_id}/equipments`).send({
      name: "Projector",
      description: "High-quality projector",
      pricePerHour: "R$10,00",
      quantityAvailable: 2,
    });
    const equipmentId = equipment.body.id;

    const response = await request(app).delete(`/places/${place_id}/equipments/${equipmentId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Equipamento removido com sucesso");
  });

  it("Deve lançar erro com código 400 (Bad Request) caso os dados sejam inválidos", async () => {
    const response = await request(app).delete("/places/invalidPlaceId/equipments/invalidEquipmentId");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Dados inválidos");
  });

  it("Deve lançar erro com código 404 (Not Found) caso o equipamento ou o espaço não existam", async () => {
    const response = await request(app).delete("/places/nonExistentPlaceId/equipments/nonExistentEquipmentId");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Equipamento ou espaço não encontrado");
  });

  it("Deve lançar erro com código 409 (Conflict) caso o equipamento não esteja associado ao espaço", async () => {
    const place = await request(app).post("/places").send({
      name: "someplace",
      address: "somewhere",
      description: "a place for work",
      pricePerHour: "R$19,00",
      availability: "afternoon",
      ownerId: "testId",
    });
    const place_id = place.body.id;

    // Simula que o equipamento não está associado ao espaço
    jest.spyOn(placeService, "removeEquipmentFromPlace").mockRejectedValueOnce(new Error("Equipamento não associado ao espaço"));

    const response = await request(app).delete(`/places/${place_id}/equipments/nonExistentEquipmentId`);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Erro ao remover equipamento");
  });
});
