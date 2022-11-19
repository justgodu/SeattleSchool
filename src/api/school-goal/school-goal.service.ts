import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {SchoolGoal, SchoolGoalDocument} from "../../model/school-goal.schema";
import mongoose, {Model} from "mongoose";
import {School, SchoolDocument} from "../../model/school.schema";

@Injectable()
export class SchoolGoalService {
    constructor(@InjectModel(SchoolGoal.name) private schoolGoalModel: Model<SchoolGoalDocument>,
                @InjectModel(School.name) private schoolModel: Model<SchoolDocument>) {
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

    async getSchoolGoal(id){
        return this.schoolGoalModel.findById(id);
    }

    async getGoals(type, formType, query, schoolId = null, ){

        let schoolGoals:any[] = await this.schoolGoalModel.find({type: type, form_type: formType});


        if(type === "row" && schoolId && query.status) {
            const aggregateObject: any = [
                {
                    $match: {_id: new mongoose.Types.ObjectId(schoolId)}
                },
                {
                    $project: {
                        name: "$name",
                        parameters: {
                            $filter: {
                                input: "$parameters",
                                as: "param",
                                cond: {$eq: ["$$param.form_type", formType]}

                            }
                        }
                    }
                }
            ]

            let school = (await this.schoolModel.aggregate(aggregateObject))[0];

            for(const rowIndex in schoolGoals){
                schoolGoals[rowIndex] = schoolGoals[rowIndex].toObject();
                schoolGoals[rowIndex].sort = 0;
                for(const param of school.parameters){
                    if(param.row_id == schoolGoals[rowIndex]._id.toString() && param.data.status == query.status){
                        schoolGoals[rowIndex].sort++;
                    }
                }

            }

            function compare( a, b ) {
                if ( a.sort > b.sort ){
                    return -1;
                }
                if ( a.sort < b.sort ){
                    return 1;
                }
                return 0;
            }
            schoolGoals = schoolGoals.sort(compare);

        }

        return schoolGoals;
    }

    async createSchoolGoal(body){
        let newSchoolGoal = new this.schoolGoalModel(body);
        return newSchoolGoal.save();
    }

}
