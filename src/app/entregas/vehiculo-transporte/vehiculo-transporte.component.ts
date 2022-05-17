import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { VehiculoTransporteService } from '../../servicios/vehiculo-transporte.service';
import { VehiculoTransporte } from '../../modelos/vehiculo-transporte';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Router } from '@angular/router';
import { Sesion } from 'src/app/modelos/sesion';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-vehiculo-transporte',
  templateUrl: './vehiculo-transporte.component.html',
  styleUrls: ['./vehiculo-transporte.component.scss']
})
export class VehiculoTransporteComponent implements OnInit {

  abrirPanelNuevoVehiculoTransporte = true;
  abrirPanelAdminVehiculoTransporte = false;

  sesion: Sesion=null;
  vehiculoTransporte= new VehiculoTransporte();
  VehiculosTransportes: VehiculoTransporte[];

  columnasVehiculoTransporte: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: VehiculoTransporte) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: VehiculoTransporte) => `${row.codigo}` },
    { nombreColumna: 'modelo', cabecera: 'Modelo', celda: (row: VehiculoTransporte) => `${row.modelo}` },
    { nombreColumna: 'placa', cabecera: 'Placa', celda: (row: VehiculoTransporte) => `${row.placa}` },
    { nombreColumna: 'marca', cabecera: 'Marca', celda: (row: VehiculoTransporte) => `${row.marca}` },
    { nombreColumna: 'cilindraje', cabecera: 'Cilindraje', celda: (row: VehiculoTransporte) => `${row.cilindraje}` },
    { nombreColumna: 'clase', cabecera: 'Clase', celda: (row: VehiculoTransporte) => `${row.clase}` },
    { nombreColumna: 'color', cabecera: 'Color', celda: (row: VehiculoTransporte) => `${row.color}` },
    { nombreColumna: 'fabricacion', cabecera: 'Fabricacion', celda: (row: VehiculoTransporte) => `${row.fabricacion}` },
    { nombreColumna: 'numero', cabecera: 'Numero', celda: (row: VehiculoTransporte) => `${row.numero}` }
  ];
  cabeceraVehiculoTransporte: string[] = this.columnasVehiculoTransporte.map(titulo => titulo.nombreColumna);
  dataSourceVehiculoTransporte: MatTableDataSource<VehiculoTransporte>;
  clickedRows = new Set<VehiculoTransporte>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private vehiculoTransporteService: VehiculoTransporteService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.consultar();
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

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.vehiculoTransporte = new VehiculoTransporte();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.vehiculoTransporteService.crear(this.vehiculoTransporte).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.vehiculoTransporte=res.resultado as VehiculoTransporte;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.vehiculoTransporteService.actualizar(this.vehiculoTransporte).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.vehiculoTransporte=res.resultado as VehiculoTransporte;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event:any) {
    if (event!=null)
      event.preventDefault();
    this.vehiculoTransporteService.eliminar(this.vehiculoTransporte).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.nuevo(null);
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  consultar() {
    this.vehiculoTransporteService.consultar().subscribe(
      res => {
        this.VehiculosTransportes = res.resultado as VehiculoTransporte[]
        this.dataSourceVehiculoTransporte = new MatTableDataSource(this.VehiculosTransportes);
        this.dataSourceVehiculoTransporte.paginator = this.paginator;
        this.dataSourceVehiculoTransporte.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
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

  filtroVehiculoTransporte(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceVehiculoTransporte.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceVehiculoTransporte.paginator) {
      this.dataSourceVehiculoTransporte.paginator.firstPage();
    }
  }

}
