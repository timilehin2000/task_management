import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  createTask(task: CreateTaskDto, userId: string): Promise<Task> {
    const newTask = this.taskRepository.create({ ...task, userId });
    return this.taskRepository.save(newTask);
  }

  async findAllTask(): Promise<Task[] | null> {
    return await this.taskRepository.find({
      relations: ['user'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }

  async findTaskById(id: string): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }

  async deleteTask(id: string, userId: string) {
    const result = await this.taskRepository.delete({ id, userId });
    return result;
  }

  async updateTask(
    id: string,
    data: Partial<Task>,
    userId: string,
  ): Promise<{ numberOfAffectedRows: number; updatedTask: Task }> {
    await this.taskRepository.update({ id, userId }, data);
    const updatedTask = await this.taskRepository.findOne({
      where: { id, userId },
    });

    return {
      numberOfAffectedRows: 1,
      updatedTask,
    };
  }
}
