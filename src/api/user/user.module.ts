import {Module, Global} from '@nestjs/common';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../../model/user.schema";
import {JwtModule} from "@nestjs/jwt";
import {secret} from "../../utils/constants";

@Global()
@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema}
        ]),
        JwtModule.register({
            secret: secret,
            signOptions: {expiresIn: '2h'},
        }),
    ],
    exports: [UserService]
})
export class UserModule {
}
