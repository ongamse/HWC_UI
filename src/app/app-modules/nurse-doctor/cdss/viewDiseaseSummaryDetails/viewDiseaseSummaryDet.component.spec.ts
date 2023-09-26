import { ComponentFixture, TestBed, async } from "@angular/core/testing";
// import { ViewDiseaseSummaryDetailsComponent } from './cdss/viewDiseaseSummaryDetails/viewDiseaseSummaryDet';
import { ViewDiseaseSummaryContentsComponent } from "../diseaseSummaryContents/disease-summary-contents.component";

describe('ViewDiseaseSummaryContentsComponent', () => {
    let component: ViewDiseaseSummaryContentsComponent;
    let fixture: ComponentFixture<ViewDiseaseSummaryContentsComponent>;
  
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ ViewDiseaseSummaryContentsComponent ]
      })
      .compileComponents();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(ViewDiseaseSummaryContentsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should be created', () => {
      expect(component).toBeTruthy();
    });
  });

function beforeEach(arg0: any) {
    throw new Error("Function not implemented.");
}
