import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type SchoolGoalDocument = SchoolGoal & Document;
@Schema({ timestamps: true })
export class SchoolGoal {
    @Prop({required:true})
    name: string;
    @Prop({required: true})
    parameter_count: number;
}

export const SchoolGoalSchema = SchemaFactory.createForClass(SchoolGoal)