import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { UserDetail } from 'src/app/auth/userDetail.model';
import { HomeService } from '../home.service';

import { UpdateProfileComponent } from './update-profile.component';
import { UpdateProfileService } from './update-profile.service';

describe('UpdateProfileComponent', () => {
  let component: UpdateProfileComponent;
  let fixture: ComponentFixture<UpdateProfileComponent>;
  let authService: any;
  let router: Router;
  let homeService: any;
  let updateProfileService: any;

  let updateProfileServiceStub = {
    updateProfile() {
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

  let homeServiceStub = {
    needBasicDetail: false,

    getCountries() {
      const replyData = [
        {
          isoCode: 'IN',
          name: 'India',
          phonecode: '91',
          flag: '🇮🇳',
          currency: 'INR',
          latitude: '20.00000000',
          longitude: '77.00000000',
          timezones: [
            {
              zoneName: 'Asia/Kolkata',
              gmtOffset: 19800,
              gmtOffsetName: 'UTC+05:30',
              abbreviation: 'IST',
              tzName: 'Indian Standard Time',
            },
          ],
        },
        {
          isoCode: 'AF',
          name: 'Afghanistan',
          phonecode: '93',
          flag: '.af',
          currency: 'AFN',
          latitude: '20.00000000',
          longitude: '77.00000000',
          timezones: [
            {
              zoneName: 'Asia/Kabul',
              gmtOffset: 16200,
              gmtOffsetName: 'UTC+04:30',
              abbreviation: 'AFT',
              tzName: 'Afghanistan Time',
            },
          ],
        },
      ];
      return replyData;
    },

    getStates() {
      return [
        {
          name: 'Delhi',
          isoCode: 'DL',
          countryCode: 'IN',
          latitude: '28.70405920',
          longitude: '77.10249020',
        },
        {
          name: 'Tamil Nadu',
          isoCode: 'TN',
          countryCode: 'IN',
          latitude: '28.70405920',
          longitude: '77.10249020',
        },
      ];
    },

    getDistricts() {
      return [
        {
          name: 'New Delhi',
          countryCode: 'IN',
          stateCode: 'DL',
          latitude: '28.63576000',
          longitude: '77.22445000',
        },
        {
          name: 'Coimbatore',
          countryCode: 'IN',
          stateCode: 'TN',
          latitude: '28.63576000',
          longitude: '77.22445000',
        },
      ];
    },

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
    getBasicDetails() {
      const replyData = {
        firstName: 'Rick',
        lastName: 'Sanchez',
        dob: '1996-11-04',
        email: 'ricky@gmail.com',
      };

      return of(replyData);
    },
  };

  let authServiceStub = {
    isNewUser: true,
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

      declarations: [UpdateProfileComponent],

      providers: [
        { provide: UpdateProfileService, useValue: updateProfileServiceStub },
        { provide: HomeService, useValue: homeServiceStub },
        { provide: AuthService, useValue: authServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    localStorage.clear();
    const userDetail = new UserDetail(
      'Rick',
      'Sanchez',
      '1996-11-04',
      'rick@gmail.com'
    );
    localStorage.setItem('userDetail', JSON.stringify(userDetail));
    const userInfo = new User(
      'ricky@gmail.com',
      'sampleToken',
      new Date('3600000')
    );
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    fixture = TestBed.createComponent(UpdateProfileComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    homeService = TestBed.inject(HomeService);
    updateProfileService = TestBed.inject(UpdateProfileService);
  });

  it('should take value from local storage for a new signed up user', () => {
    console.log(
      'Inside should take value from local storage for a new signed up user'
    );
    homeServiceStub.needBasicDetail = false;
    authServiceStub.isNewUser = true;
    component.ngOnInit();
    component.isNewUser = true;

    expect(component).toBeTruthy();
    expect(component.countries).toBeTruthy();
    expect(component.rcvdProfile.firstName).toEqual('Rick');
    expect(component.rcvdProfile.email).toEqual('rick@gmail.com');
    component.rcvdProfile = null;
  });

  it('should fetch all details from home service for an existing user', () => {
    console.log(
      'Inside should fetch value from home service for an existing user'
    );
    homeServiceStub.needBasicDetail = false;
    authServiceStub.isNewUser = false;
    component.ngOnInit();
    component.isNewUser = false;
    console.log(component.rcvdProfile);
    expect(component.rcvdProfile.email).toEqual('ricky@gmail.com');
    expect(component.rcvdProfile.memberId).toBeTruthy();
    expect(component.rcvdProfile.dependents[0].memberId).toBeTruthy();
    expect(component.rcvdProfile.dependents[1].memberId).toBeTruthy();

    component.rcvdProfile = null;
  });

  it('should fetch basic details from home service for a new user who did not complete the profile', () => {
    console.log(
      'Inside should fetch basic details from home service for a new user who did not complete the profile'
    );
    homeServiceStub.needBasicDetail = false;
    authServiceStub.isNewUser = false;

    spyOn(homeService, 'getProfile').and.returnValue(
      throwError('Email not found')
    );
    component.ngOnInit();
    component.isNewUser = false;
    console.log(component.rcvdProfile);

    expect(component.rcvdProfile.firstName).toEqual('Rick');
    expect(component.rcvdProfile.memberId).toEqual('');
    component.rcvdProfile = null;
  });

  it('should register or update profile successfully', () => {
    component.isNewUser = true;
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
      memberId: '',
      dependents: [
        {
          memberId: '',
          firstName: 'Morty',
          lastName: 'Smith',
          dob: '1999-11-22',
        },
        {
          memberId: '',
          firstName: 'Bird',
          lastName: 'Person',
          dob: '2000-08-13',
        },
      ],
    };

    component.updateProfile();

    expect(component.rcvdProfile.memberId).toEqual('R-123');
  });
});
