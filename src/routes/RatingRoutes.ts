import { Router } from "express";
import { RatingController } from "../controllers/RatingController";

const router = Router();
const ratingController = new RatingController();

router.post("/", (req, res) => ratingController.createRating(req, res));

router.get("/", (req, res) => ratingController.getAllRatings(req, res));

router.get("/:id", (req, res) => {
  ratingController.getRatingById(req, res);
  return;
});

router.delete("/:id", (req, res) => ratingController.deleteRating(req, res));

export default router;
