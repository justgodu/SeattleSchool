import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {SchoolGoal, SchoolGoalDocument} from "../../model/school-goal.schema";
import {Model} from "mongoose";

@Injectable()
export class SchoolGoalService {
    constructor(@InjectModel(SchoolGoal.name) private schoolGoalModel: Model<SchoolGoalDocument>) {
    }

    async getSchoolGoals(params){
        let filter = {}
        let per_page = params.per_page ? params.per_page : 10;
        let page = params.page ? params.page : 0;
        let resp = await Promise.all([
            this.schoolGoalModel.find(filter,{}, {limit: per_page, skip: page * per_page}),
            this.schoolGoalModel.countDocuments(filter)
        ])
        let goals = resp[0];
        let total_pages = Math.ceil(resp[1] / per_page);

        return{
            items: goals,
            total_pages
        }
    }

    async createSchoolGoal(body){
        let newSchoolGoal = new this.schoolGoalModel(body);
        return newSchoolGoal.save();
    }
}
