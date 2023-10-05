import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { Observable } from "rxjs";
import { CDSSService } from "../../shared/services/cdss-service";
import { ConfirmationService } from "app/app-modules/core/services";
import { MdDialog } from "@angular/material";
import { DoctorService, MasterdataService } from "../../shared/services";
import { Router } from "@angular/router";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { ViewDiseaseSummaryDetailsComponent } from "../viewDiseaseSummaryDetails/viewDiseaseSummaryDet.component";


@Component({
    selector: 'app-diseaseSummary-form',
    templateUrl: './diseaseSummary.component.html',
    styleUrls: ['./diseaseSummary.component.css']
  })
export class DiseaseFormComponent implements OnInit {
    currentLanguageSet: any;
    chiefComplaints: any = [];
    filteredOptions: Observable<string[]>;
    @Input('diseaseSummaryDb')
    DiseaseSummaryForm: FormGroup;
    // diseaseFormControl: FormControl = new FormControl();
    @Input('mode')
    mode: string;
    result: any;
    psd: string;
    recommendedAction: string;
    diseasesummaryID : any;
    selectedSymptoms: string;
    actions: any = [];
    sctID_psd: string;
    sctID_psd_toSave: any;
    actionId: any;
    sctID_pcc: string;
    sctID_pcc_toSave: any;
    isCdssTrue : boolean = false;
  summaryObj: null;
  summaryDetails: any = [];
  diseaseNames: any = [];
  informationGiven: any;
  diseaseSummaryView : any;
  diseasesNames: any = [];
  disableVisit: boolean = false;
  viewMode: boolean = false;
    constructor(
      private httpServiceService: HttpServiceService,
      private fb: FormBuilder,
      private cdssService: CDSSService,
      private confirmationService: ConfirmationService,
      private dialog: MdDialog,
      private masterdataService: MasterdataService,
      private router: Router,
      private doctorService : DoctorService
      
    ) {
      
  }
  
    ngOnInit() {
      
      this.getChiefComplaintSymptoms();
    //   this.filteredOptions = this.DiseaseSummaryForm.controls.presentChiefComplaint.valueChanges
    // .startWith(null)
    // .map((val) => (val ? this.filter(val) : this.chiefComplaints.slice()));
     this.getDiseaseNames();
        
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
  
    getChiefComplaintSymptoms() {
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
  
   
  
    resetForm(){
      this.DiseaseSummaryForm.reset();
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
  
  ngOnChanges() {
    if (this.mode == 'view') {
      let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID');
      this.disableVisit=true;
      this.getDiseaseSummaryDet(benRegID, visitID);
    }
    if(parseInt(localStorage.getItem("specialistFlag")) == 100)
    {
       let visitID = localStorage.getItem('visitID');
      let benRegID = localStorage.getItem('beneficiaryRegID')
      this.getDiseaseSummaryDet(benRegID, visitID);
    }
  }
  getDiseaseSummaryDet(beneficiaryRegID, visitID) {
    let visitCategory = localStorage.getItem('visitCategory');    
    if(visitCategory == "General OPD (QC)"){
      this.disableVisit=true;
      this.viewMode = true;
      this.doctorService.getVisitComplaintDetails(beneficiaryRegID, visitID)
        .subscribe(value => {
          if (value != null && value != undefined && value.statusCode == 200 && 
              value.data != null && value.data != undefined && 
              value.data.cdss != null && value.data.cdss != undefined )
              this.disableVisit=true;
              this.viewMode = true;
            this.DiseaseSummaryForm.patchValue(value.data.cdss);
            this.DiseaseSummaryForm.controls.diseaseSummaryView.patchValue(value.data.cdss.diseaseSummary);
            // this.cdssForm.patchValue({ presentChiefComplaintView : value.data.Cdss.presentChiefComplaint.presentChiefComplaint});
        });
    }else{
      this.viewMode = true;
      this.doctorService.getVisitComplaintDetails(beneficiaryRegID, visitID)
        .subscribe(value => {
          if (value != null && value != undefined && value.statusCode == 200 && 
            value.data != null && value.data != undefined && value.data.Cdss.diseaseSummary != null && 
            value.data.Cdss.diseaseSummary != undefined)
            this.DiseaseSummaryForm.patchValue(value.data.Cdss.diseaseSummary);
            this.DiseaseSummaryForm.controls.diseaseSummaryView.patchValue(value.data.Cdss.diseaseSummary.diseaseSummary);
            this.disableVisit = true;
        });
    }
   
  }
getDiseaseNames(){
  this.cdssService.getDiseaseName().subscribe(res => {
    if(res.statusCode == 200 && res.data){
      this.summaryDetails = res.data;
      let diseaseName = res.data;
      diseaseName.forEach((names)=>{
        this.diseaseNames.push(names.diseaseName)
      });
      this.filteredOptions = this.DiseaseSummaryForm.valueChanges
      .startWith(null)
      .map((val) =>
        val ? this.filterDiseaseNames(val) : this.diseaseNames.slice()
      );
    } else {
      this.confirmationService.alert(res.errorMessage, 'error');
    }
  });
  (err) => {
    this.confirmationService.alert(err, 'error')
  }

}
filterDiseaseNames(val: string): string[] {
  return this.diseaseNames.filter(
    (option) => option.toLowerCase().indexOf(val.toLowerCase()) === 0
  );
}
  showDiseaseSummary(diseaseData) {
    this.summaryObj = null;
    this.summaryDetails.forEach((filterDiseaseObj) => {
      if (filterDiseaseObj.diseaseName == diseaseData) {
        this.summaryObj = filterDiseaseObj;
      }
    });
    if (diseaseData != undefined && diseaseData != null && diseaseData != "") {
      this.cdssService
        .getDiseaseData(this.summaryObj)
        .subscribe((data) => {
          if (data) {
            let dialogRef = this.dialog.open(
              ViewDiseaseSummaryDetailsComponent,
              {
                height: "500px",
                width: "1000px",
                panelClass: "custom-dialog-content",
                data: {
                  summaryDetails: data,
                },
              }
            );


            dialogRef.afterClosed().subscribe((result) => {
              if (result) {
                this.DiseaseSummaryForm.controls.informationGiven.patchValue(result.data.diseaseName);
                this.DiseaseSummaryForm.controls.recommendedAction.patchValue(result.data.self_care);
                const recommendedActionValue = this.DiseaseSummaryForm.controls.recommendedAction.value;
                const updatedValue = recommendedActionValue.substring(1).replace(/\$/g, ",");
                this.DiseaseSummaryForm.controls.recommendedAction.patchValue(updatedValue);
                this.DiseaseSummaryForm.controls.diseasesummaryID.patchValue(result.data.diseasesummaryID);   
              }
              if (sessionStorage.getItem("diseaseClose") == "False") {
                this.DiseaseSummaryForm.reset();
                // this.DiseaseSummaryForm.controls["diseaseSummary"].setValue(" ");
                // this.DiseaseSummaryForm.controls["informationGiven"].setValue(" ");
                // this.DiseaseSummaryForm.controls["recommendedAction"].setValue(" ");
              }
            });
          }
        });
    } else {
      this.DiseaseSummaryForm.controls.informationGiven.patchValue(null);
      this.DiseaseSummaryForm.controls.recommendedAction.patchValue(null);
    }
  }

  }