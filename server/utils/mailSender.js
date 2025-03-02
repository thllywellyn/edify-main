const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,  // SMTP server host
            port: process.env.MAIL_PORT,  // Specify the SMTP port (e.g., 587 or 465)
            secure: process.env.MAIL_PORT === '465',  // Set to true if you're using port 465 (for SSL)
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from: 'ELearning || Llywellyn Sana',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        console.log(info);
        return info;
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = mailSender;
