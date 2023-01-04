import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {SchoolParameter} from "./school-parameters.schema";
export type SchoolDocument = School & Document;

@Schema({timestamps: true})
export class School {

    @Prop({required:true})
    name: string;

    @Prop({required:true})
    parameters: SchoolParameter[];

    @Prop({})
    school_type: string;
}

export const SchoolSchema = SchemaFactory.createForClass(School);