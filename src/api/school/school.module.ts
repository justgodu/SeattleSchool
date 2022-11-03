import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import {MongooseModule} from "@nestjs/mongoose";
import {School, SchoolSchema} from "../../model/school.schema";
import {SchoolGoal, SchoolGoalSchema} from "../../model/school-goal.schema";
import {User, UserSchema} from "../../model/user.schema";
import {UserModule} from "../user/user.module";
import {FormType, FormTypeSchema} from "../../model/form-type.schema";

@Module({
  controllers: [SchoolController],
  providers: [SchoolService],
  imports: [
    MongooseModule.forFeature([
      { name: School.name, schema: SchoolSchema },
      { name: SchoolGoal.name, schema: SchoolGoalSchema },
      { name: FormType.name, schema: FormTypeSchema },
    ]),
      UserModule
  ]
})
export class SchoolModule {}
