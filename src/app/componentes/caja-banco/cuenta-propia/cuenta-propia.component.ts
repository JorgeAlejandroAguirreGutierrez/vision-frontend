import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { validarSesion, mensajes, exito, exito_swal, error, error_swal, valores } from '../../../constantes';
import { Router } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { Sesion } from 'src/app/modelos/usuario/sesion';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Empresa } from '../../../modelos/usuario/empresa';
import { Banco } from '../../../modelos/caja-banco/banco';
import { BancoService } from '../../../servicios/caja-banco/banco.service';
import { CuentaPropia } from '../../../modelos/caja-banco/cuenta-propia';
import { CuentaPropiaService } from '../../../servicios/caja-banco/cuenta-propia.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-cuenta-propia',
  templateUrl: './cuenta-propia.component.html',
  styleUrls: ['./cuenta-propia.component.scss']
})
export class CuentaPropiaComponent implements OnInit {

  activo: string = valores.estadoActivo;
  inactivo: string = valores.estadoInactivo;
  ahorros: string = valores.ahorros;
  corriente: string = valores.corriente;

  abrirPanelNuevo : boolean= true;
  abrirPanelAdmin : boolean = true;

  sesion: Sesion=null;
  empresa: Empresa = new Empresa();
  banco: Banco = new Banco();
  cuentaPropia: CuentaPropia = new CuentaPropia();

  cuentasPropias: CuentaPropia[] = [];

  bancos: Banco[] = [];
  controlBanco = new UntypedFormControl();
  filtroBancos: Observable<Banco[]> = new Observable<Banco[]>();

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Codigo', celda: (row: CuentaPropia) => `${row.codigo}` },
    { nombreColumna: 'banco', cabecera: 'Banco', celda: (row: CuentaPropia) => `${row.banco.abreviatura}` },
    { nombreColumna: 'tipo', cabecera: 'Tipo Cta', celda: (row: CuentaPropia) => `${row.tipoCuenta}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: CuentaPropia) => `${row.nombre}` },
    { nombreColumna: 'numero', cabecera: 'Número', celda: (row: CuentaPropia) => `${row.numero}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: CuentaPropia) => `${row.estado}` }
  ];

  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<CuentaPropia>;
  clickedRows = new Set<CuentaPropia>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  constructor(private renderer: Renderer2, private sesionService: SesionService, private router: Router, 
    private cuentaPropiaService: CuentaPropiaService, private bancoService: BancoService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.empresa;
    this.consultar();
    this.consultarBancos();
    this.inicializarFiltros();
  }
  consultarBancos() {
    this.bancoService.consultarPorEstado(valores.estadoActivo).subscribe({
      next: res => {
        this.bancos = res.resultado as Banco[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.cuentaPropia = new CuentaPropia();
    this.controlBanco.setValue(valores.vacio);
    this.clickedRows.clear();
    this.borrarFiltro();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.cuentaPropia.empresa = this.empresa
    this.cuentaPropiaService.crear(this.cuentaPropia).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;  
    this.cuentaPropiaService.actualizar(this.cuentaPropia).subscribe({
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
    this.cuentaPropiaService.activar(this.cuentaPropia).subscribe({
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
    this.cuentaPropiaService.inactivar(this.cuentaPropia).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.cuentaPropiaService.consultarPorEmpresa(this.empresa.id).subscribe({
      next: res => {
        this.cuentasPropias = res.resultado as CuentaPropia[]
        this.llenarTabla(this.cuentasPropias);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(cuentasPropias: CuentaPropia[]) {
    this.dataSource = new MatTableDataSource(cuentasPropias);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccion(cuentaPropia: CuentaPropia) {
    if (!this.clickedRows.has(cuentaPropia)) {
      this.clickedRows.clear();
      this.clickedRows.add(cuentaPropia);
      this.cuentaPropia = {...cuentaPropia};
      this.controlBanco.setValue(this.cuentaPropia.banco);
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

    //FILTROS AUTOCOMPLETE
    inicializarFiltros() {
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
    seleccionarBanco(){
      this.cuentaPropia.banco = this.controlBanco.value;
    }

    //VALIDACIONES
    validarFormulario(): boolean {
      if (this.controlBanco.value == null || this.controlBanco.value == valores.vacio) {
        Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
        return false;
      }
      if (this.cuentaPropia.tipoCuenta == valores.vacio) {
        Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
        return false;
      }
      if (this.cuentaPropia.nombre == valores.vacio) {
        Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
        return false;
      }
      if (this.cuentaPropia.numero == valores.vacio) {
        Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
        return false;
      }
      return true;
    }
}
