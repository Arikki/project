import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { ClaimsComponent } from './home/claims/claims.component';
import { HomeComponent } from './home/home.component';

import { UpdateProfileComponent } from './home/update-profile/update-profile.component';


const routes: Routes = [
 
  {path : 'auth',component : AuthComponent},

  
  {path: 'home', component: HomeComponent,
  children: [
            {path: 'updateProfile', component:UpdateProfileComponent},
            {path:'claims',component:ClaimsComponent}
            ],

  canActivate:[AuthGuard]
},


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation:'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
