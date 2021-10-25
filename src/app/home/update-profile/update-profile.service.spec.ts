import { TestBed } from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing"
import { UpdateProfileService } from "./update-profile.service";
import { Profile } from "../profile.model";

fdescribe('updateProfileService',()=>{

    let httpTestingController:HttpTestingController;
    let updateProfileSvc:UpdateProfileService;
    beforeEach(()=>{
        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule],
            providers:[
                UpdateProfileService
              
            ]
        });

        updateProfileSvc = TestBed.inject(UpdateProfileService);
        httpTestingController = TestBed.inject(HttpTestingController);

    
    });

    it('should update profile successfully', ()=>{

        const dataToApi =<Profile>{
             
            "firstName":'Rick',
            "lastName":"Sanchez",
            "dob":"1996-05-04",
            "age":25,
            "address":"Seattle",
            "district":"Washington",
            "state":"Washington",
            "country":"United States",
            "emailId":"ricky@gmail.com",
            "contactNum":"0123456789",
            "panCrdNum":"BRB123456",
            "memberId":"",
            "dependents":
            [
            {
            "memberId":"",
            "firstName":"Morty",
            "lastName":"Smith",
            "dob":"1999-11-22"
            },
            {
            "memberId":"",
            "firstName":"Bird",
            "lastName":"Person",
            "dob":"2000-08-13"
            }
            ]
        };

        const replyData =<Profile>{
             
            "firstName":'Rick',
            "lastName":"Sanchez",
            "dob":"1996-05-04",
            "age":25,
            "address":"Seattle",
            "district":"Washington",
            "state":"Washington",
            "country":"United States",
            "emailId":"ricky@gmail.com",
            "contactNum":"0123456789",
            "panCrdNum":"BRB123456",
            "memberId":"",
            "dependents":
            [
            {
            "memberId":"",
            "firstName":"Morty",
            "lastName":"Smith",
            "dob":"1999-11-22"
            },
            {
            "memberId":"",
            "firstName":"Bird",
            "lastName":"Person",
            "dob":"2000-08-13"
            }
            ]
        };

        updateProfileSvc.updateProfile(dataToApi).subscribe(
            profile => {
                expect(profile).toBeTruthy();
                
            }
        )

        
        const req = httpTestingController.expectOne(`http://localhost:8080/profile/update`);

        expect (req.request.method).toEqual("PUT");
        expect (req.request.body).toEqual(dataToApi);

        req.flush(replyData);
        httpTestingController.verify();
    })


});