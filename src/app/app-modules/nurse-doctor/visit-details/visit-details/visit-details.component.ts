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
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { MasterdataService, DoctorService, NurseService } from '../../shared/services';
import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';
import { NcdScreeningService } from '../../shared/services/ncd-screening.service';

@Component({
  selector: 'patient-visit-details',
  templateUrl: './visit-details.component.html',
  styleUrls: ['./visit-details.component.css']
})
export class VisitDetailsComponent implements OnInit {

  @Input('patientVisitDetailsForm')
  patientVisitDetailsForm: FormGroup;

  @Input('mode')
  mode: String;

  templateNurseMasterData: any;
  templateVisitCategories: any;
  // templateVisitReasons: any="Pandemic";
  templateVisitReasons : any;
  templateBeneficiaryDetails: any;
  templateFilterVisitCategories: any;
  templatePregnancyStatus = ["Yes", "No", "Don't Know"];

  showPregnancyStatus = true;
  currentLanguageSet: any;
  disableVisit: boolean=false;
  cbacData: any=[];
  idrsCbac = [];
  showHistoryForm: boolean = false;
  hideVitalsFormForNcdScreening: boolean = false;
  enableCbac: boolean = false;
  keyType: any;

  enableOtherFpTextField: boolean = false;
  enableOtherSideEffectTextField: boolean = false;
  disableAllFpOptions: boolean = null;
  fpMethodList = [];
  sideEffectsList = [];
  beneficiaryAge: number = 0;
  attendant: any;
  previousConfirmedDiseasesList = [];
  enableConfirmedDiseases: boolean = false;
  subVisitCategory: any;
  templateSubVisitCategories = [];
  subVisitCategoryList = [];
  isRadioGroupVisible : boolean = false;
  constructor(
    private masterdataService: MasterdataService,
    private doctorService: DoctorService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService,
    private ncdScreeningService: NcdScreeningService,
    private nurseService: NurseService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.attendant = this.route.snapshot.params["attendant"];
    this.cbacData=this.beneficiaryDetailsService.cbacData;
    this.idrsCbac = environment.IdrsOrCbac;
    if (this.mode !== undefined && this.mode !== 'view') {
    this.patientVisitDetailsForm.controls["IdrsOrCbac"].setValue("CBAC");
    this.enableHistoryScreenOnIdrs("CBAC");
    }
    this.assignSelectedLanguage();
    this.getBenificiaryDetails();
    this.getVisitReasonAndCategory();
    this.loadNurseMasters();
    // this.loadMastersForDoctor();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  get visitReason() {
    return this.patientVisitDetailsForm.controls['visitReason'].value;
  }

  get visitCategory() {
    return this.patientVisitDetailsForm.controls['visitCategory'].value;
  }

  get pregnancyStatus() {
    return this.patientVisitDetailsForm.controls['pregnancyStatus'].value;
  }

  get rCHID() {
    return this.patientVisitDetailsForm.controls['rCHID'].value;
  }

  get IdrsOrCbac() {
    return this.patientVisitDetailsForm.controls['IdrsOrCbac'].value;
  }

  get followUpForFpMethod() {
    return this.patientVisitDetailsForm.controls['followUpForFpMethod'].value;
  }

  get otherFollowUpForFpMethod() {
    return this.patientVisitDetailsForm.controls['otherFollowUpForFpMethod'].value;
  }

  get sideEffects() {
    return this.patientVisitDetailsForm.controls['sideEffects'].value;
  }

  get otherSideEffects() {
    return this.patientVisitDetailsForm.controls['otherSideEffects'].value;
  }

