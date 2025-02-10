import Equipment from "../models/Equipment";

export class EquipmentRepository {
  async createEquipment(data: { name: string; description?: string; pricePerHour: number; quantityAvailable: number; place_id: string }) {
    return await Equipment.create(data);
  }

  async getAllEquipments() {
    return await Equipment.findAll();
  }

  async getEquipmentById(id: string) {
    return await Equipment.findByPk(id);
  }

  async updateEquipment(id: string, data: Partial<Equipment>) {
    const equipment = await Equipment.findByPk(id);
    if (!equipment) return null;
    return await equipment.update(data);
  }

  async deleteEquipment(id: string) {
    return await Equipment.destroy({ where: { id } });
  }
}
