import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, exhaustMap, map, take } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

import { City, Country, State } from 'country-state-city';
import { Profile } from './profile.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class HomeService {
  needBasicDetail: boolean = false;

  selectedCtryIso: string;
  constructor(private http: HttpClient) {}

  getCountries() {
    return Country.getAllCountries();
  }

  getStates(ctryName: string, countries: Array<any>) {
    console.log('ctryName ==> ' + ctryName);
    let country = countries.find((ctry) => ctry.name == ctryName);
    console.log(country);
    this.selectedCtryIso = country.isoCode;
    return State.getStatesOfCountry(this.selectedCtryIso);
  }

  getDistricts(stateName: string, states: Array<any>) {
    let state = states.find((state) => state.name == stateName);
    return City.getCitiesOfState(this.selectedCtryIso, state.isoCode);
  }

  getProfile(email: string) {
    const url = 'http://localhost:8081/profile/find/' + email;
    return this.http.get<Profile>(url).pipe(
      catchError((errorResp) => {
        let errorMsg = 'An error occured!';
        if (!errorResp.error) {
          return throwError(errorMsg);
        }

        errorMsg = errorResp.error.message;
        if (errorMsg.includes('Email not found')) {
          console.log('Inside if condition of getprofile()');
          this.needBasicDetail = true;
        }

        return throwError(errorMsg);
      })
    );
  }

  getBasicDetails(email: string) {
    const url = 'http://localhost:8080/basicDetails/' + email;
    return this.http.get<Profile>(url).pipe(
      catchError((errorResp) => {
        let errorMsg = 'An error occured!';
        if (!errorResp.error) {
          return throwError(errorMsg);
        }

        errorMsg = errorResp.error.message;

        return throwError(errorMsg);
      })
    );
  }
}
