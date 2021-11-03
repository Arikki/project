import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from '../app-routing.module';
import { AuthService } from '../auth/auth.service';
import { ClaimsComponent } from './claims/claims.component';

import { HomeComponent } from './home.component';
import { HomeService } from './home.service';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authServiceStub = {};

  let homeServiceStub = {};
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        CommonModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [HomeComponent, ClaimsComponent, UpdateProfileComponent],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: HomeService, useValue: homeServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
