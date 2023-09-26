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
import { Component, OnInit, Input } from '@angular/core';
import { DoctorService } from '../../../shared/services/doctor.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { RegistrarService } from 'app/app-modules/registrar/shared/services/registrar.service';
import { ConfirmationService } from 'app/app-modules/core/services';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { MasterdataService } from 'app/app-modules/nurse-doctor/shared/services/masterdata.service';
import { environment } from 'environments/environment';
import { NurseService } from 'app/app-modules/nurse-doctor/shared/services';

@Component({
  selector: 'app-doctor-diagnosis-case-sheet',
  templateUrl: './doctor-diagnosis-case-sheet.component.html',
  styleUrls: ['./doctor-diagnosis-case-sheet.component.css']
})
export class DoctorDiagnosisCaseSheetComponent implements OnInit {

  @Input('data')
  casesheetData: any;
  @Input('previous')
  previous: any;
  @Input('printPagePreviewSelect')
  printPagePreviewSelect: any;
  
  date: any;
  blankRows = [1, 2, 3, 4];
  visitCategory: any;
  recommendationText:string;
  beneficiaryDetails: any;
  currentVitals: any;
  caseRecords: any;
  ancDetails: any;
  imgUrl: any;
  current_language_set: any;
  language_file_path: any = "./assets/";
  language : any;
  symptomsList:any=[];
  recommendation:any=[];
  contactList:any=[];
  travelStatus:any;
  temp3: any;
  doctorDiagnosis: any;
  recomArray: any;
  recommendedtext: string;
  travel: boolean;
  travelFlag: boolean;
  contactFlag: boolean;
  rec:string;
  temp:any=[];
  suspected: any;
  symptomFlag: boolean;
  diagnosisFlag: boolean;
  recFlag: boolean;
  suspectedFlag: boolean;
  tempComp: string;
  indexComplication: number;
  diabetes=environment.diabetes;
  hypertension=environment.hypertension;
  oralCancer=environment.oral;
  breastCancer=environment.breast;
  cervicalCancer=environment.cervical;
  tempComplication: boolean = false;
  newComp: string;
  idrsDetailsHistory: any;
  suspect: any = [];
  suspectt: any = [];
  temp1: any =[];
  idrsScore: any;
  showHRP: string;
  ncdScreeningCondition: any;
  benDetails: any;
  healthIDValue: string='';
  covidVaccineDetails: any;
  ageValidationForVaccination="< 12 years";
  bloodGlucoseDetails: any;
  hypertensionBPDeatils: any;
  oralCancerDetails: any;
  breastCancerDetails: any;
  cervicalCancerDetails: any;
  enableClinicalObv: boolean;
  enableSignificantFindigs: boolean;
  enableCheifComplaints: boolean;
  enableIDRSForm: boolean = false;
  confirmScreeningArray=[];
  followUpCaseTreatment: any;
  counsellingProvidedDetails: any;
  cdssFormDetails: any;
  currentVitalsCasesheet: any;
  visitDetailsCasesheet: any;
  severityValue: any;
  cough_pattern_Value: any;
  enableResult:boolean =false;
  severity: any;
  cough_pattern: any;
  cough_severity_score: any;
  record_duration: any;

  constructor(private doctorService: DoctorService,
    public httpServiceService: HttpServiceService,
    private registrarService: RegistrarService,
    private confirmationService: ConfirmationService,
    private masterdataService: MasterdataService,
    private nurseService: NurseService
) { }

