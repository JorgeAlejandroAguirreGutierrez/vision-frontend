import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import * as util from '../../util';
import { TransportistaService } from '../../servicios/transportista.service';
import { Transportista } from '../../modelos/transportista';
import * as constantes from '../../constantes';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Router } from '@angular/router';
import { Sesion } from 'src/app/modelos/sesion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VehiculoTransporte } from 'src/app/modelos/vehiculo-transporte';
import { VehiculoTransporteService } from 'src/app/servicios/vehiculo-transporte.service';

@Component({
  selector: 'app-transportista',
  templateUrl: './transportista.component.html',
  styleUrls: ['./transportista.component.scss']
})
export class TransportistaComponent implements OnInit {

  abrirPanelNuevoTransportista = true;
  abrirPanelAdminTransportista = false;

  sesion: Sesion=null;
  transportista= new Transportista();
  transportistas: Transportista[];
  vehiculosTransportes: VehiculoTransporte[];

  columnasTransportista: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: Transportista) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Transportista) => `${row.codigo}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: Transportista) => `${row.nombre}` },
    { nombreColumna: 'identificacion', cabecera: 'Identificación', celda: (row: Transportista) => `${row.identificacion}` },
    { nombreColumna: 'vehiculoPropio', cabecera: 'Vehiculo Propio', celda: (row: Transportista) => `${row.vehiculoPropio}` },
    { nombreColumna: 'vehiculo', cabecera: 'Vehiculo', celda: (row: Transportista) => `${row.vehiculoTransporte.placa}` }
  ];
  cabeceraTransportista: string[] = this.columnasTransportista.map(titulo => titulo.nombreColumna);
  dataSourceTransportista: MatTableDataSource<Transportista>;
  clickedRows = new Set<Transportista>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private transportistaService: TransportistaService, private vehiculoTransporteService: VehiculoTransporteService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.consultar();
    this.consultarVehiculoTransporte();
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
    this.transportista = new Transportista();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.transportistaService.crear(this.transportista).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.transportista=res.resultado as Transportista;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.transportistaService.actualizar(this.transportista).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.transportista=res.resultado as Transportista;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event:any) {
    if (event!=null)
      event.preventDefault();
    this.transportistaService.eliminar(this.transportista).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.nuevo(null);
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  consultar() {
    this.transportistaService.consultar().subscribe(
      res => {
        this.transportistas = res.resultado as Transportista[]
        this.dataSourceTransportista = new MatTableDataSource(this.transportistas);
        this.dataSourceTransportista.paginator = this.paginator;
        this.dataSourceTransportista.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(transportista: Transportista) {
    if (!this.clickedRows.has(transportista)){
      this.clickedRows.clear();
      this.clickedRows.add(transportista);
      this.transportista = transportista;
    } else {
      this.clickedRows.clear();
      this.transportista = new Transportista();
    }
  }

  filtroTransportista(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTransportista.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceTransportista.paginator) {
      this.dataSourceTransportista.paginator.firstPage();
    }
  }

  consultarVehiculoTransporte() {
    this.vehiculoTransporteService.consultar().subscribe(
      res => {
        this.vehiculosTransportes = res.resultado as VehiculoTransporte[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

}
