import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Rating from "./Rating";
import RentSchedule from "./RentSchedule";

export class Rent extends Model {
  public id!: string;
  public placeId!: string;
  public ownerId!: string;
  public renterId!: string;
  public totalValue!: number;
  public status!: string;
  public paymentMethod!: string;
}

Rent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    placeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "places",
        key: "id",
      },
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    renterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    totalValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pendente",
      validate: {
        isIn: [["pendente", "confirmado", "cancelado", "finalizado"]],
      },
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "rents",
    timestamps: true,
  }
);

// Relacionamento com RentSchedule e Rating
Rent.hasMany(RentSchedule, { foreignKey: "rentId", onDelete: "CASCADE" });
Rent.hasMany(Rating, { foreignKey: "rentId" });

export default Rent;
