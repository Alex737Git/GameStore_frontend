import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../../components/home/home.component';
import { InternalServerComponent } from '../../components/error-pages/internal-server/internal-server.component';
import { NotFoundComponent } from '../../components/error-pages/not-found/not-found.component';
import { ForbiddenComponent } from '../../components/authentication/forbidden/forbidden.component';
import { GameDetailsComponent } from '../../components/game/game-details/game-details.component';
import { OrderListComponent } from '../../components/game/order-list/order-list.component';
import { OrderComponent } from '../../components/game/order/order.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'user',
    loadChildren: () => import('../user/user.module').then((m) => m.UserModule),
  },
  // {
  //   path: 'manager',
  //   loadChildren: () =>
  //     import('../manager/manager.module').then((m) => m.ManagerModule),
  // },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'game/:id', component: GameDetailsComponent },
  { path: 'orderList', component: OrderListComponent },
  { path: 'order', component: OrderComponent },
  { path: '500', component: InternalServerComponent },
  { path: '404', component: NotFoundComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
