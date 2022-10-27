import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentUrlService } from '../shared/environment-url.service';

import { IUserForAuthenticationDto } from '../../interfaces/user/userForAuthenticationDto';
import { BaseRepositoryService } from './base-repository.service';
import { IUserInfo } from '../../interfaces/user/user';
import { IRole } from '../../interfaces/role/IRole';
import { IUserForUpdateRoleDto } from '../../interfaces/role/IUserForUpdateRoleDto';

@Injectable({
  providedIn: 'root',
})
export class AdminRepositoryService extends BaseRepositoryService {
  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) {
    super();
  }

  public getAllUsers = (route: string) => {
    return this.http.get<IUserInfo[]>(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  };

  public getAllRoles = (route: string) => {
    return this.http.get<IRole[]>(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  };

  public updateUserRole = (route: string, body: IUserForUpdateRoleDto) => {
    return this.http.put(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      body,
      this.generateHeaders()
    );
  };

  public deleteUser = (route: string) => {
    return this.http.delete(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  };
}
