import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {SchoolService} from "./school.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {RoleGuard} from "../role/role.guard";
import {Roles} from "../role/decorator/role.decorator";
import {InjectModel} from "@nestjs/mongoose";
import {SchoolGoal, SchoolGoalDocument} from "../../model/school-goal.schema";
import {Model} from "mongoose";
import {User, UserDocument} from "../../model/user.schema";
import {UserService} from "../user/user.service";

@Controller('')
export class SchoolController {
    constructor(
        private schoolService: SchoolService,
        @InjectModel(SchoolGoal.name) private schoolGoalModel: Model<SchoolGoalDocument>,
        private userService: UserService) {
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Get(':id')
    async getSchool(@Param('id') schoolId) {
        return this.schoolService.getSchool(schoolId);
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
    async createSchool(@Body() body){
        return this.schoolService.createSchool(body);
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

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Get('csip-edit/:schoolId/:goalId')
    async getCSIPEdit(@Req() req, @Param('schoolId') schoolId, @Param('goalId') goalId){

        let current_user = await this.userService.getOne(req.user.username);
        let userRole = current_user.role;
        let school = await this.schoolService.getSchoolWithGoals(schoolId);
        let existingGoal;
        for(const param of school.parameters){
            if(param.goal_id == goalId){
                existingGoal = param;
                break;
            }
        }

        let schoolGoal = await this.schoolGoalModel.findById(goalId);

        let formObject = [
            {
                "key": "action",
                "label": "Action",
                "type": "textarea",
                "readonly": userRole !== 'admin',
                "value": existingGoal?.action || ''
            },
            {
                "key": "assessment_review",
                "label": "Assessment Review",
                "type": "textarea",
                "filled_with": "assessment_values",
                "readonly": userRole !== 'admin',
                "value": existingGoal?.assessment_review || ''
            },
            {
                "key": "assessment_values",
                "label": "Assessment Values",
                "type": "array",
                "array_type": "text",
                "array_length": schoolGoal.parameter_count || 0,
                "readonly": userRole !== 'admin',
                "value": existingGoal?.assessment_values || []
            },
            {
                "key": "status",
                "buttons": [
                    {
                        "title": "Exceed",
                        "bgcolor": "#00B0F0",
                        "txtcolor": "#000000",
                        "key": "exceed"
                    },
                    {
                        "title": "Meet",
                        "bgcolor": "#00B050",
                        "txtcolor": "#000000",
                        "key": "meet"
                    },
                    {
                        "title": "Partially Meet",
                        "bgcolor": "#FFFF00",
                        "txtcolor": "#44546A",
                        "key": "partially_meet"
                    },
                    {
                        "title": "Underperform",
                        "bgcolor": "#FF0000",
                        "txtcolor": "#ffffff",
                        "key": "underperform"
                    }
                ],
                "type": "radio_buttons",
                "readonly": userRole !== 'admin',
                "value": existingGoal?.status || ''
            }
        ];

        return formObject;
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Post('csip-edit/:schoolId/:goalId')
    async updateCSIPEdit(@Req() req,@Body() formData, @Param('schoolId') schoolId, @Param('goalId') goalId){
        let current_user = await this.userService.getOne(req.user.username);
        let userRole = current_user.role;
        let school = await this.schoolService.getSchool(schoolId);

        let fields = {
            action: 'admin',
            assessment_review:'admin',
            assessment_values:'admin',
            status:'admin'
        }
        let goalIndex;
        for(const index in school.parameters){
            console.log(goalId, school.parameters[index])
            if(school.parameters[index].goal_id == goalId){

                goalIndex = index;
                break;
            }
        }

        for(const key of Object.keys(formData)){
            if(fields[key] !== userRole){
                delete formData[key];
            }
        }
        formData["goal_id"] = goalId;
        return this.schoolService.updateParameter(schoolId, goalIndex, formData);




    }
}
