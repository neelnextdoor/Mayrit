import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false, // No TLS
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

async sendEmail(resetToken : string,expires_at:any, email : string): Promise<void> {

  const currentDate = new Date().toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZoneName: 'short',
    timeZone: 'Asia/Kolkata', // IST
  });


    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; color: #333;">
        <header style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
          <h1 style="color: #2a9d8f;">🔐 Password Reset Request</h1>
          <p style="font-size: 14px; color: #888;">${currentDate}</p>
        </header>
    
        <main>
          <p>Hello,</p>
          <p>You have requested to reset your password. Use the token below to proceed:</p>
    
          <div style="background: #e0f7fa; padding: 15px; border-radius: 5px; font-size: 18px; font-weight: bold; color: #00796b; word-break: break-all;">
            ${resetToken}
          </div>
    
          <p style="margin-top: 20px;">
            This valid for 15 minutes till ${expires_at} , If you did not request a password reset, please ignore this email or contact support immediately.
          </p>
    
          <p>Thank you,<br />The Support Team</p>
        </main>
    
        <footer style="border-top: 1px solid #eee; padding-top: 10px; margin-top: 20px; font-size: 12px; color: #aaa;">
          © 2025 Your Company Name. All rights reserved.<br />
          <small>This is an automated message. Please do not reply.</small>
        </footer>
      </div>
    `;


    await this.transporter.sendMail({
      from: 'Intellect <password.reset@intellect.com>',
      to: email, // Replace with actual recipient or inject dynamically
      subject: '📈 Intellect - Reset password request',
      html: htmlBody,
    });
  }
}
