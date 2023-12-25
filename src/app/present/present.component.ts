import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Present } from '../models/present';
import { PresentService } from '../services/present.service';
import { first } from 'rxjs/operators';

declare var $:any;
declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

@Component({
  selector: 'app-present',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './present.component.html',
  styleUrl: './present.component.css'
})
export class PresentComponent {
	public dataTable!: DataTable;
	public data!: string[][];

  public presents: Present[] = [];
  public present: Present = <Present>{};
  public curIndex: number = -1;

  constructor(private _presentSrv: PresentService) { 
    this.dataTable = {
      headerRow: ['ลำดับที่', 'ชื่อของขวัญ', 'จำนวน', 'แจกไป' ],
      footerRow: ['ลำดับที่', 'ชื่อของขวัญ', 'จำนวน', 'แจกไป' ],
      dataRows: [],
    };
    
    this.newPresent();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
		let self = this;

		let table = $('#present-table').DataTable({
			dom: 'frtip',
			responsive: true,
			language: {
				search: "_INPUT_",
				searchPlaceholder: "Search records",
			},
			columnDefs: [ { 
        targets: [0, 2, 3], width: '5em', className: 'text-center' } 
      ],
      paging: true,
      pageLenght: 10,
			pagingType: "full_numbers",
		});

    table.on('mouseover', 'tr', function(this: any) {
      $(this).css('cursor', 'pointer');
			$(this).css('font-weight', 'bold');
    })

    table.on('mouseout', 'tr', function(this: any) {
			$(this).css('font-weight', 'normal');
    })

		table.on('click', 'td', function(this: any) {
      self.curIndex = table.row(this).index();

      if(self.curIndex > -1) {
        self.present = self.presents[self.curIndex];
      }
		});

    self.findAll();
  }

  refresh() {
		let table = $('#present-table').DataTable();
		table.clear();
    this.data = [];
  
    if(this.presents.length > 0) {
      this.presents.forEach(s => {
        this.data.push([
          String(s.order),
          s.name,
          String(s.qty),
          s.give === undefined ? '' : String(s.give),
        ]);
      });

      table.rows.add(this.data)
    }

    table.draw();
  }

  findAll() {
    this._presentSrv.findAll().pipe(first()).subscribe(s => {
      this.presents = s;
      this.refresh();
    });
  }

  newPresent() {
    this.present = <Present>{};
    this.present.id = '';
    this.present.order = 0;
    this.present.name = '';
    this.present.qty = 0;
    this.present.give = 0;
    this.present.isEmpty = false;
  }

  async savePresent() {
    if(this.present.name != '') {

      if(this.present.qty > this.present.give) {
        this.present.isEmpty = false;
      } else {
        this.present.isEmpty = true;
      }

      if(this.present.id == '') {
        await this._presentSrv.add(this.present);
        this.newPresent();

      } else {
        this.present.isEmpty = this.present.qty <= this.present.give
        await this._presentSrv.edit(this.present);
        this.newPresent();
      }

      this.findAll();
    }
  }

  async clearLuckyDraw() {
    await this._presentSrv.clearLuckyDraw();
    this.findAll();
    alert('Finished...');
  }
 
  async removePresent() {
    if(this.present.id != '') {
      if(confirm("ต้องการที่จะลบข้อมูลของขวัญหรือไม่?")) {
        await this._presentSrv.remove(this.present);
        this.newPresent();
      }
    }
  }
}
