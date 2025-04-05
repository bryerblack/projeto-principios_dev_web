import { UserService } from "../../services/userService";
import { User } from "../../models/User";
import { jest } from "@jest/globals";

// Simula o banco de dados
jest.mock("../../models/User", () => {
  const actualModule = jest.requireActual("../../models/User") as object;
  return {
    __esModule: true,
    default: Object.assign({}, actualModule, {
      create: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    }),
  };
});

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it("Deve criar um novo usuário", async () => {
    const mockUser = {
      id: "123",
      name: "João",
      email: "joao@email.com",
      password: "senha123",
      phone: "(11) 99999-9999",
      profession: "Engenheiro",
    };

    (User.create as jest.MockedFunction<typeof User.create>).mockResolvedValue(mockUser);

    const user = await userService.createUser({
      name: "João",
      email: "joao@email.com",
      password: "senha123",
      phone: "(11) 99999-9999",
      profession: "Engenheiro",
    });

    expect(user).toEqual(mockUser);
  });
});
