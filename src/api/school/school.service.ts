import { Injectable } from '@nestjs/common';
import {School, SchoolDocument} from "../../model/school.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class SchoolService {
    constructor(@InjectModel(School.name) private schoolModel: Model<SchoolDocument> ) {
    }

    async getSchools(body){
        let filter = {}
        let per_page = body.per_page ? body.per_page : 10;
        let page = body.page ? body.page : 0
        let resp = await Promise.all([
            this.schoolModel.find(filter, {},{limit: per_page, skip: page * per_page}),
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
        console.log(body);
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

    async updateParameter(schoolId, goalIndex, parameterData){
        let updateObject
        if(goalIndex){
            updateObject = {
                "$set" :{}
            }
            updateObject["$set"][`parameters.${goalIndex}`] = parameterData;
        }else{
            updateObject = {
                "$push" :{
                    "parameters": parameterData
                }
            }
        }

        console.log(updateObject);
        return this.schoolModel.updateOne({_id: schoolId}, updateObject)
    }
}
