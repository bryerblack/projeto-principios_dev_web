import { UserRepository } from "../repositories/UserRepository";

const userRepository = new UserRepository();

export class UserService {
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    profession?: string;
  }) {
    return await userRepository.createUser(data);
  }

  async getAllUsers() {
    return await userRepository.getAllUsers();
  }

  async getUserById(id: string) {
    return await userRepository.getUserById(id);
  }

  async getUserByEmail(email: string){
    return await userRepository.getUserByEmail(email);
  }

  async updateUser(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      password: string;
      phone: string;
      profession?: string;
    }>
  ) {
    return await userRepository.updateUser(id, data);
  }

  async deleteUser(id: string) {
    return await userRepository.deleteUser(id);
  }
}
