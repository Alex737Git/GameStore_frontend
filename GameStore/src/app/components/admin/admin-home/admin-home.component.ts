import { Component, OnInit } from '@angular/core';
import { IUserInfo } from '../../../interfaces/user/user';
import { IRole } from '../../../interfaces/role/IRole';
import { AdminRepositoryService } from '../../../services/repositories/admin-repository.service';
import { IGameWithPagination } from '../../../interfaces/game/IGameWithPagination';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { adminRoutes } from '../../../routes/adminRoutes';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { IUserForUpdateRoleDto } from '../../../interfaces/role/IUserForUpdateRoleDto';
import { gamesRoutes } from '../../../routes/gamesRoutes';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss'],
})
export class AdminHomeComponent implements OnInit {
  users: IUserInfo[];
  roles: IRole[];
  selectedValue: IRole;

  constructor(
    private adminRepo: AdminRepositoryService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllRoles();
  }

  //#region Get All Users
  public getAllUsers = () => {
    this.adminRepo.getAllUsers(adminRoutes.getAllUsers).subscribe({
      next: (response: IUserInfo[]) => {
        this.users = response;
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        Swal.fire(`When you make a mistake, be excited! Analyze what happened, and learn from it. Your mistake is
        ${this.errorHandler.errorMessage}`);
      },
    });
  };
  //#endregion

  //#region Get All Roles
  public getAllRoles = () => {
    this.adminRepo.getAllRoles(adminRoutes.allRoles).subscribe({
      next: (response: IRole[]) => {
        this.roles = response;
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        Swal.fire(`When you make a mistake, be excited! Analyze what happened, and learn from it. Your mistake is
        ${this.errorHandler.errorMessage}`);
      },
    });
  };
  //#endregion

  handleEdit(userId: string) {
    let info: IUserForUpdateRoleDto = {
      userId: userId,
      roleId: this.selectedValue.id,
      roleName: this.selectedValue.name,
    };

    this.adminRepo.updateUserRole(adminRoutes.updateUserRole, info).subscribe({
      next: (game) => {
        Swal.fire(`Your have successfully updated the user role.`);
        this.getAllUsers();
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire(`The user role was not updated. Errors: ${err}`);
      },
    });
  }

  handleDelete(userId: string) {
    this.adminRepo.deleteUser(adminRoutes.deleteUser(userId)).subscribe({
      next: (_) => {
        Swal.fire(`Your have successfully deleted the user .`);
        this.getAllUsers();
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire(`The user role was not deleted. Errors: ${err}`);
      },
    });
  }
}
