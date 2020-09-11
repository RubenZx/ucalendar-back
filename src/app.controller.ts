import { Bind, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { UsersService } from "./users/users.service";

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  @Bind(Req())
  async login(req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  @Bind(Req())
  async getProfile(req) {
    const user = await this.userService.findOne(req.user.uid);
    return user;
  }
}
