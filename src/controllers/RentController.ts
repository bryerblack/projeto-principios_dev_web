import { Request, Response } from "express";
import { RentService } from "../services/RentService";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { PlaceService } from "../services/PlaceService";

const rentService = new RentService();
const placeService = new PlaceService();

export class RentController {
  // 🔹 Criar uma nova locação
  async createRent(req: Request, res: Response) {
    try {
      const {
        placeId,
        ownerId,
        renterId,
        totalValue,
        status,
        paymentMethod,
        schedules, // Novo campo
      } = req.body;

      if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
        res
          .status(400)
          .json({ message: "Os horários da locação são obrigatórios." });
        return;
      }

      const rent = await rentService.createRent({
        placeId,
        ownerId,
        renterId,
        totalValue,
        status,
        paymentMethod,
        schedules,
      });

      res.status(201).json(rent);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao criar locação", error: error.message });
      return;
    }
  }

  // 🔹 Listar todas as locações
  async getAllRents(req: Request, res: Response) {
    try {
      const rents = await rentService.getAllRents();
      res.json(rents);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter locações", error: error.message });
      return;
    }
  }

  // 🔹 Buscar locação por ID
  async getRentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const rent = await rentService.getRentById(id);

      if (!rent) {
        res.status(404).json({ message: "Locação não encontrada" });
        return;
      }

      res.json(rent);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter locação", error: error.message });
      return;
    }
  }

  // 🔹 Atualizar uma locação por ID
  async updateRent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedRent = await rentService.updateRent(id, req.body);

      if (!updatedRent) {
        res.status(404).json({ message: "Locação não encontrada" });
        return;
      }

      res.json(updatedRent);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao atualizar locação", error: error.message });
      return;
    }
  }

  // 🔹 Deletar uma locação por ID
  async deleteRent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await rentService.deleteRent(id);
      res.json({ message: "Locação deletada com sucesso" });
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao deletar locação", error: error.message });
      return;
    }
  }

  // 🔹 Criar uma nova solicitação de aluguel
  async requestRent(req: AuthenticatedRequest, res: Response) {
    try {
      const { placeId, schedules } = req.body;
      const renterId = req.user.id;

      // ✅ 1. Verifica se os horários foram fornecidos corretamente
      if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
        res
          .status(400)
          .json({ message: "Os horários da locação são obrigatórios." });
        return;
      }

      // ✅ 2. Verifica se o espaço existe e recupera o `ownerId`
      const place = await placeService.getPlaceById(placeId);
      if (!place) {
        res.status(404).json({ message: "Espaço não encontrado." });
        return;
      }

      const ownerId = place.ownerId; // 🔹 Obtém o dono do espaço

      // ✅ 3. Calcula o total do aluguel com base na duração e preço por hora
      let totalValue = 0;
      schedules.forEach((schedule: { startDate: string; endDate: string }) => {
        const startTime = new Date(schedule.startDate).getTime();
        const endTime = new Date(schedule.endDate).getTime();

        if (endTime <= startTime) {
          res.status(400).json({
            message: "Data de fim deve ser posterior à data de início.",
          });
          return;
        }

        const durationInHours = (endTime - startTime) / (1000 * 60 * 60);
        totalValue += durationInHours * place.pricePerHour;
      });

      // ✅ 4. Cria a locação com status pendente
      const rent = await rentService.createRent({
        placeId,
        ownerId, // 🔹 Agora incluímos `ownerId`
        renterId,
        status: "pendente",
        totalValue,
        paymentMethod: "não definido",
        schedules,
      });

      res.status(201).json(rent);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao solicitar aluguel", error: error.message });
      return;
    }
  }

  // 🔹 Aprovar ou negar uma solicitação de aluguel
  async approveOrRejectRent(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["approved", "rejected"].includes(status)) {
        res
          .status(400)
          .json({ message: "Status inválido. Use 'approved' ou 'rejected'." });
        return;
      }

      const rent = await rentService.getRentById(id);

      if (!rent) {
        res.status(404).json({ message: "Locação não encontrada" });
        return;
      }

      if (rent.ownerId !== req.user.id) {
        res.status(403).json({
          message:
            "Você não tem permissão para aprovar ou rejeitar esta locação.",
        });
        return;
      }

      const updatedRent = await rentService.updateRent(id, { status });

      res.json({
        message: `Locação ${status} com sucesso.`,
        rent: updatedRent,
      });
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao processar locação", error: error.message });
      return;
    }
  }

  // 🔹 Listar locações do usuário (pendentes, futuras e finalizadas)
  async getUserRents(req: AuthenticatedRequest, res: Response) {
    try {
      const rents = await rentService.getRentsByUserId(req.user.id);
      res.json(rents);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter locações", error: error.message });
      return;
    }
  }

  async cancelRent(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const rent = await rentService.getRentById(id);

      if (!rent) {
        res.status(404).json({ message: "Locação não encontrada." });
        return;
      }

      if (rent.renterId !== req.user.id) {
        res.status(403).json({
          message: "Você não tem permissão para cancelar esta locação.",
        });
        return;
      }

      if (rent.status !== "pending") {
        res.status(400).json({
          message: "Somente locações pendentes podem ser canceladas.",
        });
        return;
      }

      await rentService.deleteRent(id);

      res.json({ message: "Locação cancelada com sucesso." });
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao cancelar locação", error: error.message });
      return;
    }
  }
}
