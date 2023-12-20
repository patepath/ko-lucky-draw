import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { PresentComponent } from './present/present.component';
import { CheckinComponent } from './checkin/checkin.component';

export const routes: Routes = [
    { path: 'employee', component: EmployeeComponent },
    { path: 'present', component: PresentComponent },
    { path: 'checkin', component: CheckinComponent },
    { path: '', redirectTo: 'checkin', pathMatch: 'full' },
];
