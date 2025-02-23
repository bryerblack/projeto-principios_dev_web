import { Router } from "express";
import { PlaceController } from "../controllers/PlaceController";

const router = Router();
const placeController = new PlaceController();

router.post("/", placeController.createPlace.bind(placeController));

router.get("/", placeController.getAllPlaces.bind(placeController));

router.get("/:id", (req, res) => {
  placeController.getPlaceById(req, res);
  return;
});

router.delete("/:id", placeController.deletePlace.bind(placeController));

router.post(
  "/:place_id/equipments",
  placeController.addEquipmentToPlace.bind(placeController)
);

router.delete(
  "/:place_id/equipments/:equipmentId",
  placeController.removeEquipmentFromPlace.bind(placeController)
);

export default router;
