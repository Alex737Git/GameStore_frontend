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
  public isUserAuthenticated = false;
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

    // if (this.authService.isUserAuthenticated()) {
    //   this.authService.sendAuthStateChangeNotification(true);
    //   let user = this.authService.getUser();
    //   this.authService.sendUserInfoChangeNotification(user);
    // }
    // console.log('User: ', this.user);
  }

  public logout = () => {
    this.authService.logout();
    this.router.navigate(['home']);
  };
}
