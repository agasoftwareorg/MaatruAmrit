import { Routes } from '@angular/router';

import { authGuard, authGuardReverse } from '../services/auth.guard';

import { BlankComponent } from '../layouts/blank/blank.component'
import { SidebarComponent } from '../layouts/sidebar/sidebar.component'
import { AdminLoginComponent } from '../pages/admin-login/admin-login.component'
import { UserLoginComponent } from '../pages/user-login/user-login.component'
import { NewHospitalComponent } from '../pages/new-hospital/new-hospital.component'
import { EditHospitalComponent } from '../pages/edit-hospital/edit-hospital.component'
import { HospitalListComponent } from '../pages/hospital-list/hospital-list.component'
import { UserListComponent } from '../pages/user-list/user-list.component';
import { BatchListComponent } from '../pages/batch-list/batch-list.component';
import { MotherListComponent } from '../pages/mother-list/mother-list.component';
import { BabyListComponent } from '../pages/baby-list/baby-list.component';
import { EditMotherComponent } from '../pages/edit-mother/edit-mother.component';
import { NewMotherComponent } from '../pages/new-mother/new-mother.component';
import { NewBabyComponent } from '../pages/new-baby/new-baby.component';
import { EditBabyComponent } from '../pages/edit-baby/edit-baby.component';
import { MotherDonationsComponent } from '../pages/mother-donations/mother-donations.component';
import { BatchCollectionsComponent } from '../pages/batch-collections/batch-collections.component';
import { BabyDispatchesComponent } from '../pages/baby-dispatches/baby-dispatches.component';


export const routes: Routes = [
  {
    path: '',
    component: BlankComponent,
    children: [
      { path: 'login', component: UserLoginComponent},
      { path: 'admin/login', component: AdminLoginComponent}
    ],
    canActivate: [authGuardReverse]
  }, {
    path: '',
    component: SidebarComponent,
    children: [
      { path: 'hospital', component: HospitalListComponent },
      { path: 'hospital/new', component: NewHospitalComponent },
      { path: 'hospital/:id', component: EditHospitalComponent },
      { path: 'hospital/:id/users', component: UserListComponent },
      { path: 'batch', component: BatchListComponent },
      { path: 'batch/:id/collections', component: BatchCollectionsComponent },
      { path: 'mother', component: MotherListComponent },
      { path: 'mother/new', component: NewMotherComponent },
      { path: 'mother/:id', component: EditMotherComponent },
      { path: 'mother/:id/donations', component: MotherDonationsComponent },
      { path: 'baby', component: BabyListComponent },
      { path: 'baby/new', component: NewBabyComponent },
      { path: 'baby/:id', component: EditBabyComponent },
      { path: 'baby/:id/dispatches', component: BabyDispatchesComponent },
    ],
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login'},
];
