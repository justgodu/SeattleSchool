import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {SchoolService} from "./school.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {RoleGuard} from "../role/role.guard";
import {Roles} from "../role/decorator/role.decorator";
import {InjectModel} from "@nestjs/mongoose";
import {SchoolGoal, SchoolGoalDocument} from "../../model/school-goal.schema";
import mongoose, {Model, Schema} from "mongoose";
import {User, UserDocument} from "../../model/user.schema";
import {UserService} from "../user/user.service";
import {FormType, FormTypeDocument} from "../../model/form-type.schema";


@Controller('')
export class SchoolController {
    constructor(
        private schoolService: SchoolService,
        @InjectModel(SchoolGoal.name) private schoolGoalModel: Model<SchoolGoalDocument>,
        @InjectModel(FormType.name) private formTypeModel: Model<FormTypeDocument>,
        private userService: UserService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get('with-columns/:formType/:schoolId?')
    async getSchoolsWithColumns(@Param('formType') formType, @Param('schoolId') schoolId, @Query() query){

        let filter = {};

        if(schoolId){
            filter['_id'] = new mongoose.Types.ObjectId(schoolId)
        }

        return this.schoolService.getSchoolsWithColumns(filter, formType, query)
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
    @Get('edit/:schoolId/:formType/:columnId/:rowId?')
    async getSchoolParam(@Req() req,
                      @Param('schoolId') schoolId,
                      @Param('formType') formType,
                      @Param('columnId') columnId,
                      @Param('rowId') rowId
    ){

        let current_user = await this.userService.getOne(req.user.username);
        let userRole = current_user.role;
        let cell = await this.schoolService.getSchoolCell(schoolId, formType, columnId, rowId);

        if(cell){
            return cell;
        }
        return {};
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    @Post('edit/:schoolId/:formTypeId/:columnId/:rowId?')
    async updateSchoolParam(@Req() req,
                         @Body() formData,
                         @Param('schoolId') schoolId,
                         @Param('formTypeId') formTypeId,
                         @Param('columnId') columnId,
                         @Param('rowId') rowId
    ){
        let current_user = await this.userService.getOne(req.user.username);
        let userRole = current_user.role;
        let school = await this.schoolService.getSchool(schoolId);
        let formType = await this.formTypeModel.findById(formTypeId);

        if(!formType){
            return false;
        }

        let column = await this.schoolGoalModel.findOne({_id: columnId, type: "column", form_type: formType});
        if(!column){
            return false;
        }

        if(rowId){
            let row = await this.schoolGoalModel.findOne({_id: rowId, type: "row", form_type: formType});
            if(!row){
                return false;
            }
        }

        let schoolHasCell = await this.schoolService.schoolHasCell(schoolId, formTypeId, columnId, rowId)

        if(schoolHasCell){
            for(const index in school.parameters){
                if(rowId){
                    if(
                        school.parameters[index].row_id === rowId
                        && school.parameters[index].column_id === columnId
                    ){
                        for(const [fieldKey,field] of Object.entries<any>(formType.data)){

                            if(formData[fieldKey] && field.role === userRole){
                                school.parameters[index].data[fieldKey] = formData[fieldKey];
                            }

                        }
                    }
                }else{
                    if(
                        school.parameters[index].column_id === columnId
                    ){
                        for(const [fieldKey,field] of Object.entries<any>(formType.data)){

                            if(formData[fieldKey] && field.role === userRole){
                                school.parameters[index].data[fieldKey] = formData[fieldKey];
                            }

                        }
                    }
                }
            }


        }else{
            for(const [fieldKey,field] of Object.entries(formData)){

                if(!formType.data[fieldKey] || formType.data[fieldKey].role !== userRole){
                    delete formData[fieldKey];
                }

            }


            school.parameters.push(
                {
                    column_id: columnId,
                    row_id: rowId,
                    form_type: formType._id,
                    data: formData

                }
            )

        }

        school.markModified('parameters')


        return school.save();


    }


}
