import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ɵFormGroupValue,
  ɵTypedOrUntyped,
} from '@angular/forms';
import { AuthenticationService } from '../../../services/shared/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EmailValidation,
  PasswordValidation,
} from '../../../common/validations';
import { environment } from '../../../../environments/environment';
import { userRoutes } from '../../../routes/userRoutes';
import { IUserForAuthenticationDto } from '../../../interfaces/user/userForAuthenticationDto';
import { AuthResponseDto } from '../../../interfaces/response/authResponseDto';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from '../../../enums/auth.enum';
import { UserRepositoryService } from '../../../services/repositories/user-repository.service';
import { IUserInfo } from '../../../interfaces/user/user';
import { LS } from '../../../localStorage/localStorage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  //region Params
  private returnUrl: string;
  loginForm: FormGroup;
  errorMessage: string = '';
  showError: boolean;
  sent: boolean;
  //endregion

  //#region Ctor
  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private userRepo: UserRepositoryService
  ) {}

  ngOnInit() {
    this.buildLoginForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }

  //#endregion

  buildLoginForm() {
    let data = this.authService.getInfo(LS.loginInfo);
    console.log('Data: ', data);
    this.loginForm = this.formBuilder.group({
      userName: [data.userName],
      password: [data.password, PasswordValidation],
      rememberChecked: [data.rememberChecked ?? false],
    });
  }

  getUser() {
    this.userRepo.getUser(userRoutes.getUserInfo).subscribe((res) => {
      this.authService.sendUserInfoChangeNotification(res);
      this.authService.rememberInfo(LS.user, res);
    });
  }

  //#region Login User
  loginUser = (loginFormValue: any) => {
    // this.authService.isExternalAuth = false;
    this.showError = false;
    const login = { ...loginFormValue };

    const userForAuth: IUserForAuthenticationDto = {
      userName: login.userName,
      password: login.password,
    };

    //region Login to server
    this.authService.loginUser(userRoutes.login, userForAuth).subscribe({
      next: (res: AuthResponseDto) => {
        localStorage.setItem(LS.token, res.token);
        this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);

        this.router.navigate([this.returnUrl || this.navigateTo()]);
        this.getUser();
        this.authService.showLogin = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
      },
    });
    //endregion

    //region Remember Me functionality

    if (login.rememberChecked) {
      this.authService.rememberInfo(LS.loginInfo, {
        userName: loginFormValue.userName,
        password: loginFormValue.password,
        rememberChecked: login.rememberChecked,
      });
    } else {
      this.authService.clearInfo(LS.loginInfo);
    }
    //endregion
  };

  //#endregion

  //region Navigation after login
  private navigateTo(): string {
    const role = this.authService.getUserRole();
    console.log('Role: ', role);
    return this.homeRoutePerRole(role as Role);
  }

  private homeRoutePerRole(role: Role) {
    switch (role) {
      case Role.Manager:
        return '/manager';
      case Role.Authenticated:
        return '/user/profile';
      default:
        return '/home';
    }
  }
  //endregion
}
