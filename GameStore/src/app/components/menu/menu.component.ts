import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/shared/authentication.service';
import { IUserInfo } from '../../interfaces/user/user';
import { Router } from '@angular/router';
import { CartRepositoryService } from '../../services/repositories/cart-repository.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public isUserAuthenticated = false;
  public user: IUserInfo | null;
  public quantity: number;
  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private cartRepo: CartRepositoryService
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
    this.cartRepo.orderedItemsChanged.subscribe((res) => {
      this.quantity = res;
    });
  }

  handleCart() {
    this.router.navigate(['orderList']);
  }

  public logout = () => {
    this.authService.logout();
    this.router.navigate(['home']);
  };
}
