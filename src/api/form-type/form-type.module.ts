import { Module } from '@nestjs/common';
import { FormTypeController } from './form-type.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {FormType, FormTypeSchema} from "../../model/form-type.schema";

@Module({
  controllers: [FormTypeController],
  imports: [
    MongooseModule.forFeature([
      { name: FormType.name, schema: FormTypeSchema }
    ])
  ]
})
export class FormTypeModule {}
