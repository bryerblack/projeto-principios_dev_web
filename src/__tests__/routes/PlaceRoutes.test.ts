import request from "supertest";
import app from "../../server";

describe("Espaços", () => {
  let token: string;
  let placeId: string;
  let place2Id: string;

  beforeAll(async () => {
    const userResponse = await request(app).post("/auth/register").send({
      name: "Usuário Teste",
      email: "usuario@email.com",
      password: "Senha123#",
      phone: "(11) 98765-4321",
      profession: "Engenheiro",
    });

    token = userResponse.body.token;
  });

  it("Deve criar um novo espaço", async () => {
    const response = await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Coworking Teste",
        address: {
          rua: "Avenida Central",
          numero: "123",
          cidade: "São Paulo",
          estado: "SP",
          cep: "01000-000",
          pais: "Brasil",
          bairro: "Centro",
        },
        description: "Espaço para trabalho colaborativo.",
        pricePerHour: 50,
        availability: ["morning", "afternoon"],
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    placeId = response.body.id;
  });

  it("Deve listar os espaços do próprio usuário", async () => {
    const response = await request(app)
      .get("/places/own")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("Deve buscar um espaço por ID", async () => {
    const response = await request(app)
      .get(`/places/${placeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", placeId);
  });

  it("Deve atualizar um espaço", async () => {
    const place = await request(app)
      .post("/places")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Coworking Teste",
        address: {
          rua: "Avenida Central",
          numero: "123",
          cidade: "São Paulo",
          estado: "SP",
          cep: "01000-000",
          pais: "Brasil",
          bairro: "Centro",
        },
        description: "Espaço para trabalho colaborativo.",
        pricePerHour: 50,
        availability: ["morning", "afternoon"],
      });
    place2Id = place.body.id;

    const response = await request(app)
      .put(`/places/${place2Id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Coworking Atualizado",
      });
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Coworking Atualizado");
  });

  it("Deve deletar um espaço", async () => {
    const response = await request(app)
      .delete(`/places/${placeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
