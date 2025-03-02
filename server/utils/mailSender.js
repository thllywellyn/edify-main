const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: process.env.MAIL_PORT === '465',
            auth: {
                user: process.env.MAIL_USER,  
                pass: process.env.MAIL_PASS,  
            },
        });

        let info = await transporter.sendMail({
            from: 'ELearning || Llywellyn Sana',  // From address
            to: email,  // Recipient email
            subject: title,  // Subject
            html: body,  // Email body (HTML format)
        });

        console.log("Email sent:", info);  // Logs email send info
        return info;
    } catch (error) {
        console.log("Error sending email:", error.message);  // Logs any error that occurs
    }
};

module.exports = mailSender;
