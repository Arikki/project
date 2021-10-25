export class Profile{
    firstName:string;
    lastName:string;
    dob:string;
    age:number;
    address:string;
    district:string;
    state:string;
    country:string;
    emailId:string;
    contactNum:string;
    panCrdNum:string;
    memberId:string;
    dependents:
    [{
     memberId:string;
     firstName:string;
     lastName:string;
    dob:string;
    },
    
    {
     memberId:string;
     firstName:string;
     lastName:string;
    dob:string;
    }]
}