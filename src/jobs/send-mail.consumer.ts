import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_NAME } from 'src/constants';
import sgMail from '@sendgrid/mail';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { HashHelper } from 'src/helpers';
import { aesEncode } from 'src/utils';

type MailOptions = {
  email: string;
  template: string;
  fullname?: string;
  otp?: string;
};

@Processor(QUEUE_NAME.send_mail)
export class SendMailConsumer {
  private hasHelper = new HashHelper();
  constructor() {
    sgMail.setApiKey(process.env.MAIL_GRID_API_KEY); // Set API Key
  }
  @Process()
  async handleTask(job: Job<MailOptions>) {
    await this.sendMail(job.data);
    await job.progress(10);
  }
  private async compileTemplate<T>(template: string, data: T): Promise<string> {
    const templatePath = path.join(
      __dirname,
      '..',
      'templates',
      `${template}.hbs`,
    );
    const templateContent = await fs.promises.readFile(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateContent);
    return compiledTemplate(data);
  }
  withVerificationRegister(email: string) {
    const code = this.hasHelper.createToken(aesEncode(email), '3m');
    const data = {
      email,
      redirect_url: `${process.env.APP_URL_CLIENT}/verification/${code}`,
    };
    return {
      data,
      subject: 'SHADOW - VERIFICATION REGISTER',
    };
  }
  withWelcome(email: string, fullname: string) {
    return {
      data: { email, fullname },
      subject: 'SHADOW - WELCOME',
    };
  }
  withOtpMail(email: string, otp: string) {
    return {
      data: { email, otp },
      subject: 'SHADOW - FORGOT',
    };
  }
  async sendMail(options: MailOptions) {
    const { email, template } = options;
    console.log('Run send mail:', email);
    let subject = '';
    let data;
    if (template === 'verification-register') {
      const register = this.withVerificationRegister(email);
      subject = register.subject;
      data = register.data;
    }
    if (template === 'welcome') {
      const welcome = this.withWelcome(email, options.fullname || '');
      data = welcome.data;
      subject = welcome.subject;
    }
    if (template === 'otp-mail') {
      const otpData = this.withOtpMail(email, options.otp || '');
      data = otpData.data;
      subject = otpData.subject;
    }
    const htmlContent = await this.compileTemplate(template, data);
    try {
      await sgMail.send({
        from: process.env.MAIL_FROM,
        to: email,
        subject,
        html: htmlContent,
      });
      console.log('Send successfully mail:', email);
    } catch (error) {
      console.log(JSON.stringify(error.response));
    }
    return;
  }
}
