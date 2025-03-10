import { Request, Response } from "express";
import { PlaceService } from "../services/PlaceService";

const placeService = new PlaceService();

export class PlaceController {
  async createPlace(req: Request, res: Response) {
    try {
      const {
        name,
        address,
        description,
        pricePerHour,
        availability,
        ownerId,
      } = req.body;
      const place = await placeService.createPlace({
        name,
        address,
        description,
        pricePerHour,
        availability,
        ownerId,
      });
      res.status(201).json(place);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao criar espaço", error: error.message });
    }
  }

  async getAllPlaces(req: Request, res: Response) {
    try {
      const places = await placeService.getAllPlaces();
      res.json(places);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter espaços", error: error.message });
    }
  }

  async getPlaceById(req: Request, res: Response) {
    try {
      const place = await placeService.getPlaceById(req.params.id);
      if (!place)
        return res.status(404).json({ message: "Espaço não encontrado" });
      res.json(place);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter espaço", error: error.message });
    }
  }

  async getOwnPlaces(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id; // 🔹 Pega o ID do usuário autenticado
      const places = await placeService.getPlacesByOwner(userId);
      res.json(places);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter seus espaços", error: error.message });
    }
  }

  async updatePlace(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const place = await placeService.getPlaceById(id);

      if (!place) {
        return res.status(404).json({ message: "Espaço não encontrado." });
      }

      if (place.ownerId !== userId) {
        return res
          .status(403)
          .json({ message: "Você não tem permissão para editar este espaço." });
      }

      const updatedPlace = await placeService.updatePlace(id, req.body);
      res.status(200).json(updatedPlace);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao atualizar espaço", error: error.message });
    }
  }

  async deletePlace(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const place = await placeService.getPlaceById(id);

      if (!place) {
        return res.status(404).json({ message: "Espaço não encontrado." });
      }

      if (place.ownerId !== userId) {
        return res
          .status(403)
          .json({
            message: "Você não tem permissão para deletar este espaço.",
          });
      }

      await placeService.deletePlace(id);
      res.json({ message: "Espaço deletado com sucesso." });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao deletar espaço", error: error.message });
    }
  }

  async addEquipmentToPlace(req: Request, res: Response) {
    try {
      const { place_id } = req.params;
      const { name, description, pricePerHour, quantityAvailable } = req.body;

      const equipment = await placeService.addEquipmentToPlace(place_id, {
        name,
        description,
        pricePerHour,
        quantityAvailable,
      });
      res.status(201).json(equipment);
    } catch (error: any) {
      res.status(500).json({
        message: "Erro ao adicionar equipamento",
        error: error.message,
      });
    }
  }

  async removeEquipmentFromPlace(req: Request, res: Response) {
    try {
      const { place_id, equipmentId } = req.params;
      await placeService.removeEquipmentFromPlace(place_id, equipmentId);
      res.json({ message: "Equipamento removido com sucesso" });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao remover equipamento", error: error.message });
    }
  }
}
