import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AuthInterceptorService } from './auth/auth.interceptor';

import { ClaimsComponent } from './home/claims/claims.component';
import { UpdateProfileComponent } from './home/update-profile/update-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,

    HomeComponent,

    ClaimsComponent,
    UpdateProfileComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
