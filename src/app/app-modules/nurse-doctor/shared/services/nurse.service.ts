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
import { Http, Response } from "@angular/http";

import { FormGroup, FormArray } from "@angular/forms";
import { SpinnerService } from "../../../core/services/spinner.service";
import { Observable, BehaviorSubject, Subject } from "rxjs/Rx";

import { environment } from "environments/environment";
import { HttpParams } from "@angular/common/http";
import { NcdScreeningService } from "./ncd-screening.service";
import { shareReplay } from "rxjs/operators";

@Injectable()
export class NurseService {
  temp: boolean = false;
  private _listners = new Subject<any>();
  ncdTemp = new BehaviorSubject(this.temp);
  ncdTemp$ = this.ncdTemp.asObservable();
  enableLAssessment = new BehaviorSubject(this.temp);
  enableLAssessment$ = this.enableLAssessment.asObservable();

  rbsSelectedInvestigation: boolean = false;
  rbsSelectedInInvestigation = new BehaviorSubject(
    this.rbsSelectedInvestigation
  );
  rbsSelectedInInvestigation$ = this.rbsSelectedInInvestigation.asObservable();
  rbsTestResultFromDoctorFetch: any;
  rbsCurrentTestResult: any = null;
  rbsTestResultCurrent = new BehaviorSubject(this.rbsCurrentTestResult);
  rbsTestResultCurrent$ = this.rbsTestResultCurrent.asObservable();

  getnurse104referredworklisturls = environment.getnurse104referredworklisturls; 
   
  ismmutc = new BehaviorSubject("no");
  ismmutc$ = this.ismmutc.asObservable();
  mmuVisitData: boolean;

  diabetesResponse: any;
  ncdScreeningidrsDetails: any;
  ncdScreeningVisitDetails: any;
  comorbidityConcurrentCondition: any;
  isAssessmentDone: boolean = false;
  enableProvisionalDiag = new BehaviorSubject(this.temp);
  enableProvisionalDiag$ = this.enableProvisionalDiag.asObservable();

  listen(): Observable<any> {
    return this._listners.asObservable();
  }

  filter(filterBy: string) {
    this._listners.next(filterBy);
  }
  contactfilter(filterBy: string) {
    this._listners.next(filterBy);
  }
  fileData: any; // To store fileIDs
  diseaseFileUpload: boolean = false;

  lmpFetosenseTest: any;

  lmpFetosenseTestValue = new BehaviorSubject(this.lmpFetosenseTest);
  lmpFetosenseTestValue$ = this.lmpFetosenseTestValue.asObservable();


  hrpStatusUpdate: boolean = false;


  hrpStatusUpdateValue = new BehaviorSubject<boolean>(this.hrpStatusUpdate);
  hrpStatusUpdateCheck$ = this.hrpStatusUpdateValue.asObservable();

  constructor(
    private http: Http,
    private spinnerService: SpinnerService,
    private ncdScreeningService: NcdScreeningService
  ) {}

  getNurseWorklist() {
    console.log(
      "getNurseWorklistUrl",
      localStorage.getItem("providerServiceID")
    );
    let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
    let fetchUrl =
      localStorage.getItem("providerServiceID") +
      `/${localStorage.getItem("serviceID")}/${vanID}`;
    return this.http
      .get(environment.nurseWorklist + fetchUrl)
      .map((res: Response) => res.json());
  }

  getNurseTMFutureWorklist() {
    let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
    let fetchUrl =
      localStorage.getItem("providerServiceID") +
      `/${localStorage.getItem("serviceID")}/${vanID}`;
    return this.http
      .get(environment.getNurseTMFutureWorklistUrl + fetchUrl)
      .map((res: Response) => res.json());
  }
  getNurseTMWorklist() {
    let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
    let fetchUrl =
      localStorage.getItem("providerServiceID") +
      `/${localStorage.getItem("serviceID")}/${vanID}`;
    return this.http
      .get(environment.getNurseTMWorklistUrl + fetchUrl)
      .map((res: Response) => res.json());
  }
  getMMUNurseWorklist() {
    let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
    let fetchUrl =
      localStorage.getItem("providerServiceID") +
      `/${localStorage.getItem("serviceID")}/${vanID}`;
    return this.http
      .get(environment.mmuNurseWorklist + fetchUrl)
      .map((res: Response) => res.json());
  }

  getPreviousVisitData(obj: any) {
    return this.http
      .post(environment.previousVisitDataUrl, obj)
      .map((res) => res.json());
  }

  postNurseGeneralQCVisitForm(medicalForm, tcRequest) {
    let temp = {
      beneficiaryRegID: "" + localStorage.getItem("beneficiaryRegID"),
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    };
    let serviceID = localStorage.getItem("serviceID");
    let createdBy = localStorage.getItem("userName");
    let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
    let parkingPlaceID = JSON.parse(
      localStorage.getItem("serviceLineDetails")
    ).parkingPlaceID;
    let visitDetails = Object.assign(
      {},
      medicalForm.controls.patientVisitForm.controls.patientVisitDetailsForm
        .value,
      medicalForm.controls.patientVisitForm.controls
        .patientFileUploadDetailsForm.value,
        medicalForm.controls.patientVisitForm.controls.cdssForm.controls.presentChiefComplaintDb.value,
        medicalForm.controls.patientVisitForm.controls.cdssForm.controls.diseaseSummaryDb.value,

      temp
    );
    let vitalsDetails = Object.assign(
      {},
      medicalForm.controls["patientVitalsForm"].value,
      temp
    );
    let generalQCVisitDetails = Object.assign(
      {},
      { visitDetails: visitDetails },
      { vitalsDetails: vitalsDetails },
      {
        benFlowID: localStorage.getItem("benFlowID"),
        beneficiaryID: localStorage.getItem("beneficiaryID"),
        sessionID: localStorage.getItem("sessionID"),
        parkingPlaceID: parkingPlaceID,
        vanID: vanID,
        serviceID: serviceID,
        createdBy: createdBy,
        tcRequest: tcRequest,
        beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
        providerServiceMapID: localStorage.getItem("providerServiceID"),
      }
    );

    console.log(
      "General Quick Consult",
      JSON.stringify(generalQCVisitDetails, null, 4)
    );

    return this.http
      .post(environment.saveNurseGeneralQuickConsult, generalQCVisitDetails)
      .map((res) => res.json()).pipe(shareReplay(1));
  }

  postNurseANCVisitForm(
    medicalForm,
    benVisitID,
    visitCategory,
    benAge,
    tcRequest
  ) {
    let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
    let parkingPlaceID = JSON.parse(
      localStorage.getItem("serviceLineDetails")
    ).parkingPlaceID;
    let serviceID = localStorage.getItem("serviceID");
    let createdBy = localStorage.getItem("userName");
    let nurseANCVisitDetails = {
      visitDetails: this.postGenericVisitDetailForm(
        medicalForm.controls.patientVisitForm,
        benVisitID,
        visitCategory,
        false
      ),
      ancDetails: this.postANCForm(
        medicalForm.controls.patientANCForm,
        benVisitID
      ),
      vitalDetails: this.postGenericVitalForm(
        medicalForm.controls.patientVitalsForm,
        benVisitID
      ),
      historyDetails: this.postANCHistoryForm(
        medicalForm.controls.patientHistoryForm,
        benVisitID,
        benAge
      ),
      examinationDetails: this.postGenericExaminationForm(
        medicalForm.controls.patientExaminationForm.value,
        benVisitID,
        visitCategory
      ),
      benFlowID: localStorage.getItem("benFlowID"),
      beneficiaryID: localStorage.getItem("beneficiaryID"),
      sessionID: localStorage.getItem("sessionID"),
      parkingPlaceID: parkingPlaceID,
      vanID: vanID,
      serviceID: serviceID,
      createdBy: createdBy,
      tcRequest: tcRequest,
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      providerServiceMapID: localStorage.getItem("providerServiceID"),
    };

    console.log(
      "Nurse ANC Visit Details",
      JSON.stringify(nurseANCVisitDetails, null, 4)
    );

    // return Observable.of({});
    return this.http
      .post(environment.saveNurseANCDetails, nurseANCVisitDetails)
      .map((res) => res.json()).pipe(shareReplay(1));
  }

  //Nurse Save - FP & Contraceptive Services
  postNurseFamilyPlanningVisitForm(
    medicalForm,
    benVisitID,
    visitCategory,
    benAge,
    tcRequest
  ) {
    let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
    let parkingPlaceID = JSON.parse(
      localStorage.getItem("serviceLineDetails")
    ).parkingPlaceID;
    let serviceID = localStorage.getItem("serviceID");
    let createdBy = localStorage.getItem("userName");
    let nurseFamilyPlanningVisitDetails = {
      visitDetails: this.postGenericVisitDetailForm(
        medicalForm.controls.patientVisitForm,
        benVisitID,
        visitCategory,
        false
      ),
      vitalDetails: this.postGenericVitalForm(
        medicalForm.controls.patientVitalsForm,
        benVisitID
      ),
      familyPlanningReproductiveDetails: this.postFpAndReproductiveForm(
        medicalForm.controls.familyPlanningForm.controls[
          "familyPlanningAndReproductiveForm"
        ].value,
        benVisitID
      ),
      iecAndCounsellingDetails: this.postIecDetailsForm(
        medicalForm.controls.familyPlanningForm.controls["IecCounsellingForm"]
          .value,
        benVisitID
      ),
      dispensationDetails: this.postDispensationDetailsForm(
        medicalForm.controls.familyPlanningForm.controls[
          "dispensationDetailsForm"
        ].value,
        benVisitID
      ),
      benFlowID: localStorage.getItem("benFlowID"),
      beneficiaryID: localStorage.getItem("beneficiaryID"),
      sessionID: localStorage.getItem("sessionID"),
      parkingPlaceID: parkingPlaceID,
      vanID: vanID,
      serviceID: serviceID,
      createdBy: createdBy,
      tcRequest: tcRequest,
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      providerServiceMapID: localStorage.getItem("providerServiceID"),
    };

    console.log(
      "Nurse Family Planning Visit Details",
      JSON.stringify(nurseFamilyPlanningVisitDetails, null, 4)
    );

    return this.http
      .post(
        environment.saveNurseFamilyPlanningDetails,
        nurseFamilyPlanningVisitDetails
      )
      .map((res) => res.json()).pipe(shareReplay(1));
  }

