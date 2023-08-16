import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { DatePipe } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';
import { startWith, map, Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Producto } from '../../../modelos/inventario/producto';
import { ProductoService } from '../../../servicios/inventario/producto.service';
import { Kardex } from '../../../modelos/inventario/kardex';
import { KardexService } from '../../../servicios/inventario/kardex.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Empresa } from '../../../modelos/usuario/empresa';


@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.scss']
})
export class KardexComponent implements OnInit {

  abrirPanelAdmin: boolean = true;
  productoSeleccionado: boolean = false;

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  producto: Producto = new Producto();
  kardex: Kardex = new Kardex();
  kardexs: Kardex[] = [];

  //Variables para los autocomplete
  productos: Producto[]=[];
  controlProducto = new UntypedFormControl();
  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  columnas: any[] = [
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: Kardex) => `${this.datepipe.transform(row.fecha, 'dd-MM-yyyy') } ` },
    { nombreColumna: 'documento', cabecera: 'Documento', celda: (row: Kardex) => `${row.tipoComprobante.abreviatura}` },
    { nombreColumna: 'comprobante', cabecera: 'Comprobante', celda: (row: Kardex) => `${row.referencia}` },
    { nombreColumna: 'operacion', cabecera: 'Operacion', celda: (row: Kardex) => `${row.tipoOperacion.abreviatura}` },
    { nombreColumna: 'entrada', cabecera: 'Entrada', celda: (row: Kardex) => `${row.entrada}` },
    { nombreColumna: 'salida', cabecera: 'Salida', celda: (row: Kardex) => `${row.salida}` },
    { nombreColumna: 'saldo', cabecera: 'Saldo', celda: (row: Kardex) => `${row.saldo}` },
    { nombreColumna: 'debe', cabecera: 'Debe', celda: (row: Kardex) => `${row.debe}` },
    { nombreColumna: 'haber', cabecera: 'Haber', celda: (row: Kardex) => `${row.haber}` },
    { nombreColumna: 'promedio', cabecera: 'Costo Prom.', celda: (row: Kardex) => `${row.costoPromedio}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: Kardex) => `${row.costoTotal}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Kardex>;
  clickedRows = new Set<Kardex>();
  
  constructor(private productoService: ProductoService, public datepipe: DatePipe,
              private kardexService: KardexService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.empresa;
    this.consultarProductos();
    this.filtroProductos = this.controlProducto.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(producto => typeof producto === 'string' ? this.filtroProducto(producto) : this.productos.slice())
      );
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
    this.producto = new Producto();
    this.kardex = new Kardex();
    this.controlProducto.patchValue('');
    this.productoSeleccionado = false;
    this.dataSource = new MatTableDataSource();
    this.clickedRows.clear();
  };

  crear(event){

  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.kardexService.actualizar(this.kardex).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarProducto(){
    let productoId = this.controlProducto.value.id;
    this.productoService.obtener(productoId).subscribe({
      next: res => {
        this.producto = res.resultado as Producto;
        this.consultarKardex(this.producto.id);
        this.productoSeleccionado = true;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarKardex(productoId: number){
    this.kardexService.consultarPorProducto(productoId).subscribe({
      next: res => {
        this.kardexs = res.resultado as Kardex[];
        this.llenarTablaKardex(this.kardexs);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });

  }

  llenarTablaKardex(kardexs: Kardex[]) {
    //this.ordenarAsc(kardexs, 'fecha');
    this.dataSource = new MatTableDataSource(kardexs);
    this.dataSource.filterPredicate = (data: Kardex, filter: string): boolean =>
    this.datepipe.transform(data.fecha, valores.fechaCorta).includes(filter) || data.tipoComprobante.abreviatura.includes(filter) || data.referencia.includes(filter) || 
    data.tipoOperacion.abreviatura.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccion(kardex: Kardex) {
    if (!this.clickedRows.has(kardex)) {
      this.clickedRows.clear();
      this.clickedRows.add(kardex);
      this.kardex = kardex;
    } else {
      this.clickedRows.clear();
    }
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  consultarProductos() {
    this.productoService.consultar().subscribe({
      next: (res) => {
        this.productos = res.resultado as Producto[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }

  private filtroProducto(value: string): Producto[] {
    if(this.productos.length>0) {
      const filterValue = value.toLowerCase();
      return this.productos.filter(producto => producto.nombre.toLowerCase().includes(filterValue));
    }
    return [];
  }
  
  verProducto(producto: Producto): string {
    return producto && producto.nombre ? producto.nombre : '';
  }
}
