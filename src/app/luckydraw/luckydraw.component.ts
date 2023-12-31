import { HostListener, Component } from '@angular/core';
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

  public participants: Employee[] = [];

  constructor(
    private _prsntSrv: PresentService,
    private _emplySrv: EmployeeService) {}

  ngOnInit(): void {
    this.employee.fullName = '...';

    for(let i=0; i<10; i++) {
      let p = <Employee>{};
      p.fullName = "-";
      this.participants.push(p);
    }
  }

  @HostListener('window:keyup',['$event'])
  handleKeyUp(event: KeyboardEvent) {

    if(this.page == 0 && event.code == 'KeyS') {
      this.startLuckyDraw();
    }

    if(this.page == 1 && event.code == 'KeyR') {
      this.random1();
    }

    if(this.page == 1 && event.code == 'KeyC') {
      this.cancel1();
    }

    if(this.page == 1 && event.code == 'KeyK') {
      this.ok1();
    }

    //------------------------------------------
    if(this.page == 2 && event.code == 'KeyR') {
      this.random2();
    }

    if(this.page == 2 && event.code == 'KeyC') {
      this.cancel2();
    }

    if(this.page == 2 && event.code == 'KeyK') {
      this.ok2();
    }
  }

  startLuckyDraw() {
    this.page = 1;
    this.refreshPresent();
  }

  checkPage() {
    if(this.present.qty < 10) {
      this.page = 1;
    } else {
      this.page = 2;
    }
  }

  refreshPresent() {
    this._prsntSrv.findDrawable().pipe(first()).subscribe(s => {
      this.presents = s;
      this.presents.sort((a,b) => a.order - b.order);
      this.present = this.presents[0];

      if(this.page > 0) {
        this.checkPage();
      }

      this.refreshEmployees();
    });
  }

  refreshEmployees() {
    this._emplySrv.findParticipants().pipe(first()).subscribe(s => {
      if(s.length>10) {
        this.employees = s.slice(0,10);

      } else {
        this.employees = [...s];
      }
    });
  }

  random1() {
    if(this.employees.length > 1 && !this.isRandom) {
      this.isRandom = true;
      this.isResult = false;

      let timer = setInterval(() => {
        let inx = Math.floor(Math.random() * this.employees.length)
        this.employee = this.employees[inx];
      }, 30);

      setTimeout(() => { 
        clearInterval(timer);
        this.isRandom = false;
        this.isResult = true;

        this.page = 1; 
      }, 6000)

    } else if(this.employees.length == 1) {
        this.isRandom = false;
        this.isResult = true;
        this.employee = this.employees[0];

    } else {
      alert('ไม่มีรายชื่อผู้ร่วมงานที่สามารถจับรางวัลได้')
    }
  }

  async ok1() {
    await this._emplySrv.givePresent1(this.employee, this.present.name);
    await this._prsntSrv.pick1(this.present);

    setTimeout(()=>{
      this.refreshPresent();
      this.isResult = false;
      this.employee = <Employee>{};
      this.employee.fullName = '...';

      this.checkPage();
    }, 100);
  }

  async cancel1() {
    await this._emplySrv.cancelPresent(this.employee, this.present);
    this.isResult = false;
    this.employee = <Employee>{};
    this.employee.fullName = '...';
  }

  random2() {
    let remain = this.present.qty - this.present.give;

    if(this.employees.length > 1 && !this.isRandom) {
      this.isRandom = true;
      this.isResult = false;
      let len: number;

      let timer = setInterval(() => {
        for(let i=this.employees.length-1; i >= 0; i--) {
          let inx = Math.floor(Math.random() * this.employees.length);
          [this.employees[i], this.employees[inx]] = [this.employees[inx], this.employees[i]];       
        }

        this.participants = [...this.employees.slice(0,remain)];
        len = this.participants.length;

        for(let i=len; i<10; i++) {
          let p = <Employee>{};
          p.fullName = "-";
          this.participants.push(p);
        }
      }, 80);
      
      setTimeout(() => {
        clearInterval(timer);
          this.isRandom = false;
          this.isResult = true;

      }, 6000);

    } else {
      alert('ไม่มีรายชื่อผู้ร่วมงานที่สามารถจับรางวัลได้')
    }
  }

  async ok2() {
    let p = this.participants.filter(s => s.fullName != "-");
    await this._emplySrv.givePresent2(p, this.present.name);
    await this._prsntSrv.pick2(this.present, p.length);

    setTimeout(()=>{
      this.refreshPresent();
      this.isResult = false;
      this.participants = [];

      for(let i=0; i<10; i++) {
        let p = <Employee>{};
        p.fullName = "-";
        this.participants.push(p);
      }

      this.checkPage();
    }, 100);
  }

  cancel2() {
    this.isResult = false;
    
    this.participants.forEach(async s => {
      if(s.id != undefined) {
        await this._emplySrv.cancelPresent(s, this.present);
      }
    });

    setTimeout(() => {
      this.participants = [];

      for(let i=0; i<10; i++) {
        let p = <Employee>{};
        p.fullName = "-";
        this.participants.push(p);
      }

      this.refreshPresent();
    }, 300);
  }
}
