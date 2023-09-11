import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { ConfirmationService } from 'app/app-modules/core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';

@Component({
  selector: 'app-generate-abha-component',
  templateUrl: './generate-abha-component.component.html',
  styleUrls: ['./generate-abha-component.component.css']
})
export class GenerateAbhaComponentComponent implements OnInit {

  
  currentLanguageSet: any;

  constructor(
    public dialogRef: MdDialogRef<GenerateAbhaComponentComponent>,
    private dialog: MdDialog,
    private confirmationValService: ConfirmationService,
    public httpServiceService: HttpServiceService,
  ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
