import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Rating from "./Rating";
import { Status, Turn } from "../enums/turn.enum";

export class Rent extends Model {
  public id!: string;
  public placeId!: string;
  public ownerId!: string;
  public renterId!: string;
  public totalValue!: number;
  public status!: Status;
  public paymentMethod!: string;
  schedules!: {
    day: string; // mesmo formato de Place: "2024-03-23"
    turns: Turn[]; // ex: ["manhã", "tarde"]
  }[];
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
      type: DataTypes.ENUM("pendente", "confirmado", "rejeitado", "cancelado", "finalizado"),
      allowNull: false,
      defaultValue: "pendente",
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

// Relacionamento com Rating
Rent.hasMany(Rating, { foreignKey: "rentId" });

export default Rent;
