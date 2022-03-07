import { Component, OnInit, HostListener, Type } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';

import { TabService } from '../../componentes/services/tab.service';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { OrigenIngreso } from '../../modelos/origen-ingreso';
import { OrigenIngresoService } from '../../servicios/origen-ingreso.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-origen-ingreso',
  templateUrl: './origen-ingreso.component.html',
  styleUrls: ['./origen-ingreso.component.scss']
})
export class OrigenIngresoComponent implements OnInit {

  origenIngreso= new OrigenIngreso();
  ComponenteOrigenIngreso: Type<any> = OrigenIngresoComponent;

  sesion: Sesion;
  abrirPanelNuevoOrigen = true;
  abrirPanelAdminOrigen = false;

  origenes_ingresos: OrigenIngreso[];
  //origen_ingreso: OrigenIngreso;
  origenIngresoActualizar: OrigenIngreso= new OrigenIngreso();
  origenIngresoBuscar: OrigenIngreso=new OrigenIngreso();

  columnasOrigenIngreso: string[] = ['id', 'codigo', 'descripcion', 'abreviatura', 'estado'];
  dataSourceOrigenIngreso: MatTableDataSource<OrigenIngreso>;
  clickedRows = new Set<OrigenIngreso>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private tabService: TabService,private origenIngresoService: OrigenIngresoService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion= this.sesionService.getSesion();
    this.construirOrigenIngreso();
    this.consultar();
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //SHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'E') // SHIFT + E
      this.eliminar(null);
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.tabService.addNewTab(OrigenIngresoComponent, constantes.tab_crear_origen_ingreso);
  }
  
  borrar(event){
    if (event!=null)
      event.preventDefault();
      if(this.origenIngreso.id!=0){
        let id=this.origenIngreso.id;
        let codigo=this.origenIngreso.codigo;
        this.origenIngreso=new OrigenIngreso();
        this.origenIngreso.id=id;
        this.origenIngreso.codigo=codigo;
      }
      else{
        this.origenIngreso=new OrigenIngreso();
      }
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.origenIngresoService.crear(this.origenIngreso).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.origenIngresoService.actualizar(this.origenIngreso).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.origenIngreso=res.resultado as OrigenIngreso;
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizarLeer(event){
    if (event!=null)
      event.preventDefault();
      this.abrirPanelNuevoOrigen = true;
      this.abrirPanelAdminOrigen = false;
    if (this.origenIngresoActualizar.id != 0){
      this.origenIngreso={... this.origenIngresoActualizar};
      this.origenIngresoActualizar=new OrigenIngreso();
    }
  }

  eliminar(origen_ingreso: OrigenIngreso) {
    this.origenIngresoService.eliminar(origen_ingreso).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.origenIngreso=res.resultado as OrigenIngreso
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  eliminarLeer(event) {
    if (event!=null)
      event.preventDefault();
    this.origenIngresoService.eliminar(this.origenIngreso).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.consultar();  
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  async construirOrigenIngreso() {
    let origen_ingreso_id=0;
    this.origenIngresoService.currentMessage.subscribe(message => origen_ingreso_id = message);
    if (origen_ingreso_id!= 0) {
      await this.origenIngresoService.obtenerAsync(origen_ingreso_id).then(
        res => {
          Object.assign(this.origenIngreso, res.resultado as OrigenIngreso);
          this.origenIngresoService.enviar(0);
        },
        err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
      );
    }
  }

   consultar() {
    this.origenIngresoService.consultar().subscribe(
      res => {
        this.origenes_ingresos = res.resultado as OrigenIngreso[];
        this.dataSourceOrigenIngreso = new MatTableDataSource(this.origenes_ingresos);
        this.dataSourceOrigenIngreso.paginator = this.paginator;
        this.dataSourceOrigenIngreso.sort = this.sort;
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  buscar(event) {
    if (event!=null)
      event.preventDefault();
    this.origenIngresoService.buscar(this.origenIngresoBuscar).subscribe(
      res => {
        this.origenes_ingresos = res.resultado as OrigenIngreso[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  seleccion(origenIngresoSeleccionado: OrigenIngreso) {
    if (!this.clickedRows.has(origenIngresoSeleccionado)){
      this.clickedRows.clear();
      this.clickedRows.add(origenIngresoSeleccionado);
      this.origenIngreso = origenIngresoSeleccionado;
      this.origenIngresoActualizar=origenIngresoSeleccionado;
    } else {
      this.clickedRows.clear();
      this.origenIngreso = new OrigenIngreso();
    }
  }

  filtroOrigenIngreso(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceOrigenIngreso.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceOrigenIngreso.paginator) {
      this.dataSourceOrigenIngreso.paginator.firstPage();
    }
  }

  cambiarBuscarCodigo(){
    this.buscar(null);
  }

  cambiarBuscarDescripcion(){
    this.buscar(null);
  }

  cambiarBuscarAbreviatura(){
    this.buscar(null);
  }

}
