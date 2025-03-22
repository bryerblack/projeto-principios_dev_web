import { PlaceRepository } from "../repositories/PlaceRepository";
import { EquipmentRepository } from "../repositories/EquipmentRepository";
import Address from "../models/Address";
import { AddressRepository } from "../repositories/AddressRepository";
import { RentRepository } from "../repositories/RentRepository";
import { HttpError } from "../errors/HttpError";

const placeRepository = new PlaceRepository();
const equipmentRepository = new EquipmentRepository();
const addressRepository = new AddressRepository();
const rentRepository = new RentRepository();

export class PlaceService {
  async createPlace(data: {
    name: string;
    address: {
      cep: string;
      pais: string;
      estado: string;
      cidade: string;
      bairro: string;
      rua: string;
      numero: string;
      complemento?: string;
    };
    description?: string;
    pricePerHour: number;
    availability: string[];
    ownerId: string;
  }) {
    // 🔹 Verifica se o endereço já existe antes de criar
    let existingAddress = await addressRepository.findByFields({
      cep: data.address.cep,
      rua: data.address.rua,
      numero: data.address.numero,
    });
    if (!existingAddress) {
      existingAddress = await addressRepository.createAddress(data.address);
    } else {
      // 🔹 Verifica se já existe um espaço nesse endereço
      const existingPlace = await placeRepository.getPlaceByAddress(
        existingAddress.id
      );
      if (existingPlace) {
        throw new HttpError("Endereço já cadastrado.", 409);
      }
    }

    // 🔹 Agora cria o espaço com o ID do endereço
    return await placeRepository.createPlace({
      name: data.name,
      addressId: existingAddress.id,
      description: data.description,
      pricePerHour: data.pricePerHour,
      availability: data.availability,
      ownerId: data.ownerId,
    });
  }

  // 🔹 Obtém a lista de places disponíveis com paginação
  async getAvailablePlaces(page: number = 1, limit: number = 10) {
    try {
      if (page < 1 || limit < 1) {
        throw new HttpError("Parâmetros de paginação inválidos.", 400);
      }

      const offset = (page - 1) * limit;

      const { places, total } = await placeRepository.findAvailablePlaces(
        limit,
        offset
      );

      return {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        pageSize: places.length,
        places,
      };
    } catch (error) {
      throw new HttpError("Erro ao buscar espaços disponíveis.", 500);
    }
  }

  async getAllPlaces() {
    return await placeRepository.getAllPlaces();
  }

  async getPlaceById(id: string) {
    return await placeRepository.getPlaceById(id);
  }

  async getPlacesByOwner(ownerId: string) {
    return await placeRepository.getPlacesByOwner(ownerId);
  }

  async getPlaceByAddress(addressId: string) {
    return await placeRepository.getPlaceByAddress(addressId);
  }

  async updatePlace(
    id: string,
    data: Partial<{
      name: string;
      address: Address;
      description?: string;
      pricePerHour: number;
      availability: string[];
      ownerId: string;
    }>
  ) {
    return await placeRepository.updatePlace(id, data);
  }

  async deletePlace(id: string) {
    const place = await placeRepository.getPlaceById(id);

    if (!place) {
      throw new HttpError("Espaço não encontrado.", 404);
    }

    // 🔹 Verifica se há locações ativas antes de excluir
    const activeRents = await rentRepository.getActiveRentsByPlace(id);
    if (activeRents.length > 0) {
      throw new HttpError("Espaço tem locações ativas", 409);
    }

    await placeRepository.deletePlace(id);
  }

  async addEquipmentToPlace(
    place_id: string,
    data: {
      name: string;
      description?: string;
      pricePerHour: number;
      quantityAvailable: number;
    }
  ) {
    // 🔹 Verifica se o equipamento já existe para esse espaço
    const existingEquipment = await equipmentRepository.findByPlaceAndName(
      place_id,
      data.name
    );

    if (existingEquipment) {
      throw new HttpError("Equipamento já associado ao espaço", 409);
    }

    return await equipmentRepository.createEquipment({ ...data, place_id });
  }

  async removeEquipmentFromPlace(place_id: string, equipmentId: string) {
    const equipment = await equipmentRepository.getEquipmentById(equipmentId);
    if (equipment?.place_id === place_id) {
      return await equipmentRepository.deleteEquipment(equipmentId);
    }
  }
}

export const placeService = new PlaceService();
