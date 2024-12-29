import nodemailer from 'nodemailer';

const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email credentials are missing in environment variables');
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        debug: true
    });

    transporter.verify((error, success) => {
        if (error) {
            console.error('SMTP connection error:', error);
        } else {
            console.log('SMTP server is ready to take our messages');
        }
    });

    return transporter;
};

let transporter: nodemailer.Transporter;

export const sendResetEmail = async (to: string, resetUrl: string) => {
    try {
        if (!transporter) {
            transporter = createTransporter();
        }

        const mailOptions = {
            from: `FleekNote <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Password Reset Request',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                            line-height: 1.5;
                            color: #1a1a1a;
                            margin: 0;
                            padding: 0;
                            background-color: #f5f5f5;
                        }
                        .container {
                            max-width: 520px;
                            margin: 40px auto;
                            background: #ffffff;
                            border-radius: 4px;
                            overflow: hidden;
                        }
                        .header {
                            padding: 24px;
                            background: #f8f9fa;
                            text-align: center;
                        }
                        .logo {
                            color: #1a73e8;
                            font-size: 24px;
                            font-weight: 500;
                            letter-spacing: -0.5px;
                        }
                        .content {
                            padding: 24px;
                        }
                        .button {
                            display: inline-block;
                            background-color: #1a73e8;
                            color: #ffffff;
                            padding: 10px 24px;
                            border-radius: 4px;
                            text-decoration: none;
                            font-weight: 500;
                            margin: 16px 0;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        }
                        .button:hover {
                            background-color: #1557b0;
                        }
                        .footer {
                            padding: 24px;
                            text-align: center;
                            color: #5f6368;
                            font-size: 12px;
                            border-top: 1px solid #f1f3f4;
                        }
                        p {
                            margin: 16px 0;
                            color: #3c4043;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">FleekNote</div>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>We received a request to reset your password for your FleekNote account.</p>
                            <div style="text-align: center;">
                                <a href="${resetUrl}" class="button" style="color: #ffffff;">Reset Password</a>
                            </div>
                            <p style="font-size: 13px; color: #5f6368;">This link will expire in 30 minutes. If you didn't request this reset, you can safely ignore this email.</p>
                        </div>
                        <div class="footer">
                            This is an automated message from FleekNote.<br>
                            © ${new Date().getFullYear()} FleekNote
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}; 