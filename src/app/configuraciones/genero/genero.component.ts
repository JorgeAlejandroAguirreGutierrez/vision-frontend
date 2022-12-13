import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { GeneroService } from '../../servicios/cliente/genero.service';
import { Genero } from '../../modelos/cliente/genero';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-genero',
  templateUrl: './genero.component.html',
  styleUrls: ['./genero.component.scss']
})
export class GeneroComponent implements OnInit {

  abrirPanelNuevoGenero = true;
  abrirPanelAdminGenero = false;

  sesion: Sesion=null;
  genero= new Genero();
  generos: Genero[];

  columnasGenero: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Genero) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Genero) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripcion', celda: (row: Genero) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: Genero) => `${row.abreviatura}` },
  ];
  cabeceraGenero: string[] = this.columnasGenero.map(titulo => titulo.nombreColumna);
  dataSourceGenero: MatTableDataSource<Genero>;
  clickedRows = new Set<Genero>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private generoService: GeneroService,
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

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.genero = new Genero();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.generoService.crear(this.genero).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.genero=res.resultado as Genero;
        this.consultar();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.generoService.actualizar(this.genero).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.genero=res.resultado as Genero;
        this.consultar();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.generoService.activar(this.genero).subscribe({
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
    this.generoService.inactivar(this.genero).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  
  consultar() {
    this.generoService.consultar().subscribe(
      res => {
        this.generos = res.resultado as Genero[]
        this.dataSourceGenero = new MatTableDataSource(this.generos);
        this.dataSourceGenero.paginator = this.paginator;
        this.dataSourceGenero.sort = this.sort;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(genero: Genero) {
    if (!this.clickedRows.has(genero)){
      this.clickedRows.clear();
      this.clickedRows.add(genero);
      this.genero = genero;
    } else {
      this.clickedRows.clear();
      this.genero = new Genero();
    }
  }

  filtroGenero(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceGenero.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceGenero.paginator) {
      this.dataSourceGenero.paginator.firstPage();
    }
  }
}
