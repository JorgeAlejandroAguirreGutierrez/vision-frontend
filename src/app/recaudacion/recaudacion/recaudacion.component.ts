import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { valores, mensajes, otras, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import { DatePipe } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../modelos/format-date-picker';
import { Router } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Parametro } from '../../modelos/configuracion/parametro';
import { ParametroService } from '../../servicios/configuracion/parametro.service';
import { ClienteService } from '../../servicios/cliente/cliente.service';
import { FormaPago } from '../../modelos/cliente/forma-pago';
import { FormaPagoService } from '../../servicios/cliente/forma-pago.service';
import { Banco } from '../../modelos/caja-banco/banco';
import { BancoService } from '../../servicios/caja-banco/banco.service';
import { Cheque } from '../../modelos/recaudacion/cheque';
import { Deposito } from '../../modelos/recaudacion/deposito';
import { Transferencia } from '../../modelos/recaudacion/transferencia';
import { TarjetaCredito } from '../../modelos/recaudacion/tarjeta-credito';
import { TarjetaDebito } from '../../modelos/recaudacion/tarjeta-debito';
import { Factura } from '../../modelos/venta/factura';
import { FacturaService } from '../../servicios/venta/factura.service';
import { FacturaElectronicaService } from '../../servicios/venta/factura-eletronica.service';
import { CuentaPropia } from '../../modelos/caja-banco/cuenta-propia';
import { CuentaPropiaService } from '../../servicios/caja-banco/cuenta-propia.service';
import { FranquiciaTarjeta } from '../../modelos/recaudacion/franquicia-tarjeta';
import { FranquiciaTarjetaService } from '../../servicios/recaudacion/franquicia-tarjeta.service';
import { OperadorTarjeta } from '../../modelos/recaudacion/operador-tarjeta';
import { OperadorTarjetaService } from '../../servicios/recaudacion/operador-tarjeta.service';

