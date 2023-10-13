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
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MdDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { ConfirmationService } from 'app/app-modules/core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { startWith } from 'rxjs/operators/startWith';
import { CDSSService } from '../../shared/services/cdss-service';
import { MasterdataService } from '../../shared/services/masterdata.service';
import { CdssFormResultPopupComponent } from '../cdss-form-result-popup/cdss-form-result-popup.component';

@Component({
  selector: 'app-cdss-104-form',
  templateUrl: './cdss-form.component.html',
  styleUrls: ['./cdss-form.component.css']
})
export class Cdss104FormComponent implements OnInit {
  currentLanguageSet: any;
  chiefComplaints: any = [];
  filteredOptions: Observable<string[]>;

  cdssForm = this.fb.group({
    presentChiefComplaint: null,
    selectedProvisionalDiagnosis: null,
    recommendedAction: null,
    remarks: null,
    action: null,
    actionId: null
  });
  result: any;
  psd: string;
  recommendedAction: string;
  selectedSymptoms: string;
  actions: any = [];
  sctID_psd: string;
  sctID_psd_toSave: any;
  actionId: any;
  sctID_pcc: string;
  sctID_pcc_toSave: any;
  constructor(
    private httpServiceService: HttpServiceService,
    private fb: FormBuilder,
    private cdssService: CDSSService,
    private confirmationService: ConfirmationService,
    private dialog: MdDialog,
    private masterdataService: MasterdataService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getChiefComplaintSymptoms();
    this.getActionsMaster();
    this.filteredOptions = this.cdssForm.controls.presentChiefComplaint.valueChanges
    .startWith(null)
    .map((val) => (val ? this.filter(val) : this.chiefComplaints.slice()));
      
  }

