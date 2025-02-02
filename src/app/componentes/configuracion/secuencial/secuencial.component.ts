import { Component, OnInit, ViewChild, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { valores, validarSesion, mensajes, exito, exito_swal, error, error_swal } from '../../../constantes';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Sesion } from '../../../modelos/acceso/sesion';
import { SesionService } from '../../../servicios/acceso/sesion.service';
import { TipoComprobante } from '../../../modelos/configuracion/tipo-comprobante';
import { TipoComprobanteService } from '../../../servicios/configuracion/tipo-comprobante.service';
import { Empresa } from '../../../modelos/acceso/empresa';
import { Establecimiento } from '../../../modelos/acceso/establecimiento';
import { EstablecimientoService } from '../../../servicios/acceso/establecimiento.service';
import { Estacion } from '../../../modelos/acceso/estacion';
import { EstacionService } from '../../../servicios/acceso/estacion.service';
import { Secuencial } from '../../../modelos/configuracion/secuencial';
import { SecuencialService } from '../../../servicios/configuracion/secuencial.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-secuencial',
  templateUrl: './secuencial.component.html',
  styleUrls: ['./secuencial.component.scss']
})
export class SecuencialComponent implements OnInit {

  activo: string = valores.estadoActivo;
  inactivo: string = valores.estadoInactivo;
  
  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  secuencial: Secuencial = new Secuencial();
  estacion: Estacion = new Estacion();

  secuenciales: Secuencial[];
  tipoComprobantes: TipoComprobante[];
  establecimientos: Establecimiento[]=[];
  estaciones: Estacion[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Secuencial) => `${row.codigo}` },
    { nombreColumna: 'comprobante', cabecera: 'Comprobante', celda: (row: Secuencial) => `${row.tipoComprobante.abreviatura}` },
    { nombreColumna: 'empresa', cabecera: 'Empresa', celda: (row: Secuencial) => `${row.estacion.establecimiento.empresa.razonSocial}` },
    { nombreColumna: 'establecimiento', cabecera: 'Establecimiento', celda: (row: Secuencial) => `${row.estacion.establecimiento.codigoSRI}` },
    { nombreColumna: 'punto_venta', cabecera: 'Pto. Venta', celda: (row: Secuencial) => `${row.estacion.codigoSRI}` },
    { nombreColumna: 'siguiente', cabecera: '# Siguiente', celda: (row: Secuencial) => `${row.numeroSiguiente}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Secuencial) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Secuencial>;
  clickedRows = new Set<Secuencial>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  constructor(private renderer: Renderer2, private sesionService: SesionService,private router: Router, 
    private establecimientoService: EstablecimientoService, private estacionService: EstacionService, 
    private tipoComprobanteService: TipoComprobanteService, private secuencialService: SecuencialService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
    this.consultarTipoComprobante();
    this.consultarEstablecimientos();
    this.consultarPorEmpresa();
  }

  consultarTipoComprobante(){
    this.tipoComprobanteService.consultar().subscribe({
      next: (res) => {
        this.tipoComprobantes = res.resultado as TipoComprobante[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }

  consultarEstablecimientos() {
    this.establecimientoService.consultarPorEmpresa(this.empresa.id).subscribe({
      next: res => {
        this.establecimientos = res.resultado as Establecimiento[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarPuntosVenta() {
    this.estacionService.consultarPuntosVentaPorEstablecimiento(this.secuencial.estacion.establecimiento.id).subscribe({
      next: res => {
        this.estaciones = res.resultado as Estacion[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.secuencial = new Secuencial();
    this.clickedRows.clear();
    this.borrarFiltro();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.secuencialService.crear(this.secuencial).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultarPorEmpresa();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.secuencialService.actualizar(this.secuencial).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.secuencial=res.resultado as Secuencial;
        this.consultarPorEmpresa();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.secuencialService.activar(this.secuencial).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultarPorEmpresa();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inactivar(event) {
    if (event != null)
      event.preventDefault();
    this.secuencialService.inactivar(this.secuencial).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultarPorEmpresa();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarPorEmpresa() {
    this.secuencialService.consultarPorEmpresa(this.empresa.id).subscribe({
      next: res => {
        this.secuenciales = res.resultado as Secuencial[]
        this.llenarTabla(this.secuenciales);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(secuenciales: Secuencial[]) {
    this.dataSource = new MatTableDataSource(secuenciales);
    this.dataSource.filterPredicate = (data: Secuencial, filter: string): boolean =>
    data.codigo.includes(filter) || data.tipoComprobante.abreviatura.includes(filter) || data.estacion.establecimiento.empresa.nombreComercial.includes(filter) ||
    data.estacion.establecimiento.codigoSRI.includes(filter) || data.estacion.codigoSRI.includes(filter) || String(data.numeroSiguiente).includes(filter) ||
    data.estado.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccion(secuencial: Secuencial) {
    if (!this.clickedRows.has(secuencial)){
      this.clickedRows.clear();
      this.clickedRows.add(secuencial);
      this.secuencial = { ... secuencial};
      this.consultarEstablecimientos();
      this.consultarPuntosVenta();
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

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  validarFormulario(): boolean {
    if (this.secuencial.tipoComprobante.id == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.secuencial.estacion.id == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.secuencial.numeroSiguiente <= valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_cantidad });
      return false;
    }
    return true;
  }
}
