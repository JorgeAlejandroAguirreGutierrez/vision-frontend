import { Component, OnInit, HostListener, Type } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';

import { TabService } from '../../componentes/services/tab.service';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { FormaPago } from '../../modelos/forma-pago';
import { FormaPagoService } from '../../servicios/forma-pago.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-forma-pago',
  templateUrl: './forma-pago.component.html',
  styleUrls: ['./forma-pago.component.scss']
})

export class FormaPagoComponent implements OnInit {

  ComponenteFormaPago: Type<any> = FormaPagoComponent;

  sesion: Sesion;
  abrirPanelNuevoFormaPago = true;
  abrirPanelAdminFormaPago = false;

  formaPago= new FormaPago();
  formas_pagos: FormaPago[];
  formaPagoActualizar: FormaPago= new FormaPago();
  formaPagoBuscar: FormaPago=new FormaPago();

  columnasFormaPago: string[] = ['id', 'codigo', 'descripcion', 'abreviatura', 'estado'];
  dataSourceFormaPago: MatTableDataSource<FormaPago>;
  clickedRows = new Set<FormaPago>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private tabService: TabService,private formaPagoService: FormaPagoService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion= this.sesionService.getSesion();
    this.construirFormaPago();
    this.consultar();
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G") //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N") //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "E") // SHIFT + E
      this.eliminar(null);
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
  }

  borrar(event){
    if (event!=null)
      event.preventDefault();
      if(this.formaPago.id!=0){
        let id=this.formaPago.id;
        let codigo=this.formaPago.codigo;
        this.formaPago=new FormaPago();
        this.formaPago.id=id;
        this.formaPago.codigo=codigo;
      }
      else{
        this.formaPago=new FormaPago();
      }
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.formaPagoService.crear(this.formaPago).subscribe(
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
    this.formaPagoService.actualizar(this.formaPago).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.formaPago=res.resultado as FormaPago;
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizarLeer(event){
    if (event!=null)
      event.preventDefault();
      this.abrirPanelNuevoFormaPago = true;
      this.abrirPanelAdminFormaPago = false;
    if (this.formaPagoActualizar.id != 0){
      this.formaPago={... this.formaPagoActualizar};
      this.formaPagoActualizar=new FormaPago();
    }
  }

  eliminar(forma_pago: FormaPago) {
    this.formaPagoService.eliminar(forma_pago).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.formaPago=res.resultado as FormaPago
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  eliminarLeer(event) {
    if (event!=null)
      event.preventDefault();
    this.formaPagoService.eliminar(this.formaPago).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.formaPago = res.resultado as FormaPago
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  async construirFormaPago() {
    let forma_pago_id=0;
    this.formaPagoService.currentMessage.subscribe(message => forma_pago_id = message);
    if (forma_pago_id!= 0) {
      await this.formaPagoService.obtenerAsync(forma_pago_id).then(
        res => {
          Object.assign(this.formaPago, res.resultado as FormaPago);
          this.formaPagoService.enviar(0);
        },
        err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
      );
    }
  }

  consultar() {
    this.formaPagoService.consultar().subscribe(
      res => {
        this.formas_pagos = res.resultado as FormaPago[]
        this.dataSourceFormaPago = new MatTableDataSource(this.formas_pagos);
        this.dataSourceFormaPago.paginator = this.paginator;
        this.dataSourceFormaPago.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  buscar(event) {
    if (event!=null)
      event.preventDefault();
    this.formaPagoService.buscar(this.formaPagoBuscar).subscribe(
      res => {
        this.formas_pagos = res.resultado as FormaPago[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  seleccion(formaPagoSeleccionada: FormaPago) {
    if (!this.clickedRows.has(formaPagoSeleccionada)){
      this.clickedRows.clear();
      this.clickedRows.add(formaPagoSeleccionada);
      this.formaPago = formaPagoSeleccionada;
      this.formaPagoActualizar=formaPagoSeleccionada;
    } else {
      this.clickedRows.clear();
      this.formaPago = new FormaPago();
    }
  }

  filtroFormaPago(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFormaPago.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceFormaPago.paginator) {
      this.dataSourceFormaPago.paginator.firstPage();
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