  //Nurse Save -  Neonatal and Infant Services Details
  postNurseNeoatalAndInfantVisitForm(
    medicalForm,
    benVisitID,
    visitCategory,
    tcRequest
  ) {
    let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
    let parkingPlaceID = JSON.parse(
      localStorage.getItem("serviceLineDetails")
    ).parkingPlaceID;
    let serviceID = localStorage.getItem("serviceID");
    let createdBy = localStorage.getItem("userName");
    let nurseNeonatalAndInfantDetails = {
      visitDetails: this.postGenericVisitDetailForm(
        medicalForm.controls.patientVisitForm,
        benVisitID,
        visitCategory,
        false
      ),
      vitalDetails: this.postGenericVitalForm(
        medicalForm.controls.patientVitalsForm,
        benVisitID
      ),
      infantBirthDetails: this.postInfantBirthDetailsForm(
        medicalForm.controls.patientBirthImmunizationHistoryForm.controls[
          "infantBirthDetailsForm"
        ].value,
        benVisitID 
      ),
      immunizationHistory: this.postImmunizationHistoryForm(
        medicalForm.controls.patientBirthImmunizationHistoryForm.controls['immunizationHistory'].value,
        benVisitID
      ),
      immunizationServices: this.postImmunizationServiceForm(
        medicalForm.controls.patientImmunizationServicesForm.controls.immunizationServicesForm,
        benVisitID
      ),


      benFlowID: localStorage.getItem("benFlowID"),
      beneficiaryID: localStorage.getItem("beneficiaryID"),
      sessionID: localStorage.getItem("sessionID"),
      parkingPlaceID: parkingPlaceID,
      vanID: vanID,
      serviceID: serviceID,
      createdBy: createdBy,
      tcRequest: tcRequest,
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      providerServiceMapID: localStorage.getItem("providerServiceID"),
    };

    console.log(
      "Nurse Neonatal And Infant Details",
      JSON.stringify(nurseNeonatalAndInfantDetails, null, 4)
    );

    return this.http
      .post(
        environment.saveNurseNeonatalAndInfantDetails,
        nurseNeonatalAndInfantDetails
      )
      .map((res) => res.json()).pipe(shareReplay(1));
  }

  //Nurse Save - Child And Adolesent
  postNurseChildAndAdolescentVisitForm(
    medicalForm,
    benVisitID,
    visitCategory,
    tcRequest
  ) {
    let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
    let parkingPlaceID = JSON.parse(
      localStorage.getItem("serviceLineDetails")
    ).parkingPlaceID;
    let serviceID = localStorage.getItem("serviceID");
    let createdBy = localStorage.getItem("userName");
    let nurseChildAndAdolescentDetails = {
      visitDetails: this.postGenericVisitDetailForm(
        medicalForm.controls.patientVisitForm,
        benVisitID,
        visitCategory,
        false
      ),
      vitalDetails: this.postGenericVitalForm(
        medicalForm.controls.patientVitalsForm,
        benVisitID
      ),
      infantBirthDetails: this.postInfantBirthDetailsForm(
        medicalForm.controls.patientBirthImmunizationHistoryForm.controls[
          "infantBirthDetailsForm"
        ].value,
        benVisitID 
      ),
      immunizationHistory: this.postImmunizationHistoryForm(
        medicalForm.controls.patientBirthImmunizationHistoryForm.controls['immunizationHistory'].value,
        benVisitID
      ),
      immunizationServices: this.postImmunizationServiceForm(
        medicalForm.controls.patientImmunizationServicesForm.controls.immunizationServicesForm,
        benVisitID
      ),
      oralVitaminAProphylaxis: this.postOralVitaminImmunizationServiceForm(
        medicalForm.controls.patientImmunizationServicesForm.controls.oralVitaminAForm,
        benVisitID
      ),


      benFlowID: localStorage.getItem("benFlowID"),
      beneficiaryID: localStorage.getItem("beneficiaryID"),
      sessionID: localStorage.getItem("sessionID"),
      parkingPlaceID: parkingPlaceID,
      vanID: vanID,
      serviceID: serviceID,
      createdBy: createdBy,
      tcRequest: tcRequest,
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      providerServiceMapID: localStorage.getItem("providerServiceID"),
    };

    console.log(
      "Nurse child And Health Details",
      JSON.stringify(nurseChildAndAdolescentDetails, null, 4)
    );

    return this.http
      .post(
        environment.saveNurseChildAndAdloescentDetails,
        nurseChildAndAdolescentDetails
      )
      .map((res) => res.json()).pipe(shareReplay(1));
  }

