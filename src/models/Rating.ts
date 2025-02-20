import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export class Rating extends Model {
  public reviewerId!: string;
  public reviewedId!: string;
  public rentId!: string;
  public description?: string;
  public rating!: number;
  public date!: Date;
}

Rating.init(
  {
    reviewerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    reviewedId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    rentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "rents",
        key: "id",
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 5 },
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "ratings",
    timestamps: true,
  }
);

export default Rating;
