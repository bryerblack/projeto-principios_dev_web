import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Equipment from "./Equipment";
import Rent from "./Rent";
import Rating from "./Rating";
import User from "./User";

export class Place extends Model {
  public id!: string;
  public name!: string;
  public address!: object;
  public description?: string;
  public pricePerHour!: number;
  public availability!: string[];
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
    address: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pricePerHour: {
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

// Relacionamentos
Place.hasMany(Equipment, { foreignKey: "placeId" });
Place.hasMany(Rent, { foreignKey: "placeId" });
Place.hasMany(Rating, { foreignKey: "placeId" });

export default Place;
