import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import {MongooseModule} from "@nestjs/mongoose";
import {School, SchoolSchema} from "../../model/school.schema";

@Module({
  controllers: [SchoolController],
  providers: [SchoolService],
  imports: [
    MongooseModule.forFeature([
      { name: School.name, schema: SchoolSchema }
    ]),
  ]
})
export class SchoolModule {}
