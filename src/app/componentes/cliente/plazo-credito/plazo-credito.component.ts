import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { PlazoCreditoService } from '../../../servicios/cliente/plazo-credito.service';
import { PlazoCredito } from '../../../modelos/cliente/plazo-credito';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from 'src/app/modelos/usuario/empresa';

@Component({
  selector: 'app-plazo-credito',
  templateUrl: './plazo-credito.component.html',
  styleUrls: ['./plazo-credito.component.scss']
})
export class PlazoCreditoComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;

  sesion: Sesion = null;
  empresa: Empresa = null;
  plazoCredito = new PlazoCredito();
  plazosCreditos: PlazoCredito[];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: PlazoCredito) => `${row.codigo}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripción', celda: (row: PlazoCredito) => `${row.descripcion}` },
    { nombreColumna: 'abreviatura', cabecera: 'Abreviatura', celda: (row: PlazoCredito) => `${row.abreviatura}` },
    { nombreColumna: 'plazo', cabecera: 'Plazo', celda: (row: PlazoCredito) => `${row.plazo}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: PlazoCredito) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<PlazoCredito>;
  clickedRows = new Set<PlazoCredito>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //SHIFT + N
      this.nuevo(null);
  }

  constructor(private renderer: Renderer2, private plazoCreditoService: PlazoCreditoService,
        private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
    this.consultar();
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.plazoCredito = new PlazoCredito();
    this.clickedRows.clear();
    this.borrarFiltro();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.plazoCredito.empresa = this.empresa;
    this.plazoCreditoService.crear(this.plazoCredito).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;  
    this.plazoCreditoService.actualizar(this.plazoCredito).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
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
        this.nuevo(null);
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
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.plazoCreditoService.consultar().subscribe({
      next: res => {
        this.plazosCreditos = res.resultado as PlazoCredito[];
        this.llenarTabla(this.plazosCreditos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(plazosCreditos: PlazoCredito[]) {
    this.dataSource = new MatTableDataSource(plazosCreditos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccion(plazoCredito: PlazoCredito) {
    if (!this.clickedRows.has(plazoCredito)){
      this.clickedRows.clear();
      this.clickedRows.add(plazoCredito);
      this.plazoCredito = { ... plazoCredito};
    } else {
      this.nuevo(null);
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

  validarFormulario(): boolean{
    //validar que los campos esten llenos antes de guardar
    if (this.plazoCredito.descripcion == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.plazoCredito.abreviatura == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.plazoCredito.plazo <= 0) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }
}
