import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(userId: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(userId);
    if (user) {
      const match = await bcrypt.compare(pass, user.password);
      if (match) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      sub: user.uid,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
