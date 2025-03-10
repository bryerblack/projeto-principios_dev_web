import { Router } from "express";
import { PlaceController } from "../controllers/PlaceController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { roleMiddleware } from "../middlewares/RoleMiddleware";

const router = Router();
const placeController = new PlaceController();

// 🔹 Qualquer usuário autenticado pode criar um place
router.post("/", authMiddleware, placeController.createPlace.bind(placeController));

// 🔹 Apenas ADMIN pode listar todos os places
router.get("/", authMiddleware, roleMiddleware(["admin"]), placeController.getAllPlaces.bind(placeController));

// 🔹 Apenas ADMIN pode buscar um place pelo ID
router.get("/:id", authMiddleware, roleMiddleware(["admin"]), placeController.getPlaceById.bind(placeController));

// 🔹 Listar places próprios (usuário autenticado vê apenas os dele)
router.get("/own", authMiddleware, placeController.getOwnPlaces.bind(placeController));

// 🔹 Usuário autenticado pode editar apenas seu próprio place
router.put("/:id", authMiddleware, placeController.updatePlace.bind(placeController));

// 🔹 Usuário autenticado pode deletar apenas seu próprio place
router.delete("/:id", authMiddleware, placeController.deletePlace.bind(placeController));

// 🔹 Equipamentos podem ser adicionados e removidos apenas pelo dono do espaço
router.post("/:place_id/equipments", authMiddleware, placeController.addEquipmentToPlace.bind(placeController));

router.delete("/:place_id/equipments/:equipmentId", authMiddleware, placeController.removeEquipmentFromPlace.bind(placeController));

export default router;
