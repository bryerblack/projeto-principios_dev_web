import { Address } from "../models/Address";

export class AddressRepository {
  async createAddress(data: {
    cep: string;
    pais: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    complemento?: string;
  }) {
    return await Address.create(data);
  }

  async findByFields(data: { cep: string; rua: string; numero: string }) {
    return await Address.findOne({
      where: {
        cep: data.cep,
        rua: data.rua,
        numero: data.numero,
      },
    });
  }

  async getAllAddresses() {
    return await Address.findAll();
  }

  async getAddressById(id: string) {
    return await Address.findByPk(id);
  }

  async updateAddress(id: string, data: Partial<Address>) {
    const address = await Address.findByPk(id);
    if (!address) return null;
    return await address.update(data);
  }

  async deleteAddress(id: string) {
    return await Address.destroy({ where: { id: id } });
  }
}
