import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TaskService {
    constructor(private schedulerRegistry: SchedulerRegistry) {}

    addCronTask(taskName: string, cronExpression: any, taskCB: any): void {
        try {
            const job = new CronJob(cronExpression, taskCB);
            this.schedulerRegistry.addCronJob(taskName, job);
            job.start();
            console.log(`Job ${taskName} is run`);
        } catch (err) {
            console.log(`Job ${taskName} is already running`);
        }
    }

    deleteCron(taskName: string) {
        this.schedulerRegistry.deleteCronJob(taskName);
        console.log(`Job ${taskName} is deleted`);
    }
}
