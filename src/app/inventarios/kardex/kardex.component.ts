import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';
import { Producto } from '../../modelos/producto';
import { ProductoService } from '../../servicios/producto.service';
import { Kardex } from '../../modelos/kardex';
import { KardexService } from '../../servicios/kardex.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sesion } from 'src/app/modelos/sesion';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.scss']
})
export class KardexComponent implements OnInit {

  sesion: Sesion=null;
  abrirPanelAsignarKardex: boolean = true;
  deshabilitarEditarKardex: boolean = true;
  deshabilitarFiltroKardex: boolean = true;
  verActualizarKardex: boolean = false;
  verActualizarProducto: boolean = false;
  editarKardex: boolean = true;

  producto: Producto = new Producto();
  kardex: Kardex = new Kardex();

  codigoEquivalente: string = "";

  kardexs: Kardex[] = [];

  //Variables para los autocomplete
  productos: Producto[]=[];
  controlProducto = new FormControl();
  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltroKardex") inputFiltroKardex: ElementRef;

  columnasKardex: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Kardex) => `${row.id}` },
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: Kardex) => `${this.datepipe.transform(row.fecha, 'dd/MM/yyyy') } ` },
    { nombreColumna: 'documento', cabecera: 'Documento', celda: (row: Kardex) => `${row.documento}` },
    { nombreColumna: 'numero', cabecera: 'Numero', celda: (row: Kardex) => `${row.numero}` },
    { nombreColumna: 'operacion', cabecera: 'Operacion', celda: (row: Kardex) => `${row.operacion}` },
    { nombreColumna: 'entrada', cabecera: 'Entrada', celda: (row: Kardex) => `${row.entrada}` },
    { nombreColumna: 'salida', cabecera: 'Salida', celda: (row: Kardex) => `${row.salida}` },
    { nombreColumna: 'cantidad', cabecera: 'Cantidad', celda: (row: Kardex) => `${row.cantidad}` },
    { nombreColumna: 'debe', cabecera: 'Debe', celda: (row: Kardex) => `${row.debe}` },
    { nombreColumna: 'haber', cabecera: 'Haber', celda: (row: Kardex) => `${row.haber}` },
    { nombreColumna: 'costo_promedio', cabecera: 'Costo Prom.', celda: (row: Kardex) => `${row.costoPromedio}` }
  ];
  cabeceraKardex: string[] = this.columnasKardex.map(titulo => titulo.nombreColumna);
  dataSourceKardex: MatTableDataSource<Kardex>;
  observableDSKardex: BehaviorSubject<MatTableDataSource<Kardex>> = new BehaviorSubject<MatTableDataSource<Kardex>>(null);
  clickedRows = new Set<Kardex>();
  
  constructor(private renderer: Renderer2, private productoService: ProductoService, public datepipe: DatePipe,
              private kardexService: KardexService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion = util.validarSesion(this.sesionService, this.router);
    this.consultarProductos();
    this.filtroProductos = this.controlProducto.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(producto => typeof producto === 'string' ? this.filtroProducto(producto) : this.productos.slice())
      );
  }

  limpiar(){
    this.producto = new Producto();
    this.controlProducto.patchValue('');
    this.kardex = new Kardex();
    this.editarKardex = true;
    this.clickedRows.clear();
    this.borrarFiltroKardex();
    this.deshabilitarFiltroKardex = true;
    this.observableDSKardex = new BehaviorSubject<MatTableDataSource<Kardex>>(null);
  };

  actualizarProducto(event: any){
    if (event!=null)
      event.preventDefault();
    if (this.producto.nombre == '') {
        Swal.fire(constantes.error, constantes.error_nombre_producto, constantes.error_swal);
        return;
    }
    console.log(this.producto);
    //this.producto.kardexs[0].proveedor = new Proveedor;
    this.productoService.actualizar(this.producto).subscribe({
      next: (res) => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.limpiar();
        //this.consultar();
      },
      error: (err) => {
        Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.editarKardex = true;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.kardexService.actualizar(this.kardex).subscribe({
      next: res => {
        this.kardex = res.resultado as Kardex;
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.kardexService.eliminar(this.kardex).subscribe({
      next: res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarKardex() {
    this.kardexService.consultar().subscribe({
      next: res => {
        this.kardexs = res.resultado as Kardex[]
        this.llenarTablaKardex(this.kardexs);
      },
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaKardex(kardexs: Kardex[]) {
    this.ordenarAsc(kardexs, 'id');
    this.dataSourceKardex = new MatTableDataSource(kardexs);
    this.dataSourceKardex.paginator = this.paginator;
    this.dataSourceKardex.sort = this.sort;
    this.observableDSKardex.next(this.dataSourceKardex);
  }

  seleccion(kardex: Kardex) {
    if (!this.clickedRows.has(kardex)) {
      this.clickedRows.clear();
      this.clickedRows.add(kardex);
      this.kardex = kardex;
      this.editarKardex = false;
    } else {
      this.clickedRows.clear();
    }
  }

  filtroKardex(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceKardex.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceKardex.paginator) {
      this.dataSourceKardex.paginator.firstPage();
    }
  }
  borrarFiltroKardex() {
    this.renderer.setProperty(this.inputFiltroKardex.nativeElement, 'value', '');
    this.dataSourceKardex.filter = '';
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
      error: err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
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
  seleccionarProducto(){
    this.producto = this.controlProducto.value as Producto;
    this.kardexs = this.producto.kardexs;
    if (this.kardexs.length > 0) {
      this.llenarTablaKardex(this.kardexs);
      this.deshabilitarFiltroKardex = false;
    }
  }


}
