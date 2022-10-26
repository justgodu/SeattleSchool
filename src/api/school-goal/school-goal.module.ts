import { Module } from '@nestjs/common';
import { SchoolGoalController } from './school-goal.controller';
import { SchoolGoalService } from './school-goal.service';
import {MongooseModule} from "@nestjs/mongoose";
import {SchoolGoal, SchoolGoalSchema} from "../../model/school-goal.schema";

@Module({
  controllers: [SchoolGoalController],
  providers: [SchoolGoalService],
  imports: [
    MongooseModule.forFeature([
      { name: SchoolGoal.name, schema: SchoolGoalSchema }
    ]),
  ]
})
export class SchoolGoalModule {}
