import { RentService } from "../../services/RentService";
import { RentRepository } from "../../repositories/RentRepository";
import { RentScheduleRepository } from "../../repositories/RentScheduleRepository";
import { PlaceRepository } from "../../repositories/PlaceRepository";
import Rent from "../../models/Rent";

jest.mock("../repositories/RentRepository");
jest.mock("../repositories/RentScheduleRepository");
jest.mock("../repositories/PlaceRepository");

const rentService = new RentService();
const rentRepository = new RentRepository();
const rentScheduleRepository = new RentScheduleRepository();
const placeRepository = new PlaceRepository();

describe("RentService", () => {
  let mockRentId: string;
  let mockUserId: string;
  let mockPlaceId: string;

  beforeEach(() => {
    mockRentId = "12345";
    mockUserId = "user123";
    mockPlaceId = "place123";

    rentRepository.createRent = jest.fn().mockResolvedValue({
      id: mockRentId,
      placeId: mockPlaceId,
      ownerId: mockUserId,
      renterId: "renter123",
      totalValue: 1000,
      status: "pending",
      paymentMethod: "credit_card",
      schedules: [{ startDate: "2025-05-01", endDate: "2025-05-07" }],
    });

    rentRepository.getRentById = jest.fn().mockResolvedValue({
      id: mockRentId,
      placeId: mockPlaceId,
      ownerId: mockUserId,
      renterId: "renter123",
      totalValue: 1000,
      status: "pending",
      paymentMethod: "credit_card",
      schedules: [{ startDate: "2025-05-01", endDate: "2025-05-07" }],
    });

    rentRepository.updateRent = jest.fn().mockResolvedValue({
      id: mockRentId,
      placeId: mockPlaceId,
      ownerId: mockUserId,
      renterId: "renter123",
      totalValue: 1200,
      status: "approved",
      paymentMethod: "credit_card",
      schedules: [{ startDate: "2025-05-01", endDate: "2025-05-08" }],
    });

    rentRepository.deleteRent = jest.fn().mockResolvedValue({ success: true });
    rentRepository.getAllRents = jest.fn().mockResolvedValue([
      {
        id: mockRentId,
        placeId: mockPlaceId,
        ownerId: mockUserId,
        renterId: "renter123",
        totalValue: 1000,
        status: "pending",
        paymentMethod: "credit_card",
        schedules: [{ startDate: "2025-05-01", endDate: "2025-05-07" }],
      },
    ]);

    rentRepository.getRentsByUser = jest.fn().mockResolvedValue([
      {
        id: mockRentId,
        placeId: mockPlaceId,
        ownerId: mockUserId,
        renterId: "renter123",
        totalValue: 1000,
        status: "pending",
        paymentMethod: "credit_card",
        schedules: [{ startDate: "2025-05-01", endDate: "2025-05-07" }],
      },
    ]);

    placeRepository.getPlacesByOwner = jest.fn().mockResolvedValue([
      {
        id: mockPlaceId,
        ownerId: mockUserId,
        name: "Test Place",
        address: "123 Street",
      },
    ]);

    rentScheduleRepository.createSchedules = jest.fn().mockResolvedValue([
      {
        rentId: mockRentId,
        startDate: new Date("2025-05-01"),
        endDate: new Date("2025-05-07"),
      },
    ]);

    rentScheduleRepository.deleteSchedulesByRentId = jest.fn().mockResolvedValue({
      success: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Teste para createRent
  it("Deve criar uma locação com sucesso (Código HTTP 201)", async () => {
    const rentData = {
      placeId: mockPlaceId,
      ownerId: mockUserId,
      renterId: "renter123",
      totalValue: 1000,
      status: "pending",
      paymentMethod: "credit_card",
      schedules: [{ startDate: "2025-05-01", endDate: "2025-05-07" }],
    };

    const rent = await rentService.createRent(rentData);

    expect(rent).toHaveProperty("id");
    expect(rent.placeId).toEqual(mockPlaceId);
    expect(rent.status).toEqual("pending");
    expect(rent.schedules.length).toBeGreaterThan(0);
  });

  it("Deve lançar erro se não fornecer dados obrigatórios na criação (Código HTTP 400)", async () => {
    const rentData = {
      placeId: "", // Dados obrigatórios estão faltando
      ownerId: mockUserId,
      renterId: "renter123",
      totalValue: 1000,
      status: "pending",
      paymentMethod: "credit_card",
      schedules: [{ startDate: "2025-05-01", endDate: "2025-05-07" }],
    };

    await expect(rentService.createRent(rentData)).rejects.toThrowError(
      new Error("Place ID is required")
    );
  });

  it("Deve lançar erro se os dados de pagamento forem inválidos (Código HTTP 400)", async () => {
    const rentData = {
      placeId: mockPlaceId,
      ownerId: mockUserId,
      renterId: "renter123",
      totalValue: 1000,
      status: "pending",
      paymentMethod: "", // Método de pagamento inválido
      schedules: [{ startDate: "2025-05-01", endDate: "2025-05-07" }],
    };

    await expect(rentService.createRent(rentData)).rejects.toThrowError(
      new Error("Invalid payment method")
    );
  });

  // Testes para getAllRents
  it("Deve retornar todas as locações cadastradas (Código HTTP 200)", async () => {
    const rents = await rentService.getAllRents();

    expect(rents).toHaveLength(1);
    expect(rents[0]).toHaveProperty("id");
  });

  it("Deve lançar erro se não houver locações (Código HTTP 404)", async () => {
    rentRepository.getAllRents = jest.fn().mockResolvedValue([]);

    await expect(rentService.getAllRents()).rejects.toThrowError(
      new Error("No rents found")
    );
  });

  // Testes para getRentById
  it("Deve retornar a locação correspondente ao ID (Código HTTP 200)", async () => {
    const rent = await rentService.getRentById(mockRentId);

    expect(rent).toHaveProperty("id", mockRentId);
    expect(rent.ownerId).toEqual(mockUserId);
  });

  it("Deve lançar erro se a locação não for encontrada (Código HTTP 404)", async () => {
    rentRepository.getRentById = jest.fn().mockResolvedValue(null);

    await expect(rentService.getRentById(mockRentId)).rejects.toThrowError(
      new Error("Rent not found")
    );
  });

  // Testes para updateRent
  it("Deve atualizar a locação e retornar os dados atualizados (Código HTTP 200)", async () => {
    const updatedRent = await rentService.updateRent(mockRentId, {
      totalValue: 1200,
      status: "approved",
      schedules: [{ startDate: "2025-05-01", endDate: "2025-05-08" }],
    });

    expect(updatedRent.totalValue).toEqual(1200);
    expect(updatedRent.status).toEqual("approved");
    expect(updatedRent.schedules.length).toBeGreaterThan(0);
  });

  it("Deve lançar erro se a locação não for encontrada para atualização (Código HTTP 404)", async () => {
    rentRepository.updateRent = jest.fn().mockResolvedValue(null);

    await expect(
      rentService.updateRent(mockRentId, {
        totalValue: 1200,
        status: "approved",
        schedules: [{ startDate: "2025-05-01", endDate: "2025-05-08" }],
      })
    ).rejects.toThrowError(new Error("Rent not found to update"));
  });

  // Testes para deleteRent
  it("Deve deletar a locação e retornar confirmação (Código HTTP 200)", async () => {
    const response = await rentService.deleteRent(mockRentId);

    expect(response).toHaveProperty("success", true);
  });

  it("Deve lançar erro se a locação não for encontrada para exclusão (Código HTTP 404)", async () => {
    rentRepository.deleteRent = jest.fn().mockResolvedValue(null);

    await expect(rentService.deleteRent(mockRentId)).rejects.toThrowError(
      new Error("Rent not found to delete")
    );
  });
});