import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
//import { TableDataSource, ValidatorService } from 'angular4-material-table';

import { PromoIndValidatorService } from './promo-ind-validator.service'; 
import { Promocion } from '../../../../componentes/inventario/promocion/promocion'; //clase

@Component({
  selector: 'app-tabla-promo-ind',
//  providers: [{provide: ValidatorService, useClass: PromoIndValidatorService }],
  templateUrl: './tabla-promo-ind.component.html',
  styleUrls: ['./tabla-promo-ind.component.scss']
})
export class TablaPromoIndComponent implements OnInit {

  dataSource: any;

  constructor(//private promoIndValidator: ValidatorService 
    ) { }

  displayedColumns = ['fecha_ini', 'fecha_fin', 'segmento_id', 'rango_ini', 'rango_fin', 
  'producto_promo_id', 'medida_promo_id', 'cantidad_promo', 'descuento_promo', 'precio_fin', 'actionsColumn'];

  @Input() promoList = [
    { id: 1, aplicacion: 'Individual', fecha_ini: '20200811', fecha_fin: '20201231', rango: true, rango_ini: 1, rango_fin: 100, cantidad_promo: 2, precio_promo:4.0010, descuento_promo: 16, precio_ini: 4.00790, precio_fin: 4.12790, facturable: true, producto_id: 4, medida_id:'Unidad', grupo_productos_id: 1, segmento_id:'Mayorista', producto_promo_id: 1, medida_promo_id: 1 },
    { id: 2, aplicacion: 'Individual', fecha_ini: '20200811', fecha_fin: '20201231', rango: true, rango_ini: 1, rango_fin: 100, cantidad_promo: 2, precio_promo:4.0010, descuento_promo: 22, precio_ini: 4.00260, precio_fin: 4.12260, facturable: true, producto_id: 4, medida_id:'Unidad', grupo_productos_id: 1, segmento_id:'Distribuidor', producto_promo_id: 1, medida_promo_id: 1 },
    { id: 3, aplicacion: 'Individual', fecha_ini: '20200811', fecha_fin: '20201231', rango: true, rango_ini: 1, rango_fin: 100, cantidad_promo: 2, precio_promo:4.0010, descuento_promo: 24, precio_ini: 3.94100, precio_fin: 3.12790, facturable: true, producto_id: 3, medida_id:'Unidad', grupo_productos_id: 2, segmento_id:'Tarjeta de crédito', producto_promo_id: 1, medida_promo_id: 1 },
    { id: 4, aplicacion: 'Individual', fecha_ini: '20200811', fecha_fin: '20201231', rango: true, rango_ini: 1, rango_fin: 100, cantidad_promo: 2, precio_promo:4.0010, descuento_promo: 26, precio_ini: 3.01220, precio_fin: 3.12790, facturable: true, producto_id: 3, medida_id:'Unidad', grupo_productos_id: 2, segmento_id:'Cliente Final', producto_promo_id: 1, medida_promo_id: 1 },
    { id: 5, aplicacion: 'Individual', fecha_ini: '20200811', fecha_fin: '20201231', rango: true, rango_ini: 1, rango_fin: 100, cantidad_promo: 2, precio_promo:12.006, descuento_promo: 16, precio_ini: 12.8110, precio_fin: 12.1279, facturable: true, producto_id: 9, medida_id:'Quintal',grupo_productos_id: 3, segmento_id:'Mayorista', producto_promo_id: 1, medida_promo_id: 1 },
    { id: 6, aplicacion: 'Individual', fecha_ini: '20200811', fecha_fin: '20201231', rango: true, rango_ini: 1, rango_fin: 100, cantidad_promo: 2, precio_promo:12.006, descuento_promo: 22, precio_ini: 12.0107, precio_fin: 12.1279, facturable: true, producto_id: 1, medida_id:'Quintal',grupo_productos_id: 3, segmento_id:'Distribuidor', producto_promo_id: 1, medida_promo_id: 1  },
    { id: 7, aplicacion: 'Individual', fecha_ini: '20200811', fecha_fin: '20201231', rango: true, rango_ini: 1, rango_fin: 100, cantidad_promo: 2, precio_promo:12.006, descuento_promo: 24, precio_ini: 12.0067, precio_fin: 12.1279, facturable: true, producto_id: 1, medida_id:'Quintal',grupo_productos_id: 4, segmento_id:'Tarjeta de crédito', producto_promo_id: 1, medida_promo_id: 1  },
    { id: 8, aplicacion: 'Individual', fecha_ini: '20200811', fecha_fin: '20201231', rango: true, rango_ini: 1, rango_fin: 100, cantidad_promo: 2, precio_promo:12.006, descuento_promo: 26, precio_ini: 12.9994, precio_fin: 12.1279, facturable: true, producto_id: 1, medida_id:'Quintal',grupo_productos_id: 4, segmento_id:'Cliente Final', producto_promo_id: 1, medida_promo_id: 1  },
  ];

  @Output() promoListChange = new EventEmitter<Promocion[]>();

 // dataSource: TableDataSource<Promocion>;

  ngOnInit() {
 //   this.dataSource = new TableDataSource<any>(this.promoList, Promocion, this.promoIndValidator);
 //   this.dataSource.datasourceSubject.subscribe(promoList => this.promoListChange.emit(promoList));
  }

}
