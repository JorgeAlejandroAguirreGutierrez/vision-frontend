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

  abrirPanelNuevoEstacion: boolean = true;
  abrirPanelAdminEstacion: boolean = false;
  editarEstacion: boolean = true;

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  estacion: Estacion = new Estacion();
  estaciones: Estacion[];
  empresas: Empresa[];
  establecimientos: Establecimiento[]=[];

  columnasEstacion: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Estacion) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Estacion) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Estación', celda: (row: Estacion) => `${row.descripcion}` },
    { nombreColumna: 'nombre_pc', cabecera: 'Nombre PC', celda: (row: Estacion) => `${row.nombrePC}` },
    { nombreColumna: 'ip', cabecera: 'IP Red', celda: (row: Estacion) => `${row.ip}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Estacion) => `${row.estado}` }
  ];
  cabeceraEstacion: string[] = this.columnasEstacion.map(titulo => titulo.nombreColumna);
  dataSourceEstacion: MatTableDataSource<Estacion>;
  observableDSEstacion: BehaviorSubject<MatTableDataSource<Estacion>> = new BehaviorSubject<MatTableDataSource<Estacion>>(null);
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
    if (($event.shiftKey || $event.metaKey) && $event.key == 'E') // SHIFT + E
      this.eliminar(null);
  }

  constructor(private renderer: Renderer2, private sesionService: SesionService, private empresaService: EmpresaService, private establecimientoService: EstablecimientoService, 
    private estacionService: EstacionService, private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarEmpresas();
    //this.consultarEstablecimientos();
    this.construirEstacion();
    
  }

  limpiar() {
    this.estacion = new Estacion();
    this.editarEstacion = true;
    this.clickedRows.clear();
    this.borrarFiltroEstacion();
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
        this.llenarTablaEstacion(this.estaciones);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.editarEstacion = true;
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

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.estacionService.eliminarPersonalizado(this.estacion).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarEstaciones() {
    this.estacionService.consultar().subscribe({
      next: res => {
        this.estaciones = res.resultado as Estacion[]
        this.llenarTablaEstacion(this.estaciones);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaEstacion(estaciones: Estacion[]) {
    this.ordenarAsc(estaciones, 'id');
    this.dataSourceEstacion = new MatTableDataSource(estaciones);
    this.dataSourceEstacion.paginator = this.paginator;
    this.dataSourceEstacion.sort = this.sort;
    this.observableDSEstacion.next(this.dataSourceEstacion);
  }

  seleccion(estacion: Estacion) {
    if (!this.clickedRows.has(estacion)) {
      this.clickedRows.clear();
      this.clickedRows.add(estacion);
      this.estacion = estacion;
      this.editarEstacion = false;
    } else {
      this.limpiar();
    }
  }

  filtroEstacion(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEstacion.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceEstacion.paginator) {
      this.dataSourceEstacion.paginator.firstPage();
    }
  }
  borrarFiltroEstacion() {
    this.renderer.setProperty(this.inputFiltroEstacion.nativeElement, 'value', '');
    this.dataSourceEstacion.filter = '';
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  async construirEstacion() {
    let estacionId=0;
    this.estacionService.currentMessage.subscribe(message => estacionId = message);
    if (estacionId!= 0) {
      await this.estacionService.obtenerAsync(estacionId).then(
        res => {
          Object.assign(this.estacion, res.resultado as Estacion);
          this.estacionService.enviar(0);
        },
        err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      );
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

 /* consultarEstablecimientos1(){
    this.establecimientoService.consultar().subscribe(
      res => {
        //Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.establecimientos=res.resultado as Establecimiento[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }*/

  consultarEstablecimientos(establecimientoId: number) {
    //this.establecimiento.ubicacion.provincia = provincia;
    //this.establecimientoService.obtener(establecimientoId).subscribe({
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
