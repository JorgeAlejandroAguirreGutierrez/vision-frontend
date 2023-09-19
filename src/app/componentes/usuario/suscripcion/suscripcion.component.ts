import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { valores, validarSesion, mensajes, otras, exito, exito_swal, error, error_swal } from '../../../constantes';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Paquete } from 'src/app/modelos/usuario/paquete';
import { NgxSpinnerService } from 'ngx-spinner';
import { Suscripcion } from 'src/app/modelos/usuario/suscripcion';
import { SuscripcionService } from 'src/app/servicios/usuario/suscripcion.service';
import { PaqueteService } from 'src/app/servicios/usuario/paquete.service';
import { Empresa } from 'src/app/modelos/usuario/empresa';
import { EmpresaService } from 'src/app/servicios/usuario/empresa.service';


@Component({
  selector: 'app-suscripcion',
  templateUrl: './suscripcion.component.html',
  styleUrls: ['./suscripcion.component.scss']
})

export class SuscripcionComponent implements OnInit {

  estadoActivo: string = valores.estadoActivo;
  estadoInactivo: string = valores.estadoInactivo;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;

  sesion: Sesion = null;
  suscripcion: Suscripcion = new Suscripcion();
  empresas: Empresa[];
  suscripciones: Suscripcion[];
  paquetes: Paquete[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Suscripcion) => `${row.codigo}` },
    { nombreColumna: 'empresa', cabecera: 'Empresa', celda: (row: Suscripcion) => `${row.empresa}` },
    { nombreColumna: 'paquete', cabecera: 'Paquete', celda: (row: Suscripcion) => `${row.paquete.nombre}` },
    { nombreColumna: 'maximoComprobantes', cabecera: 'Paquete', celda: (row: Suscripcion) => `${row.paquete.maximoComprobantes}` },
    { nombreColumna: 'valorTotal', cabecera: 'Valor Total', celda: (row: Suscripcion) => `$${row.paquete.valorTotal}` },
    { nombreColumna: 'fechaInicial', cabecera: 'Fecha Inicial', celda: (row: Suscripcion) => `${row.fechaInicial}` },
    { nombreColumna: 'fechaFinal', cabecera: 'Fecha Final', celda: (row: Suscripcion) => `${row.fechaFinal}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Suscripcion) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Suscripcion>;
  clickedRows = new Set<Suscripcion>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private router: Router, private spinnerService: NgxSpinnerService, private empresaService: EmpresaService,
    private sesionService: SesionService, private suscripcionService: SuscripcionService, private paqueteService: PaqueteService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.consultarEmpresas();
    this.consultarPaquetes();
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && ($event.ctrlKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //SHIFT + N
      this.nuevo(null);
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.suscripcion = new Suscripcion();
    this.clickedRows.clear();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.suscripcionService.crear(this.suscripcion).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.suscripcion = res.resultado as Suscripcion;
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.suscripcionService.actualizar(this.suscripcion).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.suscripcion = res.resultado as Suscripcion;
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.suscripcionService.activar(this.suscripcion).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inactivar(event) {
    if (event != null)
      event.preventDefault();
    this.suscripcionService.inactivar(this.suscripcion).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarEmpresas(){
    this.empresaService.consultarPorEstado(this.estadoActivo).subscribe({
      next: res => {
        this.empresas = res.resultado as Empresa[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarEmpresa(){

  }

  consultarPaquetes(){
    this.paqueteService.consultarPorEstado(this.estadoActivo).subscribe({
      next: res => {
        this.paquetes = res.resultado as Paquete[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarPaquete(){

  }

  consultar() {
    this.suscripcionService.consultar().subscribe({
      next: res => {
        this.suscripciones = res.resultado as Suscripcion[];
        this.llenarTabla(this.suscripciones);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(suscripciones: Suscripcion[]) {
    this.dataSource = new MatTableDataSource(suscripciones);
    this.dataSource.filterPredicate = (data: Suscripcion, filter: string): boolean =>
      data.empresa.razonSocial.includes(filter) || data.paquete.nombre.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  seleccion(suscripcion: Suscripcion) {
    if (!this.clickedRows.has(suscripcion)) {
      this.clickedRows.clear();
      this.clickedRows.add(suscripcion);
      this.suscripcion = { ...suscripcion };
    } else {
      this.nuevo(null);
    }
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  borrarFiltro() {
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', '');
    this.dataSource.filter = '';
  }

  validarFormulario(): boolean {
    if (this.suscripcion.empresa.id == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.suscripcion.paquete.id == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }
}