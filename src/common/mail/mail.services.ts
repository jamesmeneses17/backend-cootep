import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendPasswordChangedConfirmation(to: string) {
    const subject = 'Tu contraseña ha sido cambiada';
    const html = `
      <p>Hola,</p>
      <p>Tu contraseña ha sido cambiada exitosamente.</p>
      <p>Si no realizaste este cambio, por favor contacta a soporte inmediatamente.</p>
      <p>Saludos,<br>El equipo de soporte</p>
    `;

    await this.transporter.sendMail({
      from: '"CotepCert"<no-reply@cotep.com>',
      to,
      subject,
      html,
    });
  }

  async sendPasswordResetLink(to: string, token: string) {
    const subject = 'Recuperación de contraseña';
    const html = `
      <p>Has solicitado recuperar tu contraseña.</p>
      <p><a href="http://tu-app.com/reset-password?token=${token}">Haz clic aquí para restablecerla</a></p>
      <p>Este enlace expira en 15 minutos.</p>
    `;

    await this.transporter.sendMail({
      from: '"CotepCert" <no-reply@cotepcert.com>',
      to,
      subject,
      html,
    });
  }
}
