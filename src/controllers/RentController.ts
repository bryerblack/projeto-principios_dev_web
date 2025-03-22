import { Request, Response } from "express";
import { RentService } from "../services/RentService";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { PlaceService } from "../services/PlaceService";
import { HttpError } from "../errors/HttpError";

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
      const status = error instanceof HttpError ? error.statusCode : 500;
      res.status(status).json({ message: error.message });
      return;
    }
  }

  // 🔹 Rota para buscar places disponíveis com paginação
  async getAvailablePlaces(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const places = await placeService.getAvailablePlaces(page, limit);
      res.json(places);
    } catch (error: any) {
      const status = error instanceof HttpError ? error.statusCode : 500;
      res.status(status).json({ message: error.message });
    }
  }

  // 🔹 Listar todas as locações
  async getAllRents(req: Request, res: Response) {
    try {
      const rents = await rentService.getAllRents();
      res.json(rents);
      return;
    } catch (error: any) {
      const status = error instanceof HttpError ? error.statusCode : 500;
      res.status(status).json({ message: error.message });
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
      const status = error instanceof HttpError ? error.statusCode : 500;
      res.status(status).json({ message: error.message });
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
      const status = error instanceof HttpError ? error.statusCode : 500;
      res.status(status).json({ message: error.message });
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
      const status = error instanceof HttpError ? error.statusCode : 500;
      res.status(status).json({ message: error.message });
      return;
    }
  }

  // 🔹 Usuário solicita um aluguel para um Place
  async requestRent(req: AuthenticatedRequest, res: Response) {
    try {
      const { placeId, schedules } = req.body;
      const renterId = req.user.id;

      if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
        res
          .status(400)
          .json({ message: "Os horários da locação são obrigatórios." });
        return;
      }

      const place = await placeService.getPlaceById(placeId);
      if (!place) {
        res.status(404).json({ message: "Espaço não encontrado." });
        return;
      }

      // 🔹 Um usuário não pode alugar seu próprio espaço
      if (place.ownerId === renterId) {
        res
          .status(403)
          .json({ message: "Você não pode alugar seu próprio espaço." });
        return;
      }

      // 🔹 Calcula o valor total do aluguel
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
        totalValue += durationInHours * place.pricePerTurn;
      });

      // 🔹 Cria a solicitação de aluguel
      const rent = await rentService.createRent({
        placeId,
        ownerId: place.ownerId,
        renterId,
        status: "pending",
        totalValue,
        paymentMethod: "not_defined",
        schedules,
      });

      res
        .status(201)
        .json({ message: "Solicitação de aluguel criada com sucesso.", rent });
      return;
    } catch (error: any) {
      const status = error instanceof HttpError ? error.statusCode : 500;
      res.status(status).json({ message: error.message });
      return;
    }
  }

  // 🔹 Dono do place pode aprovar ou rejeitar uma solicitação
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

      // 🔹 Somente o dono do Place pode aprovar/rejeitar
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
      const status = error instanceof HttpError ? error.statusCode : 500;
      res.status(status).json({ message: error.message });
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
      const status = error instanceof HttpError ? error.statusCode : 500;
      res.status(status).json({ message: error.message });
      return;
    }
  }

  // 🔹 Usuário pode cancelar um pedido pendente
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

      await rentService.cancelRent(id, req.user.id);
      res.status(200).json({ message: "Locação cancelada com sucesso." });
      return;
    } catch (error: any) {
      const status = error instanceof HttpError ? error.statusCode : 500;
      res.status(status).json({ message: error.message });
      return;
    }
  }
}
