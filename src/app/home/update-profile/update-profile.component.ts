import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { HomeService } from '../home.service';
import { Profile } from '../profile.model';
import { UpdateProfileService } from './update-profile.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  email:string;
   countries:Array<any>;
states:Array<any>;
selectedCtryName:string;
selectedStateName:string;
districts:Array<any>;
savedProfile:Profile= null;
  constructor(private updateProfileSvc:UpdateProfileService, private homeService:HomeService, private router:Router) { }
  rcvdProfile:Profile = null;
  isUpdated:boolean=false;
  isError:boolean=false;
  error:string;
  ngOnInit(): void {
    this.countries = this.homeService.getCountries();
    this.router.routeReuseStrategy.shouldReuseRoute=() => {
      return false;
    }
    // console.log("Counties ==>" + Country.getAllCountries())
    // console.log("States ==>" + State.getAllStates())
    // console.log("Cities ==>" + City.getAllCities())
  }

  // onSubmit(form:NgForm){

  // }

  getProfile(){
if (!this.rcvdProfile){
  
  this.homeService.getProfile(this.email).subscribe(
    respData => {
    console.log(respData);
     this.rcvdProfile=respData;
    // this.savedProfile = respData;
    this.getStates();
    this.getDistricts();
      
    },
    errorMsg => {
      console.log(errorMsg);
      this.isError = true;
      this.error = errorMsg;

    }
   );
}
  }

  onFocus(){
    this.isError = false;
    this.error = ""
  }

  getStates(){
  
 
      this.states =this.homeService.getStates(this.rcvdProfile.country, this.countries);
      
    }
    
    getDistricts(){
   
      this.districts = this.homeService.getDistricts(this.rcvdProfile.state,this.states);
    }

    updateProfile(){

      // console.log("Inside Update profile")

      // console.log("this.rcvdprofile.dob==>"+this.rcvdProfile.dob )
      // console.log("this.savedprofile.dob==>"+this.savedProfile.dob )
      // if (this.rcvdProfile.dob != this.savedProfile.dob){
      //   console.log("dob updated")
      // }

      this.updateProfileSvc.updateProfile(this.rcvdProfile).subscribe(
        respData => {
          console.log(respData);
         
            this.isUpdated=true;
            this.isError=false;
          },
          errorMsg => {
            console.log(errorMsg);
            this.error = errorMsg;
      this.isError = true;
          }
      )

    }

}
