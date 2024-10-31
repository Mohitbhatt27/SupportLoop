import { User } from "@prisma/client";
import UserRepository from "../repositories/user_repository";
import createUserDto from "../dtos/createUser_DTO";
import signinUserDto from "../dtos/signinUser_DTO";
import bcrypt from "bcryptjs";
import CONFIG from "../config/server_config";
import { generateJWT } from "../utils/auth";
import NotFoundError from "../errors/notFound";
import UnauthorisedError from "../errors/unauthorisedError";

class UserService {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  async getUserById(id: string): Promise<User | null> {
    try {
      const response: User | null = await this.userRepository.getUserById(id);
      if (!response) {
        throw { error: "User not found" };
      }
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const response: User[] = await this.userRepository.getAllUsers();
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createUser(userDetails: createUserDto): Promise<User> {
    try {
      const SaltRounds = bcrypt.genSaltSync(CONFIG.SALT);
      userDetails.password = bcrypt.hashSync(userDetails.password, SaltRounds);

      const response: User = await this.userRepository.createUser(userDetails);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async signinUser(userDetails: signinUserDto): Promise<object | null> {
    try {
      const response = await this.userRepository.signinUser(userDetails);
      if (!response) {
        throw new NotFoundError("User", "email", userDetails.email);
      }
      const isPasswordValid = bcrypt.compareSync(
        userDetails.password,
        response.password
      );

      if (!isPasswordValid) {
        throw new UnauthorisedError();
      }

      const token: string = generateJWT({
        id: response.id,
        email: response.email,
        role: response.role,
      });
      const res = {
        token: token,
        id: response.id,
        role: response.role,
        userData: {
          id: response.id,
          name: response.name,
        },
      };
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateUserRole(id: string, role: any): Promise<User | null> {
    try {
      const response: User | null = await this.userRepository.updateUserRole(
        id,
        role
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default UserService;
