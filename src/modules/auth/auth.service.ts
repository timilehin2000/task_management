import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUsersByEmail(email);
    if (!user) {
      return null;
    }

    const match = await this.comparePassword(password, user.password);
    if (!match) {
      return null;
    }

    return user;
  }

  public async createUser(user: CreateUserDto): Promise<any> {
    const hashedPassword = this.hashPassword(user.password);

    const newUser = await this.userService.createUser({
      ...user,
      password: hashedPassword,
    });

    const token = await this.generateToken(newUser);

    return { data: newUser, token };
  }

  public async login(user: User) {
    const token = await this.generateToken(user);
    return { data: user, token };
  }

  private async comparePassword(
    enteredPassword: string,
    savedPassword: string,
  ) {
    const match = await bcrypt.compare(enteredPassword, savedPassword);
    return match;
  }

  private hashPassword(password: string) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return hashedPassword;
  }

  private generateToken(user: User) {
    const payload = { email: user.email, id: user.id };
    const token = this.jwtService.signAsync(payload);
    return token;
  }
}
