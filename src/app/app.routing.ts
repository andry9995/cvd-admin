import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Import Containers
import { DefaultLayoutComponent } from './containers';
import { P404Component } from './views/error/404.component';
import { MedicalComponent } from './views/medical/medical.component';
import { EquipementsComponent } from './views/equipements/equipements.component';
import { CategorieComponent } from './views/categorie/categorie.component';
import { ManageCategorieComponent } from './views/manage-categorie/manage-categorie.component';
import { ManageMedicamentComponent } from './views/manage-medicament/manage-medicament.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'base',
        loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'categorie',
        component: CategorieComponent,
        data: {
          title: 'Catégorie'
        }
      },
      {
        path: 'manage-categorie/:key',
        component: ManageCategorieComponent,
        data: {
          title: 'Gestion Catégorie'
        }
      },
      {
        path: 'manage-medicament/:categorieKey/:key',
        component: ManageMedicamentComponent,
        data: {
          title: 'Gestion Médicament'
        }
      },
    ]
  },
  
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
