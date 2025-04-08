import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Rating from "./Rating";
import { Status, Turn } from "../enums/turn.enum";
import User from "./User";
import Place from "./Place";

export class Rent extends Model {
  public id!: string;
  public placeId!: string;
  public ownerId!: string;
  public renterId!: string;
  public totalValue!: number;
  public status!: Status;
  public paymentMethod!: string;
  public schedules!: {
    day: string;
    turns: Turn[]; 
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
      type: DataTypes.ENUM(
        "pendente",
        "confirmado",
        "rejeitado",
        "cancelado",
        "finalizado"
      ),
      allowNull: false,
      defaultValue: "pendente",
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    schedules: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "rents",
    timestamps: true,
  }
);

export default Rent;
