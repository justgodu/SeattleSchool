import {
    Body,
    Controller,
    Get, Param, Post, Put,
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
    async getUsers()
    {
        return this.userService.getUsers();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Post('/delete')
    async deleteUser(@Body() userData)
    {
        return await this.userService.deleteUser(userData);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Get(':userId')
    async getUser(@Param('userId') userId)
    {
        return this.userService.getById(userId);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Put(':userId')
    async updateUser(@Param('userId') userId, @Body() userData)
    {
        return this.userService.updateUser(userId, userData);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Post('')
    async createUser(@Body() userData)
    {
        return this.userService.createUser(userData);
    }

}
