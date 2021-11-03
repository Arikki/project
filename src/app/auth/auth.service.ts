import { EventEmitter, Injectable } from '@angular/core';
import { AbstractControl, NgForm, ValidatorFn } from '@angular/forms';
import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject, Observable } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { UserDetail } from './userDetail.model';


interface AuthResponseData {
  email: string;
  token: string;
  tokenExpiresIn: Date;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);

  token: string = null;

  isNewUser = false;
  timeLengthExceeded: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(form: NgForm): Observable<AuthResponseData> {
    const userDetail = new UserDetail(
      form.value.firstName,
      form.value.lastName,
      form.value.dateOfBirth,
      form.value.email
    );
    localStorage.setItem('userDetail', JSON.stringify(userDetail));

    return this.http
      .post<AuthResponseData>('http://localhost:8080/signup', {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        dob: form.value.dateOfBirth,

        email: form.value.email,
        password: form.value.password,
      })
      .pipe(
        catchError((errorResp) => {
          let errorMsg = 'An error occured!';
          if (!errorResp.error) {
            return throwError(errorMsg);
          }

          errorMsg = errorResp.error.message;

          return throwError(errorMsg);
        }),
        tap((respData) => {
          console.log('Inside tap=>' + respData);
          this.isNewUser = true;
          const expirationDate = new Date(
            new Date().getTime() + +respData.tokenExpiresIn
          );
          const user = new User(respData.email, respData.token, expirationDate);

          this.user.next(user);
          this.autoLogout(+respData.tokenExpiresIn);
          localStorage.setItem('userInfo', JSON.stringify(user));
        })
      );
  }

  login(form: NgForm) {
    return this.http
      .post<AuthResponseData>('http://localhost:8080/login', {
        email: form.value.email,
        password: form.value.password,
      })
      .pipe(
        catchError((errorResp) => {
          console.log(errorResp);
          let errorMsg = 'An error occured!';
          if (!errorResp.error) {
            console.log('If');
            return throwError(errorMsg);
          }

          errorMsg = errorResp.error.message;

          return throwError(errorMsg);
        }),
        tap((respData) => {
          const expirationDate = new Date(
            new Date().getTime() + +respData.tokenExpiresIn
          );
          console.log('expiration date of token is ' + expirationDate);
          const user = new User(respData.email, respData.token, expirationDate);
          console.log(user);
          this.user.next(user);
          this.autoLogout(+respData.tokenExpiresIn);
          localStorage.setItem('userInfo', JSON.stringify(user));
        })
      );
  }

  autoLogin() {
    const savedUserData: {
      email: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('userInfo'));

    if (!savedUserData) {
      return;
    }

    const loadedUser = new User(
      savedUserData.email,
      savedUserData._token,
      new Date(savedUserData._tokenExpirationDate)
    );

    console.log(
      'loadeduser toke expiration date' +
        new Date(savedUserData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      this.autoLogout(
        new Date(savedUserData._tokenExpirationDate).getTime() -
          new Date().getTime()
      );
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userDetail');
    this.router.navigate(['/auth']).then(() => {
      window.location.reload();
    });

    if (this.timeLengthExceeded) {
      this.timeLengthExceeded = null;
    }
  }

  autoLogout(tokenAliveDuration: number) {
    console.log('in autoLogout ' + tokenAliveDuration);
    this.timeLengthExceeded = setTimeout(
      () => this.logout(),
      tokenAliveDuration
    );
  }

 
}
