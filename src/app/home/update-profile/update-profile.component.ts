import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UserDetail } from 'src/app/auth/userDetail.model';

import { HomeService } from '../home.service';
import { Profile } from '../profile.model';
import { UpdateProfileService } from './update-profile.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
})
export class UpdateProfileComponent implements OnInit, OnDestroy {
  email: string;
  countries: Array<any>;
  states: Array<any>;
  selectedCtryName: string;
  selectedStateName: string;
  districts: Array<any>;
  savedData: UserDetail = null;
  rcvdProfile: Profile;
  isNewUser: boolean = false;
  doNotDisplay: boolean = true;
  isLoaded: boolean = false;
  savedUserDetail: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
  } = JSON.parse(localStorage.getItem('userDetail'));
  savedUserInfo: {
    email: string;
    _token: string;
    _tokenExpirationDate: Date;
  } = JSON.parse(localStorage.getItem('userInfo'));
  constructor(
    private updateProfileSvc: UpdateProfileService,
    private homeService: HomeService,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnDestroy(): void {}

  isUpdated: boolean = false;
  isError: boolean = false;
  error: string;

  ngOnInit(): void {
    this.countries = this.homeService.getCountries();

    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    console.log('this.homeservice ==>' + this.homeService.needBasicDetail);

    if (this.homeService.needBasicDetail) {
      this.getBasicDetail();
    } else {
      this.getProfile();
    }
  }

  doNotDisp() {
    this.doNotDisplay = false;
  }

  getBasicDetail() {
    this.homeService.getBasicDetails(this.savedUserInfo.email).subscribe(
      (respData) => {
        this.homeService.needBasicDetail = false;
        console.log(respData);

        this.rcvdProfile = {
          firstName: respData.firstName,
          lastName: respData.lastName,
          dob: respData.dob,
          age: 0,
          address: '',
          district: '',
          state: '',
          country: '',
          email: respData.email,
          contactNum: '',
          panCrdNum: '',
          memberId: '',
          dependents: [
            {
              memberId: '',
              firstName: '',
              lastName: '',
              dob: '',
            },
            {
              memberId: '',
              firstName: '',
              lastName: '',
              dob: '',
            },
          ],
        };

        this.isNewUser = this.isLoaded = true;
      },
      (errorMsg) => {
        console.log(errorMsg);
        this.isError = true;
        this.error = errorMsg;
      }
    );
  }

  getProfile() {
    console.log('is new user ==> ' + this.authService.isNewUser);
    this.isNewUser = this.authService.isNewUser;
    if (this.isNewUser) {
      console.log('Inside Saved user data if');
      console.log(this.savedUserDetail);

      this.rcvdProfile = {
        firstName: this.savedUserDetail.firstName,
        lastName: this.savedUserDetail.lastName,
        dob: this.savedUserDetail.dateOfBirth,
        age: 0,
        address: '',
        district: '',
        state: '',
        country: '',
        email: this.savedUserDetail.email,
        contactNum: '',
        panCrdNum: '',
        memberId: '',
        dependents: [
          {
            memberId: '',
            firstName: '',
            lastName: '',
            dob: '',
          },
          {
            memberId: '',
            firstName: '',
            lastName: '',
            dob: '',
          },
        ],
      };

      console.log('name saved in cookie =>' + this.rcvdProfile.firstName);
      this.isLoaded = true;
    } else {
      console.log('inside of getprofile' + this.savedUserInfo.email);
      this.homeService.getProfile(this.savedUserInfo.email).subscribe(
        (respData) => {
          console.log(respData);
          this.rcvdProfile = respData;

          this.getStates();
          this.getDistricts();
          this.isLoaded = true;
        },
        (errorMsg) => {
          console.log(errorMsg);

          if (errorMsg === 'Email not found') {
            console.log(
              'Inside update profile comp getProfile() email not found case'
            );

            this.getBasicDetail();
          } else {
            this.isError = true;
            this.error = errorMsg;
          }
        }
      );
    }
  }

  onFocus() {
    this.isError = false;
    this.error = '';
  }

  getStates() {
    this.states = this.homeService.getStates(
      this.rcvdProfile.country,
      this.countries
    );
  }

  getDistricts() {
    this.districts = this.homeService.getDistricts(
      this.rcvdProfile.state,
      this.states
    );
  }

  updateProfile() {
    console.log(this.rcvdProfile);

    this.updateProfileSvc
      .updateProfile(this.rcvdProfile, this.isNewUser)
      .subscribe(
        (respData) => {
          console.log(respData);
          this.rcvdProfile = respData;
          this.isUpdated = true;
          this.isError = false;

          if (this.isNewUser) {
            this.isNewUser = false;
            this.authService.isNewUser = false;
          }
        },
        (errorMsg) => {
          console.log(errorMsg);
          this.isError = true;
          this.isUpdated = false;
          this.error = errorMsg;
        }
      );
  }
}
