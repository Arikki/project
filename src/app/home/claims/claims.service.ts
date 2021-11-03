import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Claim } from '../claim.model';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
interface SelectedMember {
  memberId: string;
  firstName: string;
  lastName: string;
  dob: string;
}
@Injectable({ providedIn: 'root' })
export class ClaimsService {
  constructor(private http: HttpClient) {}

  submitClaim(email: string, form: NgForm, selectedMember: SelectedMember) {
    return this.http
      .post<Claim>('http://localhost:8082/claims', {
        email: email,
        memberId: selectedMember.memberId,
        firstName: selectedMember.firstName,
        lastName: selectedMember.lastName,
        dob: selectedMember.dob,
        admissionDate: form.value.admissionDate,
        dischargeDate: form.value.dischargeDate,
        providerName: form.value.providerName,
        billAmount: form.value.billAmount,
        claimNumber: '',
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
