import { Request, Response } from "express";
import { PlaceService } from "../services/PlaceService";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

const placeService = new PlaceService();

export class PlaceController {
  async createPlace(req: Request, res: Response) {
    try {
      if (!(req as AuthenticatedRequest).user) {
        res
          .status(401)
          .json({ message: "Acesso negado. Token não fornecido." });
        return;
      }

      const ownerId = (req as AuthenticatedRequest).user.id;
      const { name, address, description, pricePerTurn, availability } =
        req.body;

      if (!name || !address || !description || !pricePerTurn || !availability) {
        res.status(400).json({ message: "Dados do espaço inválidos" });
        return;
      }

      const place = await placeService.createPlace({
        name,
        address,
        description,
        pricePerTurn,
        availability,
        ownerId,
      });

      res.status(201).json(place);
      return;
    } catch (error: any) {
      if (error.message === "Endereço já cadastrado.") {
        res
          .status(409)
          .json({ message: "Endereço já cadastrado.", error: error.message });
        return;
      }
      res
        .status(500)
        .json({ message: "Erro ao criar espaço", error: error.message });
      return;
    }
  }

  async getAllPlaces(req: Request, res: Response) {
    try {
      const places = await placeService.getAllPlaces();
      if (places.length === 0) {
        res.status(204).json({ message: "Nenhum espaço cadastrado" });
        return;
      }
      res.status(200).json(places);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter espaços", error: error.message });
      return;
    }
  }

  async getPlaceById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "Id de espaço inválido" });
        return;
      }

      const place = await placeService.getPlaceById(id);
      if (!place) {
        res.status(404).json({ message: "Espaço não encontrado" });
        return;
      }
      res.status(200).json(place);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter espaço", error: error.message });
      return;
    }
  }

  async updatePlace(req: Request, res: Response) {
    try {
      if (!(req as AuthenticatedRequest).user) {
        res
          .status(401)
          .json({ message: "Acesso negado. Token não fornecido." });
        return;
      }

      const userId = (req as any).user.id;
      const { id } = req.params;

      const place = await placeService.getPlacesByOwner(userId);
      if (!place || place.length === 0) {
        res.status(404).json({ message: "Espaço não encontrado." });
        return;
      }

      if (place[0].ownerId !== userId) {
        res
          .status(403)
          .json({ message: "Você não tem permissão para editar este espaço." });
        return;
      }

      const updatedPlace = await placeService.updatePlace(id, req.body);
      res.status(200).json(updatedPlace);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao atualizar espaço", error: error.message });
      return;
    }
  }

  async getOwnPlaces(req: Request, res: Response) {
    try {
      const userId = (req as AuthenticatedRequest).user?.id; // 🔹 Obtém o ID do usuário autenticado

      if (!userId) {
        res.status(401).json({ message: "Usuário não autenticado." });
        return;
      }

      const places = await placeService.getPlacesByOwner(userId);

      if (!places || places.length === 0) {
        res.status(204).send();
        return;
      }

      res.status(200).json(places);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Erro ao obter seus espaços",
        error: error.message,
      });
      return;
    }
  }

  async deletePlace(req: Request, res: Response) {
    try {
      if (!(req as AuthenticatedRequest).user) {
        res
          .status(401)
          .json({ message: "Acesso negado. Token não fornecido." });
        return;
      }
      const userId = (req as AuthenticatedRequest).user.id;
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Id de espaço inválido" });
        return;
      }

      const place = await placeService.getPlaceById(id);
      if (!place) {
        res.status(404).json({ message: "Espaço não encontrado." });
        return;
      }

      if (place.ownerId !== userId) {
        res.status(403).json({
          message: "Você não tem permissão para deletar este espaço.",
        });
        return;
      }

      await placeService.deletePlace(id);
      res.status(200).json({ message: "Espaço deletado com sucesso." });
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao deletar espaço", error: error.message });
      return;
    }
  }
  
  async addEquipmentToPlace(req: Request, res: Response) {
    try {
      if (!(req as AuthenticatedRequest).user) {
        res
          .status(401)
          .json({ message: "Acesso negado. Token não fornecido." });
        return;
      }

      const { place_id } = req.params;
      const { name, description, pricePerTurn, quantityAvailable } = req.body;

      if (!name || !description || !pricePerTurn || !quantityAvailable) {
        res.status(400).json({ message: "Dados do equipamento inválidos" });
        return;
      }

      const place = await placeService.getPlaceById(place_id);
      if (!place) {
        res.status(404).json({ message: "Espaço não encontrado" });
        return;
      }

      const equipment = await placeService.addEquipmentToPlace(place_id, {
        name,
        description,
        pricePerTurn,
        quantityAvailable,
      });

      res.status(201).json(equipment);
      return;
    } catch (error: any) {
      res.status(500).json({
        message: "Erro ao adicionar equipamento",
        error: error.message,
      });
      return;
    }
  }

  async removeEquipmentFromPlace(req: Request, res: Response) {
    try {
      if (!(req as AuthenticatedRequest).user) {
        res
          .status(401)
          .json({ message: "Acesso negado. Token não fornecido." });
        return;
      }
      const { place_id, equipmentId } = req.params;

      if (!place_id || !equipmentId) {
        res.status(400).json({ message: "Dados inválidos" });
        return;
      }

      const place = await placeService.getPlaceById(place_id);
      if (!place) {
        res.status(404).json({ message: "Espaço não encontrado" });
        return;
      }

      await placeService.removeEquipmentFromPlace(place_id, equipmentId);
      res.status(200).json({ message: "Equipamento removido com sucesso" });
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao remover equipamento", error: error.message });
      return;
    }
  }

  async getAvailablePlaces(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await placeService.getAvailablePlaces(page, limit);

      res.status(200).json(result);
      return;
    } catch (error: any) {
      console.log(error)
      res.status(error.statusCode || 500).json({
        message: error.message || "Erro ao buscar espaços disponíveis.",
      });
      return;
    }
  }
}
