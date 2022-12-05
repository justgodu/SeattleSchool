import { Injectable } from '@nestjs/common';
import {School, SchoolDocument} from "../../model/school.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {SchoolGoalService} from "../school-goal/school-goal.service";

@Injectable()
export class SchoolService {
    constructor(@InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
                private schoolGoalService: SchoolGoalService) {
    }

    async getSchools(body, filter = {}){
        let per_page = body.per_page ? body.per_page : 10;
        let page = body.page ? body.page : 0;
        let selectObject = {};
        if(body.select){
            let selectKeys = body.select.split("|");
            for(const selectKey of selectKeys) {
                selectObject[selectKey] = 1;
            }
        }
        if(body.formType){

        }
        let resp = await Promise.all([
            this.schoolModel.find(filter, selectObject,{limit: per_page, skip: page * per_page}),
            this.schoolModel.countDocuments(filter)
        ])
        let schools = resp[0];
        let total_pages = Math.ceil(resp[1] / per_page);
        return {
            items: schools,
            total_pages
        };
    }

    async createSchool(body){

        const newSchool = new this.schoolModel(body);
        return newSchool.save();
    }

    async updateSchool(id,body){
        await this.schoolModel.updateOne({_id: id}, body);
        return this.schoolModel.findOne({_id: id});
    }

    async deleteSchool(id){
        return this.schoolModel.deleteOne({_id: id});
    }

    async getSchool(id) {
        return this.schoolModel.findById(id);
    }

    async getSchoolWithGoals(id){
        return this.schoolModel.findById(id).populate('parameters.goal_id');
    }

    async updateParameter(schoolId, data, columnId, rowId = null){
        let updateObject;


        if(rowId){

            updateObject = await this.schoolModel.updateOne({_id: schoolId, 'parameters.column_id': columnId, 'parameters.row_id': rowId},
                {$set:
                    { 'parameters.${element}.data' : data}
                },
                {arrayFilters: [ { 'n.row_id': rowId }, {'n.column_id': columnId}]}
                )
        }else{
            updateObject = await this.schoolModel.updateOne({_id: schoolId, 'parameters.column_id': columnId},
                {$set:
                        { 'parameters.${element}.data' : data}
                },
                {arrayFilters: [ {'n.column_id': columnId} ]}
            )
        }
        //
        // if(goalIndex){
        //     updateObject = {
        //         "$set" :{}
        //     }
        //     updateObject["$set"]['parameters.${element}.data'] = data;
        // }else{
        //     updateObject = {
        //         "$push" :{
        //             "parameters": parameterData
        //         }
        //     }
        // }


        return this.schoolModel.updateOne({_id: schoolId}, updateObject)
    }

    async getSchoolCell(schoolId, formType, columnId, rowId = null){

        let tempSchool:any = await this.getSchool(schoolId);

        if(!tempSchool){
            return false;
        }

        let cell = {}

        let column = await this.schoolGoalService.getSchoolGoal(columnId);
        cell['column_id'] = column;
        let school = tempSchool.toObject();

        if(rowId){
            let row = await this.schoolGoalService.getSchoolGoal(rowId);
            cell['row_id'] = row;
            for(const param of school.parameters){

                if(param.column_id == columnId && param.row_id == rowId && param.form_type == formType){
                    cell['data'] = param.data;
                }

            }
        }else{
            for(const param of school.parameters){


                if(param.column_id == columnId && param.form_type == formType){
                    cell['data'] = param.data;
                }

            }
        }


        return cell;
    }

    async schoolHasCell(schoolId, formType, columnId, rowId = null){

        let tempSchool:any = await this.getSchool(schoolId);

        if(!tempSchool){
            return false;
        }

        let school = tempSchool.toObject();

        if(rowId){
            for(const param of school.parameters){

                if(param.column_id == columnId && param.row_id == rowId && param.form_type == formType){
                    return true;
                }

            }
        }else{
            for(const param of school.parameters){


                if(param.column_id == columnId && param.form_type == formType){
                    return true;
                }

            }
        }

        return false;
    }
    async getSchoolsWithColumns(filter, formType, query){
        let schools;




        const aggregateObject:any = [
            {
                $match: filter
            },
            {
                $project: {
                    name: "$name",
                    parameters: {
                        $filter: {
                            input: "$parameters",
                            as: "param",
                            cond: { $eq: [ "$$param.form_type", formType ]}

                        }
                    }
                }
            }
        ]

        // if(query.sort_by && query.sort_key){
        //     aggregateObject[1]["$project"]["status_total"] = {
        //             $sum: {
        //                 $eq: ["$parameters.status", query.sort_key]
        //             }
        //         }
        //     aggregateObject[2] = {
        //         $sort: {
        //             "status_total": -1
        //         }
        //     }
        // }
        schools = await this.schoolModel.aggregate(aggregateObject);

        return schools;
    }
}
