import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Place from "./Place";
import Rent from "./Rent";
import Rating from "./Rating";

export class User extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public profession?: string;
  public averageRating!: number;
}

User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    averageRating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

// Relacionamentos
User.hasMany(Place, { foreignKey: "ownerId" });
User.hasMany(Rent, { foreignKey: "renterId" });
User.hasMany(Rating, { foreignKey: "reviewedId" });

export default User;
