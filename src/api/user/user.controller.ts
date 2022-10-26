import {
    Controller,
    Get,
    UseGuards
} from '@nestjs/common';
import { UserService} from "./user.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {RoleGuard} from "../role/role.guard";
import {Roles} from "../role/decorator/role.decorator";

@Controller('')
export class UserController {
    constructor(private readonly userService: UserService,
    ) { }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Get()
    getTest(){
        return "WP"
    }
}
