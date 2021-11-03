import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UpdateProfileService } from './update-profile.service';
import { Profile } from '../profile.model';

describe('updateProfileService', () => {
  let httpTestingController: HttpTestingController;
  let updateProfileSvc: UpdateProfileService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UpdateProfileService],
    });
    localStorage.clear();
    updateProfileSvc = TestBed.inject(UpdateProfileService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should update profile successfully', () => {
    const dataToApi = <Profile>{
      firstName: 'Rick',
      lastName: 'Sanchez',
      dob: '1996-05-04',
      age: 25,
      address: 'Seattle',
      district: 'Washington',
      state: 'Washington',
      country: 'United States',
      email: 'ricky@gmail.com',
      contactNum: '0123456789',
      panCrdNum: 'BRB123456',
      memberId: '',
      dependents: [
        {
          memberId: '',
          firstName: 'Morty',
          lastName: 'Smith',
          dob: '1999-11-22',
        },
        {
          memberId: '',
          firstName: 'Bird',
          lastName: 'Person',
          dob: '2000-08-13',
        },
      ],
    };

    const replyData = <Profile>{
      firstName: 'Rick',
      lastName: 'Sanchez',
      dob: '1996-05-04',
      age: 25,
      address: 'Seattle',
      district: 'Washington',
      state: 'Washington',
      country: 'United States',
      email: 'ricky@gmail.com',
      contactNum: '0123456789',
      panCrdNum: 'BRB123456',
      memberId: '',
      dependents: [
        {
          memberId: '',
          firstName: 'Morty',
          lastName: 'Smith',
          dob: '1999-11-22',
        },
        {
          memberId: '',
          firstName: 'Bird',
          lastName: 'Person',
          dob: '2000-08-13',
        },
      ],
    };

    updateProfileSvc.updateProfile(dataToApi, false).subscribe((profile) => {
      expect(profile).toBeTruthy();
    });

    const req = httpTestingController.expectOne(
      `http://localhost:8080/profile/update`
    );

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(dataToApi);

    req.flush(replyData);
    httpTestingController.verify();
  });

  it('should complete new profile successfully', () => {
    const dataToApi = <Profile>{
      firstName: 'Rick',
      lastName: 'Sanchez',
      dob: '1996-05-04',
      age: 25,
      address: 'Seattle',
      district: 'Washington',
      state: 'Washington',
      country: 'United States',
      email: 'ricky@gmail.com',
      contactNum: '0123456789',
      panCrdNum: 'BRB123456',
      memberId: '',
      dependents: [
        {
          memberId: '',
          firstName: 'Morty',
          lastName: 'Smith',
          dob: '1999-11-22',
        },
        {
          memberId: '',
          firstName: 'Bird',
          lastName: 'Person',
          dob: '2000-08-13',
        },
      ],
    };

    const replyData = <Profile>{
      firstName: 'Rick',
      lastName: 'Sanchez',
      dob: '1996-05-04',
      age: 25,
      address: 'Seattle',
      district: 'Washington',
      state: 'Washington',
      country: 'United States',
      email: 'ricky@gmail.com',
      contactNum: '0123456789',
      panCrdNum: 'BRB123456',
      memberId: 'R-123',
      dependents: [
        {
          memberId: 'R-234',
          firstName: 'Morty',
          lastName: 'Smith',
          dob: '1999-11-22',
        },
        {
          memberId: 'R-456',
          firstName: 'Bird',
          lastName: 'Person',
          dob: '2000-08-13',
        },
      ],
    };

    updateProfileSvc.updateProfile(dataToApi, true).subscribe((profile) => {
      expect(profile.memberId).toBeTruthy();
      expect(profile.dependents[0].memberId).toBeTruthy();
      expect(profile.dependents[1].memberId).toBeTruthy();
    });

    const req = httpTestingController.expectOne(
      `http://localhost:8080/profile/register`
    );

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(dataToApi);

    req.flush(replyData);
    httpTestingController.verify();
  });
});
