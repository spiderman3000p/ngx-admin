import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchasesRoutingModule } from './purchases-routing.module';
import { RequisitionsComponent } from './requisitions/requisitions.component';
import { OrdersComponent } from './orders/orders.component';


@NgModule({
  declarations: [
    RequisitionsComponent,
    OrdersComponent
  ],
  imports: [
    CommonModule,
    PurchasesRoutingModule
  ]
})
export class PurchasesModule { }
