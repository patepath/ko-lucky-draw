import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thankyou',
  standalone: true,
  imports: [],
  templateUrl: './thankyou.component.html',
  styleUrl: './thankyou.component.css'
})
export class ThankyouComponent {

  constructor(private _router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this._router.navigate(['/']);
    }, 1500);
  }
}
