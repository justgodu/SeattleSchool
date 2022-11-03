import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import {School} from "./school.schema";

export type UserDocument = User & Document;
@Schema({ timestamps: true })
export class User {

    @Prop({required:true, unique: true})
    username: string;
    @Prop({required:true})
    first_name: string;
    @Prop({required:true})
    last_name: string;
    @Prop({required:true, unique:true, lowercase:true})
    email: string;
    @Prop()
    password: string;
    @Prop()
    role: string;
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: School.name})
    school: string;
    @Prop()
    google_token: string;
    @Prop()
    is_google_user: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User)