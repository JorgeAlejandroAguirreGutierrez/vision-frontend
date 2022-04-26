import { Component, OnInit, HostListener  } from '@angular/core';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { CuentaContableService } from '../../servicios/cuenta-contable.service';
import { CuentaContable } from '../../modelos/cuenta-contable';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cuenta-contable',
  templateUrl: './cuenta-contable.component.html',
  styleUrls: ['./cuenta-contable.component.scss']
})
export class CuentaContableComponent implements OnInit {

  abrirPanelCuentaContable: boolean = true;
  abrirPanelAdminCuentaContable:boolean = false;

  sesion: Sesion;
  estado:string= 'ACTIVO'; // Quitar cuando se aumente el campo en la tabla segmento

  cuentaContable: CuentaContable= new CuentaContable();
  cuentasContables: CuentaContable[];
  cuentaContableActualizar: CuentaContable= new CuentaContable();
  cuentaContableBuscar: CuentaContable=new CuentaContable();

  columnasCuentaContable: string[] = ['id', 'cuenta', 'descripcion', 'clasificacion', 'nivel', 'fe'];
  dataSourceCuentaContable: MatTableDataSource<CuentaContable>;
  clickedRows = new Set<CuentaContable>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private sesionService: SesionService, private router: Router,
        private cuentaContableService: CuentaContableService) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.construirCuentaContable();
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

  async construirCuentaContable() {
    let cuentaContableId=0;
    this.cuentaContableService.currentMessage.subscribe(message => cuentaContableId = message);
    if (cuentaContableId!= 0) {
      await this.cuentaContableService.obtenerAsync(cuentaContableId).then(
        res => {
          Object.assign(this.cuentaContable, res.resultado as CuentaContable);
          this.cuentaContableService.enviar(0);
        },
        err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
      );
    }
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.cuentaContable=new CuentaContable();
  }

  borrar(event){
    if (event!=null){
      event.preventDefault()};
      if(this.cuentaContable.id!=0){
        let id=this.cuentaContable.id;
        let cuenta=this.cuentaContable.cuenta;
        this.cuentaContable=new CuentaContable();
        this.cuentaContable.id=id;
        this.cuentaContable.cuenta=cuenta;
      }
      else{
        this.cuentaContable=new CuentaContable();
      }
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.cuentaContableService.crear(this.cuentaContable).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.cuentaContable=new CuentaContable();
        this.nuevo(null);
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.cuentaContableService.actualizar(this.cuentaContable).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.cuentaContable=new CuentaContable();
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizarLeer(event){
    if (event!=null)
      event.preventDefault();
      this.abrirPanelCuentaContable = true;
      this.abrirPanelAdminCuentaContable = false;
      if(this.cuentaContableActualizar.id!=0){
        this.cuentaContable={... this.cuentaContableActualizar};
        this.cuentaContableActualizar=new CuentaContable();
      }
  }

  eliminar(event) {
    if (event!=null)
      event.preventDefault();
    this.cuentaContableService.eliminar(this.cuentaContable).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.cuentaContable = res.resultado as CuentaContable;     
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  consultar() {
    this.cuentaContableService.consultar().subscribe(
      res => {
        this.cuentasContables = res.resultado as CuentaContable[]
        this.dataSourceCuentaContable = new MatTableDataSource(this.cuentasContables);
        this.dataSourceCuentaContable.paginator = this.paginator;
        this.dataSourceCuentaContable.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  buscar(event) {
    if (event!=null)
      event.preventDefault();
    this.cuentaContableService.buscar(this.cuentaContableBuscar).subscribe(
      res => {
          this.cuentasContables = res.resultado as CuentaContable[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  seleccion(cuentaContableSeleccionado: CuentaContable) {
    if (!this.clickedRows.has(cuentaContableSeleccionado)){
      this.clickedRows.clear();
      this.clickedRows.add(cuentaContableSeleccionado);
      this.cuentaContable = cuentaContableSeleccionado;
      this.cuentaContableActualizar=cuentaContableSeleccionado;
    } else {
      this.clickedRows.clear();
      this.cuentaContable = new CuentaContable();
    }
  }

  filtroCuentaContable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCuentaContable.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceCuentaContable.paginator) {
      this.dataSourceCuentaContable.paginator.firstPage();
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
