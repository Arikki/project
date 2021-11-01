import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppRoutingModule } from '../app-routing.module';
import { AppModule } from '../app.module';
import { ClaimsComponent } from '../home/claims/claims.component';
import { HomeComponent } from '../home/home.component';

import { UpdateProfileComponent } from '../home/update-profile/update-profile.component';

import { AuthComponent } from './auth.component';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UserDetail } from './userDetail.model';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let authService:any;
  let el : DebugElement;
  let router:Router;
  let testRoutes: Routes = [
 
    {path : 'auth',component : AuthComponent},
  
    
    {path: 'home', component: HomeComponent,
    children: [
              {path: 'updateProfile', component:UpdateProfileComponent},
              {path:'claims',component:ClaimsComponent}
              ],
  
    canActivate:[AuthGuard]
  },
  
 
    
  ];

  let authServiceStub = {
    signUp(){
      const replyData = {
        "email":"rick@gmail.com",
        "token":"sampleToken",
        "tokenExpiresIn":"3600000"
    }
    return of(replyData);
    },

    login(){
      const replyData = {
        "email":"rick@gmail.com",
        "token":"sampleToken",
        "tokenExpiresIn":"3600000"
    }
    return of(replyData);
    }
  }

  beforeEach(async () => {
    // const authServiceSpy = jasmine.createSpyObj('AuthService', ['login','signUp'])
    //  const routerMock = {navigator:jasmine.createSpy('navigate')}
    await TestBed.configureTestingModule({
      imports:[
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        CommonModule, 
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ AuthComponent ],
      providers:[
        // {provide:AuthService, useValue:authServiceSpy},
        //  { provide: Router, useValue: routerMock }
        {provide:AuthService, useValue:authServiceStub},
        

      ],
      schemas:[
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
      ]
     
    })
    .compileComponents();
  });

  beforeEach(() => {
    localStorage.clear()
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
   
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 it('should route to  update profile page for new user',()=>{
    const inputForm:NgForm=<NgForm>{
      value:{
           
  "firstName":"Rick",
  "lastName":"Sanchez",
  "dateOfBirth":"1996-11-04",
"email": "rick@gmail.com",
"password": "timeLapse"
      }
  }

  const replyData = {
    "email":"rick@gmail.com",
    "token":"sampleToken",
    "tokenExpiresIn":"3600000"
}
component.isSignUpMode = true;
component.isLoginMode = false;
const navigateSpy = spyOn(router, 'navigate');
    component.onSubmit(inputForm);
// authService.signUp();
expect(navigateSpy).toHaveBeenCalledWith(['/home', 'updateProfile']);
//  authService.signUp.and.returnValue(of(replyData));
//  const form: any = debugElement.children[0].injector.get(NgForm)
//  console.log("In auth.comp.spec.ts")
//  console.log(form.value)


  })

it('should route to claims page for existing user',()=>{
    const inputForm:NgForm=<NgForm>{
      value:{
"email": "rick@gmail.com",
"password": "timeLapse"
      }
  }

  const replyData = {
    "email":"rick@gmail.com",
    "token":"sampleToken",
    "tokenExpiresIn":"3600000"
}
component.isSignUpMode = false;
component.isLoginMode = true;
const navigateSpy = spyOn(router, 'navigate');
    component.onSubmit(inputForm);
authService.login();
fixture.detectChanges()


expect(navigateSpy).toHaveBeenCalledWith(['/home', 'claims']);

//  authService.signUp.and.returnValue(of(replyData));
// fixture.detectChanges();



  })

  afterEach(()=>{
    localStorage.clear();
  })



});

