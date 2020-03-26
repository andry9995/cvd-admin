import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';

// Firebase
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
// import { FirebaseProvider } from '../providers/firebase/firebase';

import { AgmCoreModule } from '@agm/core';

import { CommonModule } from "@angular/common";

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { MedicalComponent } from './views/medical/medical.component';
import { EquipementsComponent } from './views/equipements/equipements.component';

import { FormsModule } from '@angular/forms';
import { CategorieComponent } from './views/categorie/categorie.component';
import { ManageCategorieComponent } from './views/manage-categorie/manage-categorie.component';
import { ManageMedicamentComponent } from './views/manage-medicament/manage-medicament.component';

import { AlertModule } from 'ngx-bootstrap/alert';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule.enablePersistence(),
    AgmCoreModule.forRoot({
      apiKey:'AIzaSyAXFL9EGDk4-d0HAFyIHEpJ_EaJyHwjo5E',
      libraries: ["places"]
    }),
    FormsModule,
    AlertModule.forRoot(),
  ],
  declarations: [
    // DashboardComponent,
    AppComponent,
    APP_CONTAINERS,
    P404Component,
    MedicalComponent,
    EquipementsComponent,
    CategorieComponent,
    ManageCategorieComponent,
    ManageMedicamentComponent,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
