import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_NAME } from 'src/constants';

@Processor(QUEUE_NAME.province)
export class AdminConsumer {
  @Process()
  async handleTask(job: Job<any>) {
    const mails = ['1@gmail.com', '2@gmail.com'];
    let process = 0;
    for (let i = 0; i < mails.length; i++) {
      await this.sendMail(mails[i], job.data);
      process++;
      await job.progress(process);
    }
  }
  async sendMail(email: string, job: Record<string, any>) {
    return new Promise((rel, rej) => {
      setTimeout(() => {
        rel(email);
        console.log('data', job);
      }, 1000 * 2);
    });
  }
}
