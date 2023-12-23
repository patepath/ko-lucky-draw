import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee.service';
import { first } from 'rxjs/operators';

declare var $:any;

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
    public employee: Employee | undefined = <Employee>{};
    public employees: Employee[] = [];
    public currid: string = '';

    constructor(
      private _emplySrv: EmployeeService,
      private _router: Router) {

    }

    ngAfterViewInit(): void {
      this._emplySrv.findAll().pipe(first()).subscribe(s => {
        if(s.length > 0) {
          this.employees = s;
        }
      });
    }

    submit(frm: NgForm) {
      this._emplySrv.findByName(frm.value['txtsearch']).subscribe(s => {
        this.employees = s;
      });
    }

    choice(id: string) {
      this.currid = id;
    }

    async ok() {
      this.employee = this.employees.find(s => s.id == this.currid)

      if(this.employee) {
        let check = await this._emplySrv.isCheckin(this.employee)

        if(!check) {
          this._router.navigate(['/welcome'], {queryParams: { id: this.currid, type: 2 } }) 

        } else {
          $('#msg-err').modal('show');
        }
      }
    }

    cancel() {
      this._router.navigate(['/']);
    }
}
