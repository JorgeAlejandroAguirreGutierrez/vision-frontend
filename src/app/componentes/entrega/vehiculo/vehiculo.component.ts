import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { valores, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Empresa } from '../../../modelos/usuario/empresa';
import { Vehiculo } from '../../../modelos/entrega/vehiculo';
import { VehiculoService } from '../../../servicios/entrega/vehiculo.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.scss']
})
export class VehiculoComponent implements OnInit {

  abrirPanelNuevo = true;
  abrirPanelAdmin = true;

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  vehiculo = new Vehiculo();
  vehiculos: Vehiculo[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Vehiculo) => `${row.codigo}` },
    { nombreColumna: 'modelo', cabecera: 'Modelo', celda: (row: Vehiculo) => `${row.modelo}` },
    { nombreColumna: 'placa', cabecera: 'Placa', celda: (row: Vehiculo) => `${row.placa}` },
    { nombreColumna: 'marca', cabecera: 'Marca', celda: (row: Vehiculo) => `${row.marca}` },
    { nombreColumna: 'cilindraje', cabecera: 'Cilindraje', celda: (row: Vehiculo) => `${row.cilindraje}` },
    { nombreColumna: 'clase', cabecera: 'Clase', celda: (row: Vehiculo) => `${row.clase}` },
    { nombreColumna: 'color', cabecera: 'Color', celda: (row: Vehiculo) => `${row.color}` },
    { nombreColumna: 'fabricacion', cabecera: 'Fabricacion', celda: (row: Vehiculo) => `${row.fabricacion}` },
    { nombreColumna: 'numero', cabecera: 'Numero', celda: (row: Vehiculo) => `${row.numero}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Vehiculo) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Vehiculo>;
  clickedRows = new Set<Vehiculo>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private vehiculoService: VehiculoService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
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
    this.vehiculo = new Vehiculo();
    this.clickedRows.clear();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.vehiculo.empresa = this.empresa;
    this.vehiculoService.crear(this.vehiculo).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.vehiculo=res.resultado as Vehiculo;
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.vehiculoService.actualizar(this.vehiculo).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.vehiculo=res.resultado as Vehiculo;
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.vehiculoService.activar(this.vehiculo).subscribe({
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
    this.vehiculoService.inactivar(this.vehiculo).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  
  consultar() {
    this.vehiculoService.consultarPorEmpresa(this.empresa.id).subscribe({
      next: res => {
        this.vehiculos = res.resultado as Vehiculo[]
        this.llenarTablaVehiculo(this.vehiculos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaVehiculo(vehiculos: Vehiculo[]){
    this.dataSource = new MatTableDataSource(vehiculos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccion(vehiculo: Vehiculo) {
    if (!this.clickedRows.has(vehiculo)){
      this.clickedRows.clear();
      this.clickedRows.add(vehiculo);
      this.vehiculo = vehiculo;
    } else {
      this.clickedRows.clear();
      this.vehiculo = new Vehiculo();
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
