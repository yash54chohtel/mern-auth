import nodemailer from 'nodemailer'; // Import nodemailer
import dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load environment variables

// Creating transporter instence from createTranport
const transporter = nodemailer.createTransport({

    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },

})


export default transporter; // export the transporter