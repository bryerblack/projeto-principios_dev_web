import express from "express";
import dotenv from "dotenv";
import UserRoutes from "./routes/userRoutes";
import PlaceRoutes from "./routes/PlaceRoutes";
import RentRoutes from "./routes/RentRoutes";
import RatingRoutes from "./routes/RatingRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import { setupSwagger } from "./config/swagger";

dotenv.config();

const app = express();
app.use(express.json());

setupSwagger(app);

app.use("/auth", AuthRoutes);
app.use("/users", UserRoutes);
app.use("/places", PlaceRoutes);
app.use("/rents", RentRoutes);
app.use("/ratings", RatingRoutes);


export default app;
