import { Routes } from '@angular/router';

import { BlankComponent } from '../layouts/blank/blank.component'
import { SidebarComponent } from '../layouts/sidebar/sidebar.component'

import { LoginComponent } from '../pages/login/login.component'
import { HospitalListComponent } from '../pages/hospital-list/hospital-list.component'


export const routes: Routes = [{
    path: '',
    component: BlankComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]
}, {
    path: '',
    component: SidebarComponent,
    children: [
      { path: 'hospital', component: HospitalListComponent }
    ]
}];
