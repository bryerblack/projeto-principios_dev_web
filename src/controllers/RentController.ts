import { Request, Response } from "express";
import { RentService } from "../services/RentService";

const rentService = new RentService();

export class RentController {
  // 🔹 Criar uma nova locação
  async createRent(req: Request, res: Response) {
    try {
      const {
        placeId,
        ownerId,
        renterId,
        totalValue,
        dateTimes,
        status,
        paymentMethod,
      } = req.body;

      const rent = await rentService.createRent({
        placeId,
        ownerId,
        renterId,
        totalValue,
        dateTimes,
        status,
        paymentMethod,
      });

      res.status(201).json(rent);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao criar locação", error: error.message });
    }
  }

  // 🔹 Listar todas as locações
  async getAllRents(req: Request, res: Response) {
    try {
      const rents = await rentService.getAllRents();
      res.json(rents);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter locações", error: error.message });
    }
  }

  // 🔹 Buscar locação por ID
  async getRentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const rent = await rentService.getRentById(id);

      if (!rent) {
        return res.status(404).json({ message: "Locação não encontrada" });
      }

      res.json(rent);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter locação", error: error.message });
    }
  }

  // 🔹 Atualizar uma locação por ID
  async updateRent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedRent = await rentService.updateRent(id, req.body);

      if (!updatedRent) {
        return res.status(404).json({ message: "Locação não encontrada" });
      }

      res.json(updatedRent);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao atualizar locação", error: error.message });
    }
  }

  // 🔹 Deletar uma locação por ID
  async deleteRent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await rentService.deleteRent(id);
      res.json({ message: "Locação deletada com sucesso" });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao deletar locação", error: error.message });
    }
  }
}
