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
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async create(@Body() task: CreateTaskDto, @Request() req): Promise<Task> {
    return await this.taskService.createTask(task, req.user.id);
  }

  @Get()
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async findAll() {
    return await this.taskService.findAllTask();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async findOne(@Param('id') id: string): Promise<Task> {
    const task = await this.taskService.findTaskById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiOkResponse({ description: 'The resource was updated successfully' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
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
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async remove(@Param('id') id: string, @Request() req) {
    const deleted = await this.taskService.deleteTask(id, req.user.id);

    if (deleted.affected === 0) {
      throw new NotFoundException('Task not found');
    }

    return { message: 'Successfully deleted' };
  }
}
