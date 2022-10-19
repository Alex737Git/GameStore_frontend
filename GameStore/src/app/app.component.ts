import { Component } from '@angular/core';
import { AuthenticationService } from './services/shared/authentication.service';
import { LS } from './localStorage/localStorage';
import { CategoriesRepositoryService } from './services/repositories/category-repository.service';
import { categoriesRoutes } from './routes/categoriesRoutes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'GameStore';
  constructor(
    public authService: AuthenticationService,
    public categoryService: CategoriesRepositoryService
  ) {}

  ngOnInit(): void {
    if (this.authService.isUserAuthenticated()) {
      this.authService.sendAuthStateChangeNotification(true);
      let user = this.authService.getInfo(LS.user);
      this.authService.sendUserInfoChangeNotification(user);
    }
    this.categoryService.getCategories(categoriesRoutes.getAllCategories);
  }
}
