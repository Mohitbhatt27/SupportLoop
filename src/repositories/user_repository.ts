import { PrismaClient, Ticket, User } from "@prisma/client";
import createUserDto from "../dtos/createUser_DTO";
import signinUserDto from "../dtos/signinUser_DTO";

const prisma = new PrismaClient();

class UserRepository {
  async createUser(userDetails: createUserDto): Promise<User> {
    const response: User = await prisma.user.create({
      data: {
        name: userDetails.name,
        email: userDetails.email,
        password: userDetails.password,
        role: "CUSTOMER",
        ticketsCreated: [],
        ticketsAssigned: [],
      },
    });
    return response;
  }

  async signinUser(userDetails: signinUserDto): Promise<User | null> {
    const response: User | null = await prisma.user.findUnique({
      where: {
        email: userDetails.email,
      },
    });
    console.log(response);
    return response;
  }

  async getUserById(id: string): Promise<User | null> {
    const response: User | null = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return response;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const response: User | null = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return response;
  }

  async getAllUsers(): Promise<User[]> {
    const response: User[] = await prisma.user.findMany();
    return response;
  }

  async updateUserRole(id: string, role: any): Promise<User | null> {
    const response: User | null = await prisma.user.update({
      where: {
        id,
      },
      data: {
        role: role,
      },
    });
    return response;
  }

  async getAvailableEngineers(): Promise<User[]> {
    const response: User[] = await prisma.user.findMany({
      where: {
        role: "ENGINEER",
      },
    });
    return response;
  }

  async updateUser(
    id: string,
    updatedData: Partial<User>
  ): Promise<User | null> {
    const response: User | null = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updatedData,
      },
    });
    return response;
  }
}

export default UserRepository;
