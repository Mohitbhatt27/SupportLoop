import { NextFunction, Request, Response } from "express";
import UnauthorisedError from "../errors/unauthorisedError";
import { StatusCodes } from "http-status-codes";
import { verifyJWT } from "../utils/auth";

export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (!req.headers || !req.headers["x-access-token"]) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      err: new UnauthorisedError(),
      data: {},
      success: false,
      message: "Invalid parameters sent in the request",
    });
  }
  let token = req.headers["x-access-token"].toString();
  let decodedToken;
  try {
    decodedToken = verifyJWT(token);
    req.user = decodedToken;
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      err: new UnauthorisedError(),
      data: {},
      success: false,
      message: "Invalid parameters sent in the request",
    });
  }
  next();
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const roles = req.user.role;
    const isAdmin = roles === "ADMIN";
    if (isAdmin) {
      next();
    } else {
      throw new UnauthorisedError();
    }
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      err: new UnauthorisedError(),
      data: {},
      success: false,
      message: "You are not authorised to do this operation",
    });
  }
}

export function isEngineer(req: Request, res: Response, next: NextFunction) {
  try {
    const roles = req.user.role;
    if (roles === "ENGINEER") {
      next();
    } else {
      throw new UnauthorisedError();
    }
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      err: new UnauthorisedError(),
      data: {},
      success: false,
      message: "You are not authorised to do this operation",
    });
  }
}

export function isEngineerOrAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const roles = req.user.role;
    if (roles === "ENGINEER" || roles === "ADMIN") {
      next();
    } else {
      throw new UnauthorisedError();
    }
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      err: new UnauthorisedError(),
      data: {},
      success: false,
      message: "You are not authorised to do this operation",
    });
  }
}
