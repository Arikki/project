import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from './user.model';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  jwtToken: string = 'Bearer ';
  currUser: User = null;
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.authService.user
      .subscribe((user) => (this.currUser = user))
      .unsubscribe();
    if (!this.currUser) {
      return next.handle(req);
    }

    const modReq = req.clone({
      setHeaders: {
        Authorization: this.jwtToken + this.currUser.token,
      },
    });
    console.log('JwtToken ==>' + this.jwtToken + this.currUser.token);
    return next.handle(modReq);
  }
}
