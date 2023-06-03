import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
//import { TableDataSource, ValidatorService } from 'angular4-material-table';
import { Combo } from '../combo'; //clase

@Component({
  selector: 'app-tabla-combo',
//  providers: [{provide: ValidatorService, useClass: ComboValidatorService }],
  templateUrl: './tabla-combo.component.html',
  styleUrls: ['./tabla-combo.component.scss']
})
export class TablaComboComponent implements OnInit {

  dataSourceCombo: any;

  constructor(//private comboValidator: ValidatorService
    ) { }

  displayedColumnsCombo: string[] = ['nombre', 'descripcion', 'facturable', 'precio_real', 'precio_combo', 'actionsColumn'];

  @Input() comboList = [
    { id: 1, nombre: 'combo1', descripcion: 'Desc combo', facturable: true, precio_real:4.0010, precio_combo:3.0010, grupo_productos_id: 1 },
    { id: 2, nombre: 'combo2', descripcion: 'Desc combo', facturable: true, precio_real:4.0010, precio_combo:3.0010, grupo_productos_id: 1 },
    { id: 3, nombre: 'combo3', descripcion: 'Desc combo', facturable: true, precio_real:4.0010, precio_combo:3.0010, grupo_productos_id: 2 },
    { id: 4, nombre: 'combo4', descripcion: 'Desc combo', facturable: true, precio_real:4.0010, precio_combo:3.0010, grupo_productos_id: 2 }
  ];

  @Output() comboListChange = new EventEmitter<Combo[]>();

  //dataSourceCombo: TableDataSource<Combo>;

  ngOnInit() {
  //  this.dataSourceCombo = new TableDataSource<any>(this.comboList, Combo, this.comboValidator);
  //  this.dataSourceCombo.datasourceSubject.subscribe(comboList => this.comboListChange.emit(comboList));
  }

}
