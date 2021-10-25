import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Profile } from '../profile.model';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  constructor(private http: HttpClient) {}

  //memberId: string;

  register(form: NgForm) {
    //calculate age
    let currentAge = +moment(form.value.dob, 'YYYY-MM-DD')
      .fromNow()
      .substring(0, 2);
    return this.http
      .post<Profile>('http://localhost:8080/profile/register', {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        dob: form.value.dob,
        age: currentAge,
        address: form.value.address,
        district: form.value.district,
        state: form.value.state,
        country: form.value.country,
        emailId: form.value.email,
        contactNum: form.value.contactNumber,
        panCrdNum: form.value.panCardNum,
        memberId: '',
        dependents: [
          {
            memberId: '',
            firstName: form.value.firstNameDep1,
            lastName: form.value.lastNameDep1,
            dob: form.value.dobDep1
          },

          {
            memberId: '',
            firstName: form.value.firstNameDep2,
            lastName: form.value.lastNameDep2,
            dob: form.value.dobDep2
          }
        ]
      })
      .pipe(
        catchError((errorResp) => {
          console.log(errorResp);
          let errorMsg = 'An error occured!';
          if (!errorResp.error) {
            return throwError(errorMsg);
          }

          return throwError(errorResp.error.message);
        })
      );
  }
}
