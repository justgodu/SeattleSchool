import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { UserModule} from "./api/user/user.module";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path/posix';
import {AuthModule} from "./api/auth/auth.module";
import {SchoolModule} from "./api/school/school.module";
import {SchoolGoalModule} from "./api/school-goal/school-goal.module";
const routes: any = [
  {
    path: "api",
    children: [
      {
        path: "v1",
        children: [
          {
            path: "/user",
            module: UserModule,
          },
          {
            path: "/auth",
            module: AuthModule
          },
          {
            path: "/school",
            module: SchoolModule
          },
          {
            path: "/school-goal",
            module: SchoolGoalModule
          }

        ]
      }
    ]

  }
]
@Module({
  imports: [

    RouterModule.register(routes),

    MongooseModule.forRoot('mongodb://localhost:27017/seattle-school'),

    ConfigModule.forRoot({
      envFilePath: [".env"],
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    UserModule,
    SchoolModule,
    SchoolGoalModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