  postOralVitaminImmunizationServiceForm(oralVitaminAForm, benVisitID) {
    let oralVitaminADetails = Object.assign({}, oralVitaminAForm.value, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    return oralVitaminADetails;
    
  }

  /**
   * Neonatal and Infant Health Care Services
   */
  postInfantBirthDetailsForm(infantBirthDetailsForm, benVisitID) {
    let infantBirthDetails = Object.assign({}, infantBirthDetailsForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    return infantBirthDetails;
  }

  postImmunizationHistoryForm(immunizationHistoryDetailsForm, benVisitID) {
    let immunizationHistoryDetails = Object.assign(
      {},
      immunizationHistoryDetailsForm,
      {
        vanID: JSON.parse(localStorage.getItem("serviceLineDetails")).vanID,
        parkingPlaceID: JSON.parse(localStorage.getItem("serviceLineDetails"))
          .parkingPlaceID,
        beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
        benVisitID: benVisitID,
        providerServiceMapID: localStorage.getItem("providerServiceID"),
        createdBy: localStorage.getItem("userName"),
      }
    );
    return immunizationHistoryDetails;
  }

  postImmunizationServiceForm(immunizationServiceForm, benVisitID) {
    let immunizationServicesDetails = Object.assign(
      {},
      immunizationServiceForm.value,
      {
        beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
        benVisitID: benVisitID,
        providerServiceMapID: localStorage.getItem("providerServiceID"),
        createdBy: localStorage.getItem("userName"),
      }
    );
    return immunizationServicesDetails;
  }

  /**
   * Family planning Details Form -KA40094929, AN40085822
   */

  postFpAndReproductiveForm(familyPlanningForm, benVisitID) {
    let fpAndReproductiveForm = Object.assign({}, familyPlanningForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    return fpAndReproductiveForm;
  }

  postIecDetailsForm(familyPlanningForm, benVisitID) {
    let iecAndCousellingForm = Object.assign({}, familyPlanningForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    return iecAndCousellingForm;
  }

  postDispensationDetailsForm(familyPlanningForm, benVisitID) {
    let dispensationDetailsForm = Object.assign({}, familyPlanningForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    return dispensationDetailsForm;
  }

  /**
   * Visit Details Form for All Components after Visit ID is Generated
   */
  postGenericVisitDetailForm(
    patientVisitForm,
    benVisitID,
    visitCategory,
    showIDRS
  ) {
    if (visitCategory == "ANC") {
      return {
        visitDetails: this.postPatientVisitDetails(
          patientVisitForm.controls.patientVisitDetailsForm.value,
          patientVisitForm.controls.patientFileUploadDetailsForm.value
        ),
        chiefComplaints: this.postCheifComplaintForm(
          patientVisitForm.controls.patientChiefComplaintsForm.value.complaints,
          benVisitID
        ),
        adherence: this.postAdherenceForm(
          patientVisitForm.controls.patientAdherenceForm.value,
          benVisitID
        ),
        cdss: this.postCdssForm(
          patientVisitForm.controls.cdssForm.value,
          benVisitID
          
        ),
        investigation: this.postInvestigationForm(
          patientVisitForm.controls.patientInvestigationsForm.value,
          benVisitID
        ),
      };
    }
    if (visitCategory == "General OPD") {
      console.log(patientVisitForm.controls.cdssForm , "cdssForm");
      return {
        visitDetails: this.postPatientVisitDetails(
          patientVisitForm.controls.patientVisitDetailsForm.value,
          patientVisitForm.controls.patientFileUploadDetailsForm.value
        ),
        chiefComplaints: this.postCheifComplaintForm(
          patientVisitForm.controls.patientChiefComplaintsForm.value.complaints,
          benVisitID
        ),
        adherence: this.postAdherenceForm(
          patientVisitForm.controls.patientAdherenceForm.value,
          benVisitID
        ),
        cdss: this.postCdssForm(
          patientVisitForm.controls.cdssForm.value,
          benVisitID
          
        ),
      };
    }
    if (visitCategory == "PNC") {
      return {
        visitDetails: this.postPatientVisitDetails(
          patientVisitForm.controls.patientVisitDetailsForm.value,
          patientVisitForm.controls.patientFileUploadDetailsForm.value
        ),
        chiefComplaints: this.postCheifComplaintForm(
          patientVisitForm.controls.patientChiefComplaintsForm.value.complaints,
          benVisitID
        ),
        adherence: this.postAdherenceForm(
          patientVisitForm.controls.patientAdherenceForm.value,
          benVisitID
        ),
        cdss: this.postCdssForm(
          patientVisitForm.controls.cdssForm.value,
          benVisitID
          
        ),
      };
    }
    if (visitCategory == "FP & Contraceptive Services") {
      return {
        visitDetails: this.postPatientVisitDetails(
          patientVisitForm.controls.patientVisitDetailsForm.value,
          patientVisitForm.controls.patientFileUploadDetailsForm.value
        ),
        chiefComplaints: this.postCheifComplaintForm(
          patientVisitForm.controls.patientChiefComplaintsForm.value.complaints,
          benVisitID
        ),
        adherence: this.postAdherenceForm(
          patientVisitForm.controls.patientAdherenceForm.value,
          benVisitID
        ),
        cdss: this.postCdssForm(
          patientVisitForm.controls.cdssForm.value,
          benVisitID
          
        ),
      };
    }
    if (visitCategory.toLowerCase() == "neonatal and infant health care services") {
      return {
        visitDetails: this.postPatientVisitDetails(
          patientVisitForm.controls.patientVisitDetailsForm.value,
          patientVisitForm.controls.patientFileUploadDetailsForm.value
        ),
        chiefComplaints: this.postCheifComplaintForm(
          patientVisitForm.controls.patientChiefComplaintsForm.value.complaints,
          benVisitID
        ),
        cdss: this.postCdssForm(
          patientVisitForm.controls.cdssForm.value,
          benVisitID
          
        ),
      };
    }

    if (visitCategory.toLowerCase() == "childhood & adolescent healthcare services") {
      return {
        visitDetails: this.postPatientVisitDetails(
          patientVisitForm.controls.patientVisitDetailsForm.value,
          patientVisitForm.controls.patientFileUploadDetailsForm.value
        ),
        chiefComplaints: this.postCheifComplaintForm(
          patientVisitForm.controls.patientChiefComplaintsForm.value.complaints,
          benVisitID
        ),
        cdss: this.postCdssForm(
          patientVisitForm.controls.cdssForm.value,
          benVisitID
          
        ),
      };
    }
    if (visitCategory == "NCD care") {
      return {
        visitDetails: this.postPatientVisitDetails(
          patientVisitForm.controls.patientVisitDetailsForm.value,
          patientVisitForm.controls.patientFileUploadDetailsForm.value
        ),
        adherence: this.postAdherenceForm(
          patientVisitForm.controls.patientAdherenceForm.value,
          benVisitID
        ),
        investigation: this.postInvestigationForm(
          patientVisitForm.controls.patientInvestigationsForm.value,
          benVisitID
        ),
        cdss: this.postCdssForm(
          patientVisitForm.controls.cdssForm.value,
          benVisitID

        ),
      };
    }
    if (visitCategory == "COVID-19 Screening") {
      return {
        visitDetails: this.postPatientVisitDetails(
          patientVisitForm.controls.patientVisitDetailsForm.value,
          patientVisitForm.controls.patientFileUploadDetailsForm.value
        ),
        covidDetails: this.postCovidForm(
          patientVisitForm.controls.patientCovidForm.value,
          benVisitID
        ),
        cdss: this.postCdssForm(
          patientVisitForm.controls.cdssForm.value,
          benVisitID

        ),
      };
    }
    if (visitCategory == "NCD screening") {
      if (showIDRS === true) {
        return {
          visitDetails: this.postPatientVisitDetails(
            patientVisitForm.controls.patientVisitDetailsForm.value,
            patientVisitForm.controls.patientFileUploadDetailsForm.value
          ),
          chiefComplaints: this.postCheifComplaintForm(
            patientVisitForm.controls.patientChiefComplaintsForm.value
              .complaints,
            benVisitID
          ),
          cdss: this.postCdssForm(
            patientVisitForm.controls.cdssForm.value,
            benVisitID

          ),
        };
      } else {
        return {
          visitDetails: this.postPatientVisitDetails(
            patientVisitForm.controls.patientVisitDetailsForm.value,
            patientVisitForm.controls.patientFileUploadDetailsForm.value
          ),
          cdss: this.postCdssForm(
            patientVisitForm.controls.cdssForm.value,
            benVisitID

          ),
        };
      }
    }
  }

  postPatientVisitDetails(visitForm, files) {
    let patientVisitDetails = Object.assign({}, visitForm, files, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    // console.log('visit details', JSON.stringify(patientVisitDetails, null, 4));
    return patientVisitDetails;
  }

  postCheifComplaintForm(patientChiefComplaintsForm, benVisitID) {
    let patientChiefComplaintsFormValue = JSON.parse(
      JSON.stringify(patientChiefComplaintsForm)
    );
    for (let complaint of patientChiefComplaintsFormValue) {
      if (complaint.chiefComplaint != null) {
        complaint.chiefComplaintID = complaint.chiefComplaint.chiefComplaintID;
        complaint.chiefComplaint = complaint.chiefComplaint.chiefComplaint;
      }
      complaint.beneficiaryRegID = localStorage.getItem("beneficiaryRegID");
      complaint.benVisitID = benVisitID;
      complaint.providerServiceMapID =
        localStorage.getItem("providerServiceID");
      complaint.createdBy = localStorage.getItem("userName");
    }
    // console.log('chiefComplaintsForm', JSON.stringify(patientChiefComplaintsForm, null, 4));
    return patientChiefComplaintsFormValue;
  }

  postAdherenceForm(patientAdherenceForm, benVisitID) {
    let adherenceForm = Object.assign({}, patientAdherenceForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    // console.log('adherenceForm', JSON.stringify(adherenceForm, null, 4));
    return adherenceForm;
  }
 
  postCdssForm(cdssForm, benVisitID){
    let nurseCdssForm = Object.assign({}, cdssForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
  
    return nurseCdssForm;
  }
  postInvestigationForm(patientInvestigationsForm, benVisitID) {
    let investigationsForm = Object.assign({}, patientInvestigationsForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    // console.log('investigationsForm', JSON.stringify(investigationsForm, null, 4));
    return investigationsForm;
  }

  postCovidForm(patientCovidForm, benVisitID) {
    let covidForm = Object.assign({}, patientCovidForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    // console.log('adherenceForm', JSON.stringify(adherenceForm, null, 4));
    return covidForm;
  }

  postANCForm(patientANCForm, benVisitID) {
    return {
      ancObstetricDetails: this.postANCDetailForm(patientANCForm, benVisitID),
      ancImmunization: this.postANCImmunizationForm(
        patientANCForm.controls.patientANCImmunizationForm.value,
        benVisitID
      ),
    };
  }

  postANCDetailForm(patientANCForm, benVisitID) {
    let detailedANC = JSON.parse(
      JSON.stringify(patientANCForm.controls.patientANCDetailsForm.value)
    );
    let obstetricFormula = JSON.parse(
      JSON.stringify(patientANCForm.controls.obstetricFormulaForm.value)
    );

    let combinedANCForm = Object.assign({}, detailedANC, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
      gravida_G: obstetricFormula.gravida_G,
      // termDeliveries_T: obstetricFormula.termDeliveries_T,
      // pretermDeliveries_P: obstetricFormula.pretermDeliveries_P,
      para: obstetricFormula.para,
      abortions_A: obstetricFormula.abortions_A,
      stillBirth: obstetricFormula.stillBirth,
      livebirths_L: obstetricFormula.livebirths_L,
      bloodGroup: obstetricFormula.bloodGroup,
    });
    // console.log('combinedANCForm', JSON.stringify(combinedANCForm, null, 4));
    return combinedANCForm;
  }

  postANCImmunizationForm(patientANCImmunizationForm, benVisitID) {
    let immunizationForm = Object.assign({}, patientANCImmunizationForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    // console.log('immunizationForm', JSON.stringify(immunizationForm, null, 4));
    return immunizationForm;
  }

  postGenericVitalForm(patientVitalForm, benVisitID) {
    let patientVitalsDetails = Object.assign({}, patientVitalForm.value, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    // console.log('General Vitals Form', JSON.stringify(patientVitalsDetails, null, 4));
    return patientVitalsDetails;
  }

  /**
   * Examination Form for Examination Step of Non-Cancer (Generic)
   */
  postGenericExaminationForm(
    patientExaminationForm,
    benVisitID,
    visitCategory
  ) {
    if (visitCategory == "ANC") {
      return {
        generalExamination: this.postGeneralExaminationForm(
          patientExaminationForm.generalExaminationForm,
          benVisitID
        ),
        headToToeExamination: this.postHeadToToeExaminationForm(
          patientExaminationForm.headToToeExaminationForm,
          benVisitID
        ),
        cardioVascularExamination: this.postCardioVascularSystemForm(
          patientExaminationForm.systemicExaminationForm
            .cardioVascularSystemForm,
          benVisitID
        ),
        respiratorySystemExamination: this.postRespiratorySystemForm(
          patientExaminationForm.systemicExaminationForm.respiratorySystemForm,
          benVisitID
        ),
        centralNervousSystemExamination: this.postCentralNervousSystemForm(
          patientExaminationForm.systemicExaminationForm
            .centralNervousSystemForm,
          benVisitID
        ),
        musculoskeletalSystemExamination: this.postMusculoSkeletalSystemForm(
          patientExaminationForm.systemicExaminationForm
            .musculoSkeletalSystemForm,
          benVisitID
        ),
        genitoUrinarySystemExamination: this.postGenitoUrinarySystemForm(
          patientExaminationForm.systemicExaminationForm
            .genitoUrinarySystemForm,
          benVisitID
        ),
        obstetricExamination: this.postANCObstetricExamination(
          patientExaminationForm.systemicExaminationForm
            .obstetricExaminationForANCForm,
          benVisitID
        ),
      };
    }

    if (visitCategory == "General OPD") {
      return {
        generalExamination: this.postGeneralExaminationForm(
          patientExaminationForm.generalExaminationForm,
          benVisitID
        ),
        headToToeExamination: this.postHeadToToeExaminationForm(
          patientExaminationForm.headToToeExaminationForm,
          benVisitID
        ),
        // oralDetails: this.postOralExaminationForm(
        //   patientExaminationForm.oralExaminationForm,
        //   benVisitID
        // ),
        gastroIntestinalExamination: this.postGastroIntestinalSystemForm(
          patientExaminationForm.systemicExaminationForm
            .gastroIntestinalSystemForm,
          benVisitID
        ),
        cardioVascularExamination: this.postCardioVascularSystemForm(
          patientExaminationForm.systemicExaminationForm
            .cardioVascularSystemForm,
          benVisitID
        ),
        respiratorySystemExamination: this.postRespiratorySystemForm(
          patientExaminationForm.systemicExaminationForm.respiratorySystemForm,
          benVisitID
        ),
        centralNervousSystemExamination: this.postCentralNervousSystemForm(
          patientExaminationForm.systemicExaminationForm
            .centralNervousSystemForm,
          benVisitID
        ),
        musculoskeletalSystemExamination: this.postMusculoSkeletalSystemForm(
          patientExaminationForm.systemicExaminationForm
            .musculoSkeletalSystemForm,
          benVisitID
        ),
        genitoUrinarySystemExamination: this.postGenitoUrinarySystemForm(
          patientExaminationForm.systemicExaminationForm
            .genitoUrinarySystemForm,
          benVisitID
        ),
      };
    }

    if (visitCategory == "PNC") {
      return {
        generalExamination: this.postGeneralExaminationForm(
          patientExaminationForm.generalExaminationForm,
          benVisitID
        ),
        headToToeExamination: this.postHeadToToeExaminationForm(
          patientExaminationForm.headToToeExaminationForm,
          benVisitID
        ),
        gastroIntestinalExamination: this.postGastroIntestinalSystemForm(
          patientExaminationForm.systemicExaminationForm
            .gastroIntestinalSystemForm,
          benVisitID
        ),
        cardioVascularExamination: this.postCardioVascularSystemForm(
          patientExaminationForm.systemicExaminationForm
            .cardioVascularSystemForm,
          benVisitID
        ),
        respiratorySystemExamination: this.postRespiratorySystemForm(
          patientExaminationForm.systemicExaminationForm.respiratorySystemForm,
          benVisitID
        ),
        centralNervousSystemExamination: this.postCentralNervousSystemForm(
          patientExaminationForm.systemicExaminationForm
            .centralNervousSystemForm,
          benVisitID
        ),
        musculoskeletalSystemExamination: this.postMusculoSkeletalSystemForm(
          patientExaminationForm.systemicExaminationForm
            .musculoSkeletalSystemForm,
          benVisitID
        ),
        genitoUrinarySystemExamination: this.postGenitoUrinarySystemForm(
          patientExaminationForm.systemicExaminationForm
            .genitoUrinarySystemForm,
          benVisitID
        ),
      };
    }
  }

  /**
   * General Examination Form ** Part of Examination Form for Non-Cancer (Generic)
   *
   */
  postGeneralExaminationForm(examinationForm, benVisitID) {
    let generalExaminationForm = Object.assign({}, examinationForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    // console.log('General examination', JSON.stringify(generalExaminationForm, null, 4));
    return generalExaminationForm;
  }

  /**
   * Head to Toe Examination Form ** Part of Examination Form for Non-Cancer (Generic)
   *
   */
  postHeadToToeExaminationForm(examinationForm, benVisitID) {
    let headToToeExaminationForm = Object.assign({}, examinationForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    // console.log('General Head to Toe examination', JSON.stringify(headToToeExaminationForm, null, 4));
    return headToToeExaminationForm;
  }

  /**
   * Oral Examination Form ** Part of Examination Form for Non-Cancer (Generic)
   *
   */
  postOralExaminationForm(examinationForm, benVisitID) {
    if (examinationForm) {
      if (examinationForm.preMalignantLesionTypeList != null) {
        let index =
          examinationForm.preMalignantLesionTypeList.indexOf(
            "Any other lesion"
          );
        if (
          index > -1 &&
          index == examinationForm.preMalignantLesionTypeList.length - 1
        ) {
          examinationForm.preMalignantLesionTypeList.pop();
          examinationForm.preMalignantLesionTypeList.push(
            examinationForm.otherLesionType
          );
        }
      }

      examinationForm = Object.assign({}, examinationForm, {
        otherLesionType: undefined,
        beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
        providerServiceMapID: localStorage.getItem("providerServiceID"),
        createdBy: localStorage.getItem("userName"),
      });
    }
    // console.log('General Head to Toe examination', JSON.stringify(oralExaminationForm, null, 4));
    return examinationForm;
  }

  /**
   * Systemic Examination Form ** Part of Examination Form for Non-Cancer (Generic)
   */

  /**
   * Gastro Intestinal System Form
   * !! Part of Systemic Examination Form ** Part of Examination Form for Non-Cancer (Generic) !!
   */
  postGastroIntestinalSystemForm(systemForm, benVisitID) {
    let gastroIntestinalSystemForm = Object.assign({}, systemForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    // console.log('General Gastro Intestinal System', JSON.stringify(gastroIntestinalSystemForm, null, 4));
    return gastroIntestinalSystemForm;
  }

  /**
   * Cardio Vascular System Form
   * !! Part of Systemic Examination Form ** Part of Examination Form for Non-Cancer (Generic) !!
   *
   */
  postCardioVascularSystemForm(systemForm, benVisitID) {
    let cardioVascularSystemForm = Object.assign({}, systemForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    // console.log('General Cardio Vascular System', JSON.stringify(cardioVascularSystemForm, null, 4));
    return cardioVascularSystemForm;
  }

  /**
   * Respiratory System Form
   * !! Part of Systemic Examination Form ** Part of Examination Form for Non-Cancer (Generic) !!
   *
   */
  postRespiratorySystemForm(systemForm, benVisitID) {
    let respiratorySystemForm = Object.assign({}, systemForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    // console.log('General Respiratory System Form', JSON.stringify(respiratorySystemForm, null, 4));
    return respiratorySystemForm;
  }

  /**
   * Central Nervous System Form
   * !! Part of Systemic Examination Form ** Part of Examination Form for Non-CGeneraler (Generic) !!
   *
   */
  postCentralNervousSystemForm(systemForm, benVisitID) {
    let centralNervousSystemForm = Object.assign({}, systemForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    // console.log('General Central Nervous System', JSON.stringify(centralNervousSystemForm, null, 4));
    return centralNervousSystemForm;
  }

  /**
   * Musculo Skeletal System Form
   * !! Part of Systemic Examination Form ** Part of Examination Form for Non-CGeneraler (Generic) !!
   *
   */
  postMusculoSkeletalSystemForm(systemForm, benVisitID) {
    let musculoSkeletalSystemForm = Object.assign({}, systemForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    // console.log('General Musculo Skeletal System', JSON.stringify(musculoSkeletalSystemForm, null, 4));
    return musculoSkeletalSystemForm;
  }

  /**
   * Genito Urinary System Form
   * !! Part of Systemic Examination Form ** Part of Examination Form for Non-CGeneraler (Generic) !!
   *
   */
  postGenitoUrinarySystemForm(systemForm, benVisitID) {
    let genitoUrinarySystemForm = Object.assign({}, systemForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    // console.log('General Genito Urinary System', JSON.stringify(genitoUrinarySystemForm, null, 4));
    return genitoUrinarySystemForm;
  }

  /**
   * Obstetric Examination Form -- only for ANC Visit
   * !! Part of Systemic Examination Form ** Part of Examination Form for Non-Cancer (Generic) !!
   *
   */
  postANCObstetricExamination(systemForm, benVisitID) {
    let obstetricExaminationForANCForm = Object.assign({}, systemForm, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });
    // console.log('ANC Obstetric Examination', JSON.stringify(obstetricExaminationForANCForm, null, 4));
    return obstetricExaminationForANCForm;
  }

  /**
   * ANC History
   */
  postANCHistoryForm(generalHistoryForm, benVisitID, benAge) {
    let temp = {
      beneficiaryRegID: "" + localStorage.getItem("beneficiaryRegID"),
      benVisitID: null,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    };

    if (benAge <= 16) {
      return {
        pastHistory: this.postGeneralPastHistory(
          generalHistoryForm.controls.pastHistory,
          temp
        ),
        comorbidConditions: this.postGeneralComorbidityHistory(
          generalHistoryForm.controls.comorbidityHistory,
          temp
        ),
        medicationHistory: this.postGeneralMedicationHistroy(
          generalHistoryForm.controls.medicationHistory,
          temp
        ),
        femaleObstetricHistory: this.postGeneralPastObstetricHistory(
          generalHistoryForm.controls.pastObstericHistory,
          temp
        ),
        menstrualHistory: this.postGeneralMenstrualHistory(
          generalHistoryForm.controls.menstrualHistory,
          temp
        ),
        familyHistory: this.postGeneralFamilyHistory(
          generalHistoryForm.controls.familyHistory,
          temp
        ),
        personalHistory: this.postGeneralPersonalHistory(
          generalHistoryForm.controls.personalHistory,
          temp
        ),
        childVaccineDetails: this.postGeneralOtherVaccines(
          generalHistoryForm.controls.otherVaccines,
          temp
        ),
        immunizationHistory: this.postGeneralImmunizationHistroy(
          generalHistoryForm.controls.immunizationHistory,
          temp
        ),
      };
    } else {
      return {
        pastHistory: this.postGeneralPastHistory(
          generalHistoryForm.controls.pastHistory,
          temp
        ),
        comorbidConditions: this.postGeneralComorbidityHistory(
          generalHistoryForm.controls.comorbidityHistory,
          temp
        ),
        medicationHistory: this.postGeneralMedicationHistroy(
          generalHistoryForm.controls.medicationHistory,
          temp
        ),
        femaleObstetricHistory: this.postGeneralPastObstetricHistory(
          generalHistoryForm.controls.pastObstericHistory,
          temp
        ),
        menstrualHistory: this.postGeneralMenstrualHistory(
          generalHistoryForm.controls.menstrualHistory,
          temp
        ),
        familyHistory: this.postGeneralFamilyHistory(
          generalHistoryForm.controls.familyHistory,
          temp
        ),
        personalHistory: this.postGeneralPersonalHistory(
          generalHistoryForm.controls.personalHistory,
          temp
        ),
      };
    }
  }

  postGeneralPastHistory(pastHistoryForm, otherDetails) {
    let pastHistoryFormValue = JSON.parse(
      JSON.stringify(pastHistoryForm.value)
    );
    let illness = pastHistoryFormValue.pastIllness.slice();
    illness.map((item) => {
      let temp = item.illnessType;
      if (temp) {
        item.illnessType = temp.illnessType;
        item.illnessTypeID = "" + temp.illnessID;
      }
    });

    let surgery = pastHistoryFormValue.pastSurgery.slice();
    surgery.map((item) => {
      let temp = item.surgeryType;
      if (temp) {
        item.surgeryType = temp.surgeryType;
        item.surgeryID = "" + temp.surgeryID;
      }
    });

    let historyData = Object.assign({}, pastHistoryFormValue, otherDetails, {
      pastIllness: illness,
      pastSurgery: surgery,
    });
    // console.log("History Data", JSON.stringify(historyData, null, 4));
    return historyData;
  }

  postGeneralComorbidityHistory(comorbidityHistoryForm, otherDetails) {
    let comorbidityHistoryFormValue = JSON.parse(
      JSON.stringify(comorbidityHistoryForm.value)
    );
    let comorbidityConcurrentConditions =
      comorbidityHistoryFormValue.comorbidityConcurrentConditionsList;
    comorbidityConcurrentConditions.map((item) => {
      let temp = item.comorbidConditions;
      if (temp) {
        item.comorbidConditions = undefined;
        item.comorbidCondition = temp.comorbidCondition;
        item.comorbidConditionID = "" + temp.comorbidConditionID;
        // item.isForHistory = !temp.isForHistory;
        if (
          item.isForHistory !== undefined &&
          item.isForHistory !== null &&
          item.isForHistory === true
        ) {
          item.isForHistory = false;
        } else {
          item.isForHistory = true;
        }
      }
    });
    let comorbidityData = Object.assign(
      {},
      comorbidityHistoryFormValue,
      otherDetails
    );

    // console.log("Comorbidity Data", JSON.stringify(comorbidityData, null, 4));
    return comorbidityData;
  }

  postGeneralDevelopmentHistory(developmentHistoryForm, otherDetails) {
    let developmentHistoryFormValue = JSON.parse(
      JSON.stringify(developmentHistoryForm.value)
    );
    let developmentData = Object.assign(
      {},
      developmentHistoryFormValue,
      otherDetails
    );

    // console.log("Development Data", JSON.stringify(developmentData, null, 4));
    return developmentData;
  }

  postGeneralFamilyHistory(familyHistoryForm, otherDetails) {
    let familyHistoryFormValue = JSON.parse(
      JSON.stringify(familyHistoryForm.value)
    );
    let familyDiseaseList = familyHistoryFormValue.familyDiseaseList;
    familyDiseaseList.map((item) => {
      if (item.diseaseType) {
        item.diseaseTypeID = "" + item.diseaseType.diseaseTypeID;
        item.diseaseType = item.diseaseType.diseaseType;
        // item.snomedCode = item.diseaseType.snomedCode;
        // item.snomedTerm = item.diseaseType.snomedTerm;
      }
    });
    let familyHistoryData = Object.assign(
      {},
      familyHistoryFormValue,
      otherDetails
    );

    // console.log("Family History Data", JSON.stringify(familyHistoryData, null, 4));
    return familyHistoryData;
  }

  postGeneralFeedingHistory(feedingHistoryForm, otherDetails) {
    let feedingHistoryFormValue = JSON.parse(
      JSON.stringify(feedingHistoryForm.value)
    );
    let feedingHistoryData = Object.assign(
      {},
      feedingHistoryFormValue,
      otherDetails,
      {
        foodIntoleranceStatus: +feedingHistoryFormValue.foodIntoleranceStatus,
      }
    );

    // console.log("Feeding Data", JSON.stringify(feedingHistoryData, null, 4));
    return feedingHistoryData;
  }

  postGeneralImmunizationHistroy(immunizationHistoryForm, otherDetails) {
    let immunizationFormValue = JSON.parse(
      JSON.stringify(immunizationHistoryForm.value)
    );
    let immunizationList = immunizationFormValue.immunizationList;
    // console.log(formData, 'formdata');
    // formData.forEach((item)=>{
    //   item.vaccines.forEach((vaccine)=>{
    //     vaccine.status = ""+vaccine.status
    //   })
    // })
    let immunizationHistoryData = Object.assign(
      {},
      immunizationFormValue,
      { immunizationList: immunizationList },
      otherDetails
    );
    // console.log('immunization Data', JSON.stringify(immunizationHistoryData, null, 4));
    return immunizationHistoryData;
  }

  postGeneralMedicationHistroy(medicationHistoryForm, otherDetails) {
    let medicationHistoryFormValue = JSON.parse(
      JSON.stringify(medicationHistoryForm.value)
    );
    let medicationHistoryData = Object.assign(
      {},
      medicationHistoryFormValue,
      otherDetails
    );
    // console.log("Medication Data", JSON.stringify(medicationHistoryData, null, 4));
    return medicationHistoryData;
  }

  postGeneralMenstrualHistory(menstrualHistoryForm, otherDetails) {
    let menstrualHistoryFormValue = JSON.parse(
      JSON.stringify(menstrualHistoryForm.value)
    );
    let temp = menstrualHistoryFormValue;
    if (temp.menstrualCycleStatus) {
      temp.menstrualCycleStatusID =
        "" + temp.menstrualCycleStatus.menstrualCycleStatusID;
      temp.menstrualCycleStatus = temp.menstrualCycleStatus.name;
    }

    if (temp.cycleLength) {
      temp.menstrualCyclelengthID = "" + temp.cycleLength.menstrualRangeID;
      temp.cycleLength = temp.cycleLength.menstrualCycleRange;
    }

    if (temp.bloodFlowDuration) {
      temp.menstrualFlowDurationID =
        "" + temp.bloodFlowDuration.menstrualRangeID;
      temp.bloodFlowDuration = temp.bloodFlowDuration.menstrualCycleRange;
    }

    // if (temp.problemName) {
    //   temp.menstrualProblemID = "" + temp.problemName.menstrualProblemID;
    //   temp.problemName = temp.problemName.name;
    // }

    if (!temp.lMPDate) {
      temp.lMPDate = undefined;
    }

    let menstrualHistoryData = Object.assign({}, temp, otherDetails);

    // console.log("Menstrual History Data", JSON.stringify(menstrualHistoryData, null, 4));
    return menstrualHistoryData;
  }

  postGeneralOtherVaccines(otherVaccinesForm, otherDetails) {
    let otherVaccinesFormValue = JSON.parse(
      JSON.stringify(otherVaccinesForm.value)
    );
    let otherVaccines = otherVaccinesFormValue.otherVaccines;
    otherVaccines.map((vaccine) => {
      if (vaccine.vaccineName) {
        vaccine.vaccineID = vaccine.vaccineName.vaccineID;
        vaccine.vaccineName = vaccine.vaccineName.vaccineName;
      }
    });
    let otherVaccinesData = Object.assign(
      {},
      otherVaccinesFormValue,
      { otherVaccines: undefined, childOptionalVaccineList: otherVaccines },
      otherDetails
    );
    // console.log("Other vaccines Data", JSON.stringify(otherVaccinesData, null, 4));
    return otherVaccinesData;
  }

  postGeneralPastObstetricHistory(pastObstetricHistoryForm, otherDetails) {
    let pastObstetricHistoryFormValue = JSON.parse(
      JSON.stringify(pastObstetricHistoryForm.value)
    );
    let pastObstetricList =
      pastObstetricHistoryFormValue.pastObstericHistoryList;
    pastObstetricList.map((item) => {
      // if (item.pregComplicationList) {
      //   item.pregComplicationList.map(complication => {
      //     complication.pregComplicationID = complication.complicationID;
      //     complication.pregComplicationType = complication.complicationType;
      //   })
      // }
      if (item.durationType) {
        item.pregDurationID = item.durationType.pregDurationID;
        item.durationType = item.durationType.durationType;
      }
      if (item.deliveryType) {
        item.deliveryTypeID = item.deliveryType.deliveryTypeID;
        item.deliveryType = item.deliveryType.deliveryType;
      }
      if (item.deliveryPlace) {
        item.deliveryPlaceID = item.deliveryPlace.deliveryPlaceID;
        item.deliveryPlace = item.deliveryPlace.deliveryPlace;
      }
      // if (item.deliveryComplicationType) {
      //   item.deliveryComplicationID = item.deliveryComplicationType.complicationID;
      //   item.deliveryComplicationType = item.deliveryComplicationType.complicationValue;
      // }
      // if (item.postpartumComplicationType) {
      //   item.postpartumComplicationID = item.postpartumComplicationType.complicationID;
      //   item.postpartumComplicationType = item.postpartumComplicationType.complicationValue;
      // }
      if (item.pregOutcome) {
        item.pregOutcomeID = item.pregOutcome.pregOutcomeID;
        item.pregOutcome = item.pregOutcome.pregOutcome;
      }
      // if (item.postNatalComplication) {
      //   item.postNatalComplicationID = item.postNatalComplication.complicationID;
      //   item.postNatalComplication = item.postNatalComplication.complicationValue;
      // }
      if (item.newBornComplication) {
        item.newBornComplicationID = item.newBornComplication.complicationID;
        item.newBornComplication = item.newBornComplication.complicationValue;
      }
    });
    let pastObstetricHistoryData = Object.assign(
      {},
      pastObstetricHistoryFormValue,
      otherDetails,
      {
        femaleObstetricHistoryList:
          pastObstetricHistoryFormValue.pastObstericHistoryList,
        pastObstericHistoryList: undefined,
      }
    );

    // console.log("Past Obstetric History Data", JSON.stringify(pastObstetricHistoryData, null, 4));
    return pastObstetricHistoryData;
  }

  postGeneralPerinatalHistory(perinatalHistroyForm, otherDetails) {
    let temp = JSON.parse(JSON.stringify(perinatalHistroyForm.value));
    if (temp.placeOfDelivery) {
      temp.deliveryPlaceID = temp.placeOfDelivery.deliveryPlaceID;
      temp.placeOfDelivery = temp.placeOfDelivery.deliveryPlace;
    }

    if (temp.typeOfDelivery) {
      temp.deliveryTypeID = temp.typeOfDelivery.deliveryTypeID;
      temp.typeOfDelivery = temp.typeOfDelivery.deliveryType;
    }

    if (temp.complicationAtBirth) {
      temp.complicationAtBirthID = temp.complicationAtBirth.complicationID;
      temp.complicationAtBirth = temp.complicationAtBirth.complicationValue;
    }
    let perinatalHistoryData = Object.assign({}, temp, otherDetails);
    console.log(
      "Perinatal History Data",
      JSON.stringify(perinatalHistoryData, null, 4)
    );

    return perinatalHistoryData;
  }

  postGeneralPersonalHistory(personalHistoryForm, otherDetails) {
    let personalHistoryFormValue = JSON.parse(
      JSON.stringify(personalHistoryForm.value)
    );
    let tobaccoList = personalHistoryFormValue.tobaccoList;
    if (tobaccoList) {
      tobaccoList.map((item) => {
        if (item.tobaccoUseType) {
          item.tobaccoUseTypeID = item.tobaccoUseType.personalHabitTypeID;
          item.tobaccoUseType = item.tobaccoUseType.habitValue;
        }
      });
    }

    let alcoholList = personalHistoryFormValue.alcoholList;
    if (alcoholList) {
      alcoholList.map((item) => {
        if (item.typeOfAlcohol) {
          item.alcoholTypeID = item.typeOfAlcohol.personalHabitTypeID;
          item.typeOfAlcohol = item.typeOfAlcohol.habitValue;
        }
        if (item.avgAlcoholConsumption)
          item.avgAlcoholConsumption = item.avgAlcoholConsumption.habitValue;
      });
    }

    let allergyList = personalHistoryFormValue.allergicList;
    if (allergyList) {
      allergyList.map((item) => {
        if (item.allergyType) item.allergyType = item.allergyType.allergyType;
        if (item.typeOfAllergicReactions) {
          item.typeOfAllergicReactions.map((value) => {
            value.allergicReactionTypeID = "" + value.allergicReactionTypeID;
          });
        }
      });
    }
    let personalHistoryData = Object.assign(
      {},
      personalHistoryFormValue,
      otherDetails,
      {
        riskySexualPracticesStatus:
          personalHistoryForm.value.riskySexualPracticesStatus != undefined &&
          personalHistoryForm.value.riskySexualPracticesStatus != null
            ? +personalHistoryForm.value.riskySexualPracticesStatus
            : null,
        tobaccoList: tobaccoList,
        alcoholList: alcoholList,
        allergicList: allergyList,
      }
    );
    // console.log("Personal History Data", JSON.stringify(personalHistoryData, null, 4));
    return personalHistoryData;
  }

  getPreviousPastHistory(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousPastHistoryUrl, { benRegID: benRegID })
      .map((res) => res.json());
  }

  getPreviousMedicationHistory(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousMedicationHistoryUrl, { benRegID: benRegID })
      .map((res) => res.json());
  }

  getPreviousOtherVaccines(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousOtherVaccineHistoryUrl, { benRegID: benRegID })
      .map((res) => res.json());
  }

  getPreviousTobaccoHistory(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousTobaccoHistoryUrl, { benRegID: benRegID })
      .map((res) => res.json());
  }

  getPreviousAlcoholHistory(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousAlcoholHistoryUrl, { benRegID: benRegID })
      .map((res) => res.json());
  }

  getPreviousAllergyHistory(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousAllergyHistoryUrl, { benRegID: benRegID })
      .map((res) => res.json());
  }

  getPreviousFamilyHistory(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousFamilyHistoryUrl, { benRegID: benRegID })
      .map((res) => res.json());
  }

  getPreviousMenstrualHistory(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousMestrualHistoryUrl, { benRegID: benRegID })
      .map((res) => res.json());
  }

  getPreviousObstetricHistory(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousPastObstetricHistoryUrl, { benRegID: benRegID })
      .map((res) => res.json());
  }

  getPreviousComorbidityHistory(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousComorbidityHistoryUrl, { benRegID: benRegID })
      .map((res) => res.json());
  }

  getPreviousDevelopmentalHistory(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousDevelopmentHistory, { benRegID: benRegID })
      .map((res) => res.json());
  }

  getPreviousImmunizationServicesData(benRegID) {
    return this.http
      .post(environment.previousImmunizationServiceDataUrl, { benRegID: benRegID })
      .map((res) => res.json());
  }

  getPreviousPerinatalHistory(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousPerinatalHistory, { benRegID: benRegID })
      .map((res) => res.json());
  }

  getPreviousFeedingHistory(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousFeedingHistory, { benRegID: benRegID })
      .map((res) => res.json());
  }

  getPreviousImmunizationHistory(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousImmunizationHistoryUrl, { benRegID: benRegID })
      .map((res) => res.json());
  }
  getPreviousPhysicalActivityHistory(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousPhyscialactivityHistoryUrl, {
        benRegID: benRegID,
      })
      .map((res) => res.json());
  }
  getPreviousDiabetesHistory(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousDiabetesHistoryUrl, { benRegID: benRegID })
      .map((res) => res.json());
  }
  getPreviousReferredHistory(benRegID: string, visitCategory) {
    return this.http
      .post(environment.previousReferredHistoryUrl, { benRegID: benRegID })
      .map((res) => res.json());
  }

  postNCDScreeningForm(
    medicalForm,
    visitCategory,
    beneficiary,
    tcRequest,
    showIDRS
  ) {
    this.ncdScreeningidrsDetails = null;
    this.ncdScreeningVisitDetails = null;
    let serviceDetails = {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: null,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    };

    // ncdScreeningVisitDetails
    let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
    let parkingPlaceID = JSON.parse(
      localStorage.getItem("serviceLineDetails")
    ).parkingPlaceID;

    if (showIDRS === true) {
      medicalForm.removeControl("diabetes");
      medicalForm.removeControl("hypertension");
      medicalForm.removeControl("oral");
      medicalForm.removeControl("breast");
      medicalForm.removeControl("cervical");
      this.ncdScreeningidrsDetails = Object.assign(
        {},
        medicalForm.controls.idrsScreeningForm.value,
        serviceDetails
      );

      this.ncdScreeningVisitDetails = Object.assign(
        {},
        {
          visitDetails: this.postGenericVisitDetailForm(
            medicalForm.controls.patientVisitForm,
            null,
            visitCategory,
            false
          ),
        },
        {
          vitalDetails: this.postGenericVitalForm(
            medicalForm.controls.patientVitalsForm,
            null
          ),
        },
        {
          historyDetails: this.postNCDScreeningHistoryForm(
            medicalForm.controls.patientHistoryForm,
            beneficiary,
            visitCategory
          ),
        },
        { idrsDetails: this.ncdScreeningidrsDetails },
        {
          benFlowID: localStorage.getItem("benFlowID"),
          beneficiaryID: localStorage.getItem("beneficiaryID"),
          sessionID: localStorage.getItem("sessionID"),
          parkingPlaceID: parkingPlaceID,
          createdBy: localStorage.getItem("userName"),
          tcRequest: tcRequest,
          vanID: vanID,
          beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
          benVisitID: null,
          providerServiceMapID: localStorage.getItem("providerServiceID"),
        }
      );
    } else {
      this.setNCDConfirmedDiseases(medicalForm);
      medicalForm.controls["patientVisitForm"].removeControl(
        "patientChiefComplaintsForm"
      );
      // medicalForm.removeControl("patientHistoryForm");
      medicalForm.removeControl("idrsScreeningForm");
      this.ncdScreeningVisitDetails = Object.assign(
        {},
        {
          visitDetails: this.postGenericVisitDetailForm(
            medicalForm.controls.patientVisitForm,
            null,
            visitCategory,
            showIDRS
          ),
        },
        {
          vitalDetails: this.postGenericVitalForm(
            medicalForm.controls.patientVitalsForm,
            null
          ),
        },
        {
          historyDetails: this.postNCDScreeningHistoryFormForCbac(
            medicalForm.controls.patientHistoryForm,
            beneficiary,
            visitCategory
          ),
        },
        {
          cbac: medicalForm.controls.patientVisitForm.controls.cbacScreeningForm
            .value,
        },
        { diabetes: medicalForm.controls.diabetes.value },
        { hypertension: medicalForm.controls.hypertension.value },
        { oral: medicalForm.controls.oral.value },
        { breast: medicalForm.controls.breast.value },
        { cervical: medicalForm.controls.cervical.value },
        {
          benFlowID: localStorage.getItem("benFlowID"),
          beneficiaryID: localStorage.getItem("beneficiaryID"),
          sessionID: localStorage.getItem("sessionID"),
          parkingPlaceID: parkingPlaceID,
          createdBy: localStorage.getItem("userName"),
          tcRequest: tcRequest,
          vanID: vanID,
          beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
          benVisitID: null,
          providerServiceMapID: localStorage.getItem("providerServiceID"),
        }
      );
    }
    console.log(
      "postNCDScreeningFormData",
      JSON.stringify(this.ncdScreeningVisitDetails, null, 4)
    );

    return this.http
      .post(environment.postNCDScreeningDetails, this.ncdScreeningVisitDetails)
      .map((res) => res.json());
  }

  setNCDConfirmedDiseases(medicalForm) {
    medicalForm.controls.diabetes.controls["confirmed"].setValue(
      this.ncdScreeningService.isDiabetesConfirmed
    );

    medicalForm.controls.hypertension.controls["confirmed"].setValue(
      this.ncdScreeningService.isHypertensionConfirmed
    );

    medicalForm.controls.oral.controls["confirmed"].setValue(
      this.ncdScreeningService.isOralConfirmed
    );

    medicalForm.controls.breast.controls["confirmed"].setValue(
      this.ncdScreeningService.isBreastConfirmed
    );

    medicalForm.controls.cervical.controls["confirmed"].setValue(
      this.ncdScreeningService.isCervicalConfirmed
    );
  }

  postNurseGeneralOPDVisitForm(
    medicalForm,
    visitCategory,
    beneficiary,
    tcRequest
  ) {
    let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
    let parkingPlaceID = JSON.parse(
      localStorage.getItem("serviceLineDetails")
    ).parkingPlaceID;
    let serviceID = localStorage.getItem("serviceID");
    let createdBy = localStorage.getItem("userName");
    let nurseGeneralOPDVisitDetails = {
      visitDetails: this.postGenericVisitDetailForm(
        medicalForm.controls.patientVisitForm,
        null,
        visitCategory,
        false
      ),
      vitalDetails: this.postGenericVitalForm(
        medicalForm.controls.patientVitalsForm,
        null
      ),
      historyDetails: this.postGeneralHistoryForm(
        medicalForm.controls.patientHistoryForm,
        beneficiary
      ),
      examinationDetails: this.postGenericExaminationForm(
        medicalForm.controls.patientExaminationForm.value,
        null,
        visitCategory
      ),
      benFlowID: localStorage.getItem("benFlowID"),
      beneficiaryID: localStorage.getItem("beneficiaryID"),
      sessionID: localStorage.getItem("sessionID"),
      parkingPlaceID: parkingPlaceID,
      vanID: vanID,
      serviceID: serviceID,
      createdBy: createdBy,
      tcRequest: tcRequest,
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      providerServiceMapID: localStorage.getItem("providerServiceID"),
    };

    console.log(
      "Nurse General OPD Visit Details",
      JSON.stringify(nurseGeneralOPDVisitDetails, null, 4)
    );

    return this.http
      .post(environment.saveNurseGeneralOPDDetails, nurseGeneralOPDVisitDetails)
      .map((res) => res.json()).pipe(shareReplay(1));
  }

  postGeneralHistoryForm(generalHistoryForm, beneficiary) {
    // let patientHistoryFormValue = JSON.parse(JSON.stringify(patientHistoryForm));
    let temp = {
      beneficiaryRegID: "" + localStorage.getItem("beneficiaryRegID"),
      benVisitID: null,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    };
    return {
      pastHistory: this.postGeneralPastHistory(
        generalHistoryForm.controls.pastHistory,
        temp
      ),
      comorbidConditions: this.postGeneralComorbidityHistory(
        generalHistoryForm.controls.comorbidityHistory,
        temp
      ),
      medicationHistory: this.postGeneralMedicationHistroy(
        generalHistoryForm.controls.medicationHistory,
        temp
      ),
      femaleObstetricHistory: this.postGeneralPastObstetricHistory(
        generalHistoryForm.controls.pastObstericHistory,
        temp
      ),
      menstrualHistory: this.postGeneralMenstrualHistory(
        generalHistoryForm.controls.menstrualHistory,
        temp
      ),
      familyHistory: this.postGeneralFamilyHistory(
        generalHistoryForm.controls.familyHistory,
        temp
      ),
      personalHistory: this.postGeneralPersonalHistory(
        generalHistoryForm.controls.personalHistory,
        temp
      ),
      childVaccineDetails: this.postGeneralOtherVaccines(
        generalHistoryForm.controls.otherVaccines,
        temp
      ),
      immunizationHistory: this.postGeneralImmunizationHistroy(
        generalHistoryForm.controls.immunizationHistory,
        temp
      ),
      developmentHistory: this.postGeneralDevelopmentHistory(
        generalHistoryForm.controls.developmentHistory,
        temp
      ),
      feedingHistory: this.postGeneralFeedingHistory(
        generalHistoryForm.controls.feedingHistory,
        temp
      ),
      perinatalHistroy: this.postGeneralPerinatalHistory(
        generalHistoryForm.controls.perinatalHistory,
        temp
      ),
    };
    // if (beneficiary.ageVal ) {
    //   return {
    //     "pastHistory": this.postGeneralPastHistory(generalHistoryForm.controls.pastHistory, temp),
    //     "comorbidConditions": this.postGeneralComorbidityHistory(generalHistoryForm.controls.comorbidityHistory, temp),
    //     "medicationHistory": this.postGeneralMedicationHistroy(generalHistoryForm.controls.medicationHistory, temp),
    //     "femaleObstetricHistory": this.postGeneralPastObstetricHistory(generalHistoryForm.controls.pastObstericHistory, temp),
    //     "menstrualHistory": this.postGeneralMenstrualHistory(generalHistoryForm.controls.menstrualHistory, temp),
    //     "familyHistory": this.postGeneralFamilyHistory(generalHistoryForm.controls.familyHistory, temp),
    //     "personalHistory": this.postGeneralPersonalHistory(generalHistoryForm.controls.personalHistory, temp),
    //     "childVaccineDetails": this.postGeneralOtherVaccines(generalHistoryForm.controls.otherVaccines, temp),
    //     "immunizationHistory": this.postGeneralImmunizationHistroy(generalHistoryForm.controls.immunizationHistory, temp),
    //   }
    // } else {
    //   return {
    //     "pastHistory": this.postGeneralPastHistory(generalHistoryForm.controls.pastHistory, temp),
    //     "comorbidConditions": this.postGeneralComorbidityHistory(generalHistoryForm.controls.comorbidityHistory, temp),
    //     "medicationHistory": this.postGeneralMedicationHistroy(generalHistoryForm.controls.medicationHistory, temp),
    //     "femaleObstetricHistory": this.postGeneralPastObstetricHistory(generalHistoryForm.controls.pastObstericHistory, temp),
    //     "menstrualHistory": this.postGeneralMenstrualHistory(generalHistoryForm.controls.menstrualHistory, temp),
    //     "familyHistory": this.postGeneralFamilyHistory(generalHistoryForm.controls.familyHistory, temp),
    //     "personalHistory": this.postGeneralPersonalHistory(generalHistoryForm.controls.personalHistory, temp),
    //   }
    // }
  }

  postNurseNCDCareVisitForm(
    medicalForm,
    visitCategory,
    beneficiary,
    tcRequest
  ) {
    let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
    let parkingPlaceID = JSON.parse(
      localStorage.getItem("serviceLineDetails")
    ).parkingPlaceID;
    let serviceID = localStorage.getItem("serviceID");
    let createdBy = localStorage.getItem("userName");
    let nurseGeneralOPDVisitDetails = {
      visitDetails: this.postGenericVisitDetailForm(
        medicalForm.controls.patientVisitForm,
        null,
        visitCategory,
        false
      ),
      vitalDetails: this.postGenericVitalForm(
        medicalForm.controls.patientVitalsForm,
        null
      ),
      historyDetails: this.postGeneralHistoryForm(
        medicalForm.controls.patientHistoryForm,
        beneficiary
      ),
      benFlowID: localStorage.getItem("benFlowID"),
      beneficiaryID: localStorage.getItem("beneficiaryID"),
      sessionID: localStorage.getItem("sessionID"),
      parkingPlaceID: parkingPlaceID,
      vanID: vanID,
      serviceID: serviceID,
      createdBy: createdBy,
      tcRequest: tcRequest,
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      providerServiceMapID: localStorage.getItem("providerServiceID"),
    };

    console.log(
      "Nurse NCD CARE Visit Details",
      JSON.stringify(nurseGeneralOPDVisitDetails, null, 4)
    );

    return this.http
      .post(environment.saveNurseNCDCareDetails, nurseGeneralOPDVisitDetails)
      .map((res) => res.json()).pipe(shareReplay(1));
  }

  postNurseCovidVisitForm(medicalForm, visitCategory, beneficiary, tcRequest) {
    let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
    let parkingPlaceID = JSON.parse(
      localStorage.getItem("serviceLineDetails")
    ).parkingPlaceID;
    let serviceID = localStorage.getItem("serviceID");
    let createdBy = localStorage.getItem("userName");
    let nurseGeneralOPDVisitDetails = {
      visitDetails: this.postGenericVisitDetailForm(
        medicalForm.controls.patientVisitForm,
        null,
        visitCategory,
        false
      ),
      vitalDetails: this.postGenericVitalForm(
        medicalForm.controls.patientVitalsForm,
        null
      ),
      historyDetails: this.postGeneralHistoryForm(
        medicalForm.controls.patientHistoryForm,
        beneficiary
      ),
      benFlowID: localStorage.getItem("benFlowID"),
      beneficiaryID: localStorage.getItem("beneficiaryID"),
      sessionID: localStorage.getItem("sessionID"),
      parkingPlaceID: parkingPlaceID,
      vanID: vanID,
      serviceID: serviceID,
      createdBy: createdBy,
      tcRequest: tcRequest,
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      providerServiceMapID: localStorage.getItem("providerServiceID"),
    };

    console.log(
      "Nurse Covid-19 Visit Details",
      JSON.stringify(nurseGeneralOPDVisitDetails, null, 4)
    );

    return this.http
      .post(environment.saveNurseCovidDetails, nurseGeneralOPDVisitDetails)
      .map((res) => res.json()).pipe(shareReplay(1));
  }

  postNursePNCVisitForm(medicalForm, visitCategory, beneficiary, tcRequest) {
    let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
    let parkingPlaceID = JSON.parse(
      localStorage.getItem("serviceLineDetails")
    ).parkingPlaceID;
    let serviceID = localStorage.getItem("serviceID");
    let createdBy = localStorage.getItem("userName");
    let nursePNCVisitDetails = {
      visitDetails: this.postGenericVisitDetailForm(
        medicalForm.controls.patientVisitForm,
        null,
        visitCategory,
        false
      ),
      pNCDeatils: this.postPNCDetailForm(
        medicalForm.controls.patientPNCForm,
        null
      ),
      vitalDetails: this.postGenericVitalForm(
        medicalForm.controls.patientVitalsForm,
        null
      ),
      historyDetails: this.postANCHistoryForm(
        medicalForm.controls.patientHistoryForm,
        null,
        beneficiary.ageVal
      ),
      examinationDetails: this.postGenericExaminationForm(
        medicalForm.controls.patientExaminationForm.value,
        null,
        visitCategory
      ),
      benFlowID: localStorage.getItem("benFlowID"),
      beneficiaryID: localStorage.getItem("beneficiaryID"),
      sessionID: localStorage.getItem("sessionID"),
      parkingPlaceID: parkingPlaceID,
      vanID: vanID,
      serviceID: serviceID,
      createdBy: createdBy,
      tcRequest: tcRequest,
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      providerServiceMapID: localStorage.getItem("providerServiceID"),
    };

    console.log(
      "Nurse PNC Visit Details",
      JSON.stringify(nursePNCVisitDetails, null, 4)
    );

    return this.http
      .post(environment.savePNCNurseDetailsUrl, nursePNCVisitDetails)
      .map((res) => res.json()).pipe(shareReplay(1));
  }

  postPNCDetailForm(patientPNCForm, benVisitID) {
    let temp = JSON.parse(JSON.stringify(patientPNCForm.value));
    if (temp.deliveryPlace) {
      temp.deliveryPlaceID = temp.deliveryPlace.deliveryPlaceID;
      temp.deliveryPlace = temp.deliveryPlace.deliveryPlace;
    }

    if (temp.deliveryType) {
      temp.deliveryTypeID = temp.deliveryType.deliveryTypeID;
      temp.deliveryType = temp.deliveryType.deliveryType;
    }

    if (temp.deliveryConductedBy) {
      temp.deliveryConductedByID =
        temp.deliveryConductedBy.deliveryConductedByID;
      temp.deliveryConductedBy = temp.deliveryConductedBy.deliveryConductedBy;
    }

    if (temp.deliveryComplication) {
      temp.deliveryComplicationID = temp.deliveryComplication.complicationID;
      temp.deliveryComplication =
        temp.deliveryComplication.deliveryComplicationType;
    }

    if (temp.pregOutcome) {
      temp.pregOutcomeID = temp.pregOutcome.pregOutcomeID;
      temp.pregOutcome = temp.pregOutcome.pregOutcome;
    }

    if (temp.postNatalComplication) {
      temp.postNatalComplicationID = temp.postNatalComplication.complicationID;
      temp.postNatalComplication = temp.postNatalComplication.complicationValue;
    }

    if (temp.gestationName) {
      temp.gestationID = temp.gestationName.gestationID;
      temp.gestationName = temp.gestationName.name;
    }

    if (temp.newBornHealthStatus) {
      temp.newBornHealthStatusID =
        temp.newBornHealthStatus.newBornHealthStatusID;
      temp.newBornHealthStatus = temp.newBornHealthStatus.newBornHealthStatus;
    }
    // if (!temp.dateOfDelivery) {
    //   temp.dateOfDelivery = undefined;
    // }

    let patientPNCDetails = Object.assign({}, temp, {
      beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
      benVisitID: benVisitID,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    });

    return patientPNCDetails;
  }

  getNcdScreeningVisitCount(beneficiaryRegID) {
    return this.http
      .get(environment.getNcdScreeningVisitCountUrl + beneficiaryRegID)
      .map((res) => res.json());
  }
  getStateName(value) {
    return this.http
      .get(environment.getStateName + value)
      .map((res) => res.json());
  }
  getDistrictName(stateID) {
    return this.http
      .get(environment.getDistrictName + stateID)
      .map((res) => res.json());
  }
  getSubDistrictName(districtID) {
    return this.http
      .get(environment.getSubDistrictName + districtID)
      .map((res) => res.json());
  }
  getCountryName() {
    return this.http.get(environment.getCountryName).map((res) => res.json());
  }
  getCityName(countryID) {
    return this.http
      .get(environment.getCityName + countryID + "/")
      .map((res) => res.json());
  }
  postNCDScreeningHistoryForm(medicalForm, beneficiary, visitCategory) {
    let temp = {
      beneficiaryRegID: "" + localStorage.getItem("beneficiaryRegID"),
      benVisitID: null,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    };

    return {
      familyHistory: this.postGeneralFamilyHistory(
        medicalForm.controls.familyHistory,
        temp
      ),
      physicalActivityHistory: this.postPhyscialActivityHistory(
        medicalForm.controls.physicalActivityHistory,
        temp
      ),
      personalHistory: this.postGeneralPersonalHistory(
        medicalForm.controls.personalHistory,
        temp
      ),
    };
  }

  postNCDScreeningHistoryFormForCbac(medicalForm, beneficiary, visitCategory) {
    let temp = {
      beneficiaryRegID: "" + localStorage.getItem("beneficiaryRegID"),
      benVisitID: null,
      providerServiceMapID: localStorage.getItem("providerServiceID"),
      createdBy: localStorage.getItem("userName"),
    };

    return {
      personalHistory: this.postGeneralPersonalHistory(
        medicalForm.controls.personalHistory,
        temp
      ),
    };
  }

  postPhyscialActivityHistory(physicalActivityHistory, otherDetails) {
    let physicalActivityHistoryForm = Object.assign(
      {},
      physicalActivityHistory.value,
      otherDetails
    );
    // console.log('General examination', JSON.stringify(generalExaminationForm, null, 4));
    return physicalActivityHistoryForm;
  }
  setNCDTemp(score) {
    this.temp = score;
    this.ncdTemp.next(score);
  }
  clearNCDTemp() {
    this.temp = false;
    this.ncdTemp.next(false);
  }
  setEnableLAssessment(score) {
    this.temp = score;
    this.enableLAssessment.next(score);
  }
  clearEnableLAssessment() {
    this.temp = false;
    this.enableLAssessment.next(false);
  }
  setIsMMUTC(isMMUTC) {
    this.ismmutc.next(isMMUTC);
  }

  /**
   * (C)
   * DE40034072
   *25-06-21
   */

  /*ANC Fetosense Test service*/

  sendTestDetailsToFetosense(reqObj) {
    return this.http
      .post(environment.savefetosenseTestDetailsUrl, reqObj)
      .map((res) => res.json()).pipe(shareReplay(1));
  }

  fetchPrescribedFetosenseTests(benFlowId) {
    return this.http
      .get(environment.getPrescribedFetosenseTests + benFlowId)
      .map((res) => res.json());
  }

  getESanjeevaniDetails(benRegID) {
    return this.http
      .get(environment.getESanjeevaniDetailsUrl+ benRegID )
      .map((res) => res.json());
  }

  setLMPForFetosenseTest(value) {
    this.lmpFetosenseTest = value;
    this.lmpFetosenseTestValue.next(value);
  }

  clearLMPForFetosenseTest() {
    this.lmpFetosenseTest = null;
    this.lmpFetosenseTestValue.next(null);
  }

  calculateBmiStatus(obj) {
    return this.http
      .post(environment.calculateBmiStatus, obj)
      .map((res) => res.json());
  }
  /*END*/

  setRbsSelectedInInvestigation(score) {
    this.rbsSelectedInvestigation = score;
    this.rbsSelectedInInvestigation.next(score);
  }

  clearRbsSelectedInInvestigation() {
    this.rbsSelectedInInvestigation.next(false);
  }
  setRbsInCurrentVitals(score) {
    this.rbsCurrentTestResult = score;
    this.rbsTestResultCurrent.next(score);
  }

  clearRbsInVitals() {
    this.rbsTestResultCurrent.next(null);
  }

  saveBenCovidVaccinationDetails(covidVaccineStatusForm) {
    let vanID = JSON.parse(localStorage.getItem("serviceLineDetails")).vanID;
    let parkingPlaceID = JSON.parse(
      localStorage.getItem("serviceLineDetails")
    ).parkingPlaceID;
    let createdBy = localStorage.getItem("userName");
    let covidVaccineFormValues = covidVaccineStatusForm.value;
    let nurseCovidVaccinationDetails = {};
    if (
      covidVaccineFormValues.covidVSID !== undefined &&
      covidVaccineFormValues.covidVSID !== null
    ) {
      nurseCovidVaccinationDetails = {
        covidVSID: covidVaccineFormValues.covidVSID,
        beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
        vaccineStatus: covidVaccineFormValues.vaccineStatus,
        covidVaccineTypeID: covidVaccineFormValues.vaccineTypes,
        doseTypeID: covidVaccineFormValues.doseTaken,
        providerServiceMapID: localStorage.getItem("providerServiceID"),
        createdBy: createdBy,
        vanID: vanID,
        parkingPlaceID: parkingPlaceID,
        modifiedBy: createdBy,
      };
    } else {
      nurseCovidVaccinationDetails = {
        covidVSID: null,
        beneficiaryRegID: localStorage.getItem("beneficiaryRegID"),
        vaccineStatus: covidVaccineFormValues.vaccineStatus,
        covidVaccineTypeID: covidVaccineFormValues.vaccineTypes,
        doseTypeID: covidVaccineFormValues.doseTaken,
        providerServiceMapID: localStorage.getItem("providerServiceID"),
        createdBy: createdBy,
        vanID: vanID,
        parkingPlaceID: parkingPlaceID,
      };
    }

    return this.http
      .post(
        environment.saveCovidVaccinationDetailsUrl,
        nurseCovidVaccinationDetails
      )
      .map((res) => res.json()).pipe(shareReplay(1));
  }

  getDiabetesStatus(findDiabeticStatus) {
    return this.http
      .post(environment.diabetesStatusUrl, findDiabeticStatus)
      .map((res) => res.json());
  }

  getBloodPressureStatus(findBPStatus) {
    return this.http
      .post(environment.bloodPressureStatusUrl, findBPStatus)
      .map((res) => res.json());
  }

  getCbacDetailsFromNurse(request) {
    return this.http
      .post(environment.confirmedDiseaseUrl, request)
      .map((res) => res.json());
  }

  getPreviousVisitConfirmedDiseases(request) {
    return this.http
      .post(environment.previousVisitConfirmedUrl, request)
      .map((res) => res.json());
  }


  setUpdateForHrpStatus(value) {
    this.hrpStatusUpdate = value;
    this.hrpStatusUpdateValue.next(value);
  }

  loadNursePatientDetails(vanId : any) {

    return this.http.get(this.getnurse104referredworklisturls+"/"+vanId).map((res:any)=>res.json().data);
    
  // return this.http.get(this.getnurse104referredworklistURL/uptsu/getWorklistByVanID+"/"+vanId).map((res:any)=>res.json().data);
 







 
  }


  setNCDScreeningProvision(score) {
    this.temp = score;
    this.enableProvisionalDiag.next(score);
  }
  clearNCDScreeningProvision() {
    this.temp = false;
    this.enableProvisionalDiag.next(false);
  }
}



