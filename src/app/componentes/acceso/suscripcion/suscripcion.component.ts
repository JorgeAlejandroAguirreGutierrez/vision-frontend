import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { valores, validarSesion, mensajes, otras, exito, exito_swal, error, error_swal } from '../../../constantes';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/acceso/sesion';
import { SesionService } from '../../../servicios/acceso/sesion.service';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Paquete } from 'src/app/modelos/acceso/paquete';
import { NgxSpinnerService } from 'ngx-spinner';
import { Suscripcion } from 'src/app/modelos/acceso/suscripcion';
import { SuscripcionService } from 'src/app/servicios/acceso/suscripcion.service';
import { PaqueteService } from 'src/app/servicios/acceso/paquete.service';
import { Empresa } from 'src/app/modelos/acceso/empresa';
import { EmpresaService } from 'src/app/servicios/acceso/empresa.service';
import { BancoService } from 'src/app/servicios/caja-banco/banco.service';
import { Banco } from 'src/app/modelos/caja-banco/banco';
import { DatePipe } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';


@Component({
  selector: 'app-suscripcion',
  templateUrl: './suscripcion.component.html',
  styleUrls: ['./suscripcion.component.scss']
})

export class SuscripcionComponent implements OnInit {

  estadoActivo: string = valores.estadoActivo;
  estadoInactivo: string = valores.estadoInactivo;

  abrirPanelNuevo: boolean = true;
  abrirPanelAdmin: boolean = true;

  sesion: Sesion = null;
  empresa: Empresa = null;
  suscripcion: Suscripcion = new Suscripcion();
  empresas: Empresa[];
  suscripciones: Suscripcion[];
  paquetes: Paquete[];
  bancos: Banco[] = [];
  controlBanco = new UntypedFormControl();
  filtroBancos: Observable<Banco[]> = new Observable<Banco[]>();

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Suscripcion) => `${row.codigo}` },
    { nombreColumna: 'empresa', cabecera: 'Empresa', celda: (row: Suscripcion) => `${row.empresa.razonSocial}` },
    { nombreColumna: 'paquete', cabecera: 'Paquete', celda: (row: Suscripcion) => `${row.paquete.nombre}` },
    { nombreColumna: 'conteo', cabecera: 'Conteo', celda: (row: Suscripcion) => `${row.conteoComprobantes}` },
    { nombreColumna: 'maximoComprobantes', cabecera: 'Paquete', celda: (row: Suscripcion) => `${row.paquete.maximoComprobantes}` },
    { nombreColumna: 'valorTotal', cabecera: 'Valor Total', celda: (row: Suscripcion) => `$${row.paquete.valorTotal}` },
    { nombreColumna: 'fechaInicial', cabecera: 'Fecha Inicial', celda: (row: Suscripcion) => `${this.datepipe.transform(row.fechaInicial, "dd-MM-yyyy")}` },
    { nombreColumna: 'fechaFinal', cabecera: 'Fecha Final', celda: (row: Suscripcion) => `${this.datepipe.transform(row.fechaFinal, "dd-MM-yyyy")}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Suscripcion) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Suscripcion>;
  clickedRows = new Set<Suscripcion>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private router: Router, private spinnerService: NgxSpinnerService, private datepipe: DatePipe,
    private sesionService: SesionService, private suscripcionService: SuscripcionService, private paqueteService: PaqueteService, private bancoService: BancoService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
    this.suscripcion.empresa = this.empresa;
    this.consultar();
    this.consultarPaquetes();
    this.consultarBancos();
    this.inicializarFiltros();
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && ($event.ctrlKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //SHIFT + N
      this.nuevo(null);
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.suscripcion = new Suscripcion();
    this.clickedRows.clear();
  }

  construir() {
    this.controlBanco.setValue(this.suscripcion.banco);
    let fechaTransaccion = new Date(this.suscripcion.fechaTransaccion);
    this.suscripcion.fechaTransaccion = fechaTransaccion;
  } 

  seleccionarBanco(){
    this.suscripcion.banco = this.controlBanco.value;
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.spinnerService.show();
    this.suscripcionService.crear(this.suscripcion).subscribe({
      next: res => {
        this.spinnerService.hide();
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.suscripcion = res.resultado as Suscripcion;
        this.consultar();
        this.nuevo(null);
      },
      error: err => {
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.spinnerService.show();
    this.suscripcionService.actualizar(this.suscripcion).subscribe({
      next: res => {
        this.spinnerService.hide();
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.suscripcion = res.resultado as Suscripcion;
        this.consultar();
        this.nuevo(null);
      },
      error: err => {
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.suscripcionService.activar(this.suscripcion).subscribe({
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
    this.suscripcionService.inactivar(this.suscripcion).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar(){
    this.suscripcionService.consultarPorEmpresa(this.empresa.id).subscribe({
      next: res => {
        this.suscripciones = res.resultado as Suscripcion[];
        this.llenarTabla(this.suscripciones);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarPaquetes(){
    this.paqueteService.consultarPorEstado(this.estadoActivo).subscribe({
      next: res => {
        this.paquetes = res.resultado as Paquete[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarBancos(){
    this.bancoService.consultarPorEstado(this.estadoActivo).subscribe({
      next: res => {
        this.bancos = res.resultado as Banco[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(suscripciones: Suscripcion[]) {
    this.dataSource = new MatTableDataSource(suscripciones);
    this.dataSource.filterPredicate = (data: Suscripcion, filter: string): boolean =>
      data.empresa.razonSocial.includes(filter) || data.paquete.nombre.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  seleccion(suscripcion: Suscripcion) {
    if (!this.clickedRows.has(suscripcion)) {
      this.clickedRows.clear();
      this.clickedRows.add(suscripcion);
      this.suscripcion = { ...suscripcion };
      this.construir();
    } else {
      this.nuevo(null);
    }
  }
  
  inicializarFiltros(){
    this.filtroBancos = this.controlBanco.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(banco => typeof banco === 'string' ? this.filtroBanco(banco) : this.bancos.slice())
      );
  }
  private filtroBanco(value: string): Banco[] {
    if (this.bancos.length > valores.cero) {
      const filterValue = value.toUpperCase();
      return this.bancos.filter(banco => banco.abreviatura.toUpperCase().includes(filterValue));
    }
    return [];
  }
  verBanco(banco: Banco): string {
    return banco && banco.abreviatura ? banco.abreviatura : valores.vacio;
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
    if (this.suscripcion.empresa.id == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.suscripcion.paquete.id == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.suscripcion.numeroTransaccion == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.suscripcion.banco.id == valores.cero) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }
}