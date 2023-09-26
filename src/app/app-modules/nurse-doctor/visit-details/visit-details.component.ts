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
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { ConfirmationService } from '../../core/services/confirmation.service';
import { DoctorService } from '../shared/services'
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { NcdScreeningService } from '../shared/services/ncd-screening.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-visit-details',
  templateUrl: './visit-details.component.html',
  styleUrls: ['./visit-details.component.css']
})
export class VisitDetailsComponent implements OnInit {

  @Input('patientVisitForm')
  patientVisitForm: FormGroup;

  @Input('mode')
  mode: String;

  visitCategory: any;

  hideAll = false;
  showANCVisit = false;
  showNeonatalVisit = false;
  showChildAndAdolescent = false;
  showPNCVisit = false;
  showNCDCare = false;
  showPNC = false;
  showOPD = false;
  showFamilyPlanning = false;
  showNcdScreeningVisit = false;
  enableFileSelection = false;
  currentLanguageSet: any;
  showCOVID = false;
  enableDiseaseConfirmationForm: boolean=false;
  visitReason: any;
  idrsOrCbac: any;
  enableCBACForm: boolean = false;
  isCdssVitals : boolean = false;
  enablingCBACSectionSubscription: Subscription

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService,
    private doctorService: DoctorService,
    private ncdScreeningService: NcdScreeningService) { }

  ngOnInit() {
    this.ncdScreeningService.clearDiseaseConfirmationScreenFlag();
     this.ncdScreeningService.enableDiseaseConfirmForm$.subscribe((response) => {
      if(response === "idrs" || response === "cbac")
      {
        this.idrsOrCbac = response;
        this.enableDiseaseConfirmationForm = true;
        if(response === "idrs" && this.visitCategory === "NCD screening") {
          this.enableCBACForm = false;
        }
        else if(response === "cbac" && this.visitCategory === "NCD screening") 
        this.enableCBACForm = true;
      }
   });

    this.getVisitCategory();
    this.getVisitReason();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);
    this.assignSelectedLanguage();
    if(parseInt(localStorage.getItem("specialistFlag")) == 100){
    let visitCategory = localStorage.getItem('visitCat');    
    localStorage.setItem('visitCategory',visitCategory)
    }
    
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  ngOnDestroy() {
    if (this.enablingCBACSectionSubscription)
    this.enablingCBACSectionSubscription.unsubscribe();
  }

  getVisitCategory() {
    (<FormGroup>this.patientVisitForm.controls['patientVisitDetailsForm']).controls['visitCategory'].valueChanges
      .subscribe(categoryValue => {
        if (categoryValue) {
          this.visitCategory = categoryValue;
          this.conditionCheck();
        }
      })
  }
getVisitReason()
{
  (<FormGroup>this.patientVisitForm.controls['patientVisitDetailsForm']).controls['visitReason'].valueChanges
  .subscribe(categoryValue => {
    if (categoryValue) {
      let visitDetailsForm=<FormGroup>(this.patientVisitForm.controls['patientVisitDetailsForm']);
if(visitDetailsForm !=null && visitDetailsForm !=undefined)
{
  this.visitReason=visitDetailsForm.controls["visitReason"].value;
  console.log("visit reason",this.visitReason);
}
    }
  })
}
  conditionCheck() {
    if (!this.mode)
      this.hideAllTab();
    if (this.visitCategory == 'NCD screening') {
      this.enableFileSelection = true;
      this.showNcdScreeningVisit = true;
      this.enablingCBACSectionSubscription =
      this.ncdScreeningService.enablingIdrs$.subscribe((response) => {
        if (response === true) {
          this.enableCBACForm = false;
        } else {
          this.enableCBACForm = true;
        }
      });

    }
    if (this.visitCategory == 'General OPD (QC)') {
      this.hideAll = false;
    } else if (this.visitCategory == 'ANC') {
      this.showANCVisit = true;
    }
    else if (this.visitCategory == 'PNC') {
      this.showPNCVisit = true;
    }
    else if (this.visitCategory == 'General OPD') {
      this.showOPD = true;
    }
    else if (this.visitCategory == 'FP & Contraceptive Services') {
      this.showFamilyPlanning = true;
    }
    else if (this.visitCategory == 'Neonatal and Infant Health Care Services') {
      this.showNeonatalVisit = true;
    }
    else if (this.visitCategory == 'Childhood & Adolescent Healthcare Services') {
      this.showChildAndAdolescent = true;
    }

    else if (this.visitCategory == 'NCD care') {
      this.showNCDCare = true;
    } else if (this.visitCategory == 'PNC' || this.visitCategory == 'General OPD') {
      this.showPNC = true;
    }  else if (this.visitCategory == 'COVID-19 Screening') {
      this.showCOVID = true;
    }else {
      this.hideAll = false;
    }
  }

  hideAllTab() {
    this.hideAll = false;
    this.showANCVisit = false;
     this.showPNCVisit = false;
    this.showNCDCare = false;
    this.showPNC = false;
    this.showOPD = false;
    this.showFamilyPlanning = false;
    this.showNeonatalVisit = false;
    this.showChildAndAdolescent = false;
    this.showCOVID = false;
    this.showNcdScreeningVisit = false;
    this.enableDiseaseConfirmationForm = false;
  }

}

