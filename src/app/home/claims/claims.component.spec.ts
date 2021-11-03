import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { User } from 'src/app/auth/user.model';
import { Claim } from '../claim.model';
import { HomeService } from '../home.service';
import { UpdateProfileComponent } from '../update-profile/update-profile.component';

import { ClaimsComponent } from './claims.component';
import { ClaimsService } from './claims.service';

describe('ClaimsComponent', () => {
  let component: ClaimsComponent;
  let fixture: ComponentFixture<ClaimsComponent>;

  let claimsService: any;
  let homeService: any;
  let router: Router;
  let claimsServiceStub = {
    submitClaim() {
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
      return of(replyData);
    },
  };

  let homeServiceStub = {
    getProfile() {
      const replyData = {
        firstName: 'Rick',
        lastName: 'Sanchez',
        dob: '1996-05-04',
        age: 25,
        address: 'Seattle',
        district: 'Washington',
        state: 'Washington',
        country: 'United States',
        email: 'ricky@gmail.com',
        contactNum: '0123456789',
        panCrdNum: 'BRB123456',
        memberId: 'R-123',
        dependents: [
          {
            memberId: 'R-234',
            firstName: 'Morty',
            lastName: 'Smith',
            dob: '1999-11-22',
          },
          {
            memberId: 'R-456',
            firstName: 'Bird',
            lastName: 'Person',
            dob: '2000-08-13',
          },
        ],
      };
      return of(replyData);
    },
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        CommonModule,
        RouterTestingModule.withRoutes([]),
      ],

      declarations: [ClaimsComponent, UpdateProfileComponent],
      providers: [
        { provide: ClaimsService, useValue: claimsServiceStub },
        { provide: HomeService, useValue: homeServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    localStorage.clear();
    const userInfo = new User(
      'ricky@gmail.com',
      'sampleToken',
      new Date('3600000')
    );
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    fixture = TestBed.createComponent(ClaimsComponent);
    component = fixture.componentInstance;
    claimsService = TestBed.inject(ClaimsService);
    homeService = TestBed.inject(HomeService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should get profile from Home Service', () => {
    expect(component).toBeTruthy();
    expect(component.rcvdProfile).toBeTruthy();
    expect(component.rcvdProfile.memberId).toEqual('R-123');
  });

  it('should route to update profile component if profile not found in getProfile function', () => {
    spyOn(homeService, 'getProfile').and.returnValue(
      throwError('Email not found')
    );
    const navigateSpy = spyOn(router, 'navigate');
    component.ngOnInit();
    expect(navigateSpy).toHaveBeenCalledWith(['/home', 'updateProfile']);
  });

  it('should submit claim', () => {
    component.selectedMember = {
      memberId: 'R-123',
      firstName: 'Rick',
      lastName: 'Sanchez',
      dob: '1996-11-04',
    };

    component.rcvdProfile = {
      firstName: 'Rick',
      lastName: 'Sanchez',
      dob: '1996-05-04',
      age: 25,
      address: 'Seattle',
      district: 'Washington',
      state: 'Washington',
      country: 'United States',
      email: 'ricky@gmail.com',
      contactNum: '0123456789',
      panCrdNum: 'BRB123456',
      memberId: 'R-123',
      dependents: [
        {
          memberId: 'R-234',
          firstName: 'Morty',
          lastName: 'Smith',
          dob: '1999-11-22',
        },
        {
          memberId: 'R-456',
          firstName: 'Bird',
          lastName: 'Person',
          dob: '2000-08-13',
        },
      ],
    };

    const testForm: NgForm = <NgForm>{
      value: {
        admissionDate: '2021-09-01',
        dischargeDate: '2021-10-01',
        providerName: 'ABC company',
        billAmount: '5000',
      },
    };

    component.onSubmit(testForm);
    expect(component.claimDetails.claimNumber).toEqual('9874561230');
  });
});
