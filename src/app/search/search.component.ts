import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee.service';

declare var $:any;

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
    public employee: Employee = <Employee>{};
    public employees: Employee[] = [];
    public currid: string = '';

    constructor(
      private _emplySrv: EmployeeService,
      private _router: Router) {

    }

    ngAfterViewInit(): void {
      this._emplySrv.findAll().subscribe(s => {
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

    ok() {
      $('#msg-err').modal('show');
      //this._router.navigate(['/welcome'], {queryParams: { id: this.currid}}) 
    }

    cancel() {
      this._router.navigate(['/']);
    }
}
