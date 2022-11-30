import { Injectable, HttpException, HttpStatus, Logger } from "@nestjs/common";
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

    private readonly logger = new Logger(UserService.name);

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
    async getUsers(){
        return this.userModel.find({}, {password: 0}).populate('school');
    }


    async getById(id){
        return this.userModel.findById(id, {password: 0});
    }
    async getOne(username): Promise<User> {
        return this.userModel.findOne({ $or:[ { email: username },{ username: username } ] }).exec();
    }

    async updateUser(userId, userData){
        if(!userData.school){
            userData.school = null;
        }
        console.log(userData)
        return this.userModel.updateOne({_id: userId}, userData);
    }

    async createUser(userData){
        if(userData.password){
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(userData.password, salt);
            userData.password = hash;
        }
        return this.userModel.create(userData, userData);
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

    async deleteUser(userData) {

        let userId = userData['_id'];

        try {
            let deleteOperationResult = await this.userModel.findByIdAndDelete(userId);
        } catch (err) {
            this.logger.log(`Problem deleting user with id: ${userId} _ ${err}`);
            return false;
        }

        return true;
    }

}
