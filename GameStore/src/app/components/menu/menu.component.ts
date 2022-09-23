import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/shared/authentication.service';
import { IUserInfo } from '../../interfaces/user/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public isUserAuthenticated: boolean;
  public user: IUserInfo | null;
  constructor(
    public authService: AuthenticationService,
    private router: Router
  ) {
    this.authService.authChanged.subscribe((res) => {
      this.isUserAuthenticated = res;
    });
    this.authService.userChanged.subscribe((res) => {
      this.user = res;
    });
  }

  ngOnInit(): void {
    this.authService.authChanged.subscribe((res) => {
      this.isUserAuthenticated = res;
    });
    this.authService.userChanged.subscribe((res) => {
      this.user = res;
    });
  }

  public logout = () => {
    this.authService.logout();
    this.router.navigate(['home']);
  };
}
