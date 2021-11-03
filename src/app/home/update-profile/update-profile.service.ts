import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from '../profile.model';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class UpdateProfileService {
  constructor(private http: HttpClient) {}

  updateProfile(profile: Profile, isNewUser: boolean) {
    if (isNewUser) {
      console.log('Inside register');

      let currentAge = +moment(profile.dob, 'YYYY-MM-DD')
        .fromNow()
        .substring(0, 2);
      return this.http
        .post<Profile>('http://localhost:8081/profile/register', {
          firstName: profile.firstName,
          lastName: profile.lastName,
          dob: profile.dob,
          age: currentAge,
          address: profile.address,
          district: profile.district,
          state: profile.state,
          country: profile.country,
          email: profile.email,
          contactNum: profile.contactNum,
          panCrdNum: profile.panCrdNum,
          memberId: profile.memberId,
          dependents: [
            {
              memberId: profile.dependents[0].memberId,
              firstName: profile.dependents[0].firstName,
              lastName: profile.dependents[0].lastName,
              dob: profile.dependents[0].dob,
            },

            {
              memberId: profile.dependents[1].memberId,
              firstName: profile.dependents[1].firstName,
              lastName: profile.dependents[1].lastName,
              dob: profile.dependents[1].dob,
            },
          ],
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
    } else console.log('Inside update');
    {
      let currentAge = +moment(profile.dob, 'YYYY-MM-DD')
        .fromNow()
        .substring(0, 2);
      console.log(profile);
      return this.http
        .put<Profile>('http://localhost:8081/profile/update', {
          firstName: profile.firstName,
          lastName: profile.lastName,
          dob: profile.dob,
          age: currentAge,
          address: profile.address,
          district: profile.district,
          state: profile.state,
          country: profile.country,
          email: profile.email,
          contactNum: profile.contactNum,
          panCrdNum: profile.panCrdNum,
          memberId: profile.memberId,
          dependents: [
            {
              memberId: profile.dependents[0].memberId,
              firstName: profile.dependents[0].firstName,
              lastName: profile.dependents[0].lastName,
              dob: profile.dependents[0].dob,
            },

            {
              memberId: profile.dependents[1].memberId,
              firstName: profile.dependents[1].firstName,
              lastName: profile.dependents[1].lastName,
              dob: profile.dependents[1].dob,
            },
          ],
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

  getBasicDetails(email: string) {
    return this.http.get('http://localhost:8080/authDetails/' + email).pipe(
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
