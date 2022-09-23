import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements HttpInterceptor {
  public errorMessage: string = '';
  constructor(private router: Router) {}

  //#region HandleError
  public handleError = (error: HttpErrorResponse) => {
    console.log("Getting Error: ", error)
    if (error.status === 500) {
      this.handle500Error(error);
    } else if (error.status === 404) {
      this.handle404Error(error);
    } else if (error.status === 400) {
      this.errorMessage = this.handleBadRequest(error);
    } else if (error.status === 401) {
      this.handleUnauthorized(error);
    } else if (error.status === 403) {
      this.handleForbidden(error);
    } else {
      this.handleOtherError(error);
    }
  };
  //#endregion

  //#region Methods
  private handleUnauthorized = (error: HttpErrorResponse) => {
    if (this.router.url.startsWith('/authentication/login')) {
      error.error.errorMessage == undefined
        ? (this.errorMessage = 'Email or password are wrong')
        : (this.errorMessage = error.error.errorMessage);

      return error.error.errorMessage;
    } else {
      this.router.navigate(['/authentication/login'], {
        queryParams: { returnUrl: this.router.url },
      });

      return error.message;
    }
  };

  private handle500Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigate(['/500']);
  };
  private handle404Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigate(['/404']);
  };
  private handleOtherError = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
  };
  private createErrorMessage = (error: HttpErrorResponse) => {
    this.errorMessage = error.error ? error.error : error.statusText;
  };

  private handleBadRequest = (error: HttpErrorResponse): string => {
    if (
      this.router.url === '/authentication/register' ||
      this.router.url.startsWith('/authentication/resetpassword')
    ) {
      let message = '';
      const values = Object.values(error.error.errors);
      values.map((m) => {
        message += m + '<br>';
      });
      return message.slice(0, -4);
    } else {
      return error.error ? error.error : error.message;
    }
  };

  private handleForbidden = (error: HttpErrorResponse) => {
    this.router.navigate(['/forbidden'], {
      queryParams: { returnUrl: this.router.url },
    });
    return 'Forbidden';
  };

  //#endregion

  //#region Intercept
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => new Error(this.errorMessage));
      })
    );
  }

  //#endregion
}
