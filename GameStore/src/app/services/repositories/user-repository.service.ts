import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentUrlService } from '../shared/environment-url.service';

import { IUserForAuthenticationDto } from '../../interfaces/user/userForAuthenticationDto';
import { BaseRepositoryService } from './base-repository.service';
import { IUserInfo } from '../../interfaces/user/user';

@Injectable({
  providedIn: 'root',
})
export class UserRepositoryService extends BaseRepositoryService {
  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) {
    super();
  }

  public getUser = (route: string) => {
    return this.http.get<IUserInfo>(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  };

  public update = (route: string, body: IUserForAuthenticationDto) => {
    return this.http.put(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      body,
      this.generateHeaders()
    );
  };
}
