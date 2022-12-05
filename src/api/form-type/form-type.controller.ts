import {Controller, Get, Param, Req, UseGuards} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {FormType, FormTypeDocument} from "../../model/form-type.schema";
import {Model} from "mongoose";
import {UserService} from "../user/user.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller()
export class FormTypeController {
    constructor(@InjectModel(FormType.name) private formTypeModel: Model<FormTypeDocument>,
                private userService: UserService) {
    }

    @Get(':id')
    async getFormType(@Req() req, @Param('id') formTypeId){
        let current_user = await this.userService.getOne(req.user.username);
        let userRole = current_user.role;
        let formType =  await this.formTypeModel.findById(formTypeId);
        if(formType){
            formType = formType.toObject();
        }else{
            return false;
        }
        let fieldIndexes = 0;
        console.log(formType.data)
        for(const key of Object.keys(formType.data)){
            if(formType.data[key].role && formType.data[key].role !== userRole){
                delete formType.data[key].role;
                formType.data[key].readonly = true;
            }else{
                formType.data[key].fieldIndex = ++fieldIndexes + '.';
            }
        }
        return formType

    }
}
