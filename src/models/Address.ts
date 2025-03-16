import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export class Address extends Model {
  public id!: string;
  public cep!: string;
  public pais!: string;
  public estado!: string;
  public cidade!: string;
  public bairro!: string;
  public rua!: string;
  public numero!: string;
  public complemento?: string;
}

Address.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pais: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cidade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bairro: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rua: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complemento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Address",
    tableName: "addresses",
    timestamps: true,
  }
);

export default Address;
