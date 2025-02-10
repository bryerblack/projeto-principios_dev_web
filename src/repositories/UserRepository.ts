import User from "../models/User";

export class UserRepository {
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    profession?: string;
  }) {
    return await User.create(data);
  }

  async getAllUsers() {
    return await User.findAll();
  }

  async getUserById(id: string) {
    return await User.findByPk(id);
  }

  async updateUser(id: string, data: Partial<User>) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(data);
  }

  async deleteUser(id: string) {
    return await User.destroy({ where: { id } });
  }
}
