import { Component, OnInit, HostListener, Type } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { FormaPago } from '../../modelos/forma-pago';
import { FormaPagoService } from '../../servicios/forma-pago.service';

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

  abrirPanelNuevoFormaPago = true;
  abrirPanelAdminFormaPago = false;

  sesion: Sesion=null;
  formaPago= new FormaPago();
  formasPagos: FormaPago[];

  columnasFormaPago: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: FormaPago) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: FormaPago) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: FormaPago) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: FormaPago) => `${row.abreviatura}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: FormaPago) => `${row.estado}` }
  ];
  cabeceraFormaPago: string[] = this.columnasFormaPago.map(titulo => titulo.nombreColumna);
  dataSourceFormaPago: MatTableDataSource<FormaPago>;
  clickedRows = new Set<FormaPago>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private formaPagoService: FormaPagoService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.consultar();
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

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.formaPago = new FormaPago();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.formaPagoService.crear(this.formaPago).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.formaPago=res.resultado as FormaPago;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.formaPagoService.actualizar(this.formaPago).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.formaPago=res.resultado as FormaPago;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event:any) {
    if (event!=null)
      event.preventDefault();
    this.formaPagoService.eliminarPersonalizado(this.formaPago).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.nuevo(null);
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  consultar() {
    this.formaPagoService.consultar().subscribe(
      res => {
        this.formasPagos = res.resultado as FormaPago[]
        this.dataSourceFormaPago = new MatTableDataSource(this.formasPagos);
        this.dataSourceFormaPago.paginator = this.paginator;
        this.dataSourceFormaPago.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(calificacionSeleccionada: FormaPago) {
    if (!this.clickedRows.has(calificacionSeleccionada)){
      this.clickedRows.clear();
      this.clickedRows.add(calificacionSeleccionada);
      this.formaPago = calificacionSeleccionada;
    } else {
      this.clickedRows.clear();
      this.formaPago = new FormaPago();
    }
  }

  filtroFormaPago(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFormaPago.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceFormaPago.paginator) {
      this.dataSourceFormaPago.paginator.firstPage();
    }
  }

}
