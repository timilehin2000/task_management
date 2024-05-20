/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateTaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';
import { Logger, UseGuards } from '@nestjs/common';
import { Task } from './tasks.entity';

@WebSocketGateway({ cors: true })
export class TasksGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly taskService: TasksService) {}

  private logger: Logger = new Logger('TaskGateway');

  @WebSocketServer() server: Server;

  @WebSocketServer() wss: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ..._args: any[]) {
    this.logger.log(`Client Connected: ${client.id}`);
  }

  @SubscribeMessage('createTask')
  async handleCreateTask(client: Socket, payload: any): Promise<void> {
    const task = await this.taskService.createTask(payload);
    this.server.emit('taskCreated', task);
  }

  @SubscribeMessage('updateTask')
  async handleUpdateTask(client: Socket, payload: any): Promise<void> {
    const task = await this.taskService.updateTask(payload.id, payload);
    this.server.emit('taskUpdated', task);
  }
}
