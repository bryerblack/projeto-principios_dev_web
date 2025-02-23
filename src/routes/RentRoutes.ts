import { Router } from "express";
import { RentController } from "../controllers/RentController";

const router = Router();
const rentController = new RentController();

router.post('', (req, res) => rentController.createRent(req, res));

router.get('', (req, res) => rentController.getAllRents(req, res));

router.get(':id', (req, res) => {
  rentController.getRentById(req, res);
  return;
});

router.put(':id', (req, res) => {
  rentController.updateRent(req, res);
  return;
});

router.delete(':id', (req, res) => rentController.deleteRent(req, res));

export default router;