  filter(val: string): string[] {
    return this.chiefComplaints.filter(
      (option) => option.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
  }


  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  getActionsMaster(){
    this.cdssService.getActionMaster().subscribe(res => {
      if(res.statusCode == 200 && res.data){
        this.actions = res.data;
      } else {
        this.confirmationService.alert(res.errorMessage, 'error');
      }
    });
    (err) => {
      this.confirmationService.alert(err, 'error')
    }
  }

  getActionId(){
    let action = this.cdssForm.controls.action.value;
    this.actions.filter(item => {
      if(action === item.name ){
        this.cdssForm.controls.actionId.patchValue(item.id);
      }
    });
  }

  getChiefComplaintSymptoms(){
    let reqObj = {
      age:  localStorage.getItem('patientAge'),
      gender: (localStorage.getItem('beneficiaryGender') === "Male") ? "M" : "F"
    }

    this.cdssService.getcheifComplaintSymptoms(reqObj).subscribe(res => {
      if(res.statusCode == 200 && res.data){
        this.chiefComplaints = res.data;
      } else {
        this.confirmationService.alert(res.errorMessage, 'error');
      }
    });
    (err) => {
      this.confirmationService.alert(err, 'error')
    }
  }

  getQuestions(searchSymptom) {
    if(searchSymptom != null && searchSymptom != undefined && searchSymptom != "" ){
    let reqObj  = {
      age: localStorage.getItem('patientAge'),
      gender: (localStorage.getItem('beneficiaryGender') === "Male") ? "M" : "F",
      symptom: searchSymptom
    }
    this.cdssService
      .getCdssQuestions(reqObj).subscribe((res) => {
        if(res.statusCode == 200 && res.data !== null && res.data.Msg !== "No Question Found" && res.data !== "No Question Found"){
          this.openDialog(searchSymptom);
        } else {
            this.confirmationService.alert(
              this.currentLanguageSet.noQuestionsFoundForCorrespondingInput
            );
          }
      });
      (err) => {
        this.confirmationService.alert(err, 'error')
      }
      this.getSnomedCTRecord(searchSymptom, "pcc");
    }
    else{
      this.cdssForm.controls.selectedProvisionalDiagnosis.patchValue(null);
      this.cdssForm.controls.recommendedAction.patchValue(null);
      
    }
  }

  resetForm(){
    this.cdssForm.reset();
  }

  openDialog(searchSymptom){ 
    let dialogRef = this.dialog.open(CdssFormResultPopupComponent,
      {        
        width: 0.8 * window.innerWidth + "px",
        panelClass: "dialog-width",
        disableClose: true,
        data: {
        patientData: {
          age: localStorage.getItem('patientAge'),
          gender: (localStorage.getItem('beneficiaryGender') === "Male") ? "M" : "F",
          symptom: searchSymptom
        }
      }}
      );

    dialogRef.afterClosed().subscribe(result => {
        console.log('result', result);
        this.result = result;

        this.psd = "";
        this.recommendedAction = "";
        this.selectedSymptoms = "";
        this.sctID_psd = "";
        this.sctID_psd_toSave = "";
        if (result != undefined && result != null) {
          let diseaseArr = [];
          let recomdAction = [];
          for (var a = 0; a < result.length; a++) {
            diseaseArr.push(result[a].diseases);

            this.getSnomedCTRecord(result[a].diseases, "psd");
            //  this.psd.slice(0,100);
            if (!this.recommendedAction.includes(result[a].action)) {
              recomdAction.push(result[a].action);
            }
            //  this.recommendedAction.slice(0,100);
            for (var k = 0; k < result[a].symptoms.length; k++) {
              this.selectedSymptoms += result[a].symptoms[k] + " ";
            }
          }
          this.psd = (diseaseArr !== undefined && diseaseArr.length > 0) ? diseaseArr.join(",") : "" ;
          this.recommendedAction =  (recomdAction !== undefined && recomdAction.length > 0) ? recomdAction.join(",") : "";

          this.recommendedAction = this.recommendedAction.trim().slice(0, 300);
          this.psd = this.psd.trim().slice(0, 100);
          this.selectedSymptoms = this.selectedSymptoms.trim().slice(0, 300);
          console.log(
            "lengths",
            this.selectedSymptoms.length,
            "/300",
            this.recommendedAction.length,
            "/100",
            this.psd.length,
            "/100"
          );
          this.cdssForm.controls.selectedProvisionalDiagnosis.patchValue(this.psd);
          this.cdssForm.controls.recommendedAction.patchValue(this.recommendedAction);
        } else {
          this.cdssForm.reset();
          // this.psd = this.pcc.trim();
          // this.recommendedAction="";
        }
      });
}

getSnomedCTRecord(term, field) {
  this.masterdataService.getSnomedCTRecord(term).subscribe(
    (response) => {
      console.log("Snomed response: " + JSON.stringify(response));

      if (response.data.conceptID) {
        if(field == "pcc"){
          this.sctID_pcc = "SCTID: " + response.data.conceptID ;
          this.sctID_pcc_toSave = response.data.conceptID;
        }

        else{
          this.sctID_psd += term + ("(SCTID): " + response.data.conceptID + "\n");
          if ( this.sctID_psd_toSave === ""){
            this.sctID_psd_toSave = response.data.conceptID;
          }
          
          else this.sctID_psd_toSave += "," + response.data.conceptID;
        }
      }
      else{
          if(field == "pcc"){
            this.sctID_pcc_toSave = "NA";
          }
          else{
          if (this.sctID_psd_toSave == "") 
          this.sctID_psd_toSave = "NA";
          else 
          this.sctID_psd_toSave += ",NA";
          }
        }

    },
    (err) => {
      console.log("getSnomedCTRecord Error");
    }
  );

}

saveData(){
  let patientAge = parseInt(localStorage.getItem('patientAge'));
  let reqObj = {
    beneficiaryRegID: localStorage.getItem('beneficiaryRegID'),
    beneficiaryID: localStorage.getItem('beneficiaryID'),
    patientName: localStorage.getItem('patientName'),
    patientAge: patientAge,
    patientGenderID: localStorage.getItem('beneficiaryGender') === "Male" ? 1 : 2,
    sessionID: localStorage.getItem('sessionID'),
    serviceID: localStorage.getItem('serviceID'),
    providerServiceMapID: localStorage.getItem('providerServiceID'),
    createdBy: localStorage.getItem('userName'),
    vanID: JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
    benCallID: localStorage.getItem('benCallID'),
    parkingPlaceID : JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID, 
    selecteDiagnosisID: this.sctID_psd_toSave,
    selecteDiagnosis: this.cdssForm.controls.selectedProvisionalDiagnosis.value,
    presentChiefComplaintID: this.sctID_pcc_toSave,
    presentChiefComplaint: this.cdssForm.controls.presentChiefComplaint.value,
    recommendedAction : this.cdssForm.controls.recommendedAction.value,
    remarks: this.cdssForm.controls.remarks.value,
    algorithm: this.selectedSymptoms,
    actionId: this.cdssForm.controls.actionId.value,
    action: this.cdssForm.controls.action.value,
  }
  console.log('formvalue', reqObj);
  this.cdssService.saveCheifComplaints(reqObj).subscribe(res => {
    if(res && res.statusCode == 200){
      this.confirmationService.alert(this.currentLanguageSet.savedBeneficiaryDetailsSuccessfully, 'Success');
      this.router.navigate(["/common/nurse-worklist"]);
    } else {
      this.confirmationService.alert(res.errorMessage, 'error');
    }
  });
  (err) => {
    this.confirmationService.alert(err, 'error');
  }
}


}
