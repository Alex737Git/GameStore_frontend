import { FormGroup, Validators } from '@angular/forms';

export const EmailValidation = [Validators.required, Validators.email];
export const PasswordValidation = [
  Validators.required,
  Validators.minLength(1),
  Validators.maxLength(50),
];

export const OptionalTextValidation = [
  Validators.minLength(2),
  Validators.maxLength(50),
];
export const RequiredTextValidation = OptionalTextValidation.concat([
  Validators.required,
]);

// export const validateControl = (controlName: string, form: FormGroup) => {
//   return form.get(controlName)?.invalid && form.get(controlName)?.touched;
// };
// export const hasError = (
//   controlName: string,
//   errorName: string,
//   form: FormGroup
// ) => {
//   return form.get(controlName)?.hasError(errorName);
// };
