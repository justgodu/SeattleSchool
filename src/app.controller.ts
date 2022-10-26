import {Controller, Get, Post, UseGuards, Request} from '@nestjs/common';
import { AppService } from './app.service';
import {AuthService} from "./api/auth/auth.service";
import {JwtAuthGuard} from "./api/auth/jwt-auth.guard";

@Controller()
export class AppController {
  constructor() {}

}
