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

  //   async handleCreateTask(
  //     @MessageBody() createTaskDto: CreateTaskDto,
  //     @ConnectedSocket() client: Socket,
  //   ) {
  //     const user = client.handshake.query.user;
  //     createTaskDto.userId = user.id;
  //     const task = await this.taskService.createTask(createTaskDto, user.id);
  //     this.server.emit('taskCreated', task);
  //   }
}
