import request from "supertest";
import sequelize from "../../config/database";
import app from "../../server";
import Address from "../../models/Address";
import { AddressRepository } from "../../repositories/AddressRepository";

describe("Testes de PlaceController", () => {
  let transaction: any;
  let token: string;
  let userId: string;
  let address: Address;
  let address2: Address;
  let placeId: string;
  let place2Id: string;
  const addressRepository = new AddressRepository();

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    const addressCreation = await addressRepository.createAddress({
      cep: "58433264",
      pais: "Brasil",
      estado: "São Paulo",
      cidade: "São Paulo",
      bairro: "Centro",
      rua: "Rua das Rosas",
      numero: "123",
      complemento: "Apto 45",
    });

    address = addressCreation.dataValues;

    const address2Creation = await addressRepository.createAddress({
      cep: "12345618",
      pais: "Brasil",
      estado: "Rio de Janeiro",
      cidade: "Rio de Janeiro",
      bairro: "Copacabana",
      rua: "Avenida Atlântica",
      numero: "456",
      complemento: "Sala 10",
    });

    address2 = address2Creation.dataValues;
    // 🔹 Criar um usuário de teste e obter o token de autenticação
    const userResponse = await request(app).post("/auth/register").send({
      name: "Usuário Teste",
      email: "test@example.com",
      password: "Senha123#",
      phone: "(11) 98765-4321",
      profession: "Engenheiro",
      role: "admin",
    });
    userId = userResponse.body.user.id;

    // 🔹 Autenticar o usuário e obter o token
    const loginResponse = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "Senha123#",
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

  it("Deve criar um espaço e retornar código 201", async () => {
    const response = await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "someplace",
        address: address,
        description: "a place for work",
        pricePerHour: 19.0,
        availability: "afternoon",
        ownerId: userId,
      });
    placeId = response.body.id;
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.ownerId).toBe(userId);
  });

  it("Não deve criar um espaço e deve retornar código 409 caso receba um endereço já cadastrado", async () => {
    await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "someplace",
        address,
        description: "a place for work",
        pricePerHour: 19.0,
        availability: "afternoon",
        ownerId: userId,
      });

    const response = await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "another lace",
        address,
        description: "a place for work, again",
        pricePerHour: 20.0,
        availability: "night",
        ownerId: userId,
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Endereço já cadastrado.");
  });

  it("Deve retornar código 400 (Bad Request) caso os dados sejam inválidos ou incompletos", async () => {
    const response = await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "someplace",
        address: null,
        description: "a place for work",
        pricePerHour: 19.0,
        availability: "afternoon",
        ownerId: userId,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Dados do espaço inválidos");
  });

  it("Deve retornar código 200 (OK) e a lista de espaços cadastrados caso existam espaços.", async () => {
    await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "someplace",
        address,
        description: "a place for work",
        pricePerHour: 19.0,
        availability: "afternoon",
        ownerId: userId,
      });

    const aux = await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "another place",
        address: address2,
        description: "a place for work, again",
        pricePerHour: 20.0,
        availability: "night",
        ownerId: userId,
      });
    place2Id = aux.body.id;

    const response = await request(app)
      .get("/places/own")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(1);
  });

  it("Deve retornar código 204 (No Content) caso não existam espaços cadastrados.", async () => {
    await request(app)
      .delete(`/places/${placeId}`)
      .set("Authorization", `Bearer ${token}`);
    await request(app)
      .delete(`/places/${place2Id}`)
      .set("Authorization", `Bearer ${token}`);
    const response = await request(app)
      .get("/places/own")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it("Deve retornar código 200 (OK) e os detalhes do espaço caso o ID seja válido e corresponda a um espaço existente.", async () => {
    const place = await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "someplace",
        address,
        description: "a place for work",
        pricePerHour: 19.0,
        availability: "afternoon",
        ownerId: userId,
      });

    const id = place.body.id;

    const response = await request(app)
      .get(`/places/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.ownerId).toBe(userId);
  });

  it("Deve retornar código 404 (Not Found) caso o ID não corresponda a um espaço existente.", async () => {
    const response = await request(app)
      .get("/places/id")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Espaço não encontrado");
  });

  it("Deve atualizar o espaço e retornar código 200 (OK) quando receber dados válidos.", async () => {
    const place = await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "someplace",
        address,
        description: "a place for work",
        pricePerHour: 19.0,
        availability: "afternoon",
        ownerId: userId,
      });
    const id = place.body.id;

    const response = await request(app)
      .put(`/places/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "someplaceNew",
        address: address2,
        description: "a new place for work",
        pricePerHour: 19.0,
        availability: "afternoon",
        ownerId: userId,
      });
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("someplaceNew");
  });

  it("Deve retornar código 400 (Bad Request) caso o ID seja inválido ou os dados sejam inválidos.", async () => {
    const place = await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "someplace",
        address,
        description: "a place for work",
        pricePerHour: 19.0,
        availability: "afternoon",
        ownerId: "testId",
      });
    const id = place.body.id;

    const response = await request(app)
      .put(`/places/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "someplaceNew",
        description: "a new place for work",
        pricePerHour: 12.0,
        availability: "afternoon",
        ownerId: "testId",
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Dados inválidos");
  });

  it("Deve retornar código 400 (Bad Request) caso o ID seja inválido ou os dados sejam inválidos.", async () => {
    const response = await request(app)
      .put("/places/id")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "someplaceNew",
        address: address2,
        description: "a new place for work",
        pricePerHour: 12.0,
        availability: "afternoon",
        ownerId: userId,
      });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Espaço não encontrado.");
  });

  it("Deve deletar um espaço e retornar confirmação quando o ID for válido", async () => {
    const place = await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "someplace",
        address,
        description: "a place for work",
        pricePerHour: 19.0,
        availability: "afternoon",
        ownerId: userId,
      });
    const id = place.body.id;

    const response = await request(app)
      .delete(`/places/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Espaço deletado com sucesso.");
  });

  it("Deve lançar erro com código 404 (Not Found) caso o espaço não exista", async () => {
    const response = await request(app)
      .delete("/places/nonExistentId")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Espaço não encontrado.");
  });

  it("Deve adicionar um equipamento ao espaço e retornar sucesso", async () => {
    const place = await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "someplace",
        address,
        description: "a place for work",
        pricePerHour: 19.0,
        availability: "afternoon",
        ownerId: userId,
      });
    const place_id = place.body.id;

    const response = await request(app)
      .post(`/places/${place_id}/equipments`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Projector",
        description: "High-quality projector",
        pricePerHour: 10.0,
        quantityAvailable: 2,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("Deve lançar erro com código 400 (Bad Request) caso os dados do equipamento sejam inválidos", async () => {
    const place = await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "someplace",
        address,
        description: "a place for work",
        pricePerHour: 19.0,
        availability: "afternoon",
        ownerId: userId,
      });
    const place_id = place.body.id;

    const response = await request(app)
      .post(`/places/${place_id}/equipments`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: null,
        description: "High-quality projector",
        pricePerHour: 10.0,
        quantityAvailable: 2,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Dados do equipamento inválidos");
  });

  it("Deve lançar erro com código 404 (Not Found) caso o espaço não exista", async () => {
    const response = await request(app)
      .post("/places/nonExistentId/equipments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Projector",
        description: "High-quality projector",
        pricePerHour: 10.0,
        quantityAvailable: 2,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Espaço não encontrado");
  });

  it("Deve remover um equipamento do espaço e retornar sucesso", async () => {
    const place = await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "someplace",
        address,
        description: "a place for work",
        pricePerHour: 19.0,
        availability: "afternoon",
        ownerId: "testId",
      });
    const place_id = place.body.id;

    const equipment = await request(app)
      .post(`/places/${place_id}/equipments`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Projector",
        description: "High-quality projector",
        pricePerHour: 10.0,
        quantityAvailable: 2,
      });
    const equipmentId = equipment.body.id;

    const response = await request(app)
      .delete(`/places/${place_id}/equipments/${equipmentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Equipamento removido com sucesso");
  });

  it("Deve lançar erro com código 404 (Not Found) caso o equipamento ou o espaço não existam", async () => {
    const response = await request(app)
      .delete("/places/nonExistentPlaceId/equipments/nonExistentEquipmentId")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Espaço não encontrado");
  });
});
