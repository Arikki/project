import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isSignUpMode = false;
  isLoginMode = true;
  error = '';
  showError = false;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {}

  loginMode() {
    this.isSignUpMode = this.showError = false;
    this.isLoginMode = true;
  }

  signUpMode() {
    console.log('Inside Sign up mode()');
    this.isSignUpMode = true;
    this.isLoginMode = this.showError = false;
  }

  validateDob(form:NgForm){
    console.log(form.value)
  }

  onSubmit(form: NgForm) {
    console.log('this.isSignUpMode=>' + this.isSignUpMode);
    console.log('this.isLoginMode=>' + this.isLoginMode);

    if (this.isSignUpMode) {
      console.log(form.value);

      this.authService.signUp(form).subscribe(
        (respData) => {
          console.log(respData);

          this.router.navigate(['/home', 'updateProfile']);
        },
        (errorMsg) => {
          console.log(errorMsg);
          this.error = errorMsg;
          this.showError = true;
        }
      );
    }

    if (this.isLoginMode) {
      console.log(form.value);
      this.authService.login(form).subscribe(
        (respData) => {
          console.log(respData);

          this.router.navigate(['/home', 'claims']);
        },
        (errorMsg) => {
          console.log(errorMsg);
          this.error = errorMsg;
          this.showError = true;
        }
      );
    }
  }
}
