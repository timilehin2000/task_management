import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Request,
  UseGuards,
  Put,
  Delete,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto, updateTaskDto } from './dto/task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() task: CreateTaskDto, @Request() req): Promise<Task> {
    return await this.taskService.createTask(task, req.user.id);
  }

  @Get()
  async findAll() {
    return await this.taskService.findAllTask();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Task> {
    const task = await this.taskService.findTaskById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() task: updateTaskDto,
    @Request() req,
  ): Promise<Task> {
    const { numberOfAffectedRows, updatedTask } =
      await this.taskService.updateTask(id, task, req.user.id);

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException('Task not found');
    }

    return updatedTask;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const deleted = await this.taskService.deleteTask(id, req.user.id);

    if (deleted.affected === 0) {
      throw new NotFoundException('Task not found');
    }

    return { message: 'Successfully deleted' };
  }
}
