import { Component, OnInit, HostListener } from '@angular/core';
import { valores, dispositivos, validarSesion, mensajes, exito, exito_swal, error, error_swal } from '../../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Empresa } from '../../../modelos/usuario/empresa';
import { EmpresaService } from '../../../servicios/usuario/empresa.service';
import { Establecimiento } from '../../../modelos/usuario/establecimiento';
import { EstablecimientoService } from '../../../servicios/usuario/establecimiento.service';
import { Estacion } from '../../../modelos/usuario/estacion';
import { EstacionService } from '../../../servicios/usuario/estacion.service';
import { Regimen } from '../../../modelos/configuracion/regimen';
import { RegimenService } from '../../../servicios/configuracion/regimen.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-estacion',
  templateUrl: './estacion.component.html',
  styleUrls: ['./estacion.component.scss']
})
export class EstacionComponent implements OnInit {

  activo: string = valores.estadoActivo;
  inactivo: string = valores.estadoInactivo;
  si: string = valores.si;
  no: string = valores.no;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;
  deshabilitarEmpresa: boolean = true;

  sesion: Sesion = null;
  estacion: Estacion = new Estacion();

  estaciones: Estacion[];
  empresas: Empresa[];
  establecimientos: Establecimiento[]=[];
  regimenes: Regimen[] = [];
  dispositivos: string[] = dispositivos;

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Estacion) => `${row.codigo}` },
    { nombreColumna: 'empresa', cabecera: 'Empresa', celda: (row: Estacion) => `${row.establecimiento.empresa.nombreComercial}` },
    { nombreColumna: 'establecimiento', cabecera: 'Establecimiento', celda: (row: Estacion) => `${row.establecimiento.descripcion}` },
    { nombreColumna: 'nombre', cabecera: 'Estación', celda: (row: Estacion) => `${row.descripcion}` },
    { nombreColumna: 'punto_venta', cabecera: 'P. Venta', celda: (row: Estacion) => `${row.puntoVenta}` },
    { nombreColumna: 'codigo_sri', cabecera: 'SRI', celda: (row: Estacion) => `${row.codigoSRI}` },
    { nombreColumna: 'dispositivo', cabecera: 'Dispositivo', celda: (row: Estacion) => `${row.dispositivo}` },
    { nombreColumna: 'ip', cabecera: 'IP', celda: (row: Estacion) => `${row.ip}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Estacion) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Estacion>;
  clickedRows = new Set<Estacion>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  constructor(private sesionService: SesionService, private empresaService: EmpresaService, private establecimientoService: EstablecimientoService, 
    private estacionService: EstacionService, private router: Router, private regimenService: RegimenService) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.estacion.establecimiento.empresa = this.sesion.empresa;
    this.deshabilitarEmpresa = this.sesion.usuario.perfil.multiempresa == 'SI'? false : true;
    this.consultarEmpresas();
    this.consultarEstablecimientos();
    this.consultarRegimenes();
    this.consultar();
  }

  consultarEmpresas() {
    this.empresaService.consultar().subscribe({
      next: (res) => {
        this.empresas = res.resultado as Empresa[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }
  consultarEstablecimientos() {
    this.consultar();
    this.establecimientoService.consultarPorEmpresaYEstado(this.estacion.establecimiento.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.establecimientos = res.resultado as Establecimiento[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  consultarRegimenes(){
    this.regimenService.consultarPorEstado(valores.estadoActivo).subscribe({
      next: res => {
        this.regimenes = res.resultado as Regimen[];
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.estacion = new Estacion();
    this.clickedRows.clear();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;      
    this.estacionService.crear(this.estacion).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
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
    this.estacionService.actualizar(this.estacion).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.estacionService.activar(this.estacion).subscribe({
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
    this.estacionService.inactivar(this.estacion).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.estacionService.consultarPorEmpresa(this.estacion.establecimiento.empresa.id).subscribe({
      next: res => {
        this.estaciones = res.resultado as Estacion[];
        this.llenarTablaEstacion(this.estaciones);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaEstacion(estaciones: Estacion[]){
    this.dataSource = new MatTableDataSource(estaciones);
    this.dataSource.filterPredicate = (data: Estacion, filter: string): boolean =>
      data.codigo.includes(filter) || data.establecimiento.empresa.nombreComercial.includes(filter) || data.establecimiento.descripcion.includes(filter) ||
      data.descripcion.includes(filter) || data.puntoVenta.includes(filter) || data.codigoSRI.includes(filter) ||
      data.dispositivo.includes(filter) || data.ip.includes(filter) || data.estado.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccion(estacion: Estacion) {
    if (!this.clickedRows.has(estacion)){
      this.clickedRows.clear();
      this.clickedRows.add(estacion);
      this.obtener(estacion.id);
    } else {
      this.nuevo(null);
    }
  }

  obtener(estacionId: number){
    this.estacionService.obtener(estacionId).subscribe({
      next: res => {
        this.estacion = res.resultado as Estacion;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  rellenarNumeroPuntoVenta() {
    this.estacion.codigoSRI = this.pad(this.estacion.codigoSRI, 3);
  }

  pad(numero: string, size: number): string {
    while (numero.length < size) numero = "0" + numero;
    return numero;
  }

  validarFormulario(): boolean {
    if (this.estacion.establecimiento.empresa.id == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.estacion.establecimiento.id == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.estacion.descripcion == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.estacion.puntoVenta == valores.si && this.estacion.codigoSRI == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.estacion.dispositivo == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_imagen });
      return false;
    }
    return true;
  }
}
