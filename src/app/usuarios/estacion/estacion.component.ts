import { Component, OnInit, HostListener } from '@angular/core';
import { valores, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Empresa } from '../../modelos/usuario/empresa';
import { EmpresaService } from '../../servicios/usuario/empresa.service';
import { Establecimiento } from '../../modelos/usuario/establecimiento';
import { EstablecimientoService } from '../../servicios/usuario/establecimiento.service';
import { Estacion } from '../../modelos/usuario/estacion';
import { EstacionService } from '../../servicios/usuario/estacion.service';

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

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;

  sesion: Sesion = null;
  estacion: Estacion = new Estacion();
  estaciones: Estacion[];
  empresas: Empresa[];
  establecimientos: Establecimiento[]=[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Estacion) => `${row.codigo}` },
    { nombreColumna: 'empresa', cabecera: 'Empresa', celda: (row: Estacion) => `${row.establecimiento.empresa.razonSocial}` },
    { nombreColumna: 'establecimiento', cabecera: 'Establecimiento', celda: (row: Estacion) => `${row.establecimiento.descripcion}` },
    { nombreColumna: 'dispositivo', cabecera: 'Dispositivo', celda: (row: Estacion) => `${row.dispositivo}` },
    { nombreColumna: 'nombre', cabecera: 'Estación', celda: (row: Estacion) => `${row.descripcion}` },
    { nombreColumna: 'codigo_sri', cabecera: 'SRI', celda: (row: Estacion) => `${row.codigoSRI}` },
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
    private estacionService: EstacionService, private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarEmpresas();
    this.consultar();
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
    this.estacionService.consultar().subscribe({
      next: res => {
        this.estaciones = res.resultado as Estacion[];
        this.dataSource = new MatTableDataSource(this.estaciones);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  construir(){
    this.consultarEstablecimientos();
  }

  seleccion(estacion: Estacion) {
    if (!this.clickedRows.has(estacion)){
      this.clickedRows.clear();
      this.clickedRows.add(estacion);
      this.estacion = { ... estacion};
      this.construir();
    } else {
      this.clickedRows.clear();
      this.estacion = new Estacion();
    }
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
    this.establecimientoService.consultarPorEmpresa(this.estacion.establecimiento.empresa.id).subscribe({
      next: res => {
        this.establecimientos = res.resultado as Establecimiento[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

}
