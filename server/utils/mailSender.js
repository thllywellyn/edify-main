const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        // Create the transporter using Zoho SMTP settings
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, // Zoho SMTP server
            port: process.env.MAIL_PORT, // Port (465 for SSL or 587 for TLS)
            secure: process.env.MAIL_PORT === '465', // Use SSL for port 465
            auth: {
                user: process.env.MAIL_USER, // Your Zoho email address
                pass: process.env.MAIL_PASS, // Your Zoho app password (if using 2FA)
            },
        });

        // Send the email
        let info = await transporter.sendMail({
            from: process.env.MAIL_USER, // Sender's email (must match the authenticated email)
            to: email, // Recipient's email
            subject: title, // Subject of the email
            html: body, // HTML content of the email
        });

        if (info && info.response) {
            console.log("Email sent successfully:", info.response);
        } else {
            console.error("No response from email service:", info);
        }

        return info;
    } catch (error) {
        console.error("Error occurred while sending email:", error.message);
        throw error; // Throw the error for further handling or logging
    }
};

module.exports = mailSender;
