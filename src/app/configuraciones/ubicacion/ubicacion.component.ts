import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { UbicacionService } from '../../servicios/configuracion/ubicacion.service';
import { Ubicacion } from '../../modelos/configuracion/ubicacion';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.scss']
})
export class UbicacionComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;
  
  abrirPanelNuevo = true;
  abrirPanelAdmin = false;

  sesion: Sesion=null;
  ubicacion= new Ubicacion();
  ubicaciones: Ubicacion[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Ubicacion) => `${row.codigo}` },
    { nombreColumna: 'codigoNorma', cabecera: 'Código Norma', celda: (row: Ubicacion) => `${row.codigoNorma}` },
    { nombreColumna: 'provincia', cabecera: 'Provincia', celda: (row: Ubicacion) => `${row.provincia}` },
    { nombreColumna: 'canton', cabecera: 'Canton', celda: (row: Ubicacion) => `${row.canton}` },
    { nombreColumna: 'parroquia', cabecera: 'Parroquia', celda: (row: Ubicacion) => `${row.parroquia}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Ubicacion) => `${row.estado}` },
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Ubicacion>;
  clickedRows = new Set<Ubicacion>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private ubicacionService: UbicacionService,
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
    this.ubicacion = new Ubicacion();
    this.clickedRows.clear();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.ubicacionService.crear(this.ubicacion).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.ubicacion=res.resultado as Ubicacion;
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.ubicacionService.actualizar(this.ubicacion).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.ubicacion=res.resultado as Ubicacion;
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.ubicacionService.activar(this.ubicacion).subscribe({
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
    this.ubicacionService.inactivar(this.ubicacion).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  
  consultar() {
    this.ubicacionService.consultar().subscribe(
      res => {
        this.ubicaciones = res.resultado as Ubicacion[]
        this.dataSource = new MatTableDataSource(this.ubicaciones);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(ubicacion: Ubicacion) {
    if (!this.clickedRows.has(ubicacion)){
      this.clickedRows.clear();
      this.clickedRows.add(ubicacion);
      this.ubicacion = { ... ubicacion};
    } else {
      this.clickedRows.clear();
      this.ubicacion = new Ubicacion();
    }
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
