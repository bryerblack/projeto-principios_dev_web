import { Request, Response } from "express";
import { UserService } from "../services/userService";

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password, phone, profession } = req.body;

      const existingUser = await userService.getUserByEmail(email);
      if (existingUser) {
        res.status(409).json({ message: "Email já cadastrado." });
      }

      const user = await userService.createUser({
        name,
        email,
        password,
        phone,
        profession,
      });
      res.status(201).json(user);
    } catch (error: any) {
      if (!res.status) {
        res
          .status(500)
          .json({ message: "Erro ao criar usuário", error: error.message });
      }
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter usuários", error: error.message });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user)
        return res.status(404).json({ message: "Usuário não encontrado" });
      res.json(user);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter usuário", error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      await userService.deleteUser(req.params.id);
      res.json({ message: "Usuário deletado com sucesso" });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao deletar usuário", error: error.message });
    }
  }
}
