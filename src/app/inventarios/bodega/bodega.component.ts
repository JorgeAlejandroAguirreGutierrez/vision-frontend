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


  sesion: Sesion=null;
  abrirPanelNuevaBodega = true;
  abrirPanelAdminBodega = false;

  bodega= new Bodega();
  bodegas: Bodega[];
  bodegaActualizar: Bodega= new Bodega();
  bodegaBuscar: Bodega=new Bodega();

  columnas: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Bodega) => `${row.id}`},
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Bodega) => `${row.codigo}`},
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: Bodega) => `${row.nombre}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Bodega) => `${row.estado}`}
  ];
  columnasBodega: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSourceBodega: MatTableDataSource<Bodega>;
  clickedRows = new Set<Bodega>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private bodegaService: BodegaService, 
    private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    util.validarSesion(this.sesion, this.sesionService, this.router);
    this.construir_bodega();
    this.bodega.estado='ACTIVO';
    this.consultar();
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    //if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      //this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'E') // SHIFT + E
      this.eliminarLeer(null);
  }


  borrar(event: any){
    if (event!=null)
      event.preventDefault();
      if(this.bodega.id!=0){
        let id=this.bodega.id;
        let codigo=this.bodega.codigo;
        this.bodega=new Bodega();
        this.bodega.id=id;
        this.bodega.codigo=codigo;
      }
      else{
        this.bodega=new Bodega();
      }
  }

  crear(event: any) {
    if (event!=null)
      event.preventDefault();
    this.bodegaService.crear(this.bodega).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizar(event: any) {
    if (event!=null)
      event.preventDefault();
    this.bodegaService.actualizar(this.bodega).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.bodega=res.resultado as Bodega;
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizarLeer(event: any){
    if (event!=null)
      event.preventDefault();
      this.abrirPanelNuevaBodega = true;
      this.abrirPanelAdminBodega = false;
    if (this.bodegaActualizar.id != 0){
      this.bodega={... this.bodegaActualizar};
      this.bodegaActualizar=new Bodega();
    }
  }

  eliminar(bodega: Bodega) {
    this.bodegaService.eliminar(bodega).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.bodega=res.resultado as Bodega
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  eliminarLeer(event: any) {
    if (event!=null)
      event.preventDefault();
    this.bodegaService.eliminar(this.bodega).subscribe(
      res => {
          Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
          this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  async construir_bodega() {
    let bodega_id=0;
    this.bodegaService.currentMessage.subscribe(message => bodega_id = message);
    if (bodega_id!= 0) {
      await this.bodegaService.obtenerAsync(bodega_id).then(
        res => {
          Object.assign(this.bodega, res.resultado as Bodega);
          this.bodegaService.enviar(0);
        },
        err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
      );
    }
  }

  consultar() {
    this.bodegaService.consultar().subscribe(
      res => {
        this.bodegas = res.resultado as Bodega[];
        this.dataSourceBodega = new MatTableDataSource(this.bodegas);
        this.dataSourceBodega.paginator = this.paginator;
        this.dataSourceBodega.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  buscar(event: any) {
    if (event!=null)
      event.preventDefault();
  /*    this.bodegaService.buscar(this.bodegaBuscar).subscribe(
        res => {
          this.bodegas = res.resultado as Bodega[]
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
      );*/
  }

  seleccion(bodegaSeleccionada: Bodega) {
    if (!this.clickedRows.has(bodegaSeleccionada)){
      this.clickedRows.clear();
      this.clickedRows.add(bodegaSeleccionada);
      this.bodega = bodegaSeleccionada;
      this.bodegaActualizar=bodegaSeleccionada;
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

  cambiarBuscarCodigo(){
    this.buscar(null);
  }

  cambiarBuscarDescripcion(){
    this.buscar(null);
  }

  cambiarBuscarBodega(){
    this.buscar(null);
  }

}
