import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from '../../components/user/profile/profile.component';
import { GameCreateComponent } from '../../components/game/game-create/game-create.component';
import { GameUpdateComponent } from '../../components/game/game-update/game-update.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-module/shared.module';

@NgModule({
  declarations: [ProfileComponent, GameCreateComponent, GameUpdateComponent],
  imports: [CommonModule, UserRoutingModule, ReactiveFormsModule, SharedModule],
})
export class UserModule {}
