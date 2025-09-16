import { ISendMailDto } from "./application/dto/send-email.dto.interface";
import { environmentConfig } from "@/config/environment.config";
import { Subject } from "./application/enum/subject";
import nodemailer from "nodemailer";

export class EmailAdapter {
  private static instance: EmailAdapter;

  private constructor() {}

  public static getInstance(): EmailAdapter {
    if (!EmailAdapter.instance) {
      EmailAdapter.instance = new EmailAdapter();
    }
    return EmailAdapter.instance;
  }

  async sendEmail(iSendMailDto: ISendMailDto) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: environmentConfig.nodemailer.email,
        pass: environmentConfig.nodemailer.password,
      },
    });

    await transporter.sendMail({
      from: `"Task App 👋" <environmentConfig.nodemailer.email>`,
      to: iSendMailDto.to,
      subject: iSendMailDto.subject,
      text: "Este es el link de su session",
      html: `<b>${iSendMailDto.pathHtml}</b>`,
    });
  }

  async signUpNotification(to: string, link: string) {
    const html = `<div>
    <p style="font-size:2rem"><span style="color:red">Importante</span> luego de confirmar su correo debera volver a ingresarlo en la app para recibir un link de inicio de sesion.</p>
    <strong>${link}</strong>
    </div>`;
    await this.sendEmail({
      to,
      pathHtml: html,
      subject: Subject.CONFIRMATION_EMAIL,
      text:"Confirme el registro en la app TASK"
    });
  }

  async signInNotification(to:string,link:string){
    const html = `<strong>${link}</strong>`;
    await this.sendEmail({
      to,
      pathHtml: html,
      subject: Subject.SIGN_IN,
      text:"Haga click en el enlace para iniciar sesion en TASK 2"
    });
  }
}
