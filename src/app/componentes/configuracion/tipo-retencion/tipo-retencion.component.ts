import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import Swal from 'sweetalert2';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../../constantes';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TipoRetencion } from 'src/app/modelos/configuracion/tipo-retencion';
import { TipoRetencionService } from 'src/app/servicios/configuracion/tipo-retencion.service';

@Component({
  selector: 'app-tipo-retencion',
  templateUrl: './tipo-retencion.component.html',
  styleUrls: ['./tipo-retencion.component.scss']
})
export class TipoRetencionComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;
  
  abrirPanelNuevo = true;
  abrirPanelAdmin = true;

  sesion: Sesion=null;
  tipoRetencion = new TipoRetencion();
  tiposRetenciones: TipoRetencion[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: TipoRetencion) => `${row.codigo}` },
    { nombreColumna: 'impuestoRetencion', cabecera: 'Impuesto Retención', celda: (row: TipoRetencion) => `${row.impuestoRetencion}` },
    { nombreColumna: 'tipoRetencion', cabecera: 'Tipo de Retención', celda: (row: TipoRetencion) => `${row.tipoRetencion}` },
    { nombreColumna: 'codigoSRI', cabecera: 'Código SRI', celda: (row: TipoRetencion) => `${row.codigoSRI}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripcion', celda: (row: TipoRetencion) => `${row.descripcion}` },
    { nombreColumna: 'porcentaje', cabecera: 'Porcentaje', celda: (row: TipoRetencion) => `${row.porcentaje}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: TipoRetencion) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<TipoRetencion>;
  clickedRows = new Set<TipoRetencion>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private tipoRetencionService: TipoRetencionService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
  }
  
  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.tipoRetencion = new TipoRetencion();
    this.clickedRows.clear();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.tipoRetencionService.crear(this.tipoRetencion).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.tipoRetencion=res.resultado as TipoRetencion;
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.tipoRetencionService.actualizar(this.tipoRetencion).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.tipoRetencion=res.resultado as TipoRetencion;
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.tipoRetencionService.activar(this.tipoRetencion).subscribe({
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
    this.tipoRetencionService.inactivar(this.tipoRetencion).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  
  consultar() {
    this.tipoRetencionService.consultar().subscribe(
      res => {
        this.tiposRetenciones = res.resultado as TipoRetencion[]
        this.dataSource = new MatTableDataSource(this.tiposRetenciones);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(tipoRetencion: TipoRetencion) {
    if (!this.clickedRows.has(tipoRetencion)){
      this.clickedRows.clear();
      this.clickedRows.add(tipoRetencion);
      this.tipoRetencion = { ... tipoRetencion};
    } else {
      this.clickedRows.clear();
      this.tipoRetencion = new TipoRetencion();
    }
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
