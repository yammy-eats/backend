import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async _send(
    tos: string[],
    subject: string,
    templateName: string,
    context: any = {},
  ): Promise<boolean> {
    await this.mailerService.sendMail({
      to: tos.join(', '),
      subject,
      template: `${templateName}`,
      context,
    });
    return true;
  }

  async signin(to: string): Promise<boolean> {
    await this._send([to], '로그인 시도', 'signin.ejs', {
      email: to,
      datetime: new Date(),
    });

    return true;
  }

  async signup(to: string, code: string): Promise<boolean> {
    await this._send([to], '회원가입 완료', 'signup.ejs', {
      email: to,
      key: 'code',
      value: code,
    });

    return true;
  }
}
