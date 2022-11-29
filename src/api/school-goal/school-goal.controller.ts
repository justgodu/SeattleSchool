import {Body, Controller, Get, Param, Post, Query, Req, UseGuards} from '@nestjs/common';
import {SchoolGoalService} from "./school-goal.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {RoleGuard} from "../role/role.guard";
import {Roles} from "../role/decorator/role.decorator";
import {query} from "express";
import {UserService} from "../user/user.service";

@Controller('')
export class SchoolGoalController {
    constructor(private schoolGoalService: SchoolGoalService,
                private userService: UserService) {
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Get()
    async getSchoolGoals(@Query() query) {
        return this.schoolGoalService.getSchoolGoals(query)
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Get(":id")
    async getSchoolGoal(@Param('id') goalId) {
        return this.schoolGoalService.getSchoolGoal(goalId)
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin', 'principal')
    @Get("/items/:type/:formType/:schoolId?")
    async getGoals(@Param('type') type,
                   @Param('formType') formType,
                   @Param('schoolId') schoolId,
                   @Req() req,
                   @Query() query) {

        let currentUser = await this.userService.getOne(req.user.username);
        if(currentUser.role === "principal"){
            if(schoolId !== currentUser.school.toString()){
                return;
            }
        }
        return this.schoolGoalService.getGoals(type, formType, query, schoolId)
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Post()
    async createSchoolGoal(@Body() body) {
        return this.schoolGoalService.createSchoolGoal(body)
    }
}
