import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  abrirPanelAdmin: boolean = false;
  edicion: boolean = true;

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  estacion: Estacion = new Estacion();
  estaciones: Estacion[];
  empresas: Empresa[];
  establecimientos: Establecimiento[]=[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Estacion) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Estación', celda: (row: Estacion) => `${row.descripcion}` },
    { nombreColumna: 'nombre_pc', cabecera: 'Nombre PC', celda: (row: Estacion) => `${row.nombrePC}` },
    { nombreColumna: 'ip', cabecera: 'IP Red', celda: (row: Estacion) => `${row.ip}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Estacion) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Estacion>;
  observable: BehaviorSubject<MatTableDataSource<Estacion>> = new BehaviorSubject<MatTableDataSource<Estacion>>(null);
  clickedRows = new Set<Estacion>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltroEstacion") inputFiltroEstacion: ElementRef;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  constructor(private renderer: Renderer2, private sesionService: SesionService, private empresaService: EmpresaService, private establecimientoService: EstablecimientoService, 
    private estacionService: EstacionService, private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarEmpresas();
    this.consultar();
  }

  limpiar() {
    this.estacion = new Estacion();
    this.edicion = true;
    this.clickedRows.clear();
    this.borrarFiltro();
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.limpiar();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.estacionService.crear(this.estacion).subscribe({
      next: res => {
        this.estacion = res.resultado as Estacion;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.estaciones.push(this.estacion);
        this.llenarTabla(this.estaciones);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.edicion = true;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.estacionService.actualizar(this.estacion).subscribe({
      next: res => {
        this.estacion = res.resultado as Estacion;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
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
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.estacionService.consultar().subscribe({
      next: res => {
        this.estaciones = res.resultado as Estacion[]
        this.llenarTabla(this.estaciones);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(estaciones: Estacion[]) {
    this.ordenarAsc(estaciones, 'id');
    this.dataSource = new MatTableDataSource(estaciones);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.observable.next(this.dataSource);
  }

  seleccion(estacion: Estacion) {
    if (!this.clickedRows.has(estacion)) {
      this.clickedRows.clear();
      this.clickedRows.add(estacion);
      this.estacion = estacion;
      this.edicion = false;
    } else {
      this.limpiar();
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
    this.renderer.setProperty(this.inputFiltroEstacion.nativeElement, 'value', '');
    this.dataSource.filter = '';
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
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

  consultarEstablecimientos(establecimientoId: number) {
    this.establecimientoService.consultar().subscribe({
      next: res => {
        console.log("estable");
        if (res.resultado != null) {
          this.establecimientos = res.resultado as Establecimiento[];
        } else {
          Swal.fire(error, res.mensaje, error_swal);
        }
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

}
