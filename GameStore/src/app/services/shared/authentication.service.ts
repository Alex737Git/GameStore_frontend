import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentUrlService } from './environment-url.service';
import { UserForRegistrationDto } from '../../interfaces/user/userForRegistration';
import { RegistrationResponseDto } from '../../interfaces/response/registrationResponseDto';
import { IUserForAuthenticationDto } from '../../interfaces/user/userForAuthenticationDto';
import { AuthResponseDto } from '../../interfaces/response/authResponseDto';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IUserInfo } from '../../interfaces/user/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  //region Login, Registration dialog properties
  showRegistration = false;
  showLogin = true;
  //endregion

  //#region Properties
  private authChangeSub = new Subject<boolean>();
  public authChanged = this.authChangeSub.asObservable();
  private userChangeSub = new Subject<IUserInfo | null>();
  public userChanged = this.userChangeSub.asObservable();

  //#endregion

  //#region Ctor
  constructor(
    private http: HttpClient,
    private envUrl: EnvironmentUrlService,
    private jwtHelper: JwtHelperService
  ) {}

  //#endregion

  //#region Register User, CheckEmail, Login User, Logout,
  public registerUser = (route: string, body: UserForRegistrationDto) => {
    return this.http.post<RegistrationResponseDto>(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      body
    );
  };

  public checkEmail = (route: string, email: string) => {
    return this.http.post<boolean>(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      { email }
    );
  };

  public loginUser = (route: string, body: IUserForAuthenticationDto) => {
    return this.http.post<AuthResponseDto>(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      body
    );
  };

  public logout = () => {
    localStorage.removeItem('token');
    this.sendAuthStateChangeNotification(false);
    this.sendUserInfoChangeNotification(null);
  };

  //endregion

  //#region Is User Authenticated
  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    console.log(
      `isUserAuthenticated:  ${token && !this.jwtHelper.isTokenExpired(token)}`
    );
    // if (token && !this.jwtHelper.isTokenExpired(token)) return true;
    //
    // return false;

    return !!(token && !this.jwtHelper.isTokenExpired(token));
  };

  //#endregion

  //#region Is User in Role
  public isUserInRole = (expectedRole: string): boolean => {
    const token = localStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token!);
    const role =
      decodedToken[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];
    return role === expectedRole;
  };

  //#endregion

  //#region Send Auth State Change Notification
  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  };
  //#endregion

  //#region Send UserInfo Change Notification
  public sendUserInfoChangeNotification = (user: IUserInfo | null) => {
    this.userChangeSub.next(user);
  };
  //#endregion

  //#region Create Complete Route
  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  };
  //#endregion

  //#region Get User Role
  public getUserRole = (): string => {
    const token = localStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token!);
    return decodedToken[
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    ];
  };
  //#endregion
}
