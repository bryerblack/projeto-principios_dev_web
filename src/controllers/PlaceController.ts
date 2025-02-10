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

  async deletePlace(req: Request, res: Response) {
    try {
      await placeService.deletePlace(req.params.id);
      res.json({ message: "Espaço deletado com sucesso" });
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
      res
        .status(500)
        .json({
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
