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
        return;
      }

      const user = await userService.createUser({
        name,
        email,
        password,
        phone,
        profession,
      });
      res.status(201).json(user);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao criar usuário", error: error.message });
      return;
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      if (users.length === 0){
        res.status(204)
        .json("Nenhum usuário encontrado.");
        return;
      }
      res.json(users);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter usuários", error: error.message });
      return;
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }
      res.json(user);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter usuário", error: error.message });
      return;
    }
  }

  async getUserByEmail(req: Request, res: Response) {
    try {
      const user = await userService.getUserByEmail(req.params.email);
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }
      res.json(user);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter usuário", error: error.message });
      return;
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, password, phone, profession } = req.body;

      if (!id) {
        res.status(400).json({ message: "ID do usuário é obrigatório" });
        return;
      }

      const existingUser = await userService.getUserById(id);
      if (existingUser === null) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      if (email && email !== existingUser.email) {
        const emailExists = await userService.getUserByEmail(email);
        if (emailExists) {
          res.status(409).json({ message: "Email já cadastrado." });
          return;
        }
      }

      const updatedUser = await userService.updateUser(id, {
        name,
        email,
        password,
        phone,
        profession,
      });

      res.status(200).json(updatedUser);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao atualizar usuário", error: error.message });
      return;
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "ID do usuário é obrigatório" });
        return;
      }

      const user = await userService.getUserById(id);
      if (user === null) {
        res.status(404).json({ message: "Usuário não encontrado." });
        return;
      }

      await userService.deleteUser(id);
      res.json({ message: "Usuário deletado com sucesso." });
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao deletar usuário", error: error.message });
      return;
    }
  }
}
