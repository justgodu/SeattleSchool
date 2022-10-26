import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {SchoolService} from "./school.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {RoleGuard} from "../role/role.guard";
import {Roles} from "../role/decorator/role.decorator";

@Controller('')
export class SchoolController {
    constructor(private schoolService: SchoolService) {
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Get()
    async getSchools(@Query() query) {
        return this.schoolService.getSchools(query);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Post()
    async createSchool(@Body() req){
        return this.schoolService.createSchool(req);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Put(':id')
    async updateSchool(@Param('id') id, @Body() body){
        return this.schoolService.updateSchool(id,body );
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Delete(':id')
    async deleteSchool(@Param('id') id){
        return this.schoolService.deleteSchool(id);
    }
}
