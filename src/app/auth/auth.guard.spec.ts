import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { User } from './user.model';

describe('AuthGuard', () => {
  let injector: TestBed;
  let guard: AuthGuard;
  let authService: AuthService;
  let routeMock: any = { snapshot: {} };
  let routeStateMock: any = { snapshot: {}, url: '/auth' };
  let routerMock = { createUrlTree: jasmine.createSpy('createUrlTree') };
  interface AuthResponseData {
    type: string;
    email: string;
    token: string;
    tokenExpiresIn: Date;
  }

  let authRespData: AuthResponseData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerMock },
        AuthService,
      ],
      imports: [HttpClientTestingModule],
    });
    localStorage.clear();
    injector = getTestBed();
    authService = injector.inject(AuthService);
    guard = injector.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect unauthenticated user to auth route', () => {
    guard.canActivate(routeMock, routeStateMock);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/auth']);
  });

  it('should allow authenticated user to access app', () => {
    const user = new User(
      'rick@gmail.com',
      'mockToken',
      new Date('Tue Oct 26 2021 21:20:40 GMT+0530 (India Standard Time)')
    );
    authService.user.next(user);
    spyOn(authService, 'login').and.returnValue(of(authRespData));
    expect(guard.canActivate(routeMock, routeStateMock)).toEqual(true);
  });
});
