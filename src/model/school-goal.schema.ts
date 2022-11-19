import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type SchoolGoalDocument = SchoolGoal & Document;
@Schema({ timestamps: true })
export class SchoolGoal {
    @Prop({required:true})
    name: string;

    @Prop({ref: 'FormType', required: true})
    form_type: string;

    @Prop({
        enum:[
        "row",
        "column"
        ],
        required: true
    })
    type: string;
}

export const SchoolGoalSchema = SchemaFactory.createForClass(SchoolGoal)