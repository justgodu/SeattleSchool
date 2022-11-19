import {Body, Controller, Get, Param, Post, Query, UseGuards} from '@nestjs/common';
import {SchoolGoalService} from "./school-goal.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {RoleGuard} from "../role/role.guard";
import {Roles} from "../role/decorator/role.decorator";
import {query} from "express";

@Controller('')
export class SchoolGoalController {
    constructor(private schoolGoalService: SchoolGoalService) {
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
    @Roles('admin')
    @Get("/items/:type/:formType/:schoolId?")
    async getGoals(@Param('type') type,
                   @Param('formType') formType,
                   @Param('schoolId') schoolId,
                   @Query() query) {

        return this.schoolGoalService.getGoals(type, formType, query, schoolId)
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Post()
    async createSchoolGoal(@Body() body) {
        return this.schoolGoalService.createSchoolGoal(body)
    }
}
