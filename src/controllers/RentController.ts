import { Request, Response } from "express";
import { RentService } from "../services/RentService";

const rentService = new RentService();

export class RentController {
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
}
