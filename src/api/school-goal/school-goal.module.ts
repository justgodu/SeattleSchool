import { Module } from '@nestjs/common';
import { SchoolGoalController } from './school-goal.controller';
import { SchoolGoalService } from './school-goal.service';
import {MongooseModule} from "@nestjs/mongoose";
import {SchoolGoal, SchoolGoalSchema} from "../../model/school-goal.schema";
import {School, SchoolSchema} from "../../model/school.schema";

@Module({
  controllers: [SchoolGoalController],
  providers: [SchoolGoalService],
  imports: [
    MongooseModule.forFeature([
      { name: SchoolGoal.name, schema: SchoolGoalSchema },
      { name: School.name, schema: SchoolSchema }
    ]),
  ],
  exports: [SchoolGoalService]
})
export class SchoolGoalModule {}
