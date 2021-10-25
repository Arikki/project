import { HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { NgForm } from "@angular/forms";
import { Profile } from "../profile.model";
import { RegistrationService } from "./registration.service";


fdescribe('RegistrationService', ()=>{

    let regService:RegistrationService;
    let httpTestingController:HttpTestingController;
    let memberProfile:Profile;
   let testForm:NgForm;

    beforeEach(()=>{
        TestBed.configureTestingModule({
            imports:[HttpClientTestingModule],
            providers:[
                RegistrationService
              
            ]
        });

        regService = TestBed.inject(RegistrationService);
        httpTestingController = TestBed.inject(HttpTestingController);
         testForm = <NgForm>{
            value: {
                "firstName":"Rick",
                "lastName":"Sanchez",
                "dob":"1996-05-04",
                "address":"Seattle",
                "district":"Washington",
                "email":"ricky@gmail.com",
                "state":"Washington",
                "country":"United States",
                "contactNumber":"9874563210",
                "panCardNum":"BRB123456",
                "firstNameDep1":"Morty",
                "lastNameDep1":"Smith",
                "dobDep1":"1999-11-22",
                "firstNameDep2":"Bird",
                "lastNameDep2":"Person",
                "dobDep2":"2000-08-13"
               
            }
        };
    
    });

    it(`should register a profile`, ()=>{
     
      
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
                "contactNum":"9874563210",
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
      

        const replyData = <Profile>{
           
                "firstName":"Rick",
                "lastName":"Sanchez",
                "dob":"1996-05-04",
                "age":25,
                "address":"Seattle",
                "district":"Washington",
                "emailId":"ricky@gmail.com",
                "state":"Washington",
                "country":"United States",
                "contactNum":"9874563210",
                "panCrdNum":"BRB123456",
                "memberId":"R-183",
                "dependents":
                [
                {
                "memberId":"R-501",
                "firstName":"Morty",
                "lastName":"Smith",
                "dob":"1999-11-22"
                },
                {
                "memberId":"R-135",
                "firstName":"Bird",
                "lastName":"Person",
                "dob":"2000-08-13"
                }
                ]
            }
     

        regService.register(testForm).subscribe(
            profile => {
                expect(profile.memberId).toBeTruthy();
                expect(profile.dependents[0].memberId).toBeTruthy();
                expect(profile.dependents[1].memberId).toBeTruthy();
                
            }
        );

        const req = httpTestingController.expectOne(`http://localhost:8080/profile/register`);

        expect (req.request.method).toEqual("POST");
        expect (req.request.body).toEqual(dataToApi);

        req.flush(replyData);
        httpTestingController.verify();

    });
   
    // it ("should give an error if the emailId already exists",()=>{

    //     regService.register(testForm).subscribe(
    //         ()=> fail ("Reg svc should have failed"),
            
    //         (error:HttpErrorResponse) => {
    //             expect(error.status).toBe(400)
                
    //         }
    //     );

    //     const req = httpTestingController.expectOne(`http://localhost:8080/profile/register`);

    //     expect (req.request.method).toEqual("POST");

    //     req.flush('email already exists',{"status":400, "statusText": "This email is already in use"})
        
    //      httpTestingController.verify();
    // }
    // );

});
