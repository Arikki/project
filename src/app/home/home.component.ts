import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  error = '';
  constructor(
    private authService: AuthService,
    private homeService: HomeService,
    private router: Router
  ) {}
  isSignedUpUser = this.authService.isNewUser;

  ngOnInit(): void {}

  onLogout() {
    this.authService.logout();
  }
}
