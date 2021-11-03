import { TestBed } from '@angular/core/testing';
import { HomeService } from './home.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Profile } from './profile.model';
import { City, Country, State } from 'country-state-city';

describe('HomeService', () => {
  let homeService: HomeService;
  let httpTestingController: HttpTestingController;
  let memberProfile: Profile;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HomeService],
    });
    localStorage.clear();
    homeService = TestBed.inject(HomeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  it('should return a profile by specific email id', () => {
    memberProfile = {
      firstName: 'Rick',
      lastName: 'Sanchez',
      dob: '1996-05-04',
      age: 26,
      address: 'Seattle',
      district: 'Washington',
      email: 'ricky@gmail.com',
      state: 'Washington',
      country: 'United Stats',
      contactNum: '9874563210',
      panCrdNum: 'BRB123456',
      memberId: 'R-183',
      dependents: [
        {
          memberId: 'R-501',
          firstName: 'Morty',
          lastName: 'Smith',
          dob: '1999-11-22',
        },
        {
          memberId: 'R-135',
          firstName: 'Bird',
          lastName: 'Person',
          dob: '2000-08-13',
        },
      ],
    };

    homeService.getProfile('ricky@gmail.com').subscribe((profile) => {
      expect(profile).toBeTruthy;
      expect(profile.email).toBe('ricky@gmail.com');
    });

    const req = httpTestingController.expectOne(
      'http://localhost:8080/profile/find/ricky@gmail.com'
    );
    expect(req.request.method).toEqual('GET');
    req.flush(memberProfile);

    httpTestingController.verify();
  });

  it('should return all the countries', () => {
    let countries = Country.getAllCountries();
    expect(countries).toBeTruthy();
  });

  it(`should return states for a country's ISOCODE`, () => {
    let states = State.getStatesOfCountry('IN');
    expect(states).toBeTruthy();
  });

  it(`shoud return cities for a given ISO state code and ISO country code`, () => {
    let cities = City.getCitiesOfState('IN', 'TN');
    expect(cities).toBeTruthy();
  });
});
