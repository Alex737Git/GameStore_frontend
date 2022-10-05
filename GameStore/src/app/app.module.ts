import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { NotFoundComponent } from './components/error-pages/not-found/not-found.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserModule } from './modules/user/user.module';
import { OrderListComponent } from './components/game/order-list/order-list.component';
import { OrderComponent } from './components/game/order/order.component';
import { InternalServerComponent } from './components/error-pages/internal-server/internal-server.component';
import { RouterModule } from '@angular/router';
import { RoutingModule } from './modules/routing/routing.module';
import { RegistrationComponent } from './components/authentication/registration/registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/authentication/login/login.component';
import { JwtModule } from '@auth0/angular-jwt';
import { ErrorHandlerService } from './services/error-handler.service';
import { ForbiddenComponent } from './components/authentication/forbidden/forbidden.component';
import { SettingsComponent } from './components/settings/settings.component';
import { GameDetailsComponent } from './components/game/game-details/game-details.component';
import { LS } from './localStorage/localStorage';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    NotFoundComponent,
    OrderListComponent,
    OrderComponent,
    InternalServerComponent,
    RegistrationComponent,
    LoginComponent,
    ForbiddenComponent,
    SettingsComponent,
    GameDetailsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem(LS.token),
        allowedDomains: ['localhost:44309'],
        disallowedRoutes: [],
      },
    }),
    UserModule,
    RouterModule,
    RoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
