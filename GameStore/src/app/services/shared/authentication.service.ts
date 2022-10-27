import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentUrlService } from './environment-url.service';
import { UserForRegistrationDto } from '../../interfaces/user/userForRegistration';
import { RegistrationResponseDto } from '../../interfaces/response/registrationResponseDto';
import { IUserForAuthenticationDto } from '../../interfaces/user/userForAuthenticationDto';
import { AuthResponseDto } from '../../interfaces/response/authResponseDto';
import { BehaviorSubject, Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IUserInfo } from '../../interfaces/user/user';
import { LS } from '../../localStorage/localStorage';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  //region Login, Registration dialog properties
  showRegistration = false;
  showLogin = false;
  //endregion

  //#region Properties
  private authChangeSub = new Subject<boolean>();
  public authChanged = this.authChangeSub.asObservable();
  private userChangeSub = new BehaviorSubject<IUserInfo | null>({
    avatarUrl: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    id: '',
  });
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
    localStorage.removeItem(LS.token);
    localStorage.removeItem(LS.user);
    this.sendAuthStateChangeNotification(false);
    this.sendUserInfoChangeNotification(null);
  };

  //endregion

  //#region Is User Authenticated
  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem(LS.token);
    console.log(
      `isUserAuthenticated:  ${token && !this.jwtHelper.isTokenExpired(token)}`
    );

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

  //region Write Login info to storage "Remember me" and ClearMe Get me
  public rememberInfo(name: string, info: any) {
    localStorage.setItem(name, JSON.stringify(info));
  }
  public clearInfo(value: string) {
    localStorage.removeItem(value);
  }
  public getInfo(value: string) {
    return localStorage.getItem(value)
      ? JSON.parse(localStorage.getItem(value) ?? '')
      : '';
  }

  //endregion

  public getUser() {
    return this.userChangeSub.getValue();
  }
}
