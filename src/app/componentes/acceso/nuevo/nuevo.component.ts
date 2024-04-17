import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { valores, validarSesion, mensajes, otras, exito, exito_swal, error, error_swal } from '../../../constantes';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/acceso/sesion';
import { SesionService } from '../../../servicios/acceso/sesion.service';
import { environment } from 'src/environments/environment';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Nuevo } from 'src/app/modelos/acceso/nuevo';
import { NuevoService } from 'src/app/servicios/acceso/nuevo.service';


@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.scss']
})

export class NuevoComponent implements OnInit {

  sesion: Sesion = null;
  nuevo: Nuevo = new Nuevo();

  nuevos: Nuevo[];

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;

  dataSource: MatTableDataSource<Nuevo>;
  clickedRows = new Set<Nuevo>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  si: string = valores.si;
  no: string = valores.no;
  masculino: string = valores.masculino;
  femenino: string = valores.femenino

  columnas: any[] = [
    { nombreColumna: 'identificacion', cabecera: 'Identificacion', celda: (row: Nuevo) => `${row.identificacion}` },
    { nombreColumna: 'razonSocial', cabecera: 'Razon Social', celda: (row: Nuevo) => `${row.razonSocial}` },
    { nombreColumna: 'obligado', cabecera: 'Oblig.', celda: (row: Nuevo) => `${row.obligado}` },
    { nombreColumna: 'direccion', cabecera: 'Direccion', celda: (row: Nuevo) => `${row.direccion}` },
    { nombreColumna: 'especial', cabecera: 'Especial', celda: (row: Nuevo) => `${row.especial}` },
    { nombreColumna: 'numeroResolucionEspecial', cabecera: 'No. Especial', celda: (row: Nuevo) => `${row.numeroResolucionEspecial}` },
    { nombreColumna: 'AgenteRetencion', cabecera: 'Ag. Ret', celda: (row: Nuevo) => `${row.agenteRetencion}` },
    { nombreColumna: 'numeroAgenteRetencion', cabecera: 'No. Ag Retencio', celda: (row: Nuevo) => `${row.numeroAgenteRetencion}` },
    { nombreColumna: 'regimen', cabecera: 'Regimen', celda: (row: Nuevo) => `${row.regimen}` },
    { nombreColumna: 'provincia', cabecera: 'Provincia', celda: (row: Nuevo) => `${row.provincia}` },
    { nombreColumna: 'canton', cabecera: 'Canton', celda: (row: Nuevo) => `${row.canton}` },
    { nombreColumna: 'parroquia', cabecera: 'Parroquia', celda: (row: Nuevo) => `${row.parroquia}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);

  constructor(private renderer: Renderer2, private router: Router,
    private sesionService: SesionService, private nuevoService: NuevoService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.consultar();
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && ($event.ctrlKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //SHIFT + N
      this.nuevof(null);
  }

  nuevof(event) {
    if (event != null)
      event.preventDefault();
    this.nuevo = new Nuevo();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.nuevoService.crear(this.nuevo).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.nuevo = res.resultado as Nuevo;
        this.consultar();
        this.nuevof(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.nuevoService.actualizar(this.nuevo).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.nuevo = res.resultado as Nuevo;
        this.consultar();
        this.nuevof(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  ejecutar(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.nuevoService.ejecutar(this.nuevo).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.nuevo = res.resultado as Nuevo;
        this.consultar();
        this.nuevof(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.nuevoService.consultar().subscribe({
      next: res => {
        this.nuevos = res.resultado as Nuevo[];
        this.llenarTabla(this.nuevos);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(empresas: Nuevo[]) {
    this.dataSource = new MatTableDataSource(empresas);
    this.dataSource.filterPredicate = (data: Nuevo, filter: string): boolean =>
      data.identificacion.includes(filter) || data.razonSocial.includes(filter) || data.nombreComercial.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  seleccion(nuevo: Nuevo) {
    if (!this.clickedRows.has(nuevo)) {
      this.clickedRows.clear();
      this.clickedRows.add(nuevo);
      this.nuevo = { ...nuevo };
      console.log(this.nuevo);
    } else {
      this.nuevof(null);
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

  validarFormulario(): boolean {
    if (this.nuevo.identificacion == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.nuevo.razonSocial == null) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_ruc });
      return false;
    }
    if (this.nuevo.nombreComercial == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }
}