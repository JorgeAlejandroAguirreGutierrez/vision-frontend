import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { valores, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Perfil } from '../../modelos/usuario/perfil';
import { PerfilService } from '../../servicios/usuario/perfil.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevoPerfil: boolean = true;
  abrirPanelAdminPerfil: boolean = true;
  editarPerfil: boolean = true;

  sesion: Sesion = null;
  perfil: Perfil = new Perfil();
  perfiles: Perfil[];

  columnasPerfil: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Perfil) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Perfil) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: Perfil) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: Perfil) => `${row.abreviatura}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Perfil) => `${row.estado}` }
  ];
  cabeceraPerfil: string[] = this.columnasPerfil.map(titulo => titulo.nombreColumna);
  dataSourcePerfil: MatTableDataSource<Perfil>;
  observableDSPerfil: BehaviorSubject<MatTableDataSource<Perfil>> = new BehaviorSubject<MatTableDataSource<Perfil>>(null);
  clickedRows = new Set<Perfil>();


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltroPerfil") inputFiltroPerfil: ElementRef;

  constructor(private renderer: Renderer2, private perfilService: PerfilService,
    private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
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
    this.perfil = new Perfil();
    this.editarPerfil = true;
    this.clickedRows.clear();
    this.borrarFiltroPerfil();
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.limpiar();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.perfilService.crear(this.perfil).subscribe({
      next: res => {
        this.perfil = res.resultado as Perfil;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.perfiles.push(this.perfil);
        this.llenarTablaPerfil(this.perfiles);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  editar(event) {
    if (event != null)
      event.preventDefault();
    this.editarPerfil = true;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.perfilService.actualizar(this.perfil).subscribe({
      next: res => {
        this.perfil = res.resultado as Perfil;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.limpiar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.perfilService.activar(this.perfil).subscribe({
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
    this.perfilService.inactivar(this.perfil).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.perfilService.consultar().subscribe({
      next: res => {
        this.perfiles = res.resultado as Perfil[]
        this.llenarTablaPerfil(this.perfiles);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaPerfil(perfiles: Perfil[]) {
    this.ordenarAsc(perfiles, 'id');
    this.dataSourcePerfil = new MatTableDataSource(perfiles);
    this.dataSourcePerfil.paginator = this.paginator;
    this.dataSourcePerfil.sort = this.sort;
    this.observableDSPerfil.next(this.dataSourcePerfil);
  }

  seleccion(perfil: Perfil) {
    if (!this.clickedRows.has(perfil)) {
      this.clickedRows.clear();
      this.clickedRows.add(perfil);
      this.perfil = perfil;
      this.editarPerfil = false;
    } else {
      this.limpiar();
    }
  }

  filtroPerfil(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePerfil.filter = filterValue.trim().toUpperCase();
    if (this.dataSourcePerfil.paginator) {
      this.dataSourcePerfil.paginator.firstPage();
    }
  }
  borrarFiltroPerfil() {
    this.renderer.setProperty(this.inputFiltroPerfil.nativeElement, 'value', '');
    this.dataSourcePerfil.filter = '';
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

}
