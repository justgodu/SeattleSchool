import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../../model/user.schema";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.getOne(username);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: User): Promise<any> {
        const foundUser = await this.userService.getOne(user.username)

        if (foundUser) {

            const { password, google_token } = foundUser;

            console.log([password, user.password])
            if( password && user.password ){

                if (bcrypt.compare(user.password, password)) {
                    const payload = { username: user.username };

                    return {
                        access_token: this.jwtService.sign(payload),
                        role: foundUser.role
                    };
                }
            }else if( google_token && user.google_token && user.google_token == google_token ){

                const payload = { username: user.username };

                return {
                    access_token: this.jwtService.sign(payload),
                    role: foundUser.role
                };
            }

        }
        return;
    }
}
