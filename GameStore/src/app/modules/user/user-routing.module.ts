import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from '../../components/game/order-list/order-list.component';
import { OrderComponent } from '../../components/game/order/order.component';
import { SettingsComponent } from '../../components/settings/settings.component';
import { ProfileComponent } from '../../components/user/profile/profile.component';
import { AuthGuard } from '../../services/guards/auth.guard';
import { GameCreateComponent } from '../../components/game/game-create/game-create.component';
import { GameUpdateComponent } from '../../components/game/game-update/game-update.component';

const routes: Routes = [
  { path: 'order', component: OrderComponent },
  { path: 'order-list', component: OrderListComponent },
  { path: 'upload', component: SettingsComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'create', component: GameCreateComponent, canActivate: [AuthGuard] },
  {
    path: 'update/:id',
    component: GameUpdateComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
