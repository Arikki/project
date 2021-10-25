import { Component, OnDestroy, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service'
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  error='';
  constructor(private authService:AuthService, private homeService:HomeService) { }

  ngOnInit(): void {  }

  isSignedUpUser = this.authService.isNewUser; // this is to decide whether to display the register user 

  onLogout(){
    this.authService.logout()
}

}
