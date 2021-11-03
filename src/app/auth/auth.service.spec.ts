import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';

interface AuthResponseData {
  //type :string;
  email: string;
  token: string;
  tokenExpiresIn: string;
}
interface signupReqData {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  password: string;
}
describe('Auth Service', () => {
  let httpTestingController: HttpTestingController;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [AuthService, { provide: 'Router', useValue: '' }],
    });
    localStorage.clear();
    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  it('should signup a new user', () => {
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

    req.flush(replyData);
    httpTestingController.verify();
  });

  it('should login an existing user', () => {
    const inputForm: NgForm = <NgForm>{
      value: {
        email: 'rick@gmail.com',
        password: 'timeLapse',
      },
    };

    const dataToApi = {
      email: 'rick@gmail.com',
      password: 'timeLapse',
    };
    const replyData: AuthResponseData = {
      email: 'rick@gmail.com',
      token: 'sampleToken',
      tokenExpiresIn: '3600000',
    };

    authService.login(inputForm).subscribe((authResponseData) => {
      console.log('resp=>' + replyData);
      expect(authResponseData.token).toBeTruthy();
      expect(authResponseData.tokenExpiresIn).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`http://localhost:8080/login`);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(dataToApi);

    req.flush(replyData);
    httpTestingController.verify();
  });

  afterEach(() => {
    localStorage.clear();
  });
});