import { MatStepper } from '@angular/material/stepper';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-recaudacion',
  templateUrl: './recaudacion.component.html',
  styleUrls: ['./recaudacion.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class RecaudacionComponent implements OnInit, OnChanges {

  @Input('stepper') stepper: MatStepper;
  @Input('factura') factura: Factura;
  @Output() facturaConRecaudacion = new EventEmitter<Factura>();
  @Output() llamarNuevo = new EventEmitter();

  menosUno: number = valores.menosUno;

  si: string = valores.si;
  no: string = valores.no;
  emitida: string = valores.emitida;
  anulada: string = valores.anulada;
  noFacturada: string = valores.noFacturada;
  facturada: string = valores.facturada;
  noRecaudada: string = valores.noRecaudada;
  recaudada: string = valores.recaudada;
  chequeALaVista: string = valores.chequeALaVista;
  chequePosfechado: string = valores.chequePosfechado;
  transferenciaDirecta: string = valores.transferenciaDirecta;
  transferenciaViaBCE: string = valores.transferenciaViaBCE;

  indiceCheque: number = valores.menosUno;
  indiceDeposito: number = valores.menosUno;
  indiceTransferencia: number = valores.menosUno;
  indiceTarjetaDebito: number = valores.menosUno;
  indiceTarjetaCredito: number = valores.menosUno;

  cargar: boolean = false;
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

  cheque: Cheque = new Cheque();
  deposito: Deposito = new Deposito();
  transferencia: Transferencia = new Transferencia();
  tarjetaDebito: TarjetaDebito = new TarjetaDebito();
  tarjetaCredito: TarjetaCredito = new TarjetaCredito();

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
    { nombreColumna: 'fecha', cabecera: 'Fecha', pie: 'Total :' ,celda: (row: Cheque) => `${this.datePipe.transform(row.fecha, 'dd-MM-yyyy')}`}, //.toLocaleDateString()
    { nombreColumna: 'tipo', cabecera: 'Tipo', celda: (row: Cheque) => `${row.tipo}` },
    { nombreColumna: 'banco', cabecera: 'Banco', celda: (row: Cheque) => `${row.banco.abreviatura}` },
    { nombreColumna: 'numero', cabecera: 'Número', celda: (row: Cheque) => `${row.numero}` },
    { nombreColumna: 'valor', cabecera: 'Valor', celda: (row: Cheque) => `${row.valor}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones'}
  ];
  cabeceraCheques: string[] = this.columnasCheques.map(titulo => titulo.nombreColumna);
  dataSourceCheques: MatTableDataSource<Cheque>;
  clickedRowsCheques = new Set<Cheque>();

  columnasDepositos: any[] = [
    { nombreColumna: 'fecha', cabecera: 'Fecha', pie: 'Total :' ,celda: (row: Deposito) => `${this.datePipe.transform(row.fecha, 'dd-MM-yyyy')}`},
    { nombreColumna: 'banco', cabecera: 'Banco', celda: (row: Deposito) => `${row.cuentaPropia.banco.abreviatura}` },
    { nombreColumna: 'cuenta', cabecera: 'Cuenta', celda: (row: Deposito) => `${row.cuentaPropia.numero}` },
    { nombreColumna: 'tipo', cabecera: 'Tipo Cta', celda: (row: Deposito) => `${row.cuentaPropia.tipoCuenta}` },
    { nombreColumna: 'comprobante', cabecera: 'Comprobante', celda: (row: Deposito) => `${row.comprobante}` },
    { nombreColumna: 'valor', cabecera: 'Valor', celda: (row: Deposito) => `${row.valor}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones'}
  ];
  cabeceraDepositos: string[] = this.columnasDepositos.map(titulo => titulo.nombreColumna);
  dataSourceDepositos: MatTableDataSource<Deposito>;
  clickedRowsDepositos = new Set<Deposito>();

  columnasTransferencias: any[] = [
    { nombreColumna: 'fecha', cabecera: 'Fecha', pie: 'Total :' ,celda: (row: Transferencia) => `${this.datePipe.transform(row.fecha, 'dd-MM-yyyy')}`},
    { nombreColumna: 'tipo', cabecera: 'Tipo Transf.', celda: (row: Transferencia) => `${row.tipo}` },
    { nombreColumna: 'banco', cabecera: 'Banco', celda: (row: Transferencia) => `${row.cuentaPropia.banco.abreviatura}` },
    { nombreColumna: 'cuenta', cabecera: 'Cuenta', celda: (row: Transferencia) => `${row.cuentaPropia.numero}` },
    { nombreColumna: 'comprobante', cabecera: 'Comprobante', celda: (row: Transferencia) => `${row.comprobante}` },
    { nombreColumna: 'valor', cabecera: 'Valor', celda: (row: Transferencia) => `${row.valor}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones'}
  ];
  cabeceraTransferencias: string[] = this.columnasDepositos.map(titulo => titulo.nombreColumna);
  dataSourceTransferencias: MatTableDataSource<Transferencia>;
  clickedRowsTransferencias = new Set<Transferencia>();

  columnasTarjetasCredito: any[] = [
    { nombreColumna: 'fecha', cabecera: 'Fecha', pie: 'Total :' ,celda: (row: TarjetaCredito) => `${new DatePipe('en-US').transform(row.fecha, 'dd-MM-yyyy')}`},
    { nombreColumna: 'franquicia', cabecera: 'Franquicia', celda: (row: TarjetaCredito) => `${row.franquiciaTarjeta.nombre}` },
    { nombreColumna: 'banco', cabecera: 'Banco', celda: (row: TarjetaCredito) => `${row.banco.abreviatura}` },
    { nombreColumna: 'identificacion', cabecera: 'Identificación', celda: (row: TarjetaCredito) => `${row.identificacion}` },
    { nombreColumna: 'titular', cabecera: 'Titular', celda: (row: TarjetaCredito) => `${row.titular}` },
    { nombreColumna: 'diferido', cabecera: 'Diferido', celda: (row: TarjetaCredito) => `${row.diferido}` },
    { nombreColumna: 'valor', cabecera: 'Valor', celda: (row: TarjetaCredito) => `${row.valor}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones'}
  ];
  cabeceraTarjetasCredito: string[] = this.columnasTarjetasCredito.map(titulo => titulo.nombreColumna);
  dataSourceTarjetasCredito: MatTableDataSource<TarjetaCredito>;
  clickedRowsTarjetasCredito = new Set<TarjetaCredito>();

  columnasTarjetasDebito: any[] = [
    { nombreColumna: 'fecha', cabecera: 'Fecha', pie: 'Total :' ,celda: (row: TarjetaDebito) => `${new DatePipe('en-US').transform(row.fecha, 'dd-MM-yyyy')}`},
    { nombreColumna: 'franquicia', cabecera: 'Franquicia', celda: (row: TarjetaDebito) => `${row.franquiciaTarjeta.nombre}` },
    { nombreColumna: 'banco', cabecera: 'Banco', celda: (row: TarjetaDebito) => `${row.banco.abreviatura}` },
    { nombreColumna: 'identificacion', cabecera: 'Identificación', celda: (row: TarjetaDebito) => `${row.identificacion}` },
    { nombreColumna: 'nombre', cabecera: 'Nombre', celda: (row: TarjetaDebito) => `${row.nombre}` },
    { nombreColumna: 'titular', cabecera: 'Titular', celda: (row: TarjetaDebito) => `${row.titular}` },
    { nombreColumna: 'valor', cabecera: 'Valor', celda: (row: TarjetaDebito) => `${row.valor}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones'}
  ];
  cabeceraTarjetasDebito: string[] = this.columnasTarjetasDebito.map(titulo => titulo.nombreColumna);
  dataSourceTarjetasDebito: MatTableDataSource<TarjetaDebito>;
  clickedRowsTarjetasDebito = new Set<TarjetaDebito>();

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

  constructor(private facturaService: FacturaService, private facturaElectronicaService: FacturaElectronicaService,
    private clienteService: ClienteService, private bancoService: BancoService, private sesionService: SesionService,
    private cuentaPropiaService: CuentaPropiaService, private operadorTarjetaService: OperadorTarjetaService, private datePipe: DatePipe,
    private franquiciaTarjetaService: FranquiciaTarjetaService, private formaPagoService: FormaPagoService,
    private parametroService: ParametroService, private router: Router, private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.consultarPeriodicidades();
    this.consultarBancos();
    this.consultarBancosPropios();
    this.consultarFranquiciasTarjetas();
    this.consultarOperadoresTarjetas();
    this.inicializarFiltros();

    /*this.facturaService.eventoRecaudacion.subscribe((data: Factura) => {
      this.factura = data;
      this.llenarTablasFormasPago();
      this.nuevo();
    });*/
  }

  ngOnChanges() {
    //console.log('Código ejecutado despues de recibir datos del componente padre');
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
    this.cuentaPropiaService.consultarBancos().subscribe({
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
      //console.log(this.factura);
    this.facturaService.actualizar(this.factura).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.factura = res.resultado as Factura;
        this.spinnerService.hide();  
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.spinnerService.hide();
      }
    });
  }

  crearFacturaElectronica(event) {
    if (event != null)
      event.preventDefault();
    this.spinnerService.show();  
    this.facturaElectronicaService.enviar(this.factura.id).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        //this.factura = res.resultado as Factura;
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
    this.facturaElectronicaService.obtenerPDF(this.factura.id);
  }
  
  enviarPDFYXML(event){
    if (event != null)
      event.preventDefault();
    this.spinnerService.show();
    this.facturaElectronicaService.enviarPDFYXML(this.factura.id).subscribe({
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
/*  calcularRecaudacion() {
    this.facturaService.calcularRecaudacion(this.factura).subscribe({
      next: res => {
        this.factura = res.resultado as Factura;
      }, 
      error: err => Swal.fire(error, err.error.mensaje, error_swal)
    });
  }*/

  calcularRecaudacion() {
    this.factura.totalCheques = this.calcularTotalCheques();
    this.factura.totalDepositos = this.calcularTotalDepositos();
    this.factura.totalTransferencias = this.calcularTotalTransferencias();
    this.factura.totalTarjetasCreditos = this.calcularTotalTC();
    this.factura.totalTarjetasDebitos = this.calcularTotalTD();
    this.factura.totalRecaudacion = Number(this.factura.efectivo) + this.factura.totalCheques + this.factura.totalDepositos +
      this.factura.totalTransferencias + this.factura.totalTarjetasCreditos + this.factura.totalTarjetasDebitos;
    if (this.factura.totalRecaudacion > this.factura.totalConDescuento){
      this.factura.cambio = Number((this.factura.totalRecaudacion - this.factura.totalConDescuento).toFixed(2));
      this.factura.porPagar = valores.cero;
    } else {
      this.factura.porPagar = Number((this.factura.totalConDescuento - this.factura.totalRecaudacion).toFixed(2));
    }
    this.factura.credito.saldo = this.factura.porPagar;
  }
  
  llenarTablasFormasPago() {
    this.verPanelCheques = false;
    this.verPanelDepositos = false;
    this.verPanelTransferencias = false;
    this.verPanelTarjetasCredito = false;
    this.verPanelTarjetasDebito = false;
    if(this.factura.cheques.length > valores.cero){
      this.verPanelCheques = true;
      this.llenarCheques(this.factura.cheques);
    }
    if(this.factura.depositos.length > valores.cero){
      this.verPanelDepositos = true;
      this.llenarDepositos(this.factura.depositos);
    }
    if(this.factura.transferencias.length > valores.cero){
      this.verPanelTransferencias = true;
      this.llenarTransferencias(this.factura.transferencias);
    }
    if(this.factura.tarjetasCreditos.length > valores.cero){
      this.verPanelTarjetasCredito = true;
      this.llenarTarjetasCredito(this.factura.tarjetasCreditos);
    }
    if(this.factura.tarjetasDebitos.length > valores.cero){
      this.verPanelTarjetasDebito = true;
      this.llenarTarjetasDebito(this.factura.tarjetasDebitos);
    }
    this.calcularRecaudacion();
  }

  consultarPorBanco(banco: string, formaPago: string) {
    this.cuentaPropiaService.consultarPorBanco(banco).subscribe({
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
    this.cheque = new Cheque();
    this.controlBancoCheque.patchValue(valores.vacio);
    this.clickedRowsCheques.clear();
    this.indiceCheque = valores.menosUno;
  }

  agregarCheque() {
    if (!this.validarCheque())
      return;  
    this.cheque.banco = this.controlBancoCheque.value as Banco;
    this.factura.cheques.push(this.cheque);
    this.llenarCheques(this.factura.cheques);
    this.calcularRecaudacion();
    this.nuevoCheque();
  }

  llenarCheques(cheques: Cheque[]){
    this.dataSourceCheques = new MatTableDataSource(cheques);
    this.dataSourceCheques.sort = this.sortCheques;
    this.dataSourceCheques.paginator = this.paginatorCheques;
  }

  seleccionCheque(cheque: Cheque, i: number) {
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
    this.factura.cheques[this.indiceCheque] = this.cheque;
    this.llenarCheques(this.factura.cheques);
    this.calcularRecaudacion();
    this.nuevoCheque();
  }

  eliminarCheque(i: number) {
    if (confirm(otras.pregunta_eliminar_cheque)) {
      this.factura.cheques.splice(i, 1);
      this.llenarCheques(this.factura.cheques);
      this.calcularRecaudacion();
      this.nuevoCheque();
    }
  }

  calcularTotalCheques() {
    return this.factura.cheques.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  rellenarNumeroCheque() {
    this.cheque.numero = this.pad(this.cheque.numero, 13);
  }

  // DEPOSITOS
  nuevoDeposito(){
    this.deposito = new Deposito();
    this.clickedRowsDepositos.clear();
    this.indiceDeposito = valores.menosUno;
  }

  agregarDeposito() {
    if (!this.validarDeposito())
      return;  
    this.factura.depositos.push(this.deposito);
    this.llenarDepositos(this.factura.depositos);
    this.calcularRecaudacion();
    this.nuevoDeposito();
  }

  llenarDepositos(depositos: Deposito[]){
    this.dataSourceDepositos = new MatTableDataSource(depositos);
    this.dataSourceDepositos.sort = this.sortDepositos;
    this.dataSourceDepositos.paginator = this.paginatorDepositos;
  }

  seleccionDeposito(deposito: Deposito, i: number) {
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
    this.factura.depositos[this.indiceDeposito] = this.deposito;
    this.llenarDepositos(this.factura.depositos);
    this.calcularRecaudacion();
    this.nuevoDeposito();
  }

  eliminarDeposito(i: number) {
    if (confirm(otras.pregunta_eliminar_deposito)) {
      this.factura.depositos.splice(i, 1);
      this.llenarDepositos(this.factura.depositos);
      this.calcularRecaudacion();
      this.nuevoDeposito();
    }
  }

  calcularTotalDepositos() {
    return this.factura.depositos.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  rellenarNumeroDeposito() {
    this.deposito.comprobante = this.pad(this.deposito.comprobante, 13);
  }

  // TRANSFERENCIAS
  nuevoTransferencia(){
    this.transferencia = new Transferencia();
    this.clickedRowsTransferencias.clear();
    this.indiceTransferencia = valores.menosUno;
  }

  agregarTransferencia() {
    if (!this.validarTransferencia())
      return;  
    this.factura.transferencias.push(this.transferencia);
    this.llenarTransferencias(this.factura.transferencias);
    this.calcularRecaudacion();
    this.nuevoTransferencia();
  }

  llenarTransferencias(transferencias: Transferencia[]){
    this.dataSourceTransferencias = new MatTableDataSource(transferencias);
    this.dataSourceTransferencias.sort = this.sortTransferencias;
    this.dataSourceTransferencias.paginator = this.paginatorTransferencias;
  }

  seleccionTransferencia(transferencia: Transferencia, i: number) {
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
    this.factura.transferencias[this.indiceTransferencia] = this.transferencia;
    this.llenarTransferencias(this.factura.transferencias);
    this.calcularRecaudacion();
    this.nuevoTransferencia();
  }

  eliminarTransferencia(i: number) {
    if (confirm(otras.pregunta_eliminar_transferencia)) {
      this.factura.transferencias.splice(i, 1);
      this.llenarTransferencias(this.factura.transferencias);
      this.calcularRecaudacion();
      this.nuevoTransferencia();
    }
  }

  calcularTotalTransferencias() {
    return this.factura.transferencias.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  rellenarNumeroTransferencia() {
    this.transferencia.comprobante = this.pad(this.transferencia.comprobante, 13);
  }

  // TARJETAS DE CREDITO
  nuevoTarjetaCredito(){
    this.tarjetaCredito = new TarjetaCredito();
    this.controlBancoTarjetaCredito.patchValue(valores.vacio);
    this.clickedRowsTarjetasCredito.clear();
    this.tarjetaCredito.identificacion = this.factura.cliente.identificacion;
    this.tarjetaCredito.nombre = this.factura.cliente.razonSocial;
    this.indiceTarjetaCredito = valores.menosUno;
  }

  agregarTarjetaCredito() {
    if (!this.validarTarjetaCredito())
      return; 
    this.tarjetaCredito.banco = this.controlBancoTarjetaCredito.value;
    this.factura.tarjetasCreditos.push(this.tarjetaCredito);
    this.llenarTarjetasCredito(this.factura.tarjetasCreditos);
    this.calcularRecaudacion();
    this.nuevoTarjetaCredito();
  }

  llenarTarjetasCredito(tarjetasCredito: TarjetaCredito[]){
    this.dataSourceTarjetasCredito = new MatTableDataSource(tarjetasCredito);
    this.dataSourceTarjetasCredito.sort = this.sortTarjetasCredito;
    this.dataSourceTarjetasCredito.paginator = this.paginatorTarjetasCredito;
  }

  seleccionTarjetaCredito(tarjetaCredito: TarjetaCredito, i: number) {
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
    this.factura.tarjetasCreditos[this.indiceTarjetaCredito] = this.tarjetaCredito;
    this.llenarTarjetasCredito(this.factura.tarjetasCreditos);
    this.calcularRecaudacion();
    this.nuevoTarjetaCredito();
  }

  eliminarTarjetaCredito(i: number) {
    if (confirm(otras.pregunta_eliminar_tarjeta_credito)) {
      this.factura.tarjetasCreditos.splice(i, 1);
      this.llenarTarjetasCredito(this.factura.tarjetasCreditos);
      this.calcularRecaudacion();
      this.nuevoTarjetaCredito();
    }
  }

  calcularTotalTC() {
    return this.factura.tarjetasCreditos.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  cambiarTitularTarjetaCredito() {
    if (this.tarjetaCredito.titular == valores.si) {
      this.tarjetaCredito.identificacion = this.factura.cliente.identificacion;
      this.tarjetaCredito.nombre = this.factura.cliente.razonSocial;
      this.deshabilitarTitularTarjetaCredito = true;
      } else {
      this.tarjetaCredito.identificacion = valores.vacio;
      this.tarjetaCredito.nombre = valores.vacio;
      this.deshabilitarTitularTarjetaCredito = false;
    }
  }

  // TARJETAS DE DEBITO
  nuevoTarjetaDebito(){
    this.tarjetaDebito = new TarjetaDebito();
    this.controlBancoTarjetaDebito.patchValue(valores.vacio);
    this.clickedRowsTarjetasDebito.clear();
    this.tarjetaDebito.identificacion = this.factura.cliente.identificacion;
    this.tarjetaDebito.nombre = this.factura.cliente.razonSocial;
    this.indiceTarjetaDebito = valores.menosUno;
  }

  agregarTarjetaDebito() {
    if (!this.validarTarjetaDebito())
      return; 
    this.tarjetaDebito.banco = this.controlBancoTarjetaDebito.value;
    this.factura.tarjetasDebitos.push(this.tarjetaDebito);
    this.llenarTarjetasDebito(this.factura.tarjetasDebitos);
    this.calcularRecaudacion();
    this.nuevoTarjetaDebito();
  }

  llenarTarjetasDebito(tarjetasDebito: TarjetaDebito[]){
    this.dataSourceTarjetasDebito = new MatTableDataSource(tarjetasDebito);
    this.dataSourceTarjetasDebito.sort = this.sortTarjetasDebito;
    this.dataSourceTarjetasDebito.paginator = this.paginatorTarjetasDebito;
  }

  seleccionTarjetaDebito(tarjetaDebito: TarjetaDebito, i: number) {
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
    this.factura.tarjetasDebitos[this.indiceTarjetaDebito] = this.tarjetaDebito;
    this.llenarTarjetasDebito(this.factura.tarjetasDebitos);
    this.calcularRecaudacion();
    this.nuevoTarjetaDebito();
  }

  eliminarTarjetaDebito(i: number) {
    if (confirm(otras.pregunta_eliminar_tarjeta_debito)) {
      this.factura.tarjetasDebitos.splice(i, 1);
      this.llenarTarjetasDebito(this.factura.tarjetasDebitos);
      this.calcularRecaudacion();
      this.nuevoTarjetaDebito();
    }
  }

  calcularTotalTD() {
    return this.factura.tarjetasDebitos.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  cambiarTitularTarjetaDebito() {
    if (this.tarjetaDebito.titular == valores.si) {
      this.tarjetaDebito.identificacion = this.factura.cliente.identificacion;
      this.tarjetaDebito.nombre = this.factura.cliente.razonSocial;
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
    this.facturaConRecaudacion.emit(this.factura);
    stepper.previous();
  }
  
  stepperSiguiente(stepper: MatStepper){
      stepper.next();
  }

  //VALIDACIONES
  validarCheque(): boolean{
    /*if (this.factura.totalRecaudacion + Number(this.cheque.valor) > this.factura.totalConDescuento) {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
      return false;
    } */
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
    if (this.factura.totalRecaudacion + Number(this.tarjetaCredito.valor) > this.factura.totalConDescuento) {
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
    if (this.factura.totalRecaudacion + Number(this.tarjetaDebito.valor) > this.factura.totalConDescuento) {
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

  validarIdentificacion(identificacion: string) {
    this.clienteService.validarIdentificacion(identificacion).subscribe({
      next: res => {
        if (res.resultado != null) {
          //Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        } else {
          this.tarjetaCredito.identificacion = valores.vacio;
          Swal.fire({ icon: error_swal, title: exito, text: res.mensaje });
        }
      },
      error: err => Swal.fire(error, err.error.mensaje, error_swal)
    });
  }
}
