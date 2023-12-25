import { Component } from '@angular/core';
import { Employee } from '../models/employee';
import { Report1Service } from '../services/report1.service';
import { first } from 'rxjs/operators';

declare var $:any;
declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

@Component({
  selector: 'app-report1',
  standalone: true,
  imports: [],
  templateUrl: './report1.component.html',
  styleUrl: './report1.component.css'
})
export class Report1Component {

	public dataTable!: DataTable;
	public data!: string[][];

  public emplies: Employee[] = [];
  public emply: Employee = <Employee>{};

  public totalAmount: number = 0;
  public qrcodeAmount: number = 0;

  constructor(private _rprtSrv: Report1Service) {

    this.dataTable = {
      headerRow: ['รหัส', 'ชื่อ-นามสกุล', 'ลงทะเบียนโดย', 'เวลา', 'ของขวัญที่ได้', 'หมายเหตุ' ],
      footerRow: ['รหัส', 'ชื่อ-นามสกุล', 'ลงทะเบียนโดย', 'เวลา', 'ของขวัญที่ได้', 'หมายเหตุ' ],
      dataRows: [],
    };
  }

  ngOnInit(): void {
    this._rprtSrv.getTotalAmount().then(s => this.totalAmount = s);
    this._rprtSrv.getQRCodeAmount().then(s => this.qrcodeAmount = s);
  }

  ngAfterViewInit(): void {
		let self = this;

		let table = $('#report1-table').DataTable({
			dom: 'Bfrtip',
			responsive: true,
      buttons: ['excel', 'print'],
			columnDefs: [ 
        { targets: [0, 5], width: '5em', className: 'text-center' },
        { targets: [2, 3], width: '8em', className: 'text-center' },
        { targets: [4], className: 'text-center' }
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

    self.getParticipants();
  }

  refresh() {
		let table = $('#report1-table').DataTable();
		table.clear();
    this.data = [];

    console.log(this.emplies);
  
    if(this.emplies.length > 0) {
      this.emplies.forEach(s => {
        this.data.push([
          s.code == undefined ? '' : s.code, 
          s.code == undefined ? '' : s.fullName,
          s.checkType == undefined ? '' : s.checkType == 1 ? 'QR Code' : 'Search',
          s.checkTime == undefined  || s.checkTime == '' ? '' : s.checkTime.split(' ')[1],
          s.present,
          s.isCancel ? 'สละสิทธิ์' : ''
        ]);
      });

      table.rows.add(this.data)
    }

    table.draw();
  }

  getParticipants() {
    this._rprtSrv.getAllPaticipants().pipe(first()).subscribe(s => {
      if(s) {
        this.emplies = s;
        this.refresh();
      } 
    });
  }

}
