import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { EstadoCivil } from '../../modelos/estado-civil';
import { EstadoCivilService } from '../../servicios/estado-civil.service';
import * as constantes from '../../constantes';
import * as util from '../../util';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-estado-civil',
  templateUrl: './estado-civil.component.html',
  styleUrls: ['./estado-civil.component.scss']
})
export class EstadoCivilComponent implements OnInit {

  abrirPanelNuevoEstadoCivil = true;
  abrirPanelAdminEstadoCivil = false;

  sesion: Sesion=null;
  estadoCivil= new EstadoCivil();
  estadosCiviles: EstadoCivil[];

  columnasEstadoCivil: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: EstadoCivil) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: EstadoCivil) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripcion', celda: (row: EstadoCivil) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: EstadoCivil) => `${row.abreviatura}` },
  ];
  cabeceraEstadoCivil: string[] = this.columnasEstadoCivil.map(titulo => titulo.nombreColumna);
  dataSourceEstadoCivil: MatTableDataSource<EstadoCivil>;
  clickedRows = new Set<EstadoCivil>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private estadoCivilService: EstadoCivilService,
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
    this.estadoCivil = new EstadoCivil();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.estadoCivilService.crear(this.estadoCivil).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.estadoCivil=res.resultado as EstadoCivil;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.estadoCivilService.actualizar(this.estadoCivil).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.estadoCivil=res.resultado as EstadoCivil;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event:any) {
    if (event!=null)
      event.preventDefault();
    this.estadoCivilService.eliminar(this.estadoCivil).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.nuevo(null);
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  consultar() {
    this.estadoCivilService.consultar().subscribe(
      res => {
        this.estadosCiviles = res.resultado as EstadoCivil[]
        this.dataSourceEstadoCivil = new MatTableDataSource(this.estadosCiviles);
        this.dataSourceEstadoCivil.paginator = this.paginator;
        this.dataSourceEstadoCivil.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(estadoCivil: EstadoCivil) {
    if (!this.clickedRows.has(estadoCivil)){
      this.clickedRows.clear();
      this.clickedRows.add(estadoCivil);
      this.estadoCivil = estadoCivil;
    } else {
      this.clickedRows.clear();
      this.estadoCivil = new EstadoCivil();
    }
  }

  filtroEstadoCivil(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEstadoCivil.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceEstadoCivil.paginator) {
      this.dataSourceEstadoCivil.paginator.firstPage();
    }
  }
}
