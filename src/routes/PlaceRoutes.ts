import { Router } from "express";
import { PlaceController } from "../controllers/PlaceController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { roleMiddleware } from "../middlewares/RoleMiddleware";

const router = Router();
const placeController = new PlaceController();

// 🔹 Qualquer usuário autenticado pode criar um place
router.post("/", authMiddleware, (req, res) => placeController.createPlace(req, res));

// 🔹 Apenas ADMIN pode listar todos os places
router.get("/all", authMiddleware, roleMiddleware(["admin"]), (req, res) => placeController.getAllPlaces(req, res));

// 🔹 Apenas ADMIN pode buscar um place pelo ID
router.get("/:id", authMiddleware, roleMiddleware(["admin"]), (req, res) => placeController.getPlaceById(req, res));

// 🔹 Listar places próprios (usuário autenticado vê apenas os dele)
router.get("/own", authMiddleware, (req, res) => placeController.getOwnPlaces(req, res));

// 🔹 Usuário autenticado pode editar apenas seu próprio place
router.put("/:id", authMiddleware, (req, res) => placeController.updatePlace(req, res));

// 🔹 Usuário autenticado pode deletar apenas seu próprio place
router.delete("/:id", authMiddleware, (req, res) => placeController.deletePlace(req, res));

// 🔹 Equipamentos podem ser adicionados e removidos apenas pelo dono do espaço
router.post("/:place_id/equipments", authMiddleware, (req, res) => placeController.addEquipmentToPlace(req, res));

router.delete("/:place_id/equipments/:equipmentId", authMiddleware, (req, res) => placeController.removeEquipmentFromPlace(req, res));

export default router;
