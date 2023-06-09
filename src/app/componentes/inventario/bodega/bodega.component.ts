import { Component, HostListener, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { validarSesion, mensajes, exito, exito_swal, error, error_swal, valores } from '../../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { BodegaService } from '../../../servicios/inventario/bodega.service';
import { Bodega } from '../../../modelos/inventario/bodega';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from 'src/app/modelos/usuario/empresa';


@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.scss']
})
export class BodegaComponent implements OnInit {

  abrirPanelNuevo = true;
  abrirPanelAdmin = true;

  activo = valores.activo;
  inactivo = valores.inactivo;

  sesion: Sesion = null;
  empresa: Empresa = null;
  bodega = new Bodega();
  bodegas : Bodega[];
  
  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Codigo', celda: (row: Bodega) => `${row.codigo}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: Bodega) => `${row.nombre}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: Bodega) => `${row.abreviatura}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Bodega) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Bodega>;
  clickedRows = new Set<Bodega>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  constructor(private renderer: Renderer2, private bodegaService: BodegaService, 
      private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
    this.consultar();
  }
  
  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.bodega = new Bodega();
    this.clickedRows.clear();
    this.borrarFiltro();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;  
    this.bodega.empresa = this.empresa;
    this.bodegaService.crear(this.bodega).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.bodegaService.actualizar(this.bodega).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.bodegaService.activar(this.bodega).subscribe({
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
    this.bodegaService.inactivar(this.bodega).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  
  consultar() {
    this.bodegaService.consultar().subscribe({
      next: res => {
        this.bodegas = res.resultado as Bodega[]
        this.llenarTabla(this.bodegas);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(bodegas: Bodega[]){
    this.dataSource = new MatTableDataSource(bodegas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccion(bodega: Bodega) {
    if (!this.clickedRows.has(bodega)){
      this.clickedRows.clear();
      this.clickedRows.add(bodega);
      this.bodega = { ... bodega};
    } else {
      this.nuevo(null);
    }
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  borrarFiltro() {
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', '');
    this.dataSource.filter = '';
  }

  validarFormulario(): boolean {
    //validar que los campos esten llenos antes de guardar
    if (this.bodega.nombre == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.bodega.abreviatura == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }
}
