import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { Claim } from '../claim.model';
import { ClaimsService } from './claims.service';

describe('ClaimsService', () => {
  let claimsSvc: ClaimsService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClaimsService],
    });
    localStorage.clear();

    claimsSvc = TestBed.inject(ClaimsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should add a claim', () => {
    const selectedMember = {
      memberId: 'R-123',
      firstName: 'Rick',
      lastName: 'Sanchez',
      dob: '1996-11-04',
    };

    const testForm: NgForm = <NgForm>{
      value: {
        admissionDate: '2021-09-01',
        dischargeDate: '2021-10-01',
        providerName: 'ABC company',
        billAmount: '5000',
      },
    };
    const dataToApi: Claim = {
      admissionDate: '2021-09-01',
      billAmount: '5000',
      claimNumber: '',
      dischargeDate: '2021-10-01',
      dob: '1996-11-04',
      email: 'abc@gmail.com',
      firstName: 'Rick',
      lastName: 'Sanchez',
      memberId: 'R-123',
      providerName: 'ABC company',
    };

    const replyData: Claim = {
      admissionDate: '2021-09-01',
      billAmount: '5000',
      claimNumber: '9874561230',
      dischargeDate: '2021-10-01',
      dob: '1996-11-04',
      email: 'abc@gmail.com',
      firstName: 'Rick',
      lastName: 'Sanchez',
      memberId: 'R-123',
      providerName: 'ABC company',
    };

    claimsSvc
      .submitClaim('abc@gmail.com', testForm, selectedMember)
      .subscribe((claim) => expect(claim.claimNumber).toBeTruthy());
    const req = httpTestingController.expectOne(`http://localhost:8080/claims`);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(dataToApi);

    req.flush(replyData);
    httpTestingController.verify();
  });
});
