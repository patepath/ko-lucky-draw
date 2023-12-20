import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

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

  ngAfterViewInit(): void {
    this.textcode.nativeElement.focus();
  }

  checkQRCode(qr: NgForm) {
    console.log(qr.value['textcode']);
  }

}
