import { Request, Response } from "express";
import UserService from "../services/user_service";
import UserRepository from "../repositories/user_repository";
import GenericError from "../errors/genericError";
import { StatusCodes } from "http-status-codes";
import { unknownErrorResponse } from "../utils/response.utils";

const userService = new UserService(new UserRepository());

async function getUserById(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const response = await userService.getUserById(id);
    return res.status(200).json({
      message: "Successfully fetched the user",
      data: response,
      err: {},
      success: true,
    });
  } catch (error) {
    if (error instanceof GenericError) {
      return res.status(error.statusCode).json({
        message: "Something went wrong",
        data: {},
        err: error,
        success: false,
      });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(unknownErrorResponse);
  }
}

async function getAllUsers(req: Request, res: Response) {
  try {
    const response = await userService.getAllUsers();
    return res.status(200).json({
      message: "Successfully fetched the users",
      data: response,
      err: {},
      success: true,
    });
  } catch (error) {
    if (error instanceof GenericError) {
      return res.status(error.statusCode).json({
        message: "Something went wrong",
        data: {},
        err: error,
        success: true,
      });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(unknownErrorResponse);
  }
}

async function createUser(req: Request, res: Response) {
  try {
    const response = await userService.createUser(req.body);
    return res.status(201).json({
      message: "Successfully created the user",
      data: response,
      err: {},
      success: true,
    });
  } catch (error) {
    if (error instanceof GenericError) {
      return res.status(error.statusCode).json({
        message: "Something went wrong",
        data: {},
        err: error,
        success: true,
      });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(unknownErrorResponse);
  }
}

async function signinUser(req: Request, res: Response) {
  try {
    const response = await userService.signinUser(req.body);
    return res.status(200).json({
      message: "Successfully signed in the user",
      data: response,
      err: {},
      success: true,
    });
  } catch (error) {
    if (error instanceof GenericError) {
      return res.status(error.statusCode).json({
        message: "Something went wrong",
        data: {},
        err: error,
        success: true,
      });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(unknownErrorResponse);
  }
}

async function updateUserRole(req: Request, res: Response) {
  const id = req.params.id;
  const role = req.body.role;
  try {
    const response = await userService.updateUserRole(id, role);
    return res.status(200).json({
      message: "Successfully updated the user role",
      data: response,
      err: {},
      success: true,
    });
  } catch (error) {
    if (error instanceof GenericError) {
      return res.status(error.statusCode).json({
        message: "Something went wrong",
        data: {},
        err: error,
        success: true,
      });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(unknownErrorResponse);
  }
}

export default {
  getUserById,
  getAllUsers,
  createUser,
  signinUser,
  updateUserRole,
};