  ngOnInit() {
    this.visitCategory = localStorage.getItem('caseSheetVisitCategory');
    // this.language = sessionStorage.getItem('setLanguage');
    this.fetchHRPPositive();
    this.getHealthIDDetails();
    this.assignSelectedLanguage();
    this.getVaccinationTypeAndDoseMaster();
    // this.getAssessmentID();
    
    // if (this.language != undefined) {
    //   this.httpServiceService
    //     .getLanguage(this.language_file_path + this.language + ".json")
    //     .subscribe(
    //       response => {
    //         if (response) {
    //           this.current_language_set = response[this.language];             
              
    //         } else {
    //           console.log(
    //             this.current_language_set.alerts.info.comingUpWithThisLang +
    //               " " +
    //               this.language
    //           );
    //         }
    //       },
    //       error => {
    //         console.log(
    //           this.current_language_set.alerts.info.comingUpWithThisLang +
    //             " " +
    //             this.language
    //         );
    //       }
    //     );
    // }else{
    //   this.httpServiceService.currentLangugae$.subscribe(
    //     response => (this.current_language_set = response)
    //   );
    // }


  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  ngOnChanges() {
    this.ncdScreeningCondition=null;
    if (this.casesheetData !== undefined && this.casesheetData) {
      let temp2 = this.casesheetData.nurseData.covidDetails;
      if(this.casesheetData.nurseData !=undefined && 
        this.casesheetData.nurseData !=null &&
         this.casesheetData.nurseData.diabetes !=undefined && 
        this.casesheetData.nurseData.diabetes !=null && 
        this.casesheetData.nurseData.diabetes.confirmed)
      {
        this.confirmScreeningArray.push(environment.diabetes);
      }
       if(this.casesheetData.nurseData !=undefined && 
        this.casesheetData.nurseData !=null &&
         this.casesheetData.nurseData.hypertension !=undefined && 
        this.casesheetData.nurseData.hypertension !=null && 
         this.casesheetData.nurseData.hypertension.confirmed)
      {
        this.confirmScreeningArray.push(environment.hypertension);
      }
       if(this.casesheetData.nurseData !=undefined && 
        this.casesheetData.nurseData !=null &&
         this.casesheetData.nurseData.oral !=undefined && 
        this.casesheetData.nurseData.oral !=null &&
         this.casesheetData.nurseData.oral.confirmed)
       {
        this.confirmScreeningArray.push(environment.oral);
       }
       if(this.casesheetData.nurseData !=undefined && 
        this.casesheetData.nurseData !=null &&
         this.casesheetData.nurseData.cervical !=undefined && 
        this.casesheetData.nurseData.cervical !=null && 
         this.casesheetData.nurseData.cervical.confirmed)
         {
          this.confirmScreeningArray.push(environment.cervical);
         }
     
       if(this.casesheetData.nurseData !=undefined && 
        this.casesheetData.nurseData !=null &&
         this.casesheetData.nurseData.breast !=undefined && 
        this.casesheetData.nurseData.breast !=null && 
         this.casesheetData.nurseData.breast.confirmed)
         {
          this.confirmScreeningArray.push(environment.breast);
         }
       
      if(this.casesheetData.doctorData.diagnosis.doctorDiagnonsis)
      {
      this.doctorDiagnosis=this.casesheetData.doctorData.diagnosis.doctorDiagnonsis;
      this.diagnosisFlag=true;
      }
      if(temp2!=undefined)
      {
      if((temp2["symptom"])!=undefined)
      {
        this.symptomsList=temp2["symptom"];
        this.symptomFlag=true;
      }
      if((temp2["contactStatus"])!=undefined)
      {
        this.contactList=temp2["contactStatus"];
        if((this.contactList.length)>0)
      this.contactFlag=true;
      else
      this.contactFlag=false;
      }
      if((temp2.travelStatus)!=undefined)
      {
        this.travelStatus=temp2.travelStatus;
        if(this.travelStatus===false)
      {
        this.travelFlag=true;
        this.travelStatus="No";
      }
      else if(this.travelStatus===true)
      {
        this.travelFlag=true;
      this.travelStatus="Yes";
      }
      else
         this.travelFlag=false;
      }
      if((temp2.suspectedStatusUI)!=undefined)
      {
        this.suspectedFlag=true;
      this.suspected=temp2.suspectedStatusUI;
      }
      if((temp2["recommendation"])!=undefined)
      {
        this.recFlag=true;
        this.recommendation=temp2["recommendation"];
        let ar=this.recommendation[0]
        for(var i=0;i<ar.length;i++)
        {
          this.temp.push(ar[i]);
        }
        let testtravelarr=this.temp.join("\n");
                this.recommendationText=testtravelarr;
      } 
    }
       let t = new Date();
      this.date = t.getDate() + "/" + (t.getMonth() + 1) + "/" + t.getFullYear();

      this.beneficiaryDetails = this.casesheetData.BeneficiaryData;
      

      if (this.beneficiaryDetails.benVisitDate) {
        let sDate = new Date(this.beneficiaryDetails.benVisitDate);
        this.beneficiaryDetails.benVisitDate = [
          this.padLeft.apply(sDate.getDate()),
          this.padLeft.apply((sDate.getMonth() + 1)),
          this.padLeft.apply(sDate.getFullYear())].join('/') +
          ' ' +
          [this.padLeft.apply(sDate.getHours()),
          this.padLeft.apply(sDate.getMinutes()),
          this.padLeft.apply(sDate.getSeconds())].join(':');
      }

      if (this.beneficiaryDetails.consultationDate) {
        let cDate = new Date(this.beneficiaryDetails.consultationDate);
        this.beneficiaryDetails.consultationDate = [
          this.padLeft.apply(cDate.getDate()),
          this.padLeft.apply((cDate.getMonth() + 1)),
          this.padLeft.apply(cDate.getFullYear())].join('/') +
          ' ' +
          [this.padLeft.apply(cDate.getHours()),
          this.padLeft.apply(cDate.getMinutes()),
          this.padLeft.apply(cDate.getSeconds())].join(':');
      }

      let temp = this.casesheetData.nurseData.vitals;
      this.currentVitals = Object.assign({}, temp.benAnthropometryDetail, temp.benPhysicalVitalDetail);

      if (this.visitCategory != 'General OPD (QC)') {
        this.caseRecords = this.casesheetData.doctorData;
        if(this.caseRecords && this.caseRecords.diagnosis && this.caseRecords.diagnosis.ncdScreeningCondition)
        {
          this.ncdScreeningCondition=(this.caseRecords.diagnosis.ncdScreeningCondition).replaceAll("||",",");
        }
      } else {
        let temp = this.casesheetData.doctorData;
        this.caseRecords = {
          findings: temp.findings,
          prescription: temp.prescription,
          diagnosis: {
            provisionalDiagnosis: temp.diagnosis.diagnosisProvided,
            specialistAdvice: temp.diagnosis.instruction,
            externalInvestigation: temp.diagnosis.externalInvestigation
            
          },
          LabReport: temp.LabReport
        }
      }

      if(this.visitCategory === "NCD screening"){
        this.enableClinicalObv = false;
        this.enableSignificantFindigs = false;
        this.enableCheifComplaints = false;
      }
      else {
        this.enableClinicalObv = true;
        this.enableSignificantFindigs = true;
        this.enableCheifComplaints = true;
      }

      
      if(this.currentVitals.rbsTestResult)
      {

        let vitalsRBSValue= {
          "prescriptionID": null,
          "procedureID": null,
          "createdDate": this.currentVitals.createdDate,
          "procedureName": "RBS Test",
          "procedureType": "Laboratory",
          "componentList": [
            {
              "testResultValue": this.currentVitals.rbsTestResult,
              "remarks": this.currentVitals.rbsTestRemarks,
              "fileIDs": [
                null
              ],
              "testResultUnit": "mg/dl",
              "loincName": null,
              "testComponentID": null,
              "componentName": null
            }
          ]
        };
        // this.caseRecords.LabReport.push(vitalsRBSValue);
        this.caseRecords.LabReport=[vitalsRBSValue].concat(this.caseRecords.LabReport);
      }

      if(this.caseRecords.diagnosis.complicationOfCurrentPregnancy !== undefined)
      {
      this.tempComp=this.caseRecords.diagnosis.complicationOfCurrentPregnancy;
      console.log("tempComp"+this.tempComp)
      this.indexComplication=this.tempComp.indexOf("Other-complications : null");
      console.log("indexComp"+this.indexComplication)
      if(this.indexComplication!==-1)
      {
        this.tempComplication = true;
        this.newComp=this.tempComp.replace(', Other-complications : null','');
        console.log("newComp"+this.newComp)
      }
      else{
        this.tempComplication = false;
      }
      this.ancDetails = this.casesheetData.nurseData.anc;           
    }
    
    if(this.casesheetData.nurseData.idrs !== undefined && this.casesheetData.nurseData.idrs){
    if(this.casesheetData.nurseData.idrs.IDRSDetail !== undefined && this.casesheetData.nurseData.idrs.IDRSDetail){
      this.enableIDRSForm = true;
    this.idrsDetailsHistory = this.casesheetData.nurseData.idrs.IDRSDetail;
    this.temp1 = this.idrsDetailsHistory.idrsDetails.filter(response=>response.answer === 'yes');
    this.temp1 = this.temp1.filter(
      (idrsQuestionId, index, arr) => arr.findIndex(t => t.idrsQuestionId === idrsQuestionId.idrsQuestionId) === index
      ); 
    if(this.casesheetData.nurseData.idrs.IDRSDetail){
    this.idrsScore = this.casesheetData.nurseData.idrs.IDRSDetail;
    }
    if(this.casesheetData.nurseData.idrs.IDRSDetail.suspectedDisease){
      this.suspect = this.casesheetData.nurseData.idrs.IDRSDetail.suspectedDisease.split(',') ;
    }
    if(this.casesheetData.nurseData.idrs.IDRSDetail.confirmedDisease){
      this.suspectt = this.casesheetData.nurseData.idrs.IDRSDetail.confirmedDisease.split(',') ;
    }
  } else{
    this.enableIDRSForm = false;
  }
  }
  if(
    this.casesheetData &&
    this.casesheetData.nurseData &&
    this.casesheetData.nurseData.fpNurseVisitData
){
    this.visitDetailsCasesheet = this.casesheetData.nurseData.fpNurseVisitData;
    if(this.casesheetData.doctorData !== undefined && this.casesheetData.doctorData){
      this.followUpCaseTreatment = this.casesheetData.doctorData.treatmentsOnSideEffects;
    }
  }

  if(this.visitCategory !== undefined && this.visitCategory !== null && 
    (this.visitCategory.toLowerCase() == 'neonatal and infant health care services' || 
    this.visitCategory.toLowerCase() == 'childhood & adolescent healthcare services')) {
    if(this.casesheetData.nurseData !== undefined && this.casesheetData.nurseData){
      let temp = this.casesheetData.nurseData.vitals;
      this.currentVitalsCasesheet = Object.assign({}, temp.benAnthropometryDetail, temp.benPhysicalVitalDetail);
    }
  }
    if(this.casesheetData.doctorData !== undefined && this.casesheetData.doctorData 
      && this.casesheetData.doctorData.counsellingProvidedList !== undefined 
      && this.casesheetData.doctorData.counsellingProvidedList !== null && this.visitCategory !== "General OPD (QC)"){
        this.counsellingProvidedDetails = this.casesheetData.doctorData.counsellingProvidedList;
      }
      if (this.visitCategory === "General OPD (QC)" && this.casesheetData.doctorData.diagnosis !== undefined && 
      this.casesheetData.doctorData.diagnosis !== null && this.casesheetData.doctorData.diagnosis.counsellingProvided !== undefined && 
      this.casesheetData.doctorData.diagnosis.counsellingProvided !== null){
      this.counsellingProvidedDetails = this.casesheetData.doctorData.diagnosis.counsellingProvided;
     }

     if (this.casesheetData.nurseData.cdss !== undefined && 
     this.casesheetData.nurseData.cdss !== null && this.casesheetData.nurseData.cdss.presentChiefComplaint !== undefined && 
     this.casesheetData.nurseData.cdss.presentChiefComplaint !== null && this.casesheetData.nurseData.cdss.diseaseSummary !== undefined && this.casesheetData.nurseData.cdss.diseaseSummary !== null){
     this.cdssFormDetails = this.casesheetData.nurseData.cdss;
    }

  this.downloadSign();
  this.getVaccinationTypeAndDoseMaster();
  }
  }

  // getAssessmentID() {
  //   let benRegID = localStorage.getItem('caseSheetBeneficiaryRegID');
  //   this.doctorService.getAssessment(benRegID).subscribe(res => {
  //     if (res.statusCode === 200 && res.data !== null) {
  //       const lastElementIndex = res.data.length - 1;
  //       const lastElementData = res.data[lastElementIndex];
  //       let assessmentId = lastElementData.assessmentId;
  //       if(assessmentId !== null && assessmentId !== undefined) {
  //         this.getAssessmentDetails(assessmentId);
  //       }
  //     }
  //   })
  // }

  // getAssessmentDetails(assessmentId) {
  //   this.doctorService.getAssessmentDet(assessmentId).subscribe(res => {
  //     if (res.statusCode === 200 && res.data !== null) {
  //       this.severity = res.data.severity;
  //       this.cough_pattern = res.data.cough_pattern;
  //       this.cough_severity_score = res.data.cough_severity_score;
  //       this.record_duration = res.data.record_duration;
  //       this.nurseService.setEnableLAssessment(false);
  //       this.enableResult = true;
  //     }
  //   })
  // }

  padLeft() {
    let len = (String(10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join('0') + this : this;
  }
  downloadSign() {
    if (this.beneficiaryDetails && this.beneficiaryDetails.tCSpecialistUserID) {
      let tCSpecialistUserID = this.beneficiaryDetails.tCSpecialistUserID;
      this.doctorService.downloadSign(tCSpecialistUserID).subscribe((response) => {
        const blob = new Blob([response], { type: response.type });
        this.showSign(blob);
      }, (err) => {
        console.log('error');
      })
    } else {
      console.log("No tCSpecialistUserID found");
    }
  }
  showSign(blob) {
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = (_event) => {
      this.imgUrl = reader.result;
    }
  }

  fetchHRPPositive()
  {
    let beneficiaryRegID = localStorage.getItem('caseSheetBeneficiaryRegID');
    let visitCode = localStorage.getItem('visitCode');
  this.doctorService
    .getHRPDetails(beneficiaryRegID,visitCode)
    .subscribe(res => {
      if (res && res.statusCode == 200 && res.data) {
        if(res.data.isHRP == true)
        {
          this.showHRP="true";
        }
        else
        {
          this.showHRP="false";
        }
      }
    });
  }
  getHealthIDDetails()
  {
    let data = {
      "beneficiaryRegID": localStorage.getItem('caseSheetBeneficiaryRegID'),
      "beneficiaryID": null
    }
    this.registrarService.getHealthIdDetails(data)
      .subscribe((healthIDDetails) => {
        if (healthIDDetails.statusCode == 200) {
          console.log("healthID",healthIDDetails);
          if(healthIDDetails.data !=undefined && healthIDDetails.data.BenHealthDetails !=undefined && healthIDDetails.data.BenHealthDetails !=null)
          {
            this.benDetails=healthIDDetails.data.BenHealthDetails;
            if(this.benDetails.length >0)
          {
          
          this.benDetails.forEach((healthID) => {
            if(healthID.healthId !=undefined && healthID.healthId !=null)
            this.healthIDValue=this.healthIDValue+healthID.healthId+',';
          })
        }
          if(this.healthIDValue !=undefined && this.healthIDValue !=null && this.healthIDValue.length >1)
          this.healthIDValue=this.healthIDValue.substring(0,this.healthIDValue.length-1);
        }
        } else {
          this.confirmationService.alert(this.current_language_set.issueInGettingBeneficiaryABHADetails, 'error');
        }
      }, (err) => {
        this.confirmationService.alert(this.current_language_set.issueInGettingBeneficiaryABHADetails, 'error');

      });
  }

  getVaccinationTypeAndDoseMaster(){
    if(this.beneficiaryDetails !== undefined && this.beneficiaryDetails !== null){
    if(this.beneficiaryDetails.ben_age_val >= 12) {
    this.masterdataService.getVaccinationTypeAndDoseMaster().subscribe((res) => {
      if (res.statusCode == 200) {
        if (res.data) {
          let doseTypeList = res.data.doseType;
          let vaccineTypeList = res.data.vaccineType;
              this.getPreviousCovidVaccinationDetails(doseTypeList,vaccineTypeList);
         
        }
       
      }
      
    }, err => {
      console.log("error",err.errorMessage);
    });

  }
}

  }

  getPreviousCovidVaccinationDetails(doseTypeList,vaccineTypeList)
  {
    let beneficiaryRegID = localStorage.getItem('caseSheetBeneficiaryRegID');
    this.masterdataService.getPreviousCovidVaccinationDetails(beneficiaryRegID).subscribe((res) => {
      if (res.statusCode == 200) {
        if (res.data.covidVSID) {
          this.covidVaccineDetails=res.data;

          if(res.data.doseTypeID !== undefined && res.data.doseTypeID !== null && res.data.covidVaccineTypeID !== undefined && res.data.covidVaccineTypeID !== null) 
          {
          this.covidVaccineDetails.doseTypeID = doseTypeList.filter(item => {
            return item.covidDoseTypeID === res.data.doseTypeID;
          });
          this.covidVaccineDetails.covidVaccineTypeID = vaccineTypeList.filter(item => {
            return item.covidVaccineTypeID === res.data.covidVaccineTypeID;
          });
        }

        }
       
      }
      
    }, err => {
     console.log("error",err.errorMessage);
    });
   
  }
}
