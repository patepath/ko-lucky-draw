import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.css'
})
export class CheckinComponent {
  @ViewChild('textcode')
  textcode!: ElementRef<HTMLInputElement>;

  constructor(
    private _emplySrv: EmployeeService,
    private _route: ActivatedRoute, 
    private _router: Router) {

  }

  ngAfterViewInit(): void {
    this.textcode.nativeElement.focus();
  }

  checkQRCode(qr: NgForm) {

    this._emplySrv.findByCode(qr.value['textcode']).subscribe(s => {
      if(s.length > 0) {
        this._router.navigate(['/welcome'], { queryParams: { id: s[0].id}})
      } else {
        alert('not found');
      }
    });
  }

  search() {
    this._router.navigate(['/search'])
  }

}
