import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
//import { TableDataSource, ValidatorService } from 'angular4-material-table';

import { PromoGrupValidatorService } from './promo-grup-validator.service'; 
import { Promocion } from '../promocion'; //clase

@Component({
  selector: 'app-tabla-promo-grup',
//  providers: [{provide: ValidatorService, useClass: PromoGrupValidatorService }],
  templateUrl: './tabla-promo-grup.component.html',
  styleUrls: ['./tabla-promo-grup.component.scss']
})
export class TablaPromoGrupComponent implements OnInit {

  dataSource: any;

  constructor(//private promoGrupValidator: ValidatorService
    ) { }

  displayedColumns = ['fecha_ini', 'fecha_fin', 'segmento_id', 'rango_ini', 'rango_fin', 
  'producto_promo_id', 'medida_promo_id', 'cantidad_promo', 'descuento_promo', 'valor_adicional', 'actionsColumn'];

  @Input() promoList = [
    { id: 1, aplicacion: 'Grupal', fecha_ini: '20200811', fecha_fin: '20201231', rango: true, rango_ini: 1, rango_fin: 100, cantidad_promo: 2, descuento_promo: 16, valor_adicional:4.0010, precio_ini: 4.00790, precio_fin: 4.12790, facturable: true, producto_id: 4, medida_id:'Unidad', grupo_productos_id: 1, segmento_id:'Mayorista', producto_promo_id: 1, medida_promo_id: 1 },
    { id: 2, aplicacion: 'Grupal', fecha_ini: '20200811', fecha_fin: '20201231', rango: true, rango_ini: 1, rango_fin: 100, cantidad_promo: 2, descuento_promo: 22, valor_adicional:4.0010, precio_ini: 4.00260, precio_fin: 4.12260, facturable: true, producto_id: 4, medida_id:'Unidad', grupo_productos_id: 1, segmento_id:'Distribuidor', producto_promo_id: 1, medida_promo_id: 1 },
    { id: 3, aplicacion: 'Grupal', fecha_ini: '20200811', fecha_fin: '20201231', rango: true, rango_ini: 1, rango_fin: 100, cantidad_promo: 2, descuento_promo: 24, valor_adicional:4.0010, precio_ini: 3.94100, precio_fin: 3.12790, facturable: true, producto_id: 3, medida_id:'Unidad', grupo_productos_id: 2, segmento_id:'Tarjeta de crédito', producto_promo_id: 1, medida_promo_id: 1 },
    { id: 4, aplicacion: 'Grupal', fecha_ini: '20200811', fecha_fin: '20201231', rango: true, rango_ini: 1, rango_fin: 100, cantidad_promo: 2, descuento_promo: 26, valor_adicional:4.0010, precio_ini: 3.01220, precio_fin: 3.12790, facturable: true, producto_id: 3, medida_id:'Unidad', grupo_productos_id: 2, segmento_id:'Cliente Final', producto_promo_id: 1, medida_promo_id: 1 },
  ];

  @Output() promoListChange = new EventEmitter<Promocion[]>();

  //dataSource: TableDataSource<Promocion>;

  ngOnInit() {
  //  this.dataSource = new TableDataSource<any>(this.promoList, Promocion, this.promoGrupValidator);
  //  this.dataSource.datasourceSubject.subscribe(promoList => this.promoListChange.emit(promoList));
  }

}