  ngOnChanges() {
    this.attendant = this.route.snapshot.params["attendant"];
    this.nurseService.mmuVisitData=false;
    if (this.mode == 'view') {
      this.loadNurseMasters();
      let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.disableVisit=true;
      this.getVisitDetails(visitID, benRegID);
      // this.loadMastersForDoctor();
    }
    if(parseInt(localStorage.getItem("specialistFlag")) == 100)
    {
      this.loadNurseMasters();
       console.log("MMUSpecialist===========")
       let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.getMMUVisitDetails(visitID, benRegID);

      // this.loadMastersForDoctor();
    }

  }

  enableCbacIdrs(visitID, benRegID) {
    let obj={
      
      "beneficiaryRegId": benRegID,
      "visitCode": localStorage.getItem('visitCode')
  };

  // {

  //   "beneficiaryRegID": 1234,
  
  //   "visitCode": 300220001700413
  // }
  

   this.nurseService.getCbacDetailsFromNurse(obj)
    .subscribe(valueRes => {

  if (valueRes != null && valueRes.statusCode == 200 && (valueRes.data.diabetes !== undefined ||  valueRes.data.oral !== undefined || valueRes.data.cervical !== undefined || valueRes.data.breast !== undefined || valueRes.data.hypertension !== undefined)) {
    this.patientVisitDetailsForm.controls["IdrsOrCbac"].setValue("CBAC");
    this.enableHistoryScreenOnIdrs("cbac");

  }
  else
  {
    this.patientVisitDetailsForm.controls["IdrsOrCbac"].setValue("IDRS");
    this.enableHistoryScreenOnIdrs("idrs");
  }

  
});
}


  ngOnDestroy() {
    this.beneficiaryAge = 0;
    if (this.visitCategorySubscription)
      this.visitCategorySubscription.unsubscribe();

    if (this.visitDetailsSubscription)
      this.visitDetailsSubscription.unsubscribe();

      if (this.visitDetSubscription)
      this.visitDetSubscription.unsubscribe();

    if (this.beneficiaryDetailsSubscription)
      this.beneficiaryDetailsSubscription.unsubscribe();
     // this.nurseService.mmuVisitData=false;
     this.patientVisitDetailsForm.reset();
  }


  visitCategorySubscription: any;
  getVisitReasonAndCategory() {
    this.visitCategorySubscription = this.masterdataService.visitDetailMasterData$.subscribe((masterData) => {
      if (masterData) {
        this.templateNurseMasterData = masterData;
        console.log('Visit reason and category', this.templateNurseMasterData);
        this.templateVisitReasons = this.templateNurseMasterData.visitReasons;
        this.templateVisitCategories = this.templateNurseMasterData.visitCategories;
        this.templateFilterVisitCategories = this.templateVisitCategories;
      }
    });
    //this.templateVisitReasons ="Pandemic";
    //this.templateVisitCategories="Pandemic";
  }


