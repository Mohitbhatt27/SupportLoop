import jwt from "jsonwebtoken";
import CONFIG from "../config/server_config";

// Fix: Only pass expiresIn if it is a valid string (with time unit) or a number (seconds)
export function generateJWT(payload: string | object | Buffer) {
  const secret = CONFIG.JWT_SECRET || "DUMMY";
  const expiresIn = CONFIG.JWT_EXPIRY;

  // Convert class instance to plain object if needed
  let jwtPayload = payload;
  if (typeof payload === "object" && payload !== null && !(payload instanceof Buffer)) {
    jwtPayload = JSON.parse(JSON.stringify(payload));
  }

  // Only pass expiresIn if it is a valid string (e.g., "6h", "1d", "3600s") or a number
  if (
    (typeof expiresIn === "string" && /^[0-9]+[smhd]$|^[0-9]+$/.test(expiresIn)) ||
    typeof expiresIn === "number"
  ) {
    // @ts-ignore
    return jwt.sign(jwtPayload, secret, { expiresIn });
  } else {
    return jwt.sign(jwtPayload, secret);
  }
}

export function verifyJWT(token: string) {
  const secret = CONFIG.JWT_SECRET || "DUMMY";
  return jwt.verify(token, secret);
}
