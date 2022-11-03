import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type FormTypeDocument = FormType & Document;

@Schema({timestamps: true, collection: "form_types"})
export class FormType {

    @Prop({required:true})
    _id: string;

    @Prop({type: mongoose.Schema.Types.Mixed})
    data: any;
}

export const FormTypeSchema = SchemaFactory.createForClass(FormType)