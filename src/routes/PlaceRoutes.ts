import { Router } from "express";
import { PlaceController } from "../controllers/PlaceController";

const router = Router();
const placeController = new PlaceController();

// 🔹 Criar um novo espaço
router.post("/", placeController.createPlace.bind(placeController));

// 🔹 Listar todos os espaços
router.get("/", placeController.getAllPlaces.bind(placeController));

// 🔹 Buscar espaço por ID
router.get("/:id", (req, res) => {
  placeController.getPlaceById(req, res);
  return;
});

// 🔹 Deletar espaço por ID
router.delete("/:id", placeController.deletePlace.bind(placeController));

// 🔹 Adicionar equipamento a um espaço
router.post(
  "/:place_id/equipments",
  placeController.addEquipmentToPlace.bind(placeController)
);

// 🔹 Remover equipamento de um espaço
router.delete(
  "/:place_id/equipments/:equipmentId",
  placeController.removeEquipmentFromPlace.bind(placeController)
);

export default router;
