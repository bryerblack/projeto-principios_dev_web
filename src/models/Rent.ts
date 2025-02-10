import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Rating from "./Rating";

export class Rent extends Model {
  public id!: string;
  public placeId!: string;
  public ownerId!: string;
  public renterId!: string;
  public totalValue!: number;
  public dateTimes!: string[];
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
    },
    renterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    totalValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dateTimes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pendente", "confirmado", "cancelado", "finalizado"),
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

// Relacionamento com Avaliações
Rent.hasMany(Rating, { foreignKey: "rentId" });

export default Rent;
