import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  public employee: Employee = <Employee>{};
  public firstName: string = '';
  public lastName: string = '';
  public type: number = 1;

  constructor(
    private _emplySrv: EmployeeService,
    private _route: ActivatedRoute,
    private _router: Router) {

  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(s => {
      let id = s['id'];
      this.type = Number(s['type'])

      if(id) {
        this._emplySrv.findById(id).then(s => {
          this.employee = <Employee>s.data();
          this.firstName = this.employee.fullName.split(' ')[0];
          this.lastName = this.employee.fullName.split(' ')[1];
          this.employee.id = id;
        });
      }
    });
  }

  async checkin() {
    await this._emplySrv.checkin(this.employee, this.type);
    //window.location.href = '/thankyou';
    this._router.navigate(['/thankyou']);
  }

  cancel() {
    this._router.navigate(['/']);
  }
}
