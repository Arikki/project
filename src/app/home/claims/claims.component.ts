import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Claim } from '../claim.model';
import { HomeService } from '../home.service';
import { Profile } from '../profile.model';
import { ClaimsService } from './claims.service';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css'],
})
export class ClaimsComponent implements OnInit {
  email: string;
  rcvdProfile: Profile = null;
  isUpdated: boolean = false;
  isError: boolean = false;

  memberDetails: {
    memberId: string;
    firstName: string;
    lastName: string;
    dob: string;
  }[] = null;
  selectedMemberId: string;
  selectedFirstName: string;
  selectedLastName: string;
  selectedDob: string;
  error: string;
  memberId: string[] = null;
  showDetails: boolean = false;
  isFoundMemberId: boolean = false;
  claimDetails: Claim;
  selectedMember: {
    memberId: string;
    firstName: string;
    lastName: string;
    dob: string;
  };

  isSubmitted: boolean = false;
  constructor(
    private homeService: HomeService,
    private claimsService: ClaimsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.getProfile();
  }

  onFocus() {
    this.isError = false;
    this.error = '';
  }

  getProfile() {
    const savedUserData: {
      email: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('userInfo'));

    this.homeService.getProfile(savedUserData.email).subscribe(
      (respData) => {
        console.log(respData);
        this.rcvdProfile = respData;

        this.populateMemberDetails();
      },
      (errorMsg) => {
        console.log(errorMsg);
        if (errorMsg === 'Email not found') {
          this.router.navigate(['/home', 'updateProfile']);
        } else {
          this.isError = true;
          this.error = errorMsg;
        }
      }
    );
  }

  onSubmit(form: NgForm) {
    console.log('Inside submit');

    this.claimsService
      .submitClaim(this.rcvdProfile.email, form, this.selectedMember)
      .subscribe(
        (respData) => {
          console.log(respData);
          this.claimDetails = respData;

          this.isSubmitted = true;
        },
        (errorMsg) => {
          console.log(errorMsg);
          this.isError = true;
          this.error = errorMsg;
        }
      );
  }

  prePopulate() {
    this.selectedMember = this.memberDetails.find(
      (member) => member.memberId === this.selectedMemberId
    );

    console.log(this.selectedMember);
    this.selectedFirstName = this.selectedMember.firstName;
    this.selectedLastName = this.selectedMember.lastName;
    this.selectedDob = this.selectedMember.dob;

    this.showDetails = true;
  }

  populateMemberDetails() {
    this.memberDetails = new Array(
      {
        memberId: this.rcvdProfile.memberId,
        firstName: this.rcvdProfile.firstName,
        lastName: this.rcvdProfile.lastName,
        dob: this.rcvdProfile.dob,
      },
      {
        memberId: this.rcvdProfile.dependents[0].memberId,
        firstName: this.rcvdProfile.dependents[0].firstName,
        lastName: this.rcvdProfile.dependents[0].lastName,
        dob: this.rcvdProfile.dependents[0].dob,
      },
      {
        memberId: this.rcvdProfile.dependents[1].memberId,
        firstName: this.rcvdProfile.dependents[1].firstName,
        lastName: this.rcvdProfile.dependents[1].lastName,
        dob: this.rcvdProfile.dependents[1].dob,
      }
    );
    console.log(this.memberDetails);
  }
}
