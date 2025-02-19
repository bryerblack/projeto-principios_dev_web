import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { Controller, Post, Route, SuccessResponse, Body, Get, Path, Delete } from "tsoa";
import User from "../models/User";
import { ApiError } from "src/ApiError";
import { UserRequest } from "src/DTO/UserRequest";
import { UserResponse } from "src/DTO/UserResponse";

const userService = new UserService();

@Route("users")
export class UserController extends Controller {

  @SuccessResponse("201", "Created")
  @Post()
  public async createUser(@Body() requestBody: UserRequest) {
    try {
      const { name, email, password, phone, profession } = requestBody;
      const user = await userService.createUser({
        name,
        email,
        password,
        phone,
        profession,
      });
      // return new UserResponse(user.id, user.name, user.email, user.password, user.phone, user.averageRating, user.profession);
      return "";
    } catch (error: any) {
      throw new ApiError("Internal Server Error", 500, "Erro ao criar usuário")
    }
  }

  @Get()
  public async getAllUsers() {
    try {
      const users = await userService.getAllUsers();
      return "";
    } catch (error: any) {
      throw new ApiError("Internal Server Error", 500, "Erro ao obter usuários")
    }
  }

  @Get("{userId}")
  public async getUserById(@Path() userId: string) {
    try {
      const user = await userService.getUserById(userId);
      if (!user)
        throw new ApiError("Not Found", 404, "Usuário não encontrado");
      else
        return "";
    } catch (error: any) {
      throw new ApiError("Internal Server Error", 500, "Erro ao obter usuários")
    }
  }

  @Delete("{userId}")
  async deleteUser(@Path() userId: string) {
    try {
      await userService.deleteUser(userId);
      return;
    } catch (error: any) {
      throw new ApiError("Internal Server Error", 500, "Erro ao deletar usuário")
    }
  }
}
