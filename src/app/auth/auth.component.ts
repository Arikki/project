import { Component, OnInit } from '@angular/core';
import {  NgForm } from '@angular/forms';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isSignUpMode = false;
  isLoginMode = true;
 error='';
 showError =false;

  // constructor(private http: HttpClient){}
  constructor(private authService: AuthService, private router:Router){}
  ngOnInit(): void {
  }

  loginMode(){
    
    this.isSignUpMode = false;
    this.isLoginMode =true;
    this.showError = false;

  }

  signUpMode(){
    this.isSignUpMode = true;
    this.isLoginMode =false;
    this.showError = false;

  }

  onSubmit(form:NgForm){
    
    
    
    // const payLoad :{userName:string;password:string} = { 'userName':'abc@gmail.com', 'password':'123456789'};
    //console.log(form.value.email)
    // this.http.post('http://localhost:8082/auth',form.value)
    //           .subscribe(responseData => {
    //             console.log(responseData);
    //           });
    // form.reset()

    if(this.isSignUpMode){
      console.log(form.value);
      
      this.authService.signUp(form).subscribe(
       respData => {
         console.log(respData);
         this.router.navigate(['/home']);
       },
       errorMsg => {
         console.log(errorMsg);
    this.error = errorMsg;
    this.showError = true;
       }
      );
      form.reset();
    }

    if(this.isLoginMode){
      console.log(form.value);
      this.authService.login(form).subscribe(
        respData => {
          console.log(respData);
          this.router.navigate(['/home']);
        },
        errorMsg => {
          console.log(errorMsg);
     this.error = errorMsg;
     this.showError = true;
        }
       );
       form.reset();
     }
    }

  }



