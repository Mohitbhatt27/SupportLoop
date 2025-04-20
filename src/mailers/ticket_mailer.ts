import mailsender from "../config/email_config";
import CONFIG from "../config/server_config";

export default async function ticketMailer(
  ReceiverEmail: string,
  ticketId: string,
  ticketTitle: string,
  ticketDescription: string,
  userName: string | null,
  status?: string // optional status
) {
  console.log("Sending email to:", ReceiverEmail);
  console.log("status", status);
  try {
    // Determine the message based on status
    let statusMessage = "";
    if (status === "RESOLVED") {
      statusMessage = "Your support ticket has been resolved.";
    } else if (status === "CANCELLED") {
      statusMessage = "Your support ticket has been cancelled.";
    } else {
      statusMessage = "We have received your support ticket.";
    }

    const response = await mailsender.sendMail({
      from: CONFIG.GMAIL_EMAIL,
      to: `${ReceiverEmail}`,
      text: `Hello ${
        userName ? userName : "User"
      },\n\n${statusMessage} Here are the details:\n\nTicket ID: ${ticketId}\nTitle: ${ticketTitle}\nDescription: ${ticketDescription}\n\nOur support team will review your ticket and get back to you as soon as possible.\n\nThank you for reaching out to us!\n\nBest regards,\nCRM APP Support Team`,
      subject: `Your Support Ticket [#${ticketId}] ${status === "RESOLVED" ? "Resolved" : status === "CANCELLED" ? "Cancelled" : "Has Been Created"}`,
      html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Your Support Ticket Update</title>
            </head>
            <body>
                <p>Hello ${userName ? userName : "User"},</p>
                <p>${statusMessage} Here are the details:</p>
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
    // Only log in non-test environments to avoid Jest open handle issues
    if (process.env.NODE_ENV !== "test") {
      console.log(response);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.log(error);
    }
  }
}
