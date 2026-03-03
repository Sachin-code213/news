import nodemailer from 'nodemailer';

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER, // Reads officialkhabarpoint@gmail.com
            pass: process.env.EMAIL_PASS, // Reads vensucvwhjymiuul
        },
    });

    const mailOptions = {
        from: `"KhabarPoint Newsroom" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${options.email}`);
    } catch (error) {
        console.error("❌ Nodemailer Error:", error);
        throw error; // Rethrow so the controller knows it failed
    }
};

export default sendEmail;