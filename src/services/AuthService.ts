import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

export class AuthService {
  async register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    profession?: string;
    role?: "admin" | "user";
  }) {
    const userExists = await User.findOne({ where: { email: data.email } });
    if (userExists) throw new Error("E-mail já cadastrado.");

    const user = await User.create({
      ...data,
      role: data.role || "user",
    });
    return { token: this.generateToken(user), user };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("E-mail ou senha incorretos.");
    }

    return { token: this.generateToken(user), user };
  }

  generateToken(user: { id: string; role: "admin" | "user" }) {
    const payload = {
      id: user.id,
      role: user.role, // ✅ Adicionando a role ao token
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "24h",
    });

    return token;
  }
}
