import { Routes } from '@angular/router';

import { BlankComponent } from '../layouts/blank/blank.component'
import { SidebarComponent } from '../layouts/sidebar/sidebar.component'

import { AdminLoginComponent } from '../pages/admin-login/admin-login.component'
import { UserLoginComponent } from '../pages/user-login/user-login.component'
import { NewUserComponent } from '../pages/new-user/new-user.component'
import { NewHospitalComponent } from '../pages/new-hospital/new-hospital.component'
import { EditHospitalComponent } from '../pages/edit-hospital/edit-hospital.component'
import { HospitalListComponent } from '../pages/hospital-list/hospital-list.component'
import { authGuard, authGuardReverse } from '../services/auth.guard';


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
      { path: 'user/new', component: NewUserComponent }
    ],
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login'},
];
