import { Component } from '@angular/core';
import { Present } from '../models/present';
import { PresentService } from '../services/present.service';
import { first } from 'rxjs';
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-luckydraw',
  standalone: true,
  imports: [],
  templateUrl: './luckydraw.component.html',
  styleUrl: './luckydraw.component.css'
})
export class LuckydrawComponent {
  public page = 0;
  public isRandom: boolean = false;
  public isResult: boolean = false;

  public presents: Present[] = [];
  public present: Present = <Present>{};

  public employees: Employee[] = [];
  public employee: Employee = <Employee>{};

  constructor(
    private _prsntSrv: PresentService,
    private _emplySrv: EmployeeService) {}

  ngOnInit(): void {
    this.pickPresent();
    this.refreshEmployees();
    this.employee.fullName = '...';
  }

  setPage(page: number) {
    this.page = page;
  }

  pickPresent() {
    this._prsntSrv.pickPresent().pipe(first()).subscribe(s => {
      this.presents = s;
      this.presents.sort((a,b) => a.order - b.order);
      this.present = this.presents[0];
    });
  }

  refreshEmployees() {
    this._emplySrv.findParticipants().pipe(first()).subscribe(s => {
      this.employees = s;
      console.log('list number: ' + this.employees.length);
    });
  }

  random() {
    console.log(this.employees);

    if(this.employees.length > 1 && !this.isRandom) {
      this.isRandom = true;
      this.isResult = false;

      let timer = setInterval(() => {
        let inx = Math.floor(Math.random() * this.employees.length)
        this.employee = this.employees[inx];
      }, 20);

      setTimeout(() => { 
        clearInterval(timer);
        this.isRandom = false;
        this.isResult = true;

        this.page = 1; 
      }, 4000)

    } else if(this.employees.length == 1) {
        this.isRandom = false;
        this.isResult = true;
        this.employee = this.employees[0];

    } else {
      alert('ไม่มีรายชื่อผู้ร่วมงานที่สามารถจับรางวัลได้')
    }
  }

  cancel() {
    this.isResult = false;
    this.employee = <Employee>{};
    this.employee.fullName = '...';

  }

  ok1() {
    this._emplySrv.setPresent(this.employee, this.present.name);

    if(this.employees.length == 1) {
      this.employees = [];
    } else {
      this.refreshEmployees();
    }

    this.cancel();
  }

}
