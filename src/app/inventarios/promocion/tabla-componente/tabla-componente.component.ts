import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
//import { TableDataSource, ValidatorService } from 'angular4-material-table';

import { ComponenteValidatorService } from './componente-validator.service'; 
import { Componente } from '../componente'; //clase

@Component({
  selector: 'app-tabla-componente',
//  providers: [{provide: ValidatorService, useClass: ComponenteValidatorService }],
  templateUrl: './tabla-componente.component.html',
  styleUrls: ['./tabla-componente.component.scss']
})
export class TablaComponenteComponent implements OnInit {

  constructor(//private componenteValidator: ValidatorService
    ) { }

  displayedColumnsComponente: string[] = ['producto_id', 'medida_id', 'cantidad', 'valor','actionsColumn'];

  @Input() componenteList = [
    { id: 1, producto_id: 'producto de combo1', medida_id: 'unidad', cantidad: 1, valor: 3.15 },
    { id: 2, producto_id: 'producto de combo1', medida_id: 'unidad', cantidad: 1, valor: 2.14 },
    { id: 3, producto_id: 'producto de combo4', medida_id: 'unidad', cantidad: 2, valor: 6.35 },
    { id: 4, producto_id: 'producto de combo4', medida_id: 'unidad', cantidad: 2, valor: 7.19 }
  ];

  @Output() componenteListChange = new EventEmitter<Componente[]>();

  //dataSourceComponente: TableDataSource<Componente>;
  dataSourceComponente: any;

  ngOnInit() {
  //  this.dataSourceComponente = new TableDataSource<any>(this.componenteList, Componente, this.componenteValidator);
  //  this.dataSourceComponente.datasourceSubject.subscribe(componenteList => this.componenteListChange.emit(componenteList));
  }

}
