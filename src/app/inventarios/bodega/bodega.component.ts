import { Component, HostListener, OnInit } from '@angular/core';
import * as constantes from '../../constantes';
import * as util from '../../util';
import Swal from 'sweetalert2';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { BodegaService } from '../../servicios/bodega.service';
import { Bodega } from '../../modelos/bodega';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.scss']
})
export class BodegaComponent implements OnInit {

  abrirPanelNuevoBodega = true;
  abrirPanelAdminBodega = false;

  sesion: Sesion=null;
  bodega= new Bodega();
  bodegas: Bodega[];
  
  columnasBodega: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Bodega) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Bodega) => `${row.codigo}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: Bodega) => `${row.nombre}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Bodega) => `${row.estado}` }
  ];
  cabeceraBodega: string[] = this.columnasBodega.map(titulo => titulo.nombreColumna);
  dataSourceBodega: MatTableDataSource<Bodega>;
  clickedRows = new Set<Bodega>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private bodegaService: BodegaService,
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
    this.bodega = new Bodega();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.bodegaService.crear(this.bodega).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.bodega=res.resultado as Bodega;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.bodegaService.actualizar(this.bodega).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.bodega=res.resultado as Bodega;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event:any) {
    if (event!=null)
      event.preventDefault();
    this.bodegaService.eliminarPersonalizado(this.bodega).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  consultar() {
    this.bodegaService.consultar().subscribe(
      res => {
        this.bodegas = res.resultado as Bodega[]
        this.dataSourceBodega = new MatTableDataSource(this.bodegas);
        this.dataSourceBodega.paginator = this.paginator;
        this.dataSourceBodega.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(bodega: Bodega) {
    if (!this.clickedRows.has(bodega)){
      this.clickedRows.clear();
      this.clickedRows.add(bodega);
      this.bodega = bodega;
    } else {
      this.clickedRows.clear();
      this.bodega = new Bodega();
    }
  }

  filtroBodega(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceBodega.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceBodega.paginator) {
      this.dataSourceBodega.paginator.firstPage();
    }
  }

}
