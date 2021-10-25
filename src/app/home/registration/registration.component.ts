
import { Component, OnInit } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Country, State, City } from 'country-state-city';
import { AuthService } from "src/app/auth/auth.service";
import { User } from 'src/app/auth/user.model';
import { HomeService } from '../home.service';
import { Profile } from '../profile.model';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private registerService: RegistrationService,
    private homeService: HomeService,
    private router:Router
  ) {}

  countries: Array<any>;
  states: Array<any>;
  selectedCtryName: string;
  selectedStateName: string;
  districts: Array<any>;
  selectedCtryIso: string;
  // currUser:User;
  error: string;
  isRegistered: boolean = false;
  isError: boolean = false;
  profile: Profile;

  ngOnInit(): void {
    this.countries = this.homeService.getCountries();
    this.router.routeReuseStrategy.shouldReuseRoute=() => {
      return false;
    }
    //  this.countries = Country.getAllCountries();
    //  console.log(this.countries)
    //  this.authService.user.subscribe
    //  (user => this.currUser = user).unsubscribe() -- This was added to prepoulate the email id in registration page
  }

  onSubmit(form: NgForm) {
    console.log(form.value.dob);
    console.log(typeof form.value.dob);

    this.registerService.register(form).subscribe(
      (respData) => {
        //  console.log(respData);
        this.isRegistered = true;
        this.isError = false;
        this.profile = respData;
        console.log(this.profile);
      },
      (errorMsg) => {
        console.log(errorMsg);
        this.error = errorMsg;
        this.isError = true;
      }
    );
    //form.reset();
  }

  getStates() {
    this.states = this.homeService.getStates(
      this.selectedCtryName,
      this.countries
    );
  }

  getDistricts() {
    this.districts = this.homeService.getDistricts(
      this.selectedStateName,
      this.states
    );
  }
}
