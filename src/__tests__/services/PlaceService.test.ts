import { PlaceService } from "../../services/PlaceService";
import { PlaceRepository } from "../../repositories/PlaceRepository";
import { EquipmentRepository } from "../../repositories/EquipmentRepository";
import sequelize from "../../config/database";

describe("PlaceService", () => {
  let placeService: PlaceService;
  let placeRepository: PlaceRepository;
  let equipmentRepository: EquipmentRepository;
  let transaction: any;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    transaction = await sequelize.transaction();
    placeRepository = new PlaceRepository();
    equipmentRepository = new EquipmentRepository();
    placeService = new PlaceService();
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("Deve criar um espaço e retornar o objeto criado quando os dados forem válidos", async () => {
    const placeData = {
      name: "Espaço de Trabalho",
      address: { street: "Rua Teste", number: 123 },
      description: "Um espaço para reuniões",
      pricePerHour: 50,
      availability: ["09:00-18:00"],
      ownerId: "123",
    };

    const result = await placeService.createPlace(placeData);

    expect(result).toHaveProperty("id");
    expect(result.name).toBe(placeData.name);
    expect(result.address).toEqual(placeData.address);
  });

  it("Deve lançar erro com código 400 (Bad Request) caso os dados sejam inválidos ou incompletos", async () => {
    const invalidPlaceData = {
      name: "",
      address: { street: "Rua Teste", number: 123 },
      description: "Um espaço para reuniões",
      pricePerHour: 50,
      availability: ["09:00-18:00"],
      ownerId: "123",
    };

    await expect(placeService.createPlace(invalidPlaceData)).rejects.toThrow("Dados inválidos");
  });

  it("Deve retornar todos os espaços cadastrados", async () => {
    await placeService.createPlace({
      name: "Espaço 1",
      address: { street: "Rua 1", number: 123 },
      description: "Descrição 1",
      pricePerHour: 50,
      availability: ["09:00-18:00"],
      ownerId: "123",
    });
    await placeService.createPlace({
      name: "Espaço 2",
      address: { street: "Rua 2", number: 456 },
      description: "Descrição 2",
      pricePerHour: 60,
      availability: ["10:00-19:00"],
      ownerId: "456",
    });

    const result = await placeService.getAllPlaces();

    expect(result.length).toBe(2);
    expect(result[0].name).toBe("Espaço 1");
    expect(result[1].name).toBe("Espaço 2");
  });

  it("Deve lançar erro com código 404 (Not Found) caso não existam espaços cadastrados", async () => {
    await expect(placeService.getAllPlaces()).rejects.toThrow("Nenhum espaço cadastrado");
  });

  it("Deve retornar o espaço correspondente ao ID", async () => {
    const place = await placeService.createPlace({
      name: "Espaço 1",
      address: { street: "Rua 1", number: 123 },
      description: "Descrição 1",
      pricePerHour: 50,
      availability: ["09:00-18:00"],
      ownerId: "123",
    });

    const result = await placeService.getPlaceById(place.id);

    expect(result).toEqual(place);
  });

  it("Deve lançar erro com código 400 (Bad Request) caso o ID seja inválido", async () => {
    await expect(placeService.getPlaceById("")).rejects.toThrow("ID inválido");
  });

  it("Deve lançar erro com código 404 (Not Found) caso o espaço não exista", async () => {
    await expect(placeService.getPlaceById("999")).rejects.toThrow("Espaço não encontrado");
  });

  it("Deve atualizar um espaço e retornar os dados atualizados", async () => {
    const place = await placeService.createPlace({
      name: "Espaço 1",
      address: { street: "Rua 1", number: 123 },
      description: "Descrição 1",
      pricePerHour: 50,
      availability: ["09:00-18:00"],
      ownerId: "123",
    });

    const updatedPlace = await placeService.updatePlace(place.id, { name: "Espaço Atualizado" });

    expect(updatedPlace.name).toBe("Espaço Atualizado");
  });

  it("Deve lançar erro com código 400 (Bad Request) caso o ID seja inválido ou os dados sejam inválidos", async () => {
    await expect(placeService.updatePlace("", { name: "" })).rejects.toThrow("Dados inválidos");
  });

  it("Deve lançar erro com código 404 (Not Found) caso o espaço não exista", async () => {
    await expect(placeService.updatePlace("999", { name: "Espaço Atualizado" })).rejects.toThrow("Espaço não encontrado");
  });

  it("Deve deletar um espaço e retornar confirmação quando o ID for válido", async () => {
    const place = await placeService.createPlace({
      name: "Espaço 1",
      address: { street: "Rua 1", number: 123 },
      description: "Descrição 1",
      pricePerHour: 50,
      availability: ["09:00-18:00"],
      ownerId: "123",
    });

    const result = await placeService.deletePlace(place.id);

    expect(result).toBe(true);
  });

  it("Deve lançar erro com código 400 (Bad Request) caso o ID seja inválido", async () => {
    await expect(placeService.deletePlace("")).rejects.toThrow("ID inválido");
  });

  it("Deve lançar erro com código 404 (Not Found) caso o espaço não exista", async () => {
    await expect(placeService.deletePlace("999")).rejects.toThrow("Espaço não encontrado");
  });

  it("Deve lançar erro com código 409 (Conflict) caso o espaço tenha locações ativas", async () => {
    const place = await placeService.createPlace({
      name: "Espaço 1",
      address: { street: "Rua 1", number: 123 },
      description: "Descrição 1",
      pricePerHour: 50,
      availability: ["09:00-18:00"],
      ownerId: "123",
    });

    jest.spyOn(placeRepository, "deletePlace").mockRejectedValueOnce(new Error("Espaço tem locações ativas"));

    await expect(placeService.deletePlace(place.id)).rejects.toThrow("Espaço tem locações ativas");
  });

  it("Deve adicionar um equipamento ao espaço e retornar sucesso", async () => {
    const place = await placeService.createPlace({
      name: "Espaço 1",
      address: { street: "Rua 1", number: 123 },
      description: "Descrição 1",
      pricePerHour: 50,
      availability: ["09:00-18:00"],
      ownerId: "123",
    });

    const equipmentData = {
      name: "Projetor",
      description: "Projetor Full HD",
      pricePerHour: 10,
      quantityAvailable: 2,
    };

    const result = await placeService.addEquipmentToPlace(place.id, equipmentData);

    expect(result).toHaveProperty("id");
    expect(result.name).toBe("Projetor");
  });

  it("Deve lançar erro com código 400 (Bad Request) caso os dados do equipamento sejam inválidos", async () => {
    const invalidEquipmentData = {
      name: "",
      description: "Projetor Full HD",
      pricePerHour: 10,
      quantityAvailable: 2,
    };

    await expect(placeService.addEquipmentToPlace("1", invalidEquipmentData)).rejects.toThrow("Dados do equipamento inválidos");
  });

  it("Deve lançar erro com código 404 (Not Found) caso o espaço não exista", async () => {
    const equipmentData = {
      name: "Projetor",
      description: "Projetor Full HD",
      pricePerHour: 10,
      quantityAvailable: 2,
    };

    await expect(placeService.addEquipmentToPlace("999", equipmentData)).rejects.toThrow("Espaço não encontrado");
  });

  it("Deve lançar erro com código 409 (Conflict) caso o equipamento já esteja associado ao espaço", async () => {
    const place = await placeService.createPlace({
      name: "Espaço 1",
      address: { street: "Rua 1", number: 123 },
      description: "Descrição 1",
      pricePerHour: 50,
      availability: ["09:00-18:00"],
      ownerId: "123",
    });

    const equipmentData = {
      name: "Projetor",
      description: "Projetor Full HD",
      pricePerHour: 10,
      quantityAvailable: 2,
    };

    jest.spyOn(equipmentRepository, "createEquipment").mockRejectedValueOnce(new Error("Equipamento já associado ao espaço"));

    await expect(placeService.addEquipmentToPlace(place.id, equipmentData)).rejects.toThrow("Equipamento já associado ao espaço");
  });

  it("Deve remover um equipamento do espaço e retornar sucesso", async () => {
    const place = await placeService.createPlace({
      name: "Espaço 1",
      address: { street: "Rua 1", number: 123 },
      description: "Descrição 1",
      pricePerHour: 50,
      availability: ["09:00-18:00"],
      ownerId: "123",
    });

    const equipment = await placeService.addEquipmentToPlace(place.id, {
      name: "Projetor",
      description: "Projetor Full HD",
      pricePerHour: 10,
      quantityAvailable: 2,
    });

    const result = await placeService.removeEquipmentFromPlace(place.id, equipment.id);

    expect(result).toBe(true);
  });

  it("Deve lançar erro com código 400 (Bad Request) caso os dados sejam inválidos", async () => {
    await expect(placeService.removeEquipmentFromPlace("", "")).rejects.toThrow("Dados inválidos");
  });

  it("Deve lançar erro com código 404 (Not Found) caso o equipamento ou o espaço não existam", async () => {
    await expect(placeService.removeEquipmentFromPlace("999", "999")).rejects.toThrow("Equipamento ou espaço não encontrado");
  });

  it("Deve lançar erro com código 409 (Conflict) caso o equipamento não esteja associado ao espaço", async () => {
    const place = await placeService.createPlace({
      name: "Espaço 1",
      address: { street: "Rua 1", number: 123 },
      description: "Descrição 1",
      pricePerHour: 50,
      availability: ["09:00-18:00"],
      ownerId: "123",
    });

    const equipment = await placeService.addEquipmentToPlace(place.id, {
      name: "Projetor",
      description: "Projetor Full HD",
      pricePerHour: 10,
      quantityAvailable: 2,
    });

    jest.spyOn(equipmentRepository, "deleteEquipment").mockRejectedValueOnce(new Error("Equipamento não associado ao espaço"));

    await expect(placeService.removeEquipmentFromPlace(place.id, equipment.id)).rejects.toThrow("Equipamento não associado ao espaço");
  });
});