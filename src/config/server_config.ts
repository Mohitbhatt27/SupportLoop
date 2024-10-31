import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT || 3000,
  SALT: process.env.SALT == undefined ? 10 : +process.env.SALT,
  JWT_SECRET:
    process.env.JWT_SECRET == undefined ? "DUMMY" : process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY,
  GMAIL_PASS: process.env.GMAIL_PASS || "",
  GMAIL_EMAIL: process.env.GMAIL_EMAIL || "",
};
