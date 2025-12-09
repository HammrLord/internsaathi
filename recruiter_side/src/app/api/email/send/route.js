import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const body = await request.json();
        const { to, subject, message, template } = body;

        // Configure Gmail Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'pminternsipportal1@gmail.com',
                pass: 'kcxdtrilogkzfkf'.replace(/\s/g, '') // Remove spaces if any
            }
        });

        const mailOptions = {
            from: '"PM Internship Recruitment" <pminternsipportal1@gmail.com>',
            to: to,
            subject: subject,
            html: message.replace(/\n/g, '<br>') // Simple conversion of newlines to HTML breaks if message is plain text
        };

        // Send Email
        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent: ' + info.response);
        return NextResponse.json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email: ' + error.message }, { status: 500 });
    }
}
