import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {Model} from "mongoose";
import { User, UserDocument } from "../../model/user.schema";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
                private jwtService: JwtService
    ) { }

    async signup(user: User): Promise<User> {
        if(user.password){
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(user.password, salt);
            const tempPass = user.password;
            user.password = hash;
            const newUser = new this.userModel(user);
            await newUser.save();

            user.password = tempPass;
        }else{
            const newUser = new this.userModel(user);
            await newUser.save();
        }





        return user;
    }


    async getOne(username): Promise<User> {
        return this.userModel.findOne({ $or:[ { email: username },{ username: username } ] }).exec();
    }

    /**
     * update google Token in database
     * @returns
     * @param username
     * @param googleToken
     */
    async updateGoogleToken(username, googleToken): Promise<any> {
        return this.userModel.updateOne({ $or:[ { email: username },{ username: username } ] }, {google_token: googleToken, is_google_user: true})
    }

}
