import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { PresentComponent } from './present/present.component';
import { CheckinComponent } from './checkin/checkin.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
    { path: 'employee', component: EmployeeComponent },
    { path: 'present', component: PresentComponent },
    { path: 'checkin', component: CheckinComponent },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'search', component: SearchComponent },
    { path: '', redirectTo: 'checkin', pathMatch: 'full' },
];
