import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../typeorm/base.entity';
import { Task } from '../tasks/tasks.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
