import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { Claim } from '../home/claim.model';
import { ClaimsService } from '../home/claims/claims.service';

import { AuthInterceptorService } from './auth.interceptor';
import { AuthService } from './auth.service';
import { User } from './user.model';

interface AuthResponseData {
  //type :string;
  email: string;
  token: string;
  tokenExpiresIn: string;
  registered?: boolean; // ? indicates this field is optional in the api's response
}
interface signupReqData {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  password: string;
}
describe('AuthHttpInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let authService: AuthService;
  let claimsSvc: ClaimsService;
  const selectedMember = {
    memberId: 'R-123',
    firstName: 'Rick',
    lastName: 'Sanchez',
    dob: '1996-11-04',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        AuthService,
        ClaimsService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true,
        },
        { provide: 'Router', useValue: '' },
      ],
    });

    localStorage.clear();
    httpTestingController = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    claimsSvc = TestBed.inject(ClaimsService);
  });

  it('should add an authorization header', () => {
    authService.user = new BehaviorSubject<User>(null);

    const savedUser = new User(
      'abc@gmail.com',
      'sampleJwtToken',
      new Date('3600000')
    );

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

    authService.user.next(savedUser);

    claimsSvc
      .submitClaim('abc@gmail.com', testForm, selectedMember)
      .subscribe((claim) => expect(claim.claimNumber).toBeTruthy());

    const req = httpTestingController.expectOne(`http://localhost:8080/claims`);

    expect(req.request.method).toEqual('POST');

    expect(req.request.headers.has('Authorization')).toEqual(true);

    expect(req.request.headers.get('Authorization')).toBe(
      'Bearer sampleJwtToken'
    );

    req.flush(replyData);
    httpTestingController.verify();
  });

  it('should not add an authorization header', () => {
    authService.user = new BehaviorSubject<User>(null);
    const inputForm: NgForm = <NgForm>{
      value: {
        firstName: 'Rick',
        lastName: 'Sanchez',
        dateOfBirth: '1996-11-04',
        email: 'rick@gmail.com',
        password: 'timeLapse',
      },
    };

    const dataToApi: signupReqData = {
      firstName: 'Rick',
      lastName: 'Sanchez',
      dob: '1996-11-04',
      email: 'rick@gmail.com',
      password: 'timeLapse',
    };

    const replyData: AuthResponseData = {
      email: 'rick@gmail.com',
      token: 'sampleToken',
      tokenExpiresIn: '3600000',
    };

    authService.signUp(inputForm).subscribe((authResponseData) => {
      console.log('resp=>' + replyData);
      expect(authResponseData.token).toBeTruthy();
      expect(authResponseData.tokenExpiresIn).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`http://localhost:8080/signup`);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(dataToApi);
    expect(req.request.headers.has('Authorization')).toEqual(false);

    req.flush(replyData);
    httpTestingController.verify();
  });
});
