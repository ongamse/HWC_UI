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
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from '../app-modules/core/services/confirmation.service';
import { TelemedicineService } from '../app-modules/core/services/telemedicine.service';
import { ServicePointService } from './../service-point/service-point.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  servicesList: any;
  serviceIDs: any;
  fullName: any;
  currentLanguageSet: any;
  statesList: any =[];
  stateID: any;
  current_language_set :any;
  vanServicepointDetails: any;
  vansList = [];
  vanID: string;
  serviceDetails:any

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private telemedicineService: TelemedicineService,
    private servicePointService: ServicePointService,
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    localStorage.removeItem('providerServiceID');
    this.servicesList = JSON.parse(localStorage.getItem('services'));
    this.fullName = localStorage.getItem('fullName');
  }
  getServicePoint() {
    let serviceProviderId = localStorage.getItem('providerServiceID');
    let userId = localStorage.getItem('userID');
    this.servicePointService.getServicePoints(userId,serviceProviderId).subscribe(res => {
      if (res.statusCode == 200 && res.data != null) {
        let data = res.data;
        if (data.UserVanSpDetails) {
          this.vanServicepointDetails = data.UserVanSpDetails;
          this.filterVanList(this.vanServicepointDetails)
          this.getDemographics();
          this.checkRoleAndDesingnationMappedForservice(this.loginDataResponse, this.serviceDetails);
        }
      } else if (res.statusCode == 5002) {
        this.confirmationService.alert(res.errorMessage, 'error');
      } else {
        this.confirmationService.alert(res.errorMessage, 'error');
        this.router.navigate(['/service']);
      }
    }, (err) => {
      this.confirmationService.alert(err, 'error');
    });
  }
  filterVanList(vanServicepointDetails) {
    console.log('vanServicepointDetails', vanServicepointDetails);
    this.vansList = vanServicepointDetails.filter((van) => {
      if (van.vanSession == 3) {
        return van;
      }
    })
    this.vansList = vanServicepointDetails.filter(
      (thing, i, arr) => arr.findIndex(t => t.vanID === thing.vanID) === i
      );  
      console.log("vanList",this.vansList) 
      this.getServiceLineDetails();
  }
  getServiceLineDetails() {
    let serviceLineDetails = this.vansList[0];
    console.log("serviceLineDetails", serviceLineDetails)
    localStorage.setItem('serviceLineDetails', JSON.stringify(serviceLineDetails));
    if (serviceLineDetails.facilityID && serviceLineDetails.facilityID !=undefined && serviceLineDetails.facilityID != null)
      sessionStorage.setItem('facilityID', serviceLineDetails.facilityID);
    if (serviceLineDetails.servicePointID)
      localStorage.setItem('servicePointID', serviceLineDetails.servicePointID);
    if (serviceLineDetails.servicePointName)
      localStorage.setItem('servicePointName', serviceLineDetails.servicePointName);
    if (serviceLineDetails.vanSession)
      localStorage.setItem('sessionID', serviceLineDetails.vanSession);
  }


  loginDataResponse: any;
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

  
  selectService(service) {
    localStorage.setItem('providerServiceID', service.providerServiceID);
    console.log(localStorage.getItem('provideServiceID'));
    localStorage.setItem('serviceName', service.serviceName);
    localStorage.setItem('serviceID', service.serviceID);
    sessionStorage.setItem('apimanClientKey', service.apimanClientKey);
    this.loginDataResponse = JSON.parse(localStorage.getItem('loginDataResponse'));
    this.serviceDetails = service;
    this.getServicePoint();
   
  }

  checkRoleAndDesingnationMappedForservice(loginDataResponse, service) {
    let serviceData: any;

    if (loginDataResponse.previlegeObj) {
      serviceData = loginDataResponse.previlegeObj.filter((item) => {
        return item.serviceName == service.serviceName
      })[0];

      if (serviceData != null) {
        this.checkMappedRoleForService(serviceData)
      }
    }
  }

  roleArray = []
  checkMappedRoleForService(serviceData) {
    this.roleArray = [];
    let roleData;
    if (serviceData.roles) {
      roleData = serviceData.roles;
      if (roleData.length > 0) {
        roleData.forEach((role) => {
          role.serviceRoleScreenMappings.forEach((serviceRole) => {
            this.roleArray.push(serviceRole.screen.screenName)
          });
        });
        if (this.roleArray && this.roleArray.length > 0) {
          localStorage.setItem('role', JSON.stringify(this.roleArray));
          this.checkMappedDesignation(this.loginDataResponse);
        } else {
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.mapRoleFeature, 'error');
        }
      } else {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.mapRoleFeature, 'error');
      }
    } else {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.mapRoleFeature, 'error');
    }
  }

  designation: any;
  checkMappedDesignation(loginDataResponse) {
    if (loginDataResponse.designation && loginDataResponse.designation.designationName) {
      this.designation = loginDataResponse.designation.designationName;
      if (this.designation != null) {
        this.checkDesignationWithRole();
      } else {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.mapDesignation, 'error');
      }
    } else {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.mapDesignation, 'error');
    }
  }

  checkDesignationWithRole() {
    if (this.roleArray.includes(this.designation)) {
      localStorage.setItem('designation', this.designation);
      this.getSwymedMailLogin();
      this.routeToDesignation(this.designation);
    } else {
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.rolesNotMatched, 'error');
    }
  }
  getSwymedMailLogin() {
    this.servicePointService.getSwymedMailLogin().subscribe((res) => {
      if (res.statusCode == 200)
        window.location.href = res.data.response
    })
  }
  
  routeToDesignation(designation) {
    switch (designation) {
      case "TC Specialist":
        this.router.navigate(['/common/tcspecialist-worklist']);
        break;
      case "Supervisor":
        this.telemedicineService.routeToTeleMedecine();
        break;
      default:
        this.goToWorkList();
        // this.router.navigate(["/servicePoint"]);s
        break;
    }
  }
  getDemographics() {
    this.servicePointService.getMMUDemographics()
      .subscribe((res) => {
        if (res && res.statusCode == 200) {
          this.saveDemographicsToStorage(res.data);
        } else {
          this.locationGathetingIssues();
        }
      });

  }
  saveDemographicsToStorage(data) {
    if (data) {
      if (data.stateMaster && data.stateMaster.length >= 1) {
        localStorage.setItem('location', JSON.stringify(data));
        // this.goToWorkList();
        // this.statesList = data.stateMaster;
        // this.stateID = data.otherLoc.stateID;
        // this.fetchDistrictsOnStateSelection(this.stateID);
        // this.districtID = null;
        // this.blockID = null;
        // this.districtBranchID = null;
      } else {
        this.locationGathetingIssues();
      }
    } else {
      this.locationGathetingIssues();
    }

    console.log("statesList",this.statesList);
    this.stateID = data.stateMaster.stateID;
  }

  locationGathetingIssues() {
    this.confirmationService.alert(this.current_language_set.coreComponents.issuesInGettingLocationTryToReLogin, 'error');
  }
  goToWorkList() {
    this.designation = localStorage.getItem('designation');
    this.routeToDesignationWorklist(this.designation);
  }

  routeToDesignationWorklist(designation) {
    switch (designation) {
      case "Registrar":
        this.router.navigate(['/registrar/registration']);
        break;
      case "Nurse":
        this.router.navigate(['/common/nurse-worklist']);
        break;
      case "Doctor":
        this.router.navigate(['/common/doctor-worklist']);
        break;
      case "Lab Technician":
        this.router.navigate(['/lab']);
        break;
      case "Pharmacist":
        this.router.navigate(['/pharmacist']);
        break;
      case "Radiologist":
        this.router.navigate(['/common/radiologist-worklist']);
        break;
      case "Oncologist":
        this.router.navigate(['/common/oncologist-worklist']);
        break;
      default:
    }
  }
  
  

}
