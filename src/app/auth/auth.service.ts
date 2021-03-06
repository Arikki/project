import { EventEmitter, Injectable } from "@angular/core";
import { NgForm } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {throwError, Subject,BehaviorSubject } from 'rxjs';
import {User} from './user.model';
import { Router } from "@angular/router";

interface AuthResponseData{
    type :string;
    email:string;
    token:string;
    tokenExpiresIn:Date;
    registered?:boolean; // ? indicates this field is optional in the api's response
    }

@Injectable({providedIn:'root'})
export class AuthService{

    user = new BehaviorSubject<User>(null); // BehaviorSubject is a kind of event emitter; (<User>{}) - empty object

    token : string= null;

    isNewUser = false;
    timeLengthExceeded:any;
    
constructor(private http: HttpClient, private router:Router){

}



signUp(form:NgForm){
    
    
    
  // return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBWgPVmI3C8eSCuSmnuo7evst-r-sbtEvA',
//   
//     {
//      email: form.value.email,
//      password: form.value.password,
//      returnSecureToken: true
//     }
    
//      ).pipe(catchError(     //Pipe is used to operate on observable and return an observable.
//          errorResp => {
//              let errorMsg = "An error occured!";
//              if(!errorResp.error || !errorResp.error.error){
//                 return throwError (errorMsg);
//              }
//              switch (errorResp.error.error.message){
//                  case 'EMAIL_EXISTS':
//                      errorMsg = 'Email Already Exists!';
//              }
//              return throwError (errorMsg);
//          }
//      ));

  return this.http.post<AuthResponseData>('http://localhost:8080/signup',
    {
        type:"signup",
        firstName:form.value.firstName,
        lastName:form.value.lastName,
     email: form.value.email,
     password: form.value.password
    
    }
    
     ).pipe(catchError(     //Pipe is used to operate on observable and return an observable.
         errorResp => {
            let errorMsg = "An error occured!";
            if(!errorResp.error){
                console.log("If")
                return throwError (errorMsg);
             }

            errorMsg = errorResp.error.message;
             
            return throwError (errorMsg);
         }
     ), tap (respData => {
         this.isNewUser = true;
         const expirationDate = new Date (new Date().getTime()+ +respData.tokenExpiresIn);
         const user = new User (respData.email, respData.token, expirationDate);
         
         this.user.next(user);
         this.autoLogout(+respData.tokenExpiresIn);
         localStorage.setItem('userInfo',JSON.stringify(user))
     }));



}

login(form:NgForm){
    // return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBWgPVmI3C8eSCuSmnuo7evst-r-sbtEvA', 
    // {
    //     email: form.value.email,
    //     password: form.value.password,
    //     returnSecureToken: true
    // }).pipe(catchError(
    //     errorResp => {
    //         let errorMsg = "An error occured!";
    //         if(!errorResp.error || !errorResp.error.error){
    //             return throwError (errorMsg);
    //          }
    //          switch (errorResp.error.error.message){
              
    //             case 'INVALID_PASSWORD':
    //                 errorMsg = "Invalid Password!"
    //         }
    //         return throwError (errorMsg);
    //     }
    // ));

    return this.http.post<AuthResponseData>('http://localhost:8080/login',
    {
        type: "login",
        email: form.value.email,
        password: form.value.password
    }).pipe(catchError(
        errorResp => {
            console.log(errorResp)
                    let errorMsg = "An error occured!";
                    if(!errorResp.error){
                        console.log("If")
                        return throwError (errorMsg);
                     }

                    errorMsg = errorResp.error.message;
                     
                    return throwError (errorMsg);
                }
    ),tap (respData => {
        const expirationDate = new Date (new Date().getTime()+ +respData.tokenExpiresIn);
        console.log('expiration date of token is ' + expirationDate)
        const user = new User (respData.email, respData.token, expirationDate);
        console.log(user);
       this.user.next(user);
       this.autoLogout(+respData.tokenExpiresIn);
       localStorage.setItem('userInfo',JSON.stringify(user))
    }));
}

autoLogin(){
    const savedUserData:{
        email:string;
        _token:string;
        _tokenExpirationDate:Date
    } = JSON.parse(localStorage.getItem('userInfo'));

    if (!savedUserData){
        return;
    }

    const loadedUser = new User(savedUserData.email,savedUserData._token, new Date(savedUserData._tokenExpirationDate));
    
    console.log ('loadeduser toke expiration date' + new Date(savedUserData._tokenExpirationDate));

    if(loadedUser.token){
        this.user.next(loadedUser);
        this.autoLogout((new Date(savedUserData._tokenExpirationDate).getTime())-(new Date().getTime()));
    }

}

logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userInfo');
    if (this.timeLengthExceeded){
        this.timeLengthExceeded =null;
    }
}

autoLogout(tokenAliveDuration:number){
    console.log('in autoLogout '+tokenAliveDuration )
 this.timeLengthExceeded = setTimeout(()=>
  this.logout(),tokenAliveDuration)
}

//If the two error handling methods has to be merged, then refer 297 Login Error Handling

}