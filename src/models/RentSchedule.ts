import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Rent from "./Rent";

export class RentSchedule extends Model {
  public id!: string;
  public rentId!: string;
  public startDate!: Date;
  public endDate!: Date;
}

RentSchedule.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "rents",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "rent_schedules",
    timestamps: false,
  }
);

export default RentSchedule;