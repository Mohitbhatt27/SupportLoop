import nodemailer from "nodemailer";
import CONFIG from "./server_config";
const { GMAIL_PASS, GMAIL_EMAIL } = CONFIG;

const mailsender = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: GMAIL_EMAIL,
    pass: GMAIL_PASS,
  },
});

export default mailsender;
