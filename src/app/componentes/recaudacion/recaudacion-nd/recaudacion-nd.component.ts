import { Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import { valores, mensajes, otras, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { DatePipe } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Parametro } from '../../../modelos/configuracion/parametro';
import { ParametroService } from '../../../servicios/configuracion/parametro.service';
import { Empresa } from '../../../modelos/usuario/empresa';
import { NDCheque } from '../../../modelos/recaudacion/nd-cheque';
import { NDDeposito } from '../../../modelos/recaudacion/nd-deposito';
import { NDTarjetaCredito } from '../../../modelos/recaudacion/nd-tarjeta-credito';
import { NDTarjetaDebito } from '../../../modelos/recaudacion/nd-tarjeta-debito';
import { NDTransferencia } from 'src/app/modelos/recaudacion/nd-transferencia';
import { NotaDebitoService } from '../../../servicios/venta/nota-debito.service';
import { Banco } from '../../../modelos/caja-banco/banco';
import { BancoService } from '../../../servicios/caja-banco/banco.service';
import { FormaPagoService } from '../../../servicios/cliente/forma-pago.service';
import { FormaPago } from '../../../modelos/cliente/forma-pago';
import { CuentaPropia } from '../../../modelos/caja-banco/cuenta-propia';
import { CuentaPropiaService } from '../../../servicios/caja-banco/cuenta-propia.service';
import { FranquiciaTarjeta } from '../../../modelos/recaudacion/franquicia-tarjeta';
import { FranquiciaTarjetaService } from '../../../servicios/recaudacion/franquicia-tarjeta.service';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../comun/formato/format-date-picker';
import { OperadorTarjeta } from '../../../modelos/recaudacion/operador-tarjeta';
import { OperadorTarjetaService } from '../../../servicios/recaudacion/operador-tarjeta.service';


import { MatStepper } from '@angular/material/stepper';
import { NotaDebitoElectronicaService } from 'src/app/servicios/venta/nota-debito-eletronica.service';
import { NotaDebito } from 'src/app/modelos/venta/nota-debito';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-recaudacion-nd',
  templateUrl: './recaudacion-nd.component.html',
  styleUrls: ['./recaudacion-nd.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})

export class RecaudacionNDComponent implements OnInit {

  @Input('stepper') stepper: MatStepper;
  @Input('notaDebito') notaDebito: NotaDebito;
  @Output() notaDebitoConRecaudacion = new EventEmitter<NotaDebito>();
  @Output() llamarNuevo = new EventEmitter();

  menosUno: number = valores.menosUno;

  estadoActivo: string = valores.estadoActivo;
  estadoInactivo: string = valores.estadoInactivo;
  estadoInternoEmitida: string = valores.estadoInternoEmitida;
  estadoInternoRecaudada: string = valores.estadoInternoRecaudada;
  estadoInternoAnulada: string = valores.estadoInternoAnulada
  estadoSriPendiente: string = valores.estadoSriPendiente;
  estadoSriAutorizada: string = valores.estadoSriAutorizada;
  estadoSriAnulada: string = valores.estadoSriAnulada;
  si: string = valores.si;
  no: string = valores.no;
  chequeALaVista: string = valores.chequeALaVista;
  chequePosfechado: string = valores.chequePosfechado;
  transferenciaDirecta: string = valores.transferenciaDirecta;
  transferenciaViaBCE: string = valores.transferenciaViaBCE;

  indiceCheque: number = valores.menosUno;
  indiceDeposito: number = valores.menosUno;
  indiceTransferencia: number = valores.menosUno;
  indiceTarjetaDebito: number = valores.menosUno;
  indiceTarjetaCredito: number = valores.menosUno;

  abrirPanelRecaudacion: boolean = true;
  
  abrirPanelCheques: boolean = true;
  abrirPanelDepositos: boolean = true;
  abrirPanelTransferencias: boolean = true;
  abrirPanelTarjetasCredito: boolean = true;
  abrirPanelTarjetasDebito: boolean = true;
  
  verPanelCheques: boolean = false;
  verPanelDepositos: boolean = false;
  verPanelTransferencias: boolean = false;
  verPanelTarjetasCredito: boolean = false;
  verPanelTarjetasDebito: boolean = false;

  deshabilitarTitularTarjetaCredito: boolean = true;
  deshabilitarTitularTarjetaDebito: boolean = true;

  sesion: Sesion;
  empresa: Empresa = new Empresa();
  cheque: NDCheque = new NDCheque();
  deposito: NDDeposito = new NDDeposito();
  transferencia: NDTransferencia = new NDTransferencia();
  tarjetaDebito: NDTarjetaDebito = new NDTarjetaDebito();
  tarjetaCredito: NDTarjetaCredito = new NDTarjetaCredito();

  periodicidades: Parametro[];
  tiposTransacciones: Parametro[];
  formasPagos: FormaPago[] = [];
  cuentasPropias: CuentaPropia[] = [];
  cuentasPropiasDeposito: CuentaPropia[] = [];
  cuentasPropiasTransferencia: CuentaPropia[] = [];
  bancosPropios: String[] = [];
  franquiciasTarjetas: FranquiciaTarjeta[];
  operadoresTarjetas: OperadorTarjeta[] = [];

  bancos: Banco[] = [];
  filtroBancosCheque: Observable<Banco[]> = new Observable<Banco[]>();
  controlBancoCheque = new UntypedFormControl();
  filtroBancosTarjetaCredito: Observable<Banco[]> = new Observable<Banco[]>();
  controlBancoTarjetaCredito = new UntypedFormControl();
  filtroBancosTarjetaDebito: Observable<Banco[]> = new Observable<Banco[]>();
  controlBancoTarjetaDebito = new UntypedFormControl();

  // Tablas de formas de pago
  columnasCheques: any[] = [
    { nombreColumna: 'fecha', cabecera: 'Fecha', pie: 'Total :' ,celda: (row: NDCheque) => `${this.datePipe.transform(row.fecha, 'dd-MM-yyyy')}`}, //.toLocaleDateString()
    { nombreColumna: 'tipo', cabecera: 'Tipo', celda: (row: NDCheque) => `${row.tipo}` },
    { nombreColumna: 'banco', cabecera: 'Banco', celda: (row: NDCheque) => `${row.banco.abreviatura}` },
    { nombreColumna: 'numero', cabecera: 'Número', celda: (row: NDCheque) => `${row.numero}` },
    { nombreColumna: 'valor', cabecera: 'Valor', celda: (row: NDCheque) => `${row.valor}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones'}
  ];
  cabeceraCheques: string[] = this.columnasCheques.map(titulo => titulo.nombreColumna);
  dataSourceCheques: MatTableDataSource<NDCheque>;
  clickedRowsCheques = new Set<NDCheque>();

  columnasDepositos: any[] = [
    { nombreColumna: 'fecha', cabecera: 'Fecha', pie: 'Total :' ,celda: (row: NDDeposito) => `${this.datePipe.transform(row.fecha, 'dd-MM-yyyy')}`},
    { nombreColumna: 'banco', cabecera: 'Banco', celda: (row: NDDeposito) => `${row.cuentaPropia.banco.abreviatura}` },
    { nombreColumna: 'cuenta', cabecera: 'Cuenta', celda: (row: NDDeposito) => `${row.cuentaPropia.numero}` },
    { nombreColumna: 'tipo', cabecera: 'Tipo Cta', celda: (row: NDDeposito) => `${row.cuentaPropia.tipoCuenta}` },
    { nombreColumna: 'comprobante', cabecera: 'Comprobante', celda: (row: NDDeposito) => `${row.comprobante}` },
    { nombreColumna: 'valor', cabecera: 'Valor', celda: (row: NDDeposito) => `${row.valor}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones'}
  ];
  cabeceraDepositos: string[] = this.columnasDepositos.map(titulo => titulo.nombreColumna);
  dataSourceDepositos: MatTableDataSource<NDDeposito>;
  clickedRowsDepositos = new Set<NDDeposito>();

  columnasTransferencias: any[] = [
    { nombreColumna: 'fecha', cabecera: 'Fecha', pie: 'Total :' ,celda: (row: NDTransferencia) => `${this.datePipe.transform(row.fecha, 'dd-MM-yyyy')}`},
    { nombreColumna: 'tipo', cabecera: 'Tipo Transf.', celda: (row: NDTransferencia) => `${row.tipo}` },
    { nombreColumna: 'banco', cabecera: 'Banco', celda: (row: NDTransferencia) => `${row.cuentaPropia.banco.abreviatura}` },
    { nombreColumna: 'cuenta', cabecera: 'Cuenta', celda: (row: NDTransferencia) => `${row.cuentaPropia.numero}` },
    { nombreColumna: 'comprobante', cabecera: 'Comprobante', celda: (row: NDTransferencia) => `${row.comprobante}` },
    { nombreColumna: 'valor', cabecera: 'Valor', celda: (row: NDTransferencia) => `${row.valor}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones'}
  ];
  cabeceraTransferencias: string[] = this.columnasDepositos.map(titulo => titulo.nombreColumna);
  dataSourceTransferencias: MatTableDataSource<NDTransferencia>;
  clickedRowsTransferencias = new Set<NDTransferencia>();

  columnasTarjetasCredito: any[] = [
    { nombreColumna: 'fecha', cabecera: 'Fecha', pie: 'Total :' ,celda: (row: NDTarjetaCredito) => `${new DatePipe('en-US').transform(row.fecha, 'dd-MM-yyyy')}`},
    { nombreColumna: 'franquicia', cabecera: 'Franquicia', celda: (row: NDTarjetaCredito) => `${row.franquiciaTarjeta.nombre}` },
    { nombreColumna: 'banco', cabecera: 'Banco', celda: (row: NDTarjetaCredito) => `${row.banco.abreviatura}` },
    { nombreColumna: 'identificacion', cabecera: 'Identificación', celda: (row: NDTarjetaCredito) => `${row.identificacion}` },
    { nombreColumna: 'titular', cabecera: 'Titular', celda: (row: NDTarjetaCredito) => `${row.titular}` },
    { nombreColumna: 'diferido', cabecera: 'Diferido', celda: (row: NDTarjetaCredito) => `${row.diferido}` },
    { nombreColumna: 'valor', cabecera: 'Valor', celda: (row: NDTarjetaCredito) => `${row.valor}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones'}
  ];
  cabeceraTarjetasCredito: string[] = this.columnasTarjetasCredito.map(titulo => titulo.nombreColumna);
  dataSourceTarjetasCredito: MatTableDataSource<NDTarjetaCredito>;
  clickedRowsTarjetasCredito = new Set<NDTarjetaCredito>();

  columnasTarjetasDebito: any[] = [
    { nombreColumna: 'fecha', cabecera: 'Fecha', pie: 'Total :' ,celda: (row: NDTarjetaDebito) => `${new DatePipe('en-US').transform(row.fecha, 'dd-MM-yyyy')}`},
    { nombreColumna: 'franquicia', cabecera: 'Franquicia', celda: (row: NDTarjetaDebito) => `${row.franquiciaTarjeta.nombre}` },
    { nombreColumna: 'banco', cabecera: 'Banco', celda: (row: NDTarjetaDebito) => `${row.banco.abreviatura}` },
    { nombreColumna: 'identificacion', cabecera: 'Identificación', celda: (row: NDTarjetaDebito) => `${row.identificacion}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: NDTarjetaDebito) => `${row.nombre}` },
    { nombreColumna: 'titular', cabecera: 'Titular', celda: (row: NDTarjetaDebito) => `${row.titular}` },
    { nombreColumna: 'valor', cabecera: 'Valor', celda: (row: NDTarjetaDebito) => `${row.valor}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones'}
  ];
  cabeceraTarjetasDebito: string[] = this.columnasTarjetasDebito.map(titulo => titulo.nombreColumna);
  dataSourceTarjetasDebito: MatTableDataSource<NDTarjetaDebito>;
  clickedRowsTarjetasDebito = new Set<NDTarjetaDebito>();

  @ViewChild('MatSortCheques') sortCheques: MatSort;
  @ViewChild('MatSortDepositos') sortDepositos: MatSort;
  @ViewChild('MatSortTransferencias') sortTransferencias: MatSort;
  @ViewChild('MatSortTarjetasCredito') sortTarjetasCredito: MatSort;
  @ViewChild('MatSortTarjetasDebito') sortTarjetasDebito: MatSort;

  @ViewChild('MatPaginatorCheques') paginatorCheques: MatPaginator;
  @ViewChild('MatPaginatorDepositos') paginatorDepositos: MatPaginator;
  @ViewChild('MatPaginatorTransferencias') paginatorTransferencias: MatPaginator;
  @ViewChild('MatPaginatorTarjetasCredito') paginatorTarjetasCredito: MatPaginator;
  @ViewChild('MatPaginatorTarjetasDebito') paginatorTarjetasDebito: MatPaginator;

  constructor(private notaDebitoService: NotaDebitoService, private notaDebitoElectronicaService: NotaDebitoElectronicaService,
    private bancoService: BancoService, private sesionService: SesionService,
    private cuentaPropiaService: CuentaPropiaService, private operadorTarjetaService: OperadorTarjetaService, private datePipe: DatePipe,
    private franquiciaTarjetaService: FranquiciaTarjetaService, private formaPagoService: FormaPagoService,
    private parametroService: ParametroService, private router: Router, private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.empresa;
    this.consultarPeriodicidades();
    this.consultarBancos();
    this.consultarBancosPropios();
    this.consultarFranquiciasTarjetas();
    this.consultarOperadoresTarjetas();
    this.inicializarFiltros();
  }

  ngOnChanges() {
    this.llenarTablasFormasPago();
    this.nuevo();
  }

  consultarPeriodicidades() {
    let tipo = otras.periodicidad;
    this.parametroService.consultarPorTipo(tipo).subscribe({
      next: res => {
        this.periodicidades = res.resultado as Parametro[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  consultarBancos() {
    this.bancoService.consultar().subscribe({
      next: res => {
        this.bancos = res.resultado as Banco[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  consultarBancosPropios() {
    this.cuentaPropiaService.consultarBancoDistintoPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.bancosPropios = res.resultado as String[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  consultarFranquiciasTarjetas() {
    this.franquiciaTarjetaService.consultar().subscribe({
      next: res => {
        this.franquiciasTarjetas = res.resultado as FranquiciaTarjeta[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  consultarOperadoresTarjetas() {
    let tipo = otras.credito;
    this.operadorTarjetaService.consultarPorTipo(tipo).subscribe({
      next: res => {
        this.operadoresTarjetas = res.resultado as OperadorTarjeta[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  nuevo(){
    this.nuevoCheque();
    this.nuevoDeposito();
    this.nuevoTransferencia();
    this.nuevoTarjetaCredito();
    this.nuevoTarjetaDebito();
  }

  crearRecaudacion(event) {
    if (event != null)
      event.preventDefault();
    this.spinnerService.show();
    this.notaDebitoService.recaudar(this.notaDebito).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.notaDebito = res.resultado as NotaDebito;
        this.spinnerService.hide();  
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.spinnerService.hide();
      }
    });
  }

  crearNotaDebitoElectronica(event) {
    if (event != null)
      event.preventDefault();
    this.spinnerService.show();  
    this.notaDebitoElectronicaService.enviar(this.notaDebito.id).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.llamarNuevo.emit();
        this.stepper.previous();
        this.spinnerService.hide();  
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.spinnerService.hide();  
      }
    });
  }

  obtenerPDF(event){
    if (event != null)
      event.preventDefault();
    this.notaDebitoElectronicaService.obtenerPDF(this.notaDebito.id);
  }
  
  enviarPDFYXML(event){
    if (event != null)
      event.preventDefault();
    this.spinnerService.show();
    this.notaDebitoElectronicaService.enviarPDFYXML(this.notaDebito.id).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.spinnerService.hide();  
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.spinnerService.hide();  
      }
    });
  }

  calcularRecaudacion() {
    this.notaDebito.totalCheques = this.calcularTotalCheques();
    this.notaDebito.totalDepositos = this.calcularTotalDepositos();
    this.notaDebito.totalTransferencias = this.calcularTotalTransferencias();
    this.notaDebito.totalTarjetasCreditos = this.calcularTotalTC();
    this.notaDebito.totalTarjetasDebitos = this.calcularTotalTD();
    this.notaDebito.totalRecaudacion = Number(this.notaDebito.efectivo) + this.notaDebito.totalCheques + this.notaDebito.totalDepositos +
      this.notaDebito.totalTransferencias + this.notaDebito.totalTarjetasCreditos + this.notaDebito.totalTarjetasDebitos;
    if (this.notaDebito.totalRecaudacion > this.notaDebito.total){
      this.notaDebito.cambio = Number((this.notaDebito.totalRecaudacion - this.notaDebito.total).toFixed(2));
      this.notaDebito.porPagar = valores.cero;
    } else {
      this.notaDebito.porPagar = Number((this.notaDebito.total - this.notaDebito.totalRecaudacion).toFixed(2));
    }
    this.notaDebito.credito.saldo = this.notaDebito.porPagar;
  }
  
  llenarTablasFormasPago() {
    this.verPanelCheques = false;
    this.verPanelDepositos = false;
    this.verPanelTransferencias = false;
    this.verPanelTarjetasCredito = false;
    this.verPanelTarjetasDebito = false;
    if(this.notaDebito.cheques.length > valores.cero){
      this.verPanelCheques = true;
      this.llenarCheques(this.notaDebito.cheques);
    }
    if(this.notaDebito.depositos.length > valores.cero){
      this.verPanelDepositos = true;
      this.llenarDepositos(this.notaDebito.depositos);
    }
    if(this.notaDebito.transferencias.length > valores.cero){
      this.verPanelTransferencias = true;
      this.llenarTransferencias(this.notaDebito.transferencias);
    }
    if(this.notaDebito.tarjetasCreditos.length > valores.cero){
      this.verPanelTarjetasCredito = true;
      this.llenarTarjetasCredito(this.notaDebito.tarjetasCreditos);
    }
    if(this.notaDebito.tarjetasDebitos.length > valores.cero){
      this.verPanelTarjetasDebito = true;
      this.llenarTarjetasDebito(this.notaDebito.tarjetasDebitos);
    }
    this.calcularRecaudacion();
  }

  consultarCuentasPropias(banco: string, formaPago: string) {
    this.cuentaPropiaService.consultarPorEmpresaYBanco(this.empresa.id, banco).subscribe({
      next: res => {
        this.cuentasPropias = res.resultado as CuentaPropia[];
        this.inicializarCuentasPropias(this.cuentasPropias, formaPago);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inicializarCuentasPropias(cuentasPropias: CuentaPropia[], formaPago: string){
    if (formaPago == 'DEPOSITO'){
      this.cuentasPropiasDeposito = cuentasPropias;
      this.deposito.cuentaPropia = cuentasPropias[0]}
    if (formaPago == 'TRANSFERENCIA'){
      this.cuentasPropiasTransferencia = cuentasPropias;
      this.transferencia.cuentaPropia = cuentasPropias[0]}
  }

  pad(numero: string, size: number): string {
    while (numero.length < size) numero = "0" + numero;
    return numero;
  }

  //EFECTIVO
  seleccionarEfectivo() {
    this.calcularRecaudacion();
  }

  //CREDITO

  //CHEQUES
  nuevoCheque(){
    this.cheque = new NDCheque();
    this.controlBancoCheque.patchValue(valores.vacio);
    this.clickedRowsCheques.clear();
    this.indiceCheque = valores.menosUno;
  }

  agregarCheque() {
    if (!this.validarCheque())
      return;  
    this.cheque.banco = this.controlBancoCheque.value as Banco;
    this.notaDebito.cheques.push(this.cheque);
    this.llenarCheques(this.notaDebito.cheques);
    this.calcularRecaudacion();
    this.nuevoCheque();
  }

  llenarCheques(cheques: NDCheque[]){
    this.dataSourceCheques = new MatTableDataSource(cheques);
    this.dataSourceCheques.sort = this.sortCheques;
    this.dataSourceCheques.paginator = this.paginatorCheques;
  }

  seleccionarCheque(cheque: NDCheque, i: number) {
    if (!this.clickedRowsCheques.has(cheque)){
      this.clickedRowsCheques.clear();
      this.clickedRowsCheques.add(cheque);
      this.cheque = { ...cheque};
      this.cheque.fecha = new Date(cheque.fecha);
      this.controlBancoCheque.setValue(this.cheque.banco);
      this.indiceCheque = i;
    } else {
      this.nuevoCheque();
    }
  }

  actualizarCheque() {
    if (!this.validarCheque())
    return;
    this.notaDebito.cheques[this.indiceCheque] = this.cheque;
    this.llenarCheques(this.notaDebito.cheques);
    this.calcularRecaudacion();
    this.nuevoCheque();
  }

  eliminarCheque(i: number) {
    if (confirm(otras.pregunta_eliminar_cheque)) {
      this.notaDebito.cheques.splice(i, 1);
      this.llenarCheques(this.notaDebito.cheques);
      this.calcularRecaudacion();
      this.nuevoCheque();
    }
  }

  calcularTotalCheques() {
    return this.notaDebito.cheques.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  rellenarNumeroCheque() {
    this.cheque.numero = this.pad(this.cheque.numero, 13);
  }

  // DEPOSITOS
  nuevoDeposito(){
    this.deposito = new NDDeposito();
    this.clickedRowsDepositos.clear();
    this.indiceDeposito = valores.menosUno;
  }

  agregarDeposito() {
    if (!this.validarDeposito())
      return;  
    this.notaDebito.depositos.push(this.deposito);
    this.llenarDepositos(this.notaDebito.depositos);
    this.calcularRecaudacion();
    this.nuevoDeposito();
  }

  llenarDepositos(depositos: NDDeposito[]){
    this.dataSourceDepositos = new MatTableDataSource(depositos);
    this.dataSourceDepositos.sort = this.sortDepositos;
    this.dataSourceDepositos.paginator = this.paginatorDepositos;
  }

  seleccionarDeposito(deposito: NDDeposito, i: number) {
    if (!this.clickedRowsDepositos.has(deposito)){
      this.clickedRowsDepositos.clear();
      this.clickedRowsDepositos.add(deposito);
      this.deposito = { ...deposito};
      this.deposito.fecha = new Date(deposito.fecha);
      this.indiceDeposito = i;
    } else {
      this.nuevoDeposito();
    }
  }

  actualizarDeposito() {
    if (!this.validarDeposito())
      return;  
    this.notaDebito.depositos[this.indiceDeposito] = this.deposito;
    this.llenarDepositos(this.notaDebito.depositos);
    this.calcularRecaudacion();
    this.nuevoDeposito();
  }

  eliminarDeposito(i: number) {
    if (confirm(otras.pregunta_eliminar_deposito)) {
      this.notaDebito.depositos.splice(i, 1);
      this.llenarDepositos(this.notaDebito.depositos);
      this.calcularRecaudacion();
      this.nuevoDeposito();
    }
  }

  calcularTotalDepositos() {
    return this.notaDebito.depositos.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  rellenarNumeroDeposito() {
    this.deposito.comprobante = this.pad(this.deposito.comprobante, 13);
  }

  // TRANSFERENCIAS
  nuevoTransferencia(){
    this.transferencia = new NDTransferencia();
    this.clickedRowsTransferencias.clear();
    this.indiceTransferencia = valores.menosUno;
  }

  agregarTransferencia() {
    if (!this.validarTransferencia())
      return;  
    this.notaDebito.transferencias.push(this.transferencia);
    this.llenarTransferencias(this.notaDebito.transferencias);
    this.calcularRecaudacion();
    this.nuevoTransferencia();
  }

  llenarTransferencias(transferencias: NDTransferencia[]){
    this.dataSourceTransferencias = new MatTableDataSource(transferencias);
    this.dataSourceTransferencias.sort = this.sortTransferencias;
    this.dataSourceTransferencias.paginator = this.paginatorTransferencias;
  }

  seleccionarTransferencia(transferencia: NDTransferencia, i: number) {
    if (!this.clickedRowsTransferencias.has(transferencia)){
      this.clickedRowsTransferencias.clear();
      this.clickedRowsTransferencias.add(transferencia);
      this.transferencia = { ...transferencia};
      this.transferencia.fecha = new Date(transferencia.fecha);
      this.indiceTransferencia = i;
    } else {
      this.nuevoTransferencia();
    }
  }

  actualizarTransferencia() {
    if (!this.validarTransferencia())
      return;  
    this.notaDebito.transferencias[this.indiceTransferencia] = this.transferencia;
    this.llenarTransferencias(this.notaDebito.transferencias);
    this.calcularRecaudacion();
    this.nuevoTransferencia();
  }

  eliminarTransferencia(i: number) {
    if (confirm(otras.pregunta_eliminar_transferencia)) {
      this.notaDebito.transferencias.splice(i, 1);
      this.llenarTransferencias(this.notaDebito.transferencias);
      this.calcularRecaudacion();
      this.nuevoTransferencia();
    }
  }

  calcularTotalTransferencias() {
    return this.notaDebito.transferencias.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  rellenarNumeroTransferencia() {
    this.transferencia.comprobante = this.pad(this.transferencia.comprobante, 13);
  }

  // TARJETAS DE CREDITO
  nuevoTarjetaCredito(){
    this.tarjetaCredito = new NDTarjetaCredito();
    this.controlBancoTarjetaCredito.patchValue(valores.vacio);
    this.clickedRowsTarjetasCredito.clear();
    this.tarjetaCredito.identificacion = this.notaDebito.factura.cliente.identificacion;
    this.tarjetaCredito.nombre = this.notaDebito.factura.cliente.razonSocial;
    this.indiceTarjetaCredito = valores.menosUno;
  }

  agregarTarjetaCredito() {
    if (!this.validarTarjetaCredito())
      return; 
    this.tarjetaCredito.banco = this.controlBancoTarjetaCredito.value;
    this.notaDebito.tarjetasCreditos.push(this.tarjetaCredito);
    this.llenarTarjetasCredito(this.notaDebito.tarjetasCreditos);
    this.calcularRecaudacion();
    this.nuevoTarjetaCredito();
  }

  llenarTarjetasCredito(tarjetasCredito: NDTarjetaCredito[]){
    this.dataSourceTarjetasCredito = new MatTableDataSource(tarjetasCredito);
    this.dataSourceTarjetasCredito.sort = this.sortTarjetasCredito;
    this.dataSourceTarjetasCredito.paginator = this.paginatorTarjetasCredito;
  }

  seleccionarTarjetaCredito(tarjetaCredito: NDTarjetaCredito, i: number) {
    if (!this.clickedRowsTarjetasCredito.has(tarjetaCredito)){
      this.clickedRowsTarjetasCredito.clear();
      this.clickedRowsTarjetasCredito.add(tarjetaCredito);
      this.tarjetaCredito = { ...tarjetaCredito};
      this.tarjetaCredito.fecha = new Date(tarjetaCredito.fecha);
      this.controlBancoTarjetaCredito.setValue(this.tarjetaCredito.banco);
      this.indiceTarjetaCredito = i;
    } else {
      this.nuevoTarjetaCredito();
    }
  }

  actualizarTarjetaCredito() {
    if (!this.validarTarjetaCredito())
      return; 
    this.notaDebito.tarjetasCreditos[this.indiceTarjetaCredito] = this.tarjetaCredito;
    this.llenarTarjetasCredito(this.notaDebito.tarjetasCreditos);
    this.calcularRecaudacion();
    this.nuevoTarjetaCredito();
  }

  eliminarTarjetaCredito(i: number) {
    if (confirm(otras.pregunta_eliminar_tarjeta_credito)) {
      this.notaDebito.tarjetasCreditos.splice(i, 1);
      this.llenarTarjetasCredito(this.notaDebito.tarjetasCreditos);
      this.calcularRecaudacion();
      this.nuevoTarjetaCredito();
    }
  }

  calcularTotalTC() {
    return this.notaDebito.tarjetasCreditos.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  cambiarTitularTarjetaCredito() {
    if (this.tarjetaCredito.titular == valores.si) {
      this.tarjetaCredito.identificacion = this.notaDebito.factura.cliente.identificacion;
      this.tarjetaCredito.nombre = this.notaDebito.factura.cliente.razonSocial;
      this.deshabilitarTitularTarjetaCredito = true;
      } else {
      this.tarjetaCredito.identificacion = valores.vacio;
      this.tarjetaCredito.nombre = valores.vacio;
      this.deshabilitarTitularTarjetaCredito = false;
    }
  }

  // TARJETAS DE DEBITO
  nuevoTarjetaDebito(){
    this.tarjetaDebito = new NDTarjetaDebito();
    this.controlBancoTarjetaDebito.patchValue(valores.vacio);
    this.clickedRowsTarjetasDebito.clear();
    this.tarjetaDebito.identificacion = this.notaDebito.factura.cliente.identificacion;
    this.tarjetaDebito.nombre = this.notaDebito.factura.cliente.razonSocial;
    this.indiceTarjetaDebito = valores.menosUno;
  }

  agregarTarjetaDebito() {
    if (!this.validarTarjetaDebito())
      return; 
    this.tarjetaDebito.banco = this.controlBancoTarjetaDebito.value;
    this.notaDebito.tarjetasDebitos.push(this.tarjetaDebito);
    this.llenarTarjetasDebito(this.notaDebito.tarjetasDebitos);
    this.calcularRecaudacion();
    this.nuevoTarjetaDebito();
  }

  llenarTarjetasDebito(tarjetasDebito: NDTarjetaDebito[]){
    this.dataSourceTarjetasDebito = new MatTableDataSource(tarjetasDebito);
    this.dataSourceTarjetasDebito.sort = this.sortTarjetasDebito;
    this.dataSourceTarjetasDebito.paginator = this.paginatorTarjetasDebito;
  }

  seleccionarTarjetaDebito(tarjetaDebito: NDTarjetaDebito, i: number) {
    if (!this.clickedRowsTarjetasDebito.has(tarjetaDebito)){
      this.clickedRowsTarjetasDebito.clear();
      this.clickedRowsTarjetasDebito.add(tarjetaDebito);
      this.tarjetaDebito = { ...tarjetaDebito};
      this.tarjetaDebito.fecha = new Date(tarjetaDebito.fecha);
      this.controlBancoTarjetaDebito.setValue(this.tarjetaDebito.banco);
      this.indiceTarjetaDebito = i;
    } else {
      this.nuevoTarjetaDebito();
    }
  }

  actualizarTarjetaDebito() {
    if (!this.validarTarjetaDebito())
      return; 
    this.notaDebito.tarjetasDebitos[this.indiceTarjetaDebito] = this.tarjetaDebito;
    this.llenarTarjetasDebito(this.notaDebito.tarjetasDebitos);
    this.calcularRecaudacion();
    this.nuevoTarjetaDebito();
  }

  eliminarTarjetaDebito(i: number) {
    if (confirm(otras.pregunta_eliminar_tarjeta_debito)) {
      this.notaDebito.tarjetasDebitos.splice(i, 1);
      this.llenarTarjetasDebito(this.notaDebito.tarjetasDebitos);
      this.calcularRecaudacion();
      this.nuevoTarjetaDebito();
    }
  }

  calcularTotalTD() {
    return this.notaDebito.tarjetasDebitos.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  cambiarTitularTarjetaDebito() {
    if (this.tarjetaDebito.titular == valores.si) {
      this.tarjetaDebito.identificacion = this.notaDebito.factura.cliente.identificacion;
      this.tarjetaDebito.nombre = this.notaDebito.factura.cliente.razonSocial;
      this.deshabilitarTitularTarjetaDebito = true;
      } else {
      this.tarjetaDebito.identificacion = valores.vacio;
      this.tarjetaDebito.nombre = valores.vacio;
      this.deshabilitarTitularTarjetaDebito = false;
    }
  }

  //FILTROS AUTOCOMPLETE
  inicializarFiltros() {
    this.filtroBancosCheque = this.controlBancoCheque.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(banco => typeof banco === 'string' ? this.filtroBanco(banco) : this.bancos.slice())
      );
      this.filtroBancosTarjetaCredito = this.controlBancoTarjetaCredito.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(banco => typeof banco === 'string' ? this.filtroBanco(banco) : this.bancos.slice())
      );
      this.filtroBancosTarjetaDebito = this.controlBancoTarjetaDebito.valueChanges
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

  //STEEPER
  stepperPrevio(stepper: MatStepper){
    this.notaDebitoConRecaudacion.emit(this.notaDebito);
    stepper.previous();
  }
  
  stepperSiguiente(stepper: MatStepper){
      stepper.next();
  }

  //VALIDACIONES
  validarCheque(): boolean{
    if (this.cheque.fecha == null || this.cheque.tipo == null) {
      Swal.fire(error, mensajes.error_recaudacion_dato, error_swal);
      return false;
    }
    let banco: Banco = this.controlBancoCheque.value as Banco;
    if (this.controlBancoCheque.value == null || this.controlBancoCheque.value == valores.vacio || banco.id == undefined) {
      Swal.fire(error, mensajes.error_recaudacion_dato, error_swal);
      return false;
    }
    if (this.cheque.numero == null || this.cheque.numero == '0000000000000') {
      Swal.fire(error, mensajes.error_recaudacion_dato, error_swal);
      return false;
    }
    if (this.cheque.valor == null || this.cheque.valor <= valores.cero) {
      Swal.fire(error, mensajes.error_recaudacion_valor, error_swal);
      return false;
    }
    return true;
  }
  validarDeposito(): boolean{
    if (this.deposito.fecha == null || this.deposito.cuentaPropia.banco.abreviatura == valores.vacio) {
      Swal.fire(error, mensajes.error_recaudacion_dato, error_swal);
      return false;
    }
    if (this.deposito.comprobante == null || this.deposito.comprobante == valores.vacio || 
      this.deposito.comprobante == '0000000000000') {
      Swal.fire(error, mensajes.error_recaudacion_dato, error_swal);
      return false;
    }
    if (this.deposito.valor == null || this.deposito.valor <= valores.cero) {
      Swal.fire(error, mensajes.error_recaudacion_valor, error_swal);
      return false;
    }  
    return true;
  }

  validarTransferencia(): boolean{
    if (this.transferencia.fecha == null || this.transferencia.cuentaPropia.banco.abreviatura == valores.vacio) {
      Swal.fire(error, mensajes.error_recaudacion_dato, error_swal);
      return false;
    }
    if (this.transferencia.comprobante == null || this.transferencia.comprobante == valores.vacio || 
      this.transferencia.comprobante == '0000000000000') {
      Swal.fire(error, mensajes.error_recaudacion_dato, error_swal);
      return false;
    }
    if (this.transferencia.valor == null || this.transferencia.valor <= valores.cero) {
      Swal.fire(error, mensajes.error_recaudacion_valor, error_swal);
      return false;
    }  
    return true;
  }

  validarTarjetaCredito(): boolean{
    if (this.notaDebito.totalRecaudacion + Number(this.tarjetaCredito.valor) > this.notaDebito.total) {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
      return false;
    }
    let banco: Banco = this.controlBancoTarjetaCredito.value as Banco;
    if (this.controlBancoTarjetaCredito.value == null || this.controlBancoTarjetaCredito.value == valores.vacio ||
        banco.id == undefined) {
      Swal.fire(error, mensajes.error_recaudacion_dato, error_swal);
      return false;
    }
    if (this.tarjetaCredito.fecha == null || this.tarjetaCredito.franquiciaTarjeta == null) {
      Swal.fire(error, mensajes.error_recaudacion_dato, error_swal);
      return false;
    }
    if (this.tarjetaCredito.identificacion == null || this.tarjetaCredito.nombre == null) {
      Swal.fire(error, mensajes.error_recaudacion_dato, error_swal);
      return false;
    }
    if (this.tarjetaCredito.operadorTarjeta == null || this.tarjetaCredito.lote == null) {
      Swal.fire(error, mensajes.error_recaudacion_dato, error_swal);
      return false;
    }
    if (this.tarjetaCredito.valor == null || this.tarjetaCredito.valor <= valores.cero) {
      Swal.fire(error, mensajes.error_recaudacion_valor, error_swal);
      return false;
    }
    return true;
  }

  validarTarjetaDebito(): boolean{
    if (this.notaDebito.totalRecaudacion + Number(this.tarjetaDebito.valor) > this.notaDebito.total) {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
      return false;
    }
    let banco: Banco = this.controlBancoTarjetaDebito.value as Banco;
    if (this.controlBancoTarjetaDebito.value == null || this.controlBancoTarjetaDebito.value == valores.vacio
      || banco == undefined) {
      Swal.fire(error, mensajes.error_recaudacion_dato, error_swal);
      return false;
    }
    if (this.tarjetaDebito.fecha == null || this.tarjetaDebito.franquiciaTarjeta == null) {
      Swal.fire(error, mensajes.error_recaudacion_dato, error_swal);
      return false;
    }
    if (this.tarjetaDebito.identificacion == null || this.tarjetaDebito.nombre == null) {
      Swal.fire(error, mensajes.error_recaudacion_dato, error_swal);
      return false;
    }
    if (this.tarjetaDebito.operadorTarjeta == null || this.tarjetaDebito.lote == null) {
      Swal.fire(error, mensajes.error_recaudacion_dato, error_swal);
      return false;
    }
    if (this.tarjetaDebito.valor == null || this.tarjetaDebito.valor <= valores.cero) {
      Swal.fire(error, mensajes.error_recaudacion_valor, error_swal);
      return false;
    }
    return true;
  }

  validarIdentificacion(identificacion: string, tipo: string) {
    this.notaDebitoService.validarIdentificacion(identificacion).subscribe({
      next: res => {
        if (res.resultado != valores.vacio) {
          if (tipo == 'TC') {
            this.tarjetaCredito.identificacion = identificacion;
            this.tarjetaCredito.nombre = res.resultado;
          } else {
            this.tarjetaDebito.identificacion = identificacion;
            this.tarjetaDebito.nombre = res.resultado;
          }
        } else {
          this.tarjetaCredito.identificacion = valores.vacio;
          Swal.fire({ icon: error_swal, title: exito, text: res.mensaje });
        }
      },
      error: err => Swal.fire(error, err.error.mensaje, error_swal)
    });
  }
}
