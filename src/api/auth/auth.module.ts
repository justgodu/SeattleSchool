import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {UserModule} from "../user/user.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {secret} from "../../utils/constants";
import { AuthController } from './auth.controller';
import {JwtStrategy} from "./jwt.strategy";
import {GoogleStrategy} from "./google.strategy";

@Module({
  providers: [
      AuthService,
      JwtStrategy,
      GoogleStrategy
  ],
  imports: [
      UserModule,
      PassportModule,
      JwtModule.register({
          secret: secret,
          signOptions: { expiresIn: '2h' },
      }),
  ],
  controllers: [AuthController]
})
export class AuthModule {}
