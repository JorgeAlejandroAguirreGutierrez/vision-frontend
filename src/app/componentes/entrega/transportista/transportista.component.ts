import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { TransportistaService } from '../../../servicios/entrega/transportista.service';
import { Transportista } from '../../../modelos/entrega/transportista';
import { valores, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../../constantes';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Router } from '@angular/router';
import { Sesion } from 'src/app/modelos/usuario/sesion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VehiculoTransporte } from 'src/app/modelos/entrega/vehiculo-transporte';
import { VehiculoTransporteService } from 'src/app/servicios/entrega/vehiculo-transporte.service';
import { Empresa } from 'src/app/modelos/usuario/empresa';

@Component({
  selector: 'app-transportista',
  templateUrl: './transportista.component.html',
  styleUrls: ['./transportista.component.scss']
})
export class TransportistaComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevo = true;
  abrirPanelAdmin = true;

  sesion: Sesion = null;
  empresa: Empresa = null;
  transportista = new Transportista();
  transportistas: Transportista[];
  vehiculosTransportes: VehiculoTransporte[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Transportista) => `${row.codigo}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: Transportista) => `${row.nombre}` },
    { nombreColumna: 'identificacion', cabecera: 'Identificación', celda: (row: Transportista) => `${row.identificacion}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Transportista) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Transportista>;
  clickedRows = new Set<Transportista>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private transportistaService: TransportistaService, private vehiculoTransporteService: VehiculoTransporteService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
    this.consultar();
    this.consultarVehiculosTransportes();
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
    this.transportista = new Transportista();
    this.clickedRows.clear();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.transportista.empresa = this.empresa;
    this.transportistaService.crear(this.transportista).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.transportista=res.resultado as Transportista;
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.transportistaService.actualizar(this.transportista).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.transportista=res.resultado as Transportista;
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.transportistaService.activar(this.transportista).subscribe({
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
    this.transportistaService.inactivar(this.transportista).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  
  consultar() {
    this.transportistaService.consultarPorEmpresa(this.empresa.id).subscribe(
      res => {
        this.transportistas = res.resultado as Transportista[]
        this.dataSource = new MatTableDataSource(this.transportistas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(transportista: Transportista) {
    if (!this.clickedRows.has(transportista)){
      this.clickedRows.clear();
      this.clickedRows.add(transportista);
      this.transportista = { ... transportista};
    } else {
      this.clickedRows.clear();
      this.transportista = new Transportista();
    }
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  consultarVehiculosTransportes(){
    this.vehiculoTransporteService.consultarPorEstado(valores.activo).subscribe({
      next: res => {
        this.vehiculosTransportes = res.resultado as VehiculoTransporte[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }
}
