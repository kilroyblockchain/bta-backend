import { Module } from '@nestjs/common';
import { TaskService } from './task.service';

@Module({
    imports: [],
    providers: [TaskService]
})
export class TaskModule {}
