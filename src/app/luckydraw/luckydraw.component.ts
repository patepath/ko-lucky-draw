import { Component } from '@angular/core';

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

  setPage(page: number) {
    this.page = page;
  }
}
