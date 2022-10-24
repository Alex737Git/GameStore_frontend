import { Component } from '@angular/core';
import { AuthenticationService } from './services/shared/authentication.service';
import { LS } from './localStorage/localStorage';
import { CategoriesRepositoryService } from './services/repositories/category-repository.service';
import { categoriesRoutes } from './routes/categoriesRoutes';
import { Subscription } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';

export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'GameStore';
  subscription: Subscription;
  constructor(
    public authService: AuthenticationService,
    public categoryService: CategoriesRepositoryService,
    private router: Router
  ) {
    // for detecting refresh page
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
    });
  }

  ngOnInit(): void {
    if (this.authService.isUserAuthenticated()) {
      this.authService.sendAuthStateChangeNotification(true);
      let user = this.authService.getInfo(LS.user);
      this.authService.sendUserInfoChangeNotification(user);
    }
    this.categoryService.getCategories(categoriesRoutes.getAllCategories);
  }
}
