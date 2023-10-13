import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MdDialog, MdDialogRef } from '@angular/material';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { ConfirmationService } from 'app/app-modules/core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { RegistrarService } from '../shared/services/registrar.service';
import { RegistrationUtils } from '../shared/utility/registration-utility';
import { HealthIdOtpGenerationComponent } from '../health-id-otp-generation/health-id-otp-generation.component';
import { BiometricAuthenticationComponent } from '../biometric-authentication/biometric-authentication.component';




@Component({
  selector: 'app-generate-abha-component',
  templateUrl: './generate-abha-component.component.html',
  styleUrls: ['./generate-abha-component.component.css']
})

export class GenerateAbhaComponentComponent implements OnInit {
  utils = new RegistrationUtils(this.fb);
  
  abhaGenerateForm: FormGroup;
  currentLanguageSet: any;
  modeofAbhaHealthID: any;
  aadharNumber: any;
  disableGenerateOTP: boolean;
  // modeofAbhaHealthID: any;
  // aadharNumber: any;

  constructor(
    public dialogRef: MdDialogRef<GenerateAbhaComponentComponent>,
    private fb: FormBuilder,
    private dialog: MdDialog,
    private confirmationValService: ConfirmationService,
    public httpServiceService: HttpServiceService,
    private registrarService: RegistrarService,

  ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    // this.abhaGenerateForm = new RegistrationUtils(this.fb).createRegistrationDetailsForm();
    this.abhaGenerateForm = this.createAbhaGenerateForm();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  closeDialog() {
    this.dialogRef.close();
    this.modeofAbhaHealthID = null;
      this.aadharNumber = null;
  }

  createAbhaGenerateForm() {
    return this.fb.group({
      modeofAbhaHealthID: null,
      aadharNumber: null
    
    });
    
  }

  resetAbhaValidateForm() {
   
    this.abhaGenerateForm.patchValue({
      aadharNumber: null,
    });
    this.abhaGenerateForm.patchValue({
      modeofAbhaHealthID: null,
    });

    
  }

  getAbhaValues(){
    this.modeofAbhaHealthID=this.abhaGenerateForm.controls["modeofAbhaHealthID"].value;
    this.aadharNumber=this.abhaGenerateForm.controls["aadharNumber"].value;
  }

  generateABHACard() {
    this.dialogRef.close();
    this.modeofAbhaHealthID=this.abhaGenerateForm.controls["modeofAbhaHealthID"].value;
    this.aadharNumber=this.abhaGenerateForm.controls["aadharNumber"].value;
    if (this.modeofAbhaHealthID==="AADHAR") {
      this.generateHealthIDCard();
      this.getOTP();
      
    } else if (this.modeofAbhaHealthID==="BIOMETRIC"){
      let mdDialogRef: MdDialogRef<BiometricAuthenticationComponent> = this.dialog.open(BiometricAuthenticationComponent,
        {
          width:"500px",
          height:"320px",
          disableClose: true,
        }
      );
     mdDialogRef.afterClosed().subscribe((res) => {
     });
    }
    
  }

  generateHealthIDCard() {
    const id = {
      "aadharNumber"     : this.aadharNumber,
      "modeofAbhaHealthID" : this.modeofAbhaHealthID
    }
    this.registrarService.passIDsToFetchOtp(id);
  }

  getOTP() {
    let dialogRef = this.dialog.open(HealthIdOtpGenerationComponent, {
      height: '250px',
      width: '420px',
      data: {
        "aadharNumber"     : this.aadharNumber,
        "healthIdMode" : this.modeofAbhaHealthID
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('resultGoldy', result)
      if (result) {
        (<FormGroup>this.abhaGenerateForm.controls['otherDetailsForm']).patchValue({ healthId: result.healthId });
        (<FormGroup>this.abhaGenerateForm.controls['otherDetailsForm']).patchValue({ healthIdNumber: result.healthIdNumber });

        (<FormGroup>this.abhaGenerateForm.controls['otherDetailsForm']).controls['healthId'].disable();
        this.disableGenerateOTP=true;
      
      }
    
     
      

  })
  }
 
}
