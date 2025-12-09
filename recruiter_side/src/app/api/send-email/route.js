import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const { to, subject, html } = await request.json();

        // Configure Gmail Transporter
        // NOTE: App Password is required for Gmail
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
            html: html
        };

        // Send Email
        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent: ' + info.response);
        return NextResponse.json({ message: 'Email sent successfully', success: true });

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email: ' + error.message }, { status: 500 });
    }
}
