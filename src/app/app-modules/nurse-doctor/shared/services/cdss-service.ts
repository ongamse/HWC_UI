/*
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/
import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { environment } from "environments/environment";
import { BehaviorSubject } from "rxjs";



@Injectable()
export class CDSSService {

constructor(private http: Http) {}


getCdssQuestions(reqObject){
    return this.http.post(environment.getCdssQuestionsUrl, reqObject)
    .map((res) => res.json());   
}

getCdssAnswers(reqObject){
    return this.http.post(environment.getCdssAnswersUrl, reqObject)
    .map((res) => res.json());   
}

getSnomedCtRecord(reqObject){
    return this.http.post(environment.getSnomedCtRecordUrl, reqObject)
    .map((res) => res.json());   
}

getcheifComplaintSymptoms(reqObject){
    return this.http.post(environment.getCheifComplaintsSymptomsUrl, reqObject)
    .map((res) => res.json());   
}

getActionMaster(){
    return this.http.get(environment.getActionMasterUrl)
    .map((res) => res.json());   
}

saveCheifComplaints(reqObject){
    return this.http.post(environment.closeVisitSaveComplaintsUrl, reqObject)
    .map((res) => res.json());
}
getDiseaseData(diseaseObj) {
    return this.http.post(environment.getDiseaseDataUrls, diseaseObj)
    .map((res) => res.json());
}
getDiseaseName() {
    return this.http.post(environment.getDiseaseNamesUrls, {})
    .map((res) => res.json());
}

}