  visitDetSubscription: any;
  getMMUVisitDetails(visitID, benRegID) {
   
    let visitCategory = localStorage.getItem('visitCategory');    
    this.visitDetSubscription = this.doctorService.getVisitComplaintDetails(benRegID, visitID)
      .subscribe(value => {
        if (value != null && value.statusCode == 200 && value.data != null) {
          
          if (visitCategory == 'General OPD (QC)') {
            let visitDetails = value.data.benVisitDetails;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.benVisitDetails.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.disableVisit=true;
            // this.patientVisitDetailsForm.disable();
          }
          if (visitCategory == 'ANC') {
            let visitDetails = value.data.ANCNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.ANCNurseVisitDetail.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.disableVisit=true;
            // this.patientVisitDetailsForm.disable();
          }
          if (visitCategory == 'General OPD') {
            let visitDetails = value.data.GOPDNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.GOPDNurseVisitDetail.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.disableVisit=true;
            // this.patientVisitDetailsForm.disable();
          }
          if (visitCategory == 'NCD screening') {
            let visitDetails = value.data.NCDScreeningNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.NCDScreeningNurseVisitDetail.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.disableVisit=true;
            // if(this.route.snapshot.params["attendant"]  == "nurse")
            // this.nurseService.mmuVisitData=true;
            // this.patientVisitDetailsForm.disable();
          }
          if (visitCategory == 'NCD care') {
            let visitDetails = value.data.NCDCareNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.disableVisit=true;
            this.loadConfirmedDiseasesFromNCD();
            // this.patientVisitDetailsForm.disable();
          }
          if (visitCategory == 'PNC') {
            let visitDetails = value.data.PNCNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.disableVisit=true;
            // this.patientVisitDetailsForm.disable();
          }
          if (visitCategory == 'COVID-19 Screening') {
            console.log("visitData",value.data);            
            let visitDetails = value.data.covid19NurseVisitDetail;            
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.disableVisit=true;
            // this.patientVisitDetailsForm.disable();
          }
          if (visitCategory == 'Neonatal and Infant Health Care Services') {
            let visitDetails = value.data.neonatalNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.disableVisit=true;
            // this.patientVisitDetailsForm.disable();
          }
          if (visitCategory == 'Childhood & Adolescent Healthcare Services') {
            let visitDetails = value.data.cacNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.disableVisit=true;
            // this.patientVisitDetailsForm.disable();
          }

          if (visitCategory == 'FP & Contraceptive Services') {           
            let visitDetails = value.data.FP_NurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.FP_NurseVisitDetail.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);

            this.checkForOtherFpMethodOption(this.patientVisitDetailsForm.controls.followUpForFpMethod.value);
            this.checkForOtherSideEffectsOption(this.patientVisitDetailsForm.controls.sideEffects.value)
            this.disableVisit=true;
          }
        }
      })
  }



  visitDetailsSubscription: any;
  getVisitDetails(visitID, benRegID) {
    // localStorage.setItem('visitCategory', "General OPD");
    let visitCategory = localStorage.getItem('visitCategory');    
    this.visitDetailsSubscription = this.doctorService.getVisitComplaintDetails(benRegID, visitID)
      .subscribe(value => {
        if (value != null && value.statusCode == 200 && value.data != null) {
          if (visitCategory == 'General OPD (QC)') {
            let visitDetails = value.data.benVisitDetails;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.benVisitDetails.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
           
          }
          if (visitCategory == 'ANC') {
            let visitDetails = value.data.ANCNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.ANCNurseVisitDetail.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
           
          }
          if (visitCategory == 'General OPD') {
            let visitDetails = value.data.GOPDNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.GOPDNurseVisitDetail.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
           
          }
          if (visitCategory == 'NCD screening') {
            let visitDetails = value.data.NCDScreeningNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.NCDScreeningNurseVisitDetail.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.enableCbacIdrs(visitID, benRegID);
            
          }
          if (visitCategory == 'NCD care') {
            let visitDetails = value.data.NCDCareNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.patientVisitDetailsForm.patchValue(visitDetails);
            this.loadConfirmedDiseasesFromNCD();

           
          }
          if (visitCategory == 'PNC') {
            let visitDetails = value.data.PNCNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.patientVisitDetailsForm.patchValue(visitDetails);
           
          }
          if (visitCategory == 'COVID-19 Screening') {
            console.log("visitData",value.data);            
            let visitDetails = value.data.covid19NurseVisitDetail;            
            this.patientVisitDetailsForm.patchValue(visitDetails);
            
          }
          if (visitCategory == 'Neonatal and Infant Health Care Services') {
            let visitDetails = value.data.neonatalNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.patientVisitDetailsForm.patchValue(visitDetails);
           
          }
          if (visitCategory == 'Childhood & Adolescent Healthcare Services') {
            let visitDetails = value.data.cacNurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.patientVisitDetailsForm.patchValue(visitDetails);
          }

          if (visitCategory == 'FP & Contraceptive Services') {           
            let visitDetails = value.data.FP_NurseVisitDetail;
            visitDetails.visitCode = visitDetails.visitCode;
            this.doctorService.fileIDs = value.data.FP_NurseVisitDetail.fileIDs;
            this.patientVisitDetailsForm.patchValue(visitDetails);
             
            this.checkForOtherFpMethodOption(this.patientVisitDetailsForm.controls.followUpForFpMethod.value);
            this.checkForOtherSideEffectsOption(this.patientVisitDetailsForm.controls.sideEffects.value)
          }
        }
      })
  }


  beneficiaryGender: any;
  beneficiary: any;
  beneficiaryDetailsSubscription: any;
  getBenificiaryDetails() {
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if (beneficiaryDetails) {
          this.beneficiary = beneficiaryDetails;
          this.beneficiaryGender = beneficiaryDetails.genderName;
          let calculateAgeInYears = beneficiaryDetails.age.split('-')[0].trim();
          let calculateAgeInMonths = beneficiaryDetails.age.split('-')[1] ? beneficiaryDetails.age.split('-')[1].trim() : "";
          let age = this.getAgeValueNew(calculateAgeInYears);
          if (age !== 0 && calculateAgeInMonths !== "0 months") {
  
            this.beneficiaryAge = age + 1; 
          }
          else
          {
               this.beneficiaryAge = age;
          }

          if (beneficiaryDetails && beneficiaryDetails.genderName != null && beneficiaryDetails.genderName == 'Male')
            this.showPregnancyStatus = false;
          else if (beneficiaryDetails && beneficiaryDetails.ageVal != null && beneficiaryDetails.ageVal <= 11)
            this.showPregnancyStatus = false;
          else
            this.showPregnancyStatus = true;
        }
      })
  }

  getAgeValueNew(age) {
    if (!age) return 0;
    let arr = (age !== undefined && age !== null) ? age.trim().split(' ') : age;
    if (arr[1]) {
      let ageUnit = arr[1];
      if (ageUnit.toLowerCase() == "years") {
        return parseInt(arr[0]);
      }
    }
    return 0;
  }	

  reasonSelected(visitReason) {
    this.templateFilterVisitCategories = [];
    this.patientVisitDetailsForm.controls['visitCategory'].setValue(null);
    localStorage.setItem("visitReason",visitReason);
    if (visitReason == 'Screening') {
      this.templateFilterVisitCategories = this.templateVisitCategories.filter(item => item.visitCategory.toLowerCase().indexOf('screening') >= 0);
        if(this.beneficiary.ageVal < 30)
        this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => item.visitCategory.toLowerCase() != "ncd screening")
    } else if (visitReason == 'Pandemic') {
      this.templateFilterVisitCategories = this.templateVisitCategories.filter(item => item.visitCategory.indexOf('COVID-19') >= 0)
    } 
    else if (visitReason == 'Referral') {
      this.templateFilterVisitCategories = this.templateVisitCategories.filter(item => item.visitCategory.toLowerCase() != "synctest")
      if(this.beneficiaryAge > 1) {
        this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => item.visitCategory.toLowerCase() != "neonatal and infant health care services")
      }
      if(this.beneficiaryAge > 19 || this.beneficiaryAge < 1) {
        this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => item.visitCategory.toLowerCase() != "childhood & adolescent healthcare services")
      }
      if(this.beneficiary.ageVal <= 12) {
        this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => item.visitCategory.toLowerCase() != "fp & contraceptive services")
      }
      
      if(this.beneficiary.ageVal < 30){
      this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => item.visitCategory.toLowerCase() != "ncd screening")
      }
      // if(this.beneficiary.ageVal < 30) {
      //   this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => item.visitCategory.toLowerCase() != "ncd care")
      // }

      if (this.beneficiary.genderName == "Male" || this.beneficiary.ageVal < 12) {
        this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => (item.visitCategory.toLowerCase() != "anc" && item.visitCategory.toLowerCase() != "pnc"
        &&  item.visitCategory.toLowerCase() != "synctest"));
      }
    } 
    else if(visitReason == 'Follow Up')  
    {
      this.templateFilterVisitCategories = this.templateVisitCategories.filter((item =>
        (
          item.visitCategory.toLowerCase() != "ncd screening" &&
          item.visitCategory.toLowerCase() != "covid-19 screening" &&
          item.visitCategory.toLowerCase() != "synctest"
          )
          )
          );
          // if(this.beneficiary.ageVal < 30) {
          //   this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => item.visitCategory.toLowerCase() != "ncd care")
          // }
           if(this.beneficiary.ageVal <= 12) {
            this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => item.visitCategory.toLowerCase() != "fp & contraceptive services")
          }
          if(this.beneficiaryAge > 1) {
            this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => item.visitCategory.toLowerCase() != "neonatal and infant health care services")
          }
          if(this.beneficiaryAge > 19 || this.beneficiaryAge < 1) {
            this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => item.visitCategory.toLowerCase() != "childhood & adolescent healthcare services")
          }
          if (this.beneficiary.genderName == "Male" || this.beneficiary.ageVal < 12) {
            this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => (item.visitCategory.toLowerCase() != "anc" && item.visitCategory.toLowerCase() != "pnc"
            &&  item.visitCategory.toLowerCase() != "synctest"));
          } else
              this.templateFilterVisitCategories = this.templateFilterVisitCategories.slice();
    }
    else {

      /**
       * Filtering ANC for male and child (hardcoded)
       * TODO : need to filter based on api
       */
       this.templateFilterVisitCategories =this.templateVisitCategories.filter(item => (
        item.visitCategory.toLowerCase() != "synctest"
       && item.visitCategory.toLowerCase() != "ncd care"));

      if (this.beneficiary.genderName == "Male" || this.beneficiary.ageVal < 12)
        this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => (item.visitCategory.toLowerCase() != "anc" && item.visitCategory.toLowerCase() != "pnc"
        &&  item.visitCategory.toLowerCase() != "synctest"
        
        //&& item.visitCategory.toLowerCase() != "ncd care"
        ));
      else
        this.templateFilterVisitCategories = this.templateFilterVisitCategories.slice();

        if(this.beneficiary.ageVal < 30)
        this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => item.visitCategory.toLowerCase() != "ncd screening")

        if(this.beneficiary.ageVal <= 12) {
          this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => item.visitCategory.toLowerCase() != "fp & contraceptive services")
        }

        if(this.beneficiaryAge > 1) {
          this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => item.visitCategory.toLowerCase() != "neonatal and infant health care services")
        }
        if(this.beneficiaryAge > 19 || this.beneficiaryAge < 1) {
          this.templateFilterVisitCategories = this.templateFilterVisitCategories.filter(item => item.visitCategory.toLowerCase() != "childhood & adolescent healthcare services")
        }
    }

    this.resetFPAndSideEffects();
  }

  checkCategoryDependent(visitCategory) {
    this.previousConfirmedDiseasesList = [];
    this.enableConfirmedDiseases = false;

    localStorage.setItem("visiCategoryANC",visitCategory);
    if (visitCategory == 'ANC') {
      this.templatePregnancyStatus = [ 'Yes' ];
      this.patientVisitDetailsForm.patchValue({ 'pregnancyStatus': 'Yes' });
    } else{
      this.templatePregnancyStatus = ["Yes", "No", "Don't Know"];
      this.patientVisitDetailsForm.patchValue({ 'pregnancyStatus': null });
    }

    this.patientVisitDetailsForm.patchValue({ 'rCHID': null });

    if (visitCategory == 'NCD screening') {
    this.patientVisitDetailsForm.controls["IdrsOrCbac"].setValue("CBAC")
    this.enableHistoryScreenOnIdrs("cbac");
    }

    if (visitCategory == 'NCD care') {
       this.loadConfirmedDiseasesFromNCD();
      }

    this.resetFPAndSideEffects();
    this.patientVisitDetailsForm.controls.subVisitCategory.reset();

    // if (visitCategory === 'FP & Contraceptive Services') {
    //    this.loadNurseMasters();
    // }
  }

  visitCategorySelected(){
    // this.templateSubVisitCategories = [];

    if(this.beneficiaryAge > 1){
   this.templateSubVisitCategories = this.subVisitCategoryList.filter(item => item.name.toLowerCase() != "newborn & infant opd care")
    }
     if(this.beneficiaryAge > 19 || this.beneficiaryAge < 1) {
      this.templateSubVisitCategories = this.templateSubVisitCategories.filter(item => item.name.toLowerCase() != "child & adolescent opd care")
     }
     if(this.beneficiary.ageVal < 12) {
      this.templateSubVisitCategories = this.templateSubVisitCategories.filter(item => item.name.toLowerCase() != "reproductive health opd care")
   }
      if(this.beneficiaryAge <= 60) {
        this.templateSubVisitCategories = this.templateSubVisitCategories.filter(item => item.name.toLowerCase() != "elderly opd health care")
     }
     if(this.beneficiaryAge <= 19) {
        this.templateSubVisitCategories = this.templateSubVisitCategories.filter(item => item.name.toLowerCase() != "management of common communicable diseases and outpatient care for acute simple illnesses & minor ailments")

     }
     }


  loadConfirmedDiseasesFromNCD() {
    this.previousConfirmedDiseasesList = [];
    this.enableConfirmedDiseases = false;
    let obj={
      
      "beneficiaryRegId": localStorage.getItem('beneficiaryRegID')
  };

    this.nurseService.getPreviousVisitConfirmedDiseases(obj)
    .subscribe(value => {
      if (value != null && value.statusCode == 200 && value.data != null) {
        this.previousConfirmedDiseasesList = [];

        if(value.data.confirmedDiseases !== undefined && value.data.confirmedDiseases !== null && 
          value.data.confirmedDiseases.length > 0) {
        this.previousConfirmedDiseasesList = value.data.confirmedDiseases;
        this.enableConfirmedDiseases = true;
        }
  }
     });
}

  enableHistoryScreenOnIdrs(IdrsOrCbac) {
    if(IdrsOrCbac.toLowerCase() == 'idrs'){
      this.showHistoryForm = true;
      this.enableCbac =false;
    } else {
      this.showHistoryForm = false;
      this.enableCbac = true;
    }

    this.nurseService.diseaseFileUpload = false;

    this.ncdScreeningService.enableHistoryScreenOnIdrs(this.showHistoryForm);
    this.ncdScreeningService.checkIfCbac(this.enableCbac);

    if(IdrsOrCbac.toLowerCase() == 'cbac'){
      this.hideVitalsFormForNcdScreening = false;
    } else {
      this.hideVitalsFormForNcdScreening = true;
    }
    this.ncdScreeningService.disableViatlsFormOnCbac(this.hideVitalsFormForNcdScreening);

    this.ncdScreeningService.enableDiseaseConfirmationScreen(IdrsOrCbac.toLowerCase());
  }


  loadNurseMasters() {
    this.fpMethodList = [];
    this.sideEffectsList = [];
      this.masterdataService.nurseMasterData$.subscribe(
        masterResp => {
          if (masterResp) {
            if(masterResp.subVisitCategories !== undefined && masterResp.subVisitCategories !== null){
              this.templateSubVisitCategories = masterResp.subVisitCategories;
              this.subVisitCategoryList = masterResp.subVisitCategories;
              this.visitCategorySelected();
            }
          
  
            if(masterResp.m_fpmethodfollowup !== undefined && masterResp.m_fpmethodfollowup !== null && 
              masterResp.m_FPSideEffects !== undefined && masterResp.m_FPSideEffects !== null ) {
          this.fpMethodList = masterResp.m_fpmethodfollowup;
          this.sideEffectsList = masterResp.m_FPSideEffects;
              } 


          }
        }
      );

  }

  
  // loadMastersForDoctor() {
  //   this.fpMethodList = [];
  //   this.sideEffectsList = [];
  //     this.masterdataService.nurseMasterData$.subscribe(
  //       masterResp => {
  //         if (masterResp) {
  
  //           if(masterResp.m_fpmethodfollowup !== undefined && masterResp.m_fpmethodfollowup !== null && 
  //             masterResp.m_FPSideEffects !== undefined && masterResp.m_FPSideEffects !== null ) {
  //         this.fpMethodList = masterResp.m_fpmethodfollowup;
  //         this.sideEffectsList = masterResp.m_FPSideEffects;
  //             } 

  //             if (this.mode == 'view') {
  //               let visitID = localStorage.getItem('visitID');
  //               let benRegID = localStorage.getItem('beneficiaryRegID')
  //               this.disableVisit=true;
  //               this.getVisitDetails(visitID, benRegID);
  //             }

  //             if(parseInt(localStorage.getItem("specialistFlag")) == 100)
  //             {
  //                console.log("MMUSpecialist===========")
  //                let visitID = localStorage.getItem('visitID');
  //               let benRegID = localStorage.getItem('beneficiaryRegID')
  //               this.getMMUVisitDetails(visitID, benRegID);
  //             }

  //         }
  //       }
  //     );

  // }

  checkForOtherFpMethodOption(selectedOption) {
    if(selectedOption !== undefined && selectedOption !== null && selectedOption.length > 0) {
      if(selectedOption.includes("Other")) {
        this.enableOtherFpTextField = true;
      }
      else {
        this.enableOtherFpTextField = false;
        this.patientVisitDetailsForm.controls["otherFollowUpForFpMethod"].setValue(null);
      }

      if(selectedOption.includes("None")) {
        this.disableAllFpOptions = true;
      }
      else {
        this.disableAllFpOptions = false;
      }
    // selectedOption.filter((checkForOtherOption) => {
    //   if (checkForOtherOption.toLowerCase() === "other") {
    //     this.enableOtherFpTextField = true;
    //     this.patientVisitDetailsForm.controls["otherFollowUpForFpMethod"].setValue(null);
    //   } else {
    //     this.enableOtherFpTextField = false;
    //     this.patientVisitDetailsForm.controls["otherFollowUpForFpMethod"].setValue(null);
    //   }
    // });

  }
  else
  {
    this.enableOtherFpTextField = false;
    this.patientVisitDetailsForm.controls["otherFollowUpForFpMethod"].setValue(null);
    this.disableAllFpOptions = null;
  }
  }


  checkForOtherSideEffectsOption(selectedOption) {
    if(selectedOption !== undefined && selectedOption !== null  && selectedOption.length > 0) {

      if(selectedOption.includes("Other")) {
        this.enableOtherSideEffectTextField = true;
      }
      else {
        this.enableOtherSideEffectTextField = false;
        this.patientVisitDetailsForm.controls["otherSideEffects"].setValue(null);
      }

    
  }
  else
  {
    this.enableOtherSideEffectTextField = false;
    this.patientVisitDetailsForm.controls["otherSideEffects"].setValue(null);
  }
  }

  resetFPAndSideEffects() {
    this.patientVisitDetailsForm.controls["followUpForFpMethod"].setValue(null);
    this.patientVisitDetailsForm.controls["otherFollowUpForFpMethod"].setValue(null);
    this.patientVisitDetailsForm.controls["sideEffects"].setValue(null);
    this.patientVisitDetailsForm.controls["otherSideEffects"].setValue(null);
    this.enableOtherFpTextField = false;
    this.disableAllFpOptions = null;
    this.enableOtherSideEffectTextField = false;

  }






}
