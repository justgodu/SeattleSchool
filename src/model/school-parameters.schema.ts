import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
export type SchoolParameterDocument = SchoolParameter & Document;
@Schema({timestamps: true})
export class SchoolParameter {
    @Prop({required:true, ref: 'SchoolGoal', type: mongoose.Schema.Types.ObjectId})
    column_id: string;

    @Prop({ ref: 'SchoolGoal', type: mongoose.Schema.Types.ObjectId })
    row_id: string;

    @Prop({ref: 'FormType', type: mongoose.Schema.Types.String})
    form_type: string;

    @Prop({type: mongoose.Schema.Types.Mixed})
    data: any;
}
export const SchoolParameterSchema = SchemaFactory.createForClass(SchoolParameter)