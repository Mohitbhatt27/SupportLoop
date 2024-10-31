import mailsender from "../config/email_config";
import CONFIG from "../config/server_config";

export default async function ticketMailer(
  ReceiverEmail: string,
  ticketId: string,
  ticketTitle: string,
  ticketDescription: string,
  userName: string | null
) {
  try {
    const response = await mailsender.sendMail({
      from: CONFIG.GMAIL_EMAIL,
      to: `${ReceiverEmail}`,
      text: `Hello ${
        userName ? userName : "User"
      },\n\nWe have received your support ticket. Here are the details:\n\nTicket ID: ${ticketId}\nTitle: ${ticketTitle}\nDescription: ${ticketDescription}\n\nOur support team will review your ticket and get back to you as soon as possible.\n\nThank you for reaching out to us!\n\nBest regards,\nYour Company Name Support Team`,
      subject: `Your Support Ticket [#${ticketId}] Has Been Created`,
      html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Your Support Ticket Has Been Created</title>
            </head>
            <body>
                <p>Hello ${userName},</p>
                <p>We have received your support ticket. Here are the details:</p>
                <table border="1" cellpadding="10" cellspacing="0">
                    <tr>
                        <th>Ticket ID</th>
                        <td>${ticketId}</td>
                    </tr>
                    <tr>
                        <th>Title</th>
                        <td>${ticketTitle}</td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>${ticketDescription}</td>
                    </tr>
                </table>
                <p>Our support team will review your ticket and get back to you as soon as possible.</p>
                <p>Thank you for reaching out to us!</p>
                <p>Best regards,<br>CRM APP Support Team</p>
            </body>
            </html>
        `,
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}
