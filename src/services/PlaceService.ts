import { PlaceRepository } from "../repositories/PlaceRepository";
import { EquipmentRepository } from "../repositories/EquipmentRepository";
import Address from "../models/Address";
import { AddressRepository } from "../repositories/AddressRepository";

const placeRepository = new PlaceRepository();
const equipmentRepository = new EquipmentRepository();
const addressRepository = new AddressRepository();

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
    let existingAddress = await addressRepository.findByFields(data.address);
    if (!existingAddress) {
      existingAddress = await addressRepository.createAddress(data.address);
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
    return await placeRepository.deletePlace(id);
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
