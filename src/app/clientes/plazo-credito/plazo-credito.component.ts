import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { PlazoCreditoService } from '../../servicios/cliente/plazo-credito.service';
import { PlazoCredito } from '../../modelos/cliente/plazo-credito';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-plazo-credito',
  templateUrl: './plazo-credito.component.html',
  styleUrls: ['./plazo-credito.component.scss']
})
export class PlazoCreditoComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = false;
  edicion: boolean = true;

  sesion: Sesion=null;
  plazoCredito= new PlazoCredito();
  plazoCreditos: PlazoCredito[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: PlazoCredito) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: PlazoCredito) => `${row.descripcion}` },
    { nombreColumna: 'plazo', cabecera: 'Plazo', celda: (row: PlazoCredito) => `${row.plazo}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: PlazoCredito) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<PlazoCredito>;
  observable: BehaviorSubject<MatTableDataSource<PlazoCredito>> = new BehaviorSubject<MatTableDataSource<PlazoCredito>>(null);
  clickedRows = new Set<PlazoCredito>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private plazoCreditoService: PlazoCreditoService,
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

  limpiar() {
    this.plazoCredito = new PlazoCredito();
    this.edicion = true;
    this.clickedRows.clear();
    this.borrarFiltro();
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.limpiar();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.plazoCreditoService.crear(this.plazoCredito).subscribe({
      next: res => {
        this.plazoCredito = res.resultado as PlazoCredito;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.plazoCreditos.push(this.plazoCredito);
        this.llenarTabla(this.plazoCreditos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.edicion = true;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.plazoCreditoService.actualizar(this.plazoCredito).subscribe({
      next: res => {
        this.plazoCredito = res.resultado as PlazoCredito;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.plazoCreditoService.activar(this.plazoCredito).subscribe({
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
    this.plazoCreditoService.inactivar(this.plazoCredito).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.plazoCreditoService.consultar().subscribe({
      next: res => {
        this.plazoCreditos = res.resultado as PlazoCredito[]
        this.llenarTabla(this.plazoCreditos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(plazoCreditos: PlazoCredito[]) {
    this.ordenarAsc(plazoCreditos, 'codigo');
    this.dataSource = new MatTableDataSource(plazoCreditos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.observable.next(this.dataSource);
  }

  seleccion(plazoCredito: PlazoCredito) {
    if (!this.clickedRows.has(plazoCredito)) {
      this.clickedRows.clear();
      this.clickedRows.add(plazoCredito);
      this.plazoCredito = plazoCredito;
      this.edicion = false;
    } else {
      this.limpiar();
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

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }
}
