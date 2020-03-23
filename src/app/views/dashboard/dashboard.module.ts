import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { CommonModule } from '@angular/common';

import { AgmCoreModule } from '@agm/core';



@NgModule({
  imports: [
  CommonModule,
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey:'AIzaSyAXFL9EGDk4-d0HAFyIHEpJ_EaJyHwjo5E',
      libraries: ["places"]
    })
  ],
  declarations: [ DashboardComponent ]
})
export class DashboardModule { }
