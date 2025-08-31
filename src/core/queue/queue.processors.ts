import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';

@Processor('emails')
export class EmailProcessor extends WorkerHost {
  async process(job: Job): Promise<any> {
    // send email here
    return true;
  }
}
