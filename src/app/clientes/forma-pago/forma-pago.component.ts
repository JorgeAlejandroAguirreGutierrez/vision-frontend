import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { FormaPago } from '../../modelos/cliente/forma-pago';
import { FormaPagoService } from '../../servicios/cliente/forma-pago.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-forma-pago',
  templateUrl: './forma-pago.component.html',
  styleUrls: ['./forma-pago.component.scss']
})

export class FormaPagoComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevoFormaPago: boolean = true;
  abrirPanelAdminFormaPago: boolean = false;
  editarFormaPago: boolean = true;

  sesion: Sesion=null;
  formaPago= new FormaPago();
  formaPagos: FormaPago[];

  columnasFormaPago: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: FormaPago) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: FormaPago) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: FormaPago) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: FormaPago) => `${row.abreviatura}` },
    { nombreColumna: 'codigoSri', cabecera: 'Código SRI', celda: (row: FormaPago) => `${row.codigoSri}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: FormaPago) => `${row.estado}` }
  ];
  cabeceraFormaPago: string[] = this.columnasFormaPago.map(titulo => titulo.nombreColumna);
  dataSourceFormaPago: MatTableDataSource<FormaPago>;
  observableDSFormaPago: BehaviorSubject<MatTableDataSource<FormaPago>> = new BehaviorSubject<MatTableDataSource<FormaPago>>(null);
  clickedRows = new Set<FormaPago>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltroFormaPago") inputFiltroFormaPago: ElementRef;

  constructor(private renderer: Renderer2, private formaPagoService: FormaPagoService,
        private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarFormaPagos();
  }
  
  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'E') // SHIFT + E
      this.eliminar(null);
  }

  limpiar() {
    this.formaPago = new FormaPago();
    this.editarFormaPago = true;
    this.clickedRows.clear();
    this.borrarFiltroFormaPago();
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.limpiar();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.formaPagoService.crear(this.formaPago).subscribe({
      next: res => {
        this.formaPago = res.resultado as FormaPago;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.formaPagos.push(this.formaPago);
        this.llenarTablaFormaPago(this.formaPagos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.editarFormaPago = true;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.formaPagoService.actualizar(this.formaPago).subscribe({
      next: res => {
        this.formaPago = res.resultado as FormaPago;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.formaPagoService.eliminarPersonalizado(this.formaPago).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarFormaPagos() {
    this.formaPagoService.consultar().subscribe({
      next: res => {
        this.formaPagos = res.resultado as FormaPago[];
        //console.log(this.formaPagos);
        this.llenarTablaFormaPago(this.formaPagos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaFormaPago(formaPagos: FormaPago[]) {
    this.ordenarAsc(formaPagos, 'id');
    this.dataSourceFormaPago = new MatTableDataSource(formaPagos);
    this.dataSourceFormaPago.paginator = this.paginator;
    this.dataSourceFormaPago.sort = this.sort;
    this.observableDSFormaPago.next(this.dataSourceFormaPago);
  }

  seleccion(formaPago: FormaPago) {
    if (!this.clickedRows.has(formaPago)) {
      this.clickedRows.clear();
      this.clickedRows.add(formaPago);
      this.formaPago = formaPago;
      this.editarFormaPago = false;
    } else {
      this.limpiar();
    }
  }

  filtroFormaPago(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFormaPago.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceFormaPago.paginator) {
      this.dataSourceFormaPago.paginator.firstPage();
    }
  }
  borrarFiltroFormaPago() {
    this.renderer.setProperty(this.inputFiltroFormaPago.nativeElement, 'value', '');
    this.dataSourceFormaPago.filter = '';
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

}
