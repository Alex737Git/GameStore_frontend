import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/shared/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { userRoutes } from '../../../routes/userRoutes';
import { tap } from 'rxjs';
import { UserForRegistrationDto } from '../../../interfaces/user/userForRegistration';
import { HttpErrorResponse } from '@angular/common/http';
import { PasswordConfirmationValidatorService } from '../../../services/custom-validators/password-confirmation-validator.service';
import {
  EmailValidation,
  PasswordValidation,
} from '../../../common/validations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  // @ts-ignore
  public registrationForm: FormGroup;
  public emailIsTaken: boolean = true;
  public errorMessage: string = '';
  public showError: boolean = false;

  //#region ctor
  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private passConfValidator: PasswordConfirmationValidatorService
  ) {}

  //endregion

  ngOnInit() {
    this.buildRegisterForm();
    this.addConfirmValidator();
  }

  //#region Forms build, add validator, and validate
  buildRegisterForm() {
    this.registrationForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      userName: new FormControl(''),
      email: new FormControl('', EmailValidation),
      password: new FormControl('', PasswordValidation),
      confirm: new FormControl(''),
    });
  }

  addConfirmValidator() {
    this.registrationForm
      .get('confirm')
      ?.setValidators([
        Validators.required,
        this.passConfValidator.validateConfirmPassword(
          this.registrationForm.get('password')!
        ),
      ]);
  }

  public validateControl = (controlName: string) => {
    return (
      this.registrationForm.get(controlName)?.invalid &&
      this.registrationForm.get(controlName)?.touched
    );
  };

  public hasError = (controlName: string, errorName: string) => {
    return this.registrationForm.get(controlName)?.hasError(errorName);
  };
  //endregion

  //Todo check also userName, change this method to check email or other field
  onBlur(value: HTMLInputElement) {
    if (value.checkValidity()) {
      this.authService
        .checkEmail(userRoutes.checkEmail, value.value)
        .pipe(
          tap((val) => {
            this.fillParams(val, 'email');
          })
        )
        .subscribe();
    }
  }

  private fillParams(val: boolean, param: string) {
    if (val) {
      // alert(` The ${param} is taken.Please choose a new one.`);
      this.errorMessage = ` The ${param} is taken.Please choose a new one.`;
      this.emailIsTaken = true;
    } else {
      this.emailIsTaken = false;
      this.errorMessage = '';
    }
  }

  public registerUser = (registerFormValue: any) => {
    this.showError = false;
    const formValues = { ...registerFormValue };
    const user: UserForRegistrationDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      userName: formValues.userName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirm,
    };

    this.authService.registerUser(userRoutes.registration, user).subscribe({
      next: (_) => {
        Swal.fire('Registration was successful. Please login.');
      },
      error: (err: HttpErrorResponse) => {
        // alert(`Errors in registration: ${err?.error?.errors}`);
        this.errorMessage = err?.error?.errors;
        this.showError = true;
      },
    });
  };
}
