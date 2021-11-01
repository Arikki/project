import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import {map} from "rxjs/operators";
import { User } from "./user.model";

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate{

    constructor(private authService:AuthService, private router:Router){}

    currUser:User = null;
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean 
    | UrlTree> | Promise<boolean | UrlTree> {
        // return this.authService.user.pipe(
        //     map(
        //         user => {
        //             console.log(user)
        //             console.log(!!user)
        //             return !!user
        //         }
        //     )
        // );
        
         this.authService.user.subscribe(user => {
             this.currUser = user
         }).unsubscribe
         console.log("this.curruser in guard=>")
         console.log(this.currUser)
         if (!!this.currUser){
             return true
         }

        return this.router.createUrlTree(['/auth'])
        // this.router.navigate(['/auth'])
        // return false;
    }


}