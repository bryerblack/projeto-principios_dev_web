import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export class Equipment extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public pricePerHour!: number;
  public quantityAvailable!: number;
  public place_id!: string;
}

Equipment.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pricePerHour: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantityAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    place_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
  },
  {
    sequelize,
    tableName: "equipments",
    timestamps: true,
  }
);

export default Equipment;
