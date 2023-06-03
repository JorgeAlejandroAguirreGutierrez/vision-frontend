import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { VehiculoTransporteService } from '../../../servicios/entrega/vehiculo-transporte.service';
import { VehiculoTransporte } from '../../../modelos/entrega/vehiculo-transporte';
import Swal from 'sweetalert2';
import { valores, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Router } from '@angular/router';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-vehiculo-transporte',
  templateUrl: './vehiculo-transporte.component.html',
  styleUrls: ['./vehiculo-transporte.component.scss']
})
export class VehiculoTransporteComponent implements OnInit {

  abrirPanelNuevo = true;
  abrirPanelAdmin = false;

  sesion: Sesion=null;
  vehiculoTransporte= new VehiculoTransporte();
  VehiculosTransportes: VehiculoTransporte[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: VehiculoTransporte) => `${row.codigo}` },
    { nombreColumna: 'modelo', cabecera: 'Modelo', celda: (row: VehiculoTransporte) => `${row.modelo}` },
    { nombreColumna: 'placa', cabecera: 'Placa', celda: (row: VehiculoTransporte) => `${row.placa}` },
    { nombreColumna: 'marca', cabecera: 'Marca', celda: (row: VehiculoTransporte) => `${row.marca}` },
    { nombreColumna: 'cilindraje', cabecera: 'Cilindraje', celda: (row: VehiculoTransporte) => `${row.cilindraje}` },
    { nombreColumna: 'clase', cabecera: 'Clase', celda: (row: VehiculoTransporte) => `${row.clase}` },
    { nombreColumna: 'color', cabecera: 'Color', celda: (row: VehiculoTransporte) => `${row.color}` },
    { nombreColumna: 'fabricacion', cabecera: 'Fabricacion', celda: (row: VehiculoTransporte) => `${row.fabricacion}` },
    { nombreColumna: 'numero', cabecera: 'Numero', celda: (row: VehiculoTransporte) => `${row.numero}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: VehiculoTransporte) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<VehiculoTransporte>;
  clickedRows = new Set<VehiculoTransporte>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private vehiculoTransporteService: VehiculoTransporteService,
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
    this.vehiculoTransporte = new VehiculoTransporte();
    this.clickedRows.clear();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.vehiculoTransporteService.crear(this.vehiculoTransporte).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.vehiculoTransporte=res.resultado as VehiculoTransporte;
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.vehiculoTransporteService.actualizar(this.vehiculoTransporte).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.vehiculoTransporte=res.resultado as VehiculoTransporte;
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.vehiculoTransporteService.activar(this.vehiculoTransporte).subscribe({
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
    this.vehiculoTransporteService.inactivar(this.vehiculoTransporte).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  
  consultar() {
    this.vehiculoTransporteService.consultar().subscribe(
      res => {
        this.VehiculosTransportes = res.resultado as VehiculoTransporte[]
        this.dataSource = new MatTableDataSource(this.VehiculosTransportes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(vehiculoTransporte: VehiculoTransporte) {
    if (!this.clickedRows.has(vehiculoTransporte)){
      this.clickedRows.clear();
      this.clickedRows.add(vehiculoTransporte);
      this.vehiculoTransporte = vehiculoTransporte;
    } else {
      this.clickedRows.clear();
      this.vehiculoTransporte = new VehiculoTransporte();
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
