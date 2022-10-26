import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
export type SchoolParameterDocument = SchoolParameter & Document;
@Schema({timestamps: true})
export class SchoolParameter {
    @Prop({required:true, ref: 'SchoolGoal', type: mongoose.Schema.Types.ObjectId})
    goal_id: string;

    @Prop()
    priority: string;

    @Prop()
    assessment_review: string;

    @Prop()
    assessment_values: string[];

    @Prop({required:true, enum: SchoolGoalStatuses})
    status: string
}
export const SchoolParameterSchema = SchemaFactory.createForClass(SchoolParameter)