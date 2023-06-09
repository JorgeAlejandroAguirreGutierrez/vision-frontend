import { Component, OnInit, HostListener } from '@angular/core';
import Swal from 'sweetalert2';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../../constantes';

import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { MovimientoContable } from '../../../modelos/contabilidad/movimiento-contable';
import { MovimientoContableService } from '../../../servicios/contabilidad/movimiento-contable.service';
import { TablaMovimientoContableComponent } from '../../../componentes/contabilidad/movimiento-contable/tabla-movimiento-contable/tabla-movimiento-contable.component';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AfectacionContableService } from 'src/app/servicios/contabilidad/afectacion-contable.service';
import { AfectacionContable } from 'src/app/modelos/contabilidad/afectacion-contable';
import { Empresa } from 'src/app/modelos/usuario/empresa';


@Component({
  selector: 'app-movimiento-contable',
  templateUrl: './movimiento-contable.component.html',
  styleUrls: ['./movimiento-contable.component.scss']
})
export class MovimientoContableComponent implements OnInit {

  abrirPanelNuevo = true;
  abrirPanelAdmin = true;
  edicion: boolean = true;

  sesion: Sesion = null;
  empresa: Empresa = null;
  movimientoContable = new MovimientoContable();
  movimientosContables: MovimientoContable[];
  afectacionesContables: AfectacionContable[];

  @ViewChild(TablaMovimientoContableComponent) TablaMovimientoContable: TablaMovimientoContableComponent;

  constructor(private afectacionContableService: AfectacionContableService, private movimientoContableService: MovimientoContableService,
    private sesionService: SesionService, private router: Router) { }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
    this.consultar();
  }

  limpiar() {
    this.movimientoContable = new MovimientoContable();
    this.TablaMovimientoContable.clickedRows.clear();
    this.TablaMovimientoContable.borrarFiltroMovimientoContable();
    if (this.TablaMovimientoContable.dataSourceMovimientoContable.paginator) {
      this.TablaMovimientoContable.dataSourceMovimientoContable.paginator.firstPage();
    }
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.movimientoContable = new MovimientoContable();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.movimientoContable.empresa = this.empresa;
    this.movimientoContableService.crear(this.movimientoContable).subscribe({
      next: res => {
        this.movimientoContable = res.resultado as MovimientoContable;
        this.TablaMovimientoContable.consultarMovimientoContable();
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar() {
    this.edicion = true;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.movimientoContableService.actualizar(this.movimientoContable).subscribe(
      res => {
        this.movimientoContable = res.resultado as MovimientoContable;
        this.TablaMovimientoContable.consultarMovimientoContable();
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.movimientoContableService.activar(this.movimientoContable).subscribe({
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
    this.movimientoContableService.inactivar(this.movimientoContable).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccion(event: any) {
    this.movimientoContable = event.movimientoContableSeleccionado as MovimientoContable;
    if (this.movimientoContable.id != 0) {
      this.edicion = false;
    } else {
      this.limpiar();
    }
  }

  consultar() {
    this.movimientoContableService.consultarPorEmpresa(this.empresa.id).subscribe({
      next: res => {
        this.movimientosContables = res.resultado as MovimientoContable[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarAfectacionContable() {
    this.afectacionContableService.consultarPorEstado(valores.activo).subscribe({
      next: res => {
        this.afectacionesContables = res.resultado as AfectacionContable[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
}
