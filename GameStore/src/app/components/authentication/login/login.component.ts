import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private returnUrl: string;
  loginForm: FormGroup;
  errorMessage: string = '';
  showError: boolean;
  sent: boolean;
  // user: IUserInfo = {
  //   id: '',
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   role: '',
  // };

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
    this.loginForm = this.formBuilder.group({
      userName: [''],
      password: ['', PasswordValidation],
    });
  }

  getUser() {
    this.userRepo.getUser(userRoutes.getUserInfo).subscribe((res) => {
      this.authService.sendUserInfoChangeNotification(res);
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
    this.authService.loginUser(userRoutes.login, userForAuth).subscribe({
      next: (res: AuthResponseDto) => {
        console.log('Token: ', res.token);
        localStorage.setItem('token', res.token);
        this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);

        // this.router.navigate([this.returnUrl || this.navigateTo()]);
        this.getUser();
        this.authService.showLogin = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
      },
    });
  };

  //#endregion

  private navigateTo(): string {
    const role = this.authService.getUserRole();
    return this.homeRoutePerRole(role as Role);
  }

  private homeRoutePerRole(role: Role) {
    switch (role) {
      case Role.Manager:
        return '/manager';
      default:
        return '/home';
    }
  }
}
