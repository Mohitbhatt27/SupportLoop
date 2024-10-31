import jwt from "jsonwebtoken";
import CONFIG from "../config/server_config";

export function generateJWT(payload: string | object | Buffer) {
  return jwt.sign(payload, CONFIG.JWT_SECRET, { expiresIn: CONFIG.JWT_EXPIRY });
}

export function verifyJWT(token: string) {
  return jwt.verify(token, CONFIG.JWT_SECRET);
}
