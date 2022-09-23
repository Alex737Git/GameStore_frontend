import { Component } from '@angular/core';
import {AuthenticationService} from "./services/shared/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GameStore';
  constructor(public authService:AuthenticationService) {
  }
}
