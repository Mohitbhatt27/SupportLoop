import UserService from "../../src/services/user_service";
import UserRepository from "../../src/repositories/user_repository";
import createUserDto from "../../src/dtos/createUser_DTO";
import signinUserDto from "../../src/dtos/signinUser_DTO";
import NotFoundError from "../../src/errors/notFound";
import UnauthorisedError from "../../src/errors/unauthorisedError";

jest.mock("../../src/repositories/user_repository");

describe("UserService - createUser (register)", () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = new (UserRepository as any)();
    userService = new UserService(userRepository);
  });

  it("should create a new user", async () => {
    const dto = new createUserDto("test@example.com", "Test User", "password123");
    userRepository.createUser.mockResolvedValue({
      id: "userId",
      email: dto.email,
      name: dto.name,
      password: "hashed",
      role: "CUSTOMER",
      ticketsCreated: [],
      ticketsAssigned: [],
    } as any);

    const result = await userService.createUser(dto);
    expect(result.email).toBe(dto.email);
    expect(userRepository.createUser).toHaveBeenCalled();
  });
});

describe("UserService - signinUser (login)", () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = new (UserRepository as any)();
    userService = new UserService(userRepository);
  });

  it("should throw NotFoundError if user does not exist", async () => {
    userRepository.signinUser.mockResolvedValue(null);
    const dto = new signinUserDto("notfound@example.com", "password123");
    await expect(userService.signinUser(dto)).rejects.toThrow(NotFoundError);
  });

  it("should throw UnauthorisedError if password is invalid", async () => {
    userRepository.signinUser.mockResolvedValue({
      id: "userId",
      email: "test@example.com",
      name: "Test User",
      password: "hashed",
      role: "CUSTOMER",
      ticketsCreated: [],
      ticketsAssigned: [],
    } as any);
    const dto = new signinUserDto("test@example.com", "wrongpassword");
    jest.spyOn(require("bcryptjs"), "compareSync").mockReturnValue(false);
    await expect(userService.signinUser(dto)).rejects.toThrow(UnauthorisedError);
  });

  it("should return token and user data on valid login", async () => {
    userRepository.signinUser.mockResolvedValue({
      id: "userId",
      email: "test@example.com",
      name: "Test User",
      password: "hashed",
      role: "CUSTOMER",
      ticketsCreated: [],
      ticketsAssigned: [],
    } as any);
    const dto = new signinUserDto("test@example.com", "password123");
    jest.spyOn(require("bcryptjs"), "compareSync").mockReturnValue(true);
    jest.spyOn(require("../../src/utils/auth"), "generateJWT").mockReturnValue("mocktoken");

    const result = await userService.signinUser(dto);
    expect(result).not.toBeNull();
    // Use type assertion to access userData property
    expect((result as any).token).toBe("mocktoken");
    expect((result as any).userData).toBeDefined();
    expect((result as any).userData.name).toBe("Test User");
  });
});
