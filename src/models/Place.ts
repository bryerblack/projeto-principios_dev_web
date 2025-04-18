import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Equipment from "./Equipment";
import Rent from "./Rent";
import Rating from "./Rating";
import User from "./User";
import Address from "./Address";
import { Turn } from "../enums/turn.enum";

export class Place extends Model {
  public id!: string;
  public name!: string;
  public addressId!: string;
  public description?: string;
  public pricePerTurn!: number;
  public availability!: {
    day: string; // Ex: "2024-03-23"
    availableTurns: Turn[]; // Ex: ["manhã", "tarde"]
  }[];
  public ownerId!: string;
  public averageRating!: number;
}

Place.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Address,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pricePerTurn: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    availability: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Place",
    tableName: "places",
    timestamps: true,
  }
);

export default Place;
