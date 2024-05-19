import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { TasksGateway } from './task.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TasksService, TasksGateway],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
