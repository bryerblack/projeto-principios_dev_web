import { Request, Response } from "express";
import { RentService } from "../services/RentService";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { PlaceService } from "../services/PlaceService";
import { HttpError } from "../errors/HttpError";
import { Status } from "../enums/turn.enum";

const rentService = new RentService();
const placeService = new PlaceService();

export class RentController {
  async createRent(req: Request, res: Response) {
    try {
      const {
        placeId,
        ownerId,
        renterId,
        totalValue,
        status,
        paymentMethod,
        schedules,
      } = req.body;

      if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
        return res
          .status(400)
          .json({ message: "Os horários da locação são obrigatórios." });
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

      return res.status(201).json(rent);
    } catch (error: any) {
      const status = error instanceof HttpError ? error.statusCode : 500;
      return res.status(status).json({ message: error.message });
    }
  }

  async getAvailablePlaces(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const places = await placeService.getAvailablePlaces(page, limit);
      return res.json(places);
    } catch (error: any) {
      const status = error instanceof HttpError ? error.statusCode : 500;
      return res.status(status).json({ message: error.message });
    }
  }

  async getAllRents(req: Request, res: Response) {
    try {
      const rents = await rentService.getAllRents();
      return res.json(rents);
    } catch (error: any) {
      const status = error instanceof HttpError ? error.statusCode : 500;
      return res.status(status).json({ message: error.message });
    }
  }

  async getRentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const rent = await rentService.getRentById(id);

      if (!rent) {
        return res.status(404).json({ message: "Locação não encontrada" });
      }

      return res.json(rent);
    } catch (error: any) {
      const status = error instanceof HttpError ? error.statusCode : 500;
      return res.status(status).json({ message: error.message });
    }
  }

  async updateRent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedRent = await rentService.updateRent(id, req.body);

      if (!updatedRent) {
        return res.status(404).json({ message: "Locação não encontrada" });
      }

      return res.json(updatedRent);
    } catch (error: any) {
      const status = error instanceof HttpError ? error.statusCode : 500;
      return res.status(status).json({ message: error.message });
    }
  }

  async deleteRent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await rentService.deleteRent(id);
      return res.json({ message: "Locação deletada com sucesso" });
    } catch (error: any) {
      const status = error instanceof HttpError ? error.statusCode : 500;
      return res.status(status).json({ message: error.message });
    }
  }

  async requestRent(req: AuthenticatedRequest, res: Response) {
    try {
      const { placeId, ownerId, schedules, paymentMethod, totalValue, status } =
        req.body;
      const renterId = req.user.id;

      if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
        return res
          .status(400)
          .json({ message: "Os horários da locação são obrigatórios." });
      }

      const place = await placeService.getPlaceById(placeId);
      if (!place) {
        return res.status(404).json({ message: "Espaço não encontrado." });
      }

      if (place.ownerId === renterId) {
        return res
          .status(403)
          .json({ message: "Você não pode alugar seu próprio espaço." });
      }

      const rent = await rentService.createRent({
        placeId,
        ownerId,
        renterId,
        status,
        totalValue,
        paymentMethod: paymentMethod,
        schedules,
      });

      return res
        .status(201)
        .json({ message: "Solicitação de aluguel criada com sucesso.", rent });
    } catch (error: any) {
      const status = error instanceof HttpError ? error.statusCode : 500;
      return res.status(status).json({ message: error.message });
    }
  }

  async approveOrRejectRent(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["confirmado", "rejeitado"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Status inválido. Use 'aprovado' ou 'rejeitado'." });
      }

      const rent = await rentService.getRentById(id);
      if (!rent) {
        return res.status(404).json({ message: "Locação não encontrada" });
      }

      if (rent.ownerId !== req.user.id) {
        return res.status(403).json({
          message:
            "Você não tem permissão para aprovar ou rejeitar esta locação.",
        });
      }

      const updatedRent = await rentService.updateRent(id, { status });
      return res.json({
        message: `Locação ${status} com sucesso.`,
        rent: updatedRent,
      });
    } catch (error: any) {
      const status = error instanceof HttpError ? error.statusCode : 500;
      return res.status(status).json({ message: error.message });
    }
  }

  async finalizeRent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const rent = await rentService.getRentById(id);
      if (rent.status !== Status.CONFIRMADO) {
        return res
          .status(400)
          .json({
            message: "Apenas locações confirmadas podem ser finalizadas.",
          });
      }

      await rentService.updateRentStatus(id, Status.FINALIZADO);
      res.status(200).json({ message: "Locação finalizada com sucesso" });
    } catch (error: any) {
      res.status(500).json({
        message: "Erro ao finalizar locação",
        error: error.message,
      });
    }
  }

  async getUserRents(req: AuthenticatedRequest, res: Response) {
    try {
      const rents = await rentService.getRentsByUserId(req.user.id);
      return res.json(rents);
    } catch (error: any) {
      const status = error instanceof HttpError ? error.statusCode : 500;
      return res.status(status).json({ message: error.message });
    }
  }

  async cancelRent(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const rent = await rentService.getRentById(id);

      if (!rent) {
        return res.status(404).json({ message: "Locação não encontrada." });
      }

      if (rent.renterId !== req.user.id) {
        return res.status(403).json({
          message: "Você não tem permissão para cancelar esta locação.",
        });
      }

      if (rent.status !== "pendente") {
        return res.status(400).json({
          message: "Somente locações pendentes podem ser canceladas.",
        });
      }

      await rentService.cancelRent(id, req.user.id);
      return res
        .status(200)
        .json({ message: "Locação cancelada com sucesso." });
    } catch (error: any) {
      const status = error instanceof HttpError ? error.statusCode : 500;
      return res.status(status).json({ message: error.message });
    }
  }
}
