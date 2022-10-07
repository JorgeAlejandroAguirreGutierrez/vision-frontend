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

  abrirPanelNuevoPlazoCredito: boolean = true;
  abrirPanelAdminPlazoCredito: boolean = false;
  editarPlazoCredito: boolean = true;

  sesion: Sesion=null;
  plazoCredito= new PlazoCredito();
  plazoCreditos: PlazoCredito[];

  columnasPlazoCredito: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: PlazoCredito) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: PlazoCredito) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: PlazoCredito) => `${row.descripcion}` },
    { nombreColumna: 'plazo', cabecera: 'Plazo', celda: (row: PlazoCredito) => `${row.plazo}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: PlazoCredito) => `${row.estado}` }
  ];
  cabeceraPlazoCredito: string[] = this.columnasPlazoCredito.map(titulo => titulo.nombreColumna);
  dataSourcePlazoCredito: MatTableDataSource<PlazoCredito>;
  observableDSPlazoCredito: BehaviorSubject<MatTableDataSource<PlazoCredito>> = new BehaviorSubject<MatTableDataSource<PlazoCredito>>(null);
  clickedRows = new Set<PlazoCredito>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltroPlazoCredito") inputFiltroPlazoCredito: ElementRef;

  constructor(private renderer: Renderer2, private plazoCreditoService: PlazoCreditoService,
        private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarPlazoCreditos();
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

  limpiar() {
    this.plazoCredito = new PlazoCredito();
    this.editarPlazoCredito = true;
    this.clickedRows.clear();
    this.borrarFiltroPlazoCredito();
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
        this.llenarTablaPlazoCredito(this.plazoCreditos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.editarPlazoCredito = true;
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

  eliminar(event: any) {
    if (event != null)
      event.preventDefault();
    this.plazoCreditoService.eliminarPersonalizado(this.plazoCredito).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarPlazoCreditos() {
    this.plazoCreditoService.consultar().subscribe({
      next: res => {
        this.plazoCreditos = res.resultado as PlazoCredito[]
        this.llenarTablaPlazoCredito(this.plazoCreditos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaPlazoCredito(plazoCreditos: PlazoCredito[]) {
    this.ordenarAsc(plazoCreditos, 'id');
    this.dataSourcePlazoCredito = new MatTableDataSource(plazoCreditos);
    this.dataSourcePlazoCredito.paginator = this.paginator;
    this.dataSourcePlazoCredito.sort = this.sort;
    this.observableDSPlazoCredito.next(this.dataSourcePlazoCredito);
  }

  seleccion(plazoCredito: PlazoCredito) {
    if (!this.clickedRows.has(plazoCredito)) {
      this.clickedRows.clear();
      this.clickedRows.add(plazoCredito);
      this.plazoCredito = plazoCredito;
      this.editarPlazoCredito = false;
    } else {
      this.limpiar();
    }
  }

  filtroPlazoCredito(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePlazoCredito.filter = filterValue.trim().toUpperCase();
    if (this.dataSourcePlazoCredito.paginator) {
      this.dataSourcePlazoCredito.paginator.firstPage();
    }
  }
  borrarFiltroPlazoCredito() {
    this.renderer.setProperty(this.inputFiltroPlazoCredito.nativeElement, 'value', '');
    this.dataSourcePlazoCredito.filter = '';
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }
}
