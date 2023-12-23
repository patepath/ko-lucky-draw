import { Component } from '@angular/core';
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';

declare var $:any;
declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {

	public dataTable!: DataTable;
	public data!: string[][];

  public emplies: Employee[] = [];
  public emply: Employee = <Employee>{};
  public curIndex: number = -1;

  constructor(private emplyServ: EmployeeService) {

    this.dataTable = {
      headerRow: ['รหัส', 'ชื่อ-นามสกุล', 'ลงทะเบียน', 'ของขวัญที่ได้', 'สละสิทธิ์' ],
      footerRow: ['รหัส', 'ชื่อ-นามสกุล', 'ลงทะเบียน', 'ของขวัญที่ได้', 'สละสิทธิ์' ],
      dataRows: [],
    };

    this.emply.isCheck = false;
    this.emply.present = '';
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
		let self = this;

		let table = $('#employee-table').DataTable({
			dom: 'frtip',
			responsive: true,
			columnDefs: [ 
        { targets: [0, 2, 4], width: '5em', className: 'text-center' },
        { targets: [3], className: 'text-center' }
      ],
			language: {
				search: "_INPUT_",
				searchPlaceholder: "Search records",
			},
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
        self.emply = self.emplies[self.curIndex];
      }
		});

    self.findAll();
  }

  refresh() {
		let table = $('#employee-table').DataTable();
		table.clear();
    this.data = [];
  
    if(this.emplies.length > 0) {
      this.emplies.forEach(s => {
        this.data.push([
          s.code, 
          s.fullName,
          s.checkTime == '' ? '' : s.checkTime.split(' ')[1],
          s.present,
          s.isCancel ? '/' : ''
        ]);
      });

      table.rows.add(this.data)
    }

    table.draw();
  }

  findAll() {
    this.emplyServ.findAll().pipe(first()).subscribe(s => {
      this.emplies = s;
      this.refresh();
    });
  }

  async reset() { 
    let emplys: Employee[]= []; 

    this.emplyServ.findAll().pipe(first()).subscribe(async s =>{
      emplys = <Employee[]>s;

      for(let i=0; i < emplys.length; i++) {
        await this.emplyServ.resetCheckin(emplys[i].id);
      }

      alert('Finished...')
    });

  }

  newEmply() {
    this.emply = <Employee>{};
    this.emply.id = '';
    this.emply.isCheck = false;
    this.emply.present = '';
  }

  checkCheckin() {
    if(this.emply.isCheck) {
      this.emply.checkTime = new Date().toLocaleString();

    } else {
      this.emply.checkTime = '';
    }
  }

  async saveEmployee() {
    if(this.emply.id === '') {
      await this.emplyServ.add(this.emply);

    } else {
      await this.emplyServ.edit(this.emply);
    }

    this.newEmply();
  }

  async removeEmployee() {
    if(confirm("ต้องการที่จะลบข้อมูลพนักงานหรือไม่?")) {
      await this.emplyServ.remove(this.emply);
    }
  }

}
