import { Component } from '@angular/core';
import { AuthenticationService } from './services/shared/authentication.service';
import { LS } from './localStorage/localStorage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'GameStore';
  constructor(public authService: AuthenticationService) {}

  ngOnInit(): void {
    if (this.authService.isUserAuthenticated()) {
      this.authService.sendAuthStateChangeNotification(true);
      let user = this.authService.getInfo(LS.user);
      this.authService.sendUserInfoChangeNotification(user);
    }
  }
}
