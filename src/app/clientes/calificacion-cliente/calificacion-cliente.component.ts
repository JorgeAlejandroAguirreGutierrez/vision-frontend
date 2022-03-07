import { Component, OnInit, HostListener, Type } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { CalificacionCliente } from '../../modelos/calificacion-cliente';
import { TabService } from '../../componentes/services/tab.service';
import { CalificacionClienteService } from '../../servicios/calificacion-cliente.service';
import * as constantes from '../../constantes';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-calificacion-cliente',
  templateUrl: './calificacion-cliente.component.html',
  styleUrls: ['./calificacion-cliente.component.scss']
})

export class CalificacionClienteComponent implements OnInit {

  abrirPanelNuevaCalificacion = true;
  abrirPanelAdminCalificacion = false;

  ComponenteCalificacionCliente: Type<any> = CalificacionClienteComponent;

  sesion: Sesion;
  calificacionCliente= new CalificacionCliente();

  columnasCalificacion: string[] = ['id', 'codigo', 'descripcion', 'abreviatura', 'estado'];
  dataSourceCalificacion: MatTableDataSource<CalificacionCliente>;
  clickedRows = new Set<CalificacionCliente>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private tabService: TabService,private calificacionClienteService: CalificacionClienteService,
    private sesionService: SesionService,private router: Router) { }

    calificacionesClientes: CalificacionCliente[];
    calificacionClienteActualizar: CalificacionCliente= new CalificacionCliente();
    calificacionClienteBuscar: CalificacionCliente=new CalificacionCliente();

  ngOnInit() {
    this.sesion= this.sesionService.getSesion();
    this.construirCalificacionCliente();
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
    this.calificacionCliente = new CalificacionCliente();
  }

  borrar(event){
    if (event!=null)
      event.preventDefault();
      if(this.calificacionCliente.id!=0){
        let id=this.calificacionCliente.id;
        let codigo=this.calificacionCliente.codigo;
        this.calificacionCliente=new CalificacionCliente();
        this.calificacionCliente.id=id;
        this.calificacionCliente.codigo=codigo;
      }
      else{
        this.calificacionCliente=new CalificacionCliente();
      }
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.calificacionClienteService.crear(this.calificacionCliente).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.nuevo(null);
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.calificacionClienteService.actualizar(this.calificacionCliente).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.calificacionCliente=res.resultado as CalificacionCliente;
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizarLeer(event){
    if (event!=null)
      event.preventDefault();
      this.abrirPanelNuevaCalificacion = true;
      this.abrirPanelAdminCalificacion = false;
    if (this.calificacionClienteActualizar.id != 0){
      this.calificacionCliente={... this.calificacionClienteActualizar};
      this.calificacionClienteActualizar=new CalificacionCliente();
    }
  }

  eliminar(calificacionCliente: CalificacionCliente) {
    this.calificacionClienteService.eliminar(calificacionCliente).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.calificacionCliente=res.resultado as CalificacionCliente
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  eliminarLeer(event) {
    if (event!=null)
      event.preventDefault();
    this.calificacionClienteService.eliminar(this.calificacionCliente).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.calificacionCliente = res.resultado as CalificacionCliente 
        this.consultar();     
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  async construirCalificacionCliente() {
    let calificacionClienteId=0;
    this.calificacionClienteService.currentMessage.subscribe(message => calificacionClienteId = message);
    if (calificacionClienteId!= 0) {
      await this.calificacionClienteService.obtenerAsync(calificacionClienteId).then(
        res => {
          Object.assign(this.calificacionCliente, res.resultado as CalificacionCliente);
          this.calificacionClienteService.enviar(0);
        },
        err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
      );
    }
  }
  
  consultar() {
    this.calificacionClienteService.consultar().subscribe(
      res => {
        this.calificacionesClientes = res.resultado as CalificacionCliente[]
        this.dataSourceCalificacion = new MatTableDataSource(this.calificacionesClientes);
        this.dataSourceCalificacion.paginator = this.paginator;
        this.dataSourceCalificacion.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  buscar(event) {
    if (event!=null)
      event.preventDefault();
    this.calificacionClienteService.buscar(this.calificacionClienteBuscar).subscribe(
      res => {
        this.calificacionesClientes = res.resultado as CalificacionCliente[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  seleccion(calificacionSeleccionada: CalificacionCliente) {
    if (!this.clickedRows.has(calificacionSeleccionada)){
      this.clickedRows.clear();
      this.clickedRows.add(calificacionSeleccionada);
      this.calificacionCliente = calificacionSeleccionada;
      this.calificacionClienteActualizar=calificacionSeleccionada;
    } else {
      this.clickedRows.clear();
      this.calificacionCliente = new CalificacionCliente();
    }
  }

  filtroCalificacion(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCalificacion.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceCalificacion.paginator) {
      this.dataSourceCalificacion.paginator.firstPage();
    }
  }

  cambiar_buscar_codigo(){
    this.buscar(null);
  }

  cambiar_buscar_descripcion(){
    this.buscar(null);
  }

  cambiar_buscar_abreviatura(){
    this.buscar(null);
  }

}
