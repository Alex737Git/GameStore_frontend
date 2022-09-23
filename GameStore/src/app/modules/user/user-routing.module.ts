import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrderListComponent} from "../../components/game/order-list/order-list.component";
import {OrderComponent} from "../../components/game/order/order.component";


//Todo delete
// for reference https://code-maze.com/net-core-web-development-part10/

const routes: Routes = [
  { path:'order', component: OrderComponent },
  { path:'order-list', component: OrderListComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
