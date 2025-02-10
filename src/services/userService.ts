import User from "../models/User";

export class UserService {
  async createUser(name: string, email: string, password: string) {
    return await User.create({ name, email, password, id:0 });
  }

  async getAllUsers() {
    return await User.findAll();
  }

  async getUserById(id: number) {
    return await User.findByPk(id);
  }
}
