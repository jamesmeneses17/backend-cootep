import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,

        },
    });

    async send({
        to,
        subject,
        html
    }: {
        to: string; subject: string; html: string
    }
    ) {
        await this.transporter.sendMail({
            from: `"CotepCert" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,

        });
    }
}