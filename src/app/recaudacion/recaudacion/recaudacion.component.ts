import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { valores, mensajes, otras, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import { DatePipe } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../modelos/format-date-picker';
import { Router } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
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

export class RecaudacionComponent implements OnInit {

  @Input('stepper') stepper: MatStepper;

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

  deshabilitarTitularTarjetaCredito: boolean = false;
  deshabilitarTitularTarjetaDebito: boolean = false;

  sesion: Sesion;
  factura: Factura = new Factura();
  cheque: Cheque = new Cheque();
  deposito: Deposito = new Deposito();
  transferencia: Transferencia = new Transferencia();
  tarjetaDebito: TarjetaDebito = new TarjetaDebito();
  tarjetaCredito: TarjetaCredito = new TarjetaCredito();

  periodicidades: Parametro[];
  tiposTransacciones: Parametro[];
  formasPagos: FormaPago[] = [];
  cuentasPropias: CuentaPropia[] = [];
  bancosPropios: String[] = [];
  franquiciasTarjetasCreditos: FranquiciaTarjeta[];
  franquiciasTarjetasDebitos: FranquiciaTarjeta[];
  operadoresTarjetasCreditos: OperadorTarjeta[] = [];
  operadoresTarjetasDebitos: OperadorTarjeta[] = [];

  bancos: Banco[] = [];
  controlBancoCheque = new UntypedFormControl();
  filtroBancos: Observable<Banco[]> = new Observable<Banco[]>();

  bancosDepositos: Banco[] = [];
  controlBancoDeposito = new UntypedFormControl();
  filtroBancosDepositos: Observable<Banco[]> = new Observable<Banco[]>();

  bancosTransferencias: Banco[] = [];
  controlBancoTransferencia = new UntypedFormControl();
  filtroBancosTransferencias: Observable<Banco[]> = new Observable<Banco[]>();

  bancosTarjetasCreditos: Banco[] = [];
  controlBancoTarjetaCredito = new UntypedFormControl();
  filtroBancosTarjetasCreditos: Observable<Banco[]> = new Observable<Banco[]>();

  bancosTarjetasDebitos: Banco[] = [];
  controlBancoTarjetaDebito = new UntypedFormControl();
  filtroBancosTarjetasDebitos: Observable<Banco[]> = new Observable<Banco[]>();

  // Variables para Tablas de formas de pago
  columnasCheques: any[] = [
    { nombreColumna: 'fecha', cabecera: 'Fecha', pie: 'Total' ,celda: (row: Cheque) => `${row.fecha } `  }, //.toLocaleDateString()
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
    { nombreColumna: 'fecha', cabecera: 'Fecha', pie: 'Total' ,celda: (row: Deposito) => `${row.fecha } `  }, //.toLocaleDateString()
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


  habilitarTransferencias: boolean = false;
  columnasTransferencias: string[] = ['id', 'fecha', 'tipoTransaccion', 'numeroTransaccion', 'banco', 'valor', 'acciones'];;
  dataSourceTransferencias = new MatTableDataSource<Transferencia>(this.factura.transferencias);

  habilitarTarjetasCreditos: boolean = false;
  columnasTarjetasCredito: string[] = ['id', 'franquicia', 'banco', 'identificacion', 'nombre', 'titular', 'diferido', 'operador', 'lote', 'valor', 'acciones'];
  dataSourceTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.factura.tarjetasCreditos);

  habilitarTarjetasDebitos: boolean = false;
  columnasTarjetasDebito: string[] = ['id', 'franquicia', 'banco', 'identificacion', 'nombre', 'titular', 'operador', 'lote', 'valor', 'acciones'];
  dataSourceTarjetasDebitos = new MatTableDataSource<TarjetaDebito>(this.factura.tarjetasDebitos);

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
    private parametroService: ParametroService, private router: Router) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    //this.consultarCuentasPropias();
    this.consultarBancos();
    this.consultarBancosPropios();
    this.consultarFranquiciasTarjetas();
    this.consultarOperadoresTarjetasCreditos();
    this.consultarOperadoresTarjetasDebitos();
    this.consultarPeriodicidades();
    this.consultarTiposTransacciones();
    this.consultarBancosDepositos();
    this.consultarBancosTransferencias();
    this.consultarBancosTarjetasCreditos();
    this.consultarBancosTarjetasDebitos();
    this.defectoTarjetaCredito();
    this.defectoTarjetaDebito();
    this.inicializarFiltros();

    this.facturaService.eventoRecaudacion.subscribe((data: Factura) => {
      this.factura = data;
      this.calcularRecaudacion();
      this.recargar();
      this.defectoTarjetaCredito();
      this.defectoTarjetaDebito();
    });

  }

  consultarCuentasPropias() {
    this.cuentaPropiaService.consultar().subscribe({
      next: res => {
        this.cuentasPropias = res.resultado as CuentaPropia[]
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
  consultarPorBanco(banco: String) {
    this.cuentaPropiaService.consultarPorBanco(banco).subscribe({
      next: res => {
        this.cuentasPropias = res.resultado as CuentaPropia[]
        console.log(this.cuentasPropias);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  consultarBancos() { // Solo se requiere Bancos y Bancos Propios
    this.bancoService.consultar().subscribe({
      next: res => {
        this.bancos = res.resultado as Banco[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  consultarFranquiciasTarjetas() {
    this.franquiciaTarjetaService.consultar().subscribe(
      res => {
        this.franquiciasTarjetasCreditos = res.resultado as FranquiciaTarjeta[]
        this.franquiciasTarjetasDebitos = res.resultado as FranquiciaTarjeta[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  consultarOperadoresTarjetasCreditos() {
    let tipo = otras.credito;
    this.operadorTarjetaService.consultarPorTipo(tipo).subscribe(
      res => {
        this.operadoresTarjetasCreditos = res.resultado as OperadorTarjeta[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  consultarOperadoresTarjetasDebitos() {
    let tipo = otras.debito;
    this.operadorTarjetaService.consultarPorTipo(tipo).subscribe(
      res => {
        this.operadoresTarjetasDebitos = res.resultado as OperadorTarjeta[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  consultarPeriodicidades() {
    let tipo = otras.periodicidad;
    this.parametroService.consultarPorTipo(tipo).subscribe(
      res => {
        this.periodicidades = res.resultado as Parametro[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  consultarTiposTransacciones() {
    let tipo = otras.tipo_transaccion;
    this.parametroService.consultarPorTipo(tipo).subscribe(
      res => {
        this.tiposTransacciones = res.resultado as Parametro[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarBancosDepositos() {
    this.bancoService.consultar().subscribe(
      res => {
        this.bancosDepositos = res.resultado as Banco[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  consultarBancosTransferencias() {
    this.bancoService.consultar().subscribe(
      res => {
        this.bancosTransferencias = res.resultado as Banco[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  consultarBancosTarjetasCreditos() {
    this.bancoService.consultar().subscribe(
      res => {
        this.bancosTarjetasCreditos = res.resultado as Banco[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  consultarBancosTarjetasDebitos() {
    this.bancoService.consultar().subscribe(
      res => {
        this.bancosTarjetasDebitos = res.resultado as Banco[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  recaudar(event) {
    if (event != null)
      event.preventDefault();
    console.log(this.factura);
    this.facturaService.actualizar(this.factura).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.factura = res.resultado as Factura;
        this.stepperPrevio(this.stepper);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  crearFacturaElectronica(event) {
    if (event != null)
      event.preventDefault();
    this.cargar = true;
    this.facturaElectronicaService.enviar(this.factura.id).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.factura = res.resultado as Factura;
        this.cargar = false;
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.cargar = false;
      }
    });
  }

  calcularRecaudacion() {
    this.facturaService.calcularRecaudacion(this.factura).subscribe({
      next: res => {
        this.factura = res.resultado as Factura;
        this.cheque.valor = this.factura.porPagar;
        this.deposito.valor = this.factura.porPagar;
        this.transferencia.valor = this.factura.porPagar;
        this.tarjetaCredito.valor = this.factura.porPagar;
        this.tarjetaDebito.valor = this.factura.porPagar;
      }, 
      error: err => Swal.fire(error, err.error.mensaje, error_swal)
    });
  }
  
  recargar() {
    this.verPanelCheques = false;
    this.verPanelDepositos = false;
    this.verPanelTransferencias = false;
    this.verPanelTarjetasCredito = false;
    this.verPanelTarjetasDebito = false;
    if(this.factura.cheques.length > valores.cero){
      this.verPanelCheques = true;
    }
    if(this.factura.depositos.length > valores.cero){
      this.verPanelDepositos = true;
    }
    if(this.factura.transferencias.length > valores.cero){
      this.verPanelTransferencias = true;
    }
    if(this.factura.tarjetasCreditos.length > valores.cero){
      this.verPanelTarjetasCredito = true;
    }
    if(this.factura.tarjetasDebitos.length > valores.cero){
      this.verPanelTarjetasDebito = true;
    }
    this.dataSourceCheques = new MatTableDataSource<Cheque>(this.factura.cheques);
    this.dataSourceDepositos = new MatTableDataSource<Deposito>(this.factura.depositos);
    this.dataSourceTransferencias = new MatTableDataSource<Transferencia>(this.factura.transferencias);
    this.dataSourceTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.factura.tarjetasCreditos);
    this.dataSourceTarjetasDebitos = new MatTableDataSource<TarjetaDebito>(this.factura.tarjetasDebitos);
    this.calcularRecaudacion();
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
    this.cheque.banco = this.controlBancoCheque.value;
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
    }
  }

  totalCheques() {
    return this.factura.cheques.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  rellenarNumeroCheque() {
    this.cheque.numero = this.pad(this.cheque.numero, 13);
  }

  // DEPOSITOS
  nuevoDeposito(){
    this.cheque = new Cheque();
    this.controlBancoCheque.patchValue(valores.vacio);
    this.clickedRowsCheques.clear();
    this.indiceCheque = valores.menosUno;
  }

  agregarDeposito() {
    if (!this.validarCheque())
      return;  
      //this.deposito.banco = this.controlBancoDeposito.value;
    this.factura.depositos.push(this.deposito);
    this.llenarDepositos(this.factura.depositos);
    this.calcularRecaudacion();
    this.nuevoCheque();

    this.deposito = new Deposito();
    this.controlBancoDeposito.patchValue(valores.vacio);

    this.calcularRecaudacion();
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
      this.controlBancoDeposito.setValue(this.deposito.cuentaPropia.banco);
      this.indiceDeposito = i;
    } else {
      this.nuevoDeposito();
    }
  }

  editarDeposito(i: number) {
    this.indiceDeposito = i;
    this.deposito = { ... this.factura.depositos[this.indiceDeposito] };
    //this.controlBancoDeposito.setValue(this.deposito.banco);
  }
  confirmarEditarDeposito() {
    this.factura.depositos[this.indiceDeposito] = this.deposito;
    this.deposito = new Deposito();
    this.controlBancoDeposito.setValue(valores.vacio);
    this.dataSourceDepositos = new MatTableDataSource<Deposito>(this.factura.depositos);
    this.dataSourceDepositos.sort = this.sortDepositos;
    this.dataSourceDepositos.paginator = this.paginatorDepositos;
    this.calcularRecaudacion();
  }

  eliminarDeposito(i: number) {
    if (confirm(otras.pregunta_eliminar_deposito)) {
      this.factura.depositos.splice(i, 1);
      this.dataSourceDepositos = new MatTableDataSource<Deposito>(this.factura.depositos);
      this.dataSourceDepositos.sort = this.sortDepositos;
      this.dataSourceDepositos.paginator = this.paginatorDepositos;
      this.calcularRecaudacion();
    }
  }

  totalDepositos() {
    return this.factura.depositos.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  rellenarNumeroDeposito() {
    this.deposito.comprobante = this.pad(this.deposito.comprobante, 13);
  }

  // TRANSFERENCIAS
  agregarTransferencia() {
    if (this.factura.totalRecaudacion + Number(this.transferencia.valor) <= this.factura.totalConDescuento) {
      this.transferencia.banco = this.controlBancoTransferencia.value;
      this.factura.transferencias.push(this.transferencia);
      this.transferencia = new Transferencia();
      this.controlBancoTransferencia.patchValue(valores.vacio);
      this.dataSourceTransferencias = new MatTableDataSource<Transferencia>(this.factura.transferencias);
      this.dataSourceTransferencias.sort = this.sortTransferencias;
      this.dataSourceTransferencias.paginator = this.paginatorTransferencias;
    } else {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
    }
    this.defectoTransferencia();
    this.calcularRecaudacion();
  }

  editarTransferencia(i: number) {
    this.indiceTransferencia = i;
    this.transferencia = { ... this.factura.transferencias[this.indiceTransferencia] };
    this.controlBancoTransferencia.setValue(this.transferencia.banco);
  }
  confirmarEditarTransferencia() {
    this.factura.transferencias[this.indiceTransferencia] = this.transferencia;
    this.transferencia = new Transferencia();
    this.controlBancoTransferencia.setValue(valores.vacio);
    this.dataSourceTransferencias = new MatTableDataSource<Transferencia>(this.factura.transferencias);
    this.dataSourceTransferencias.sort = this.sortTransferencias;
    this.dataSourceTransferencias.paginator = this.paginatorTransferencias;
    this.calcularRecaudacion();
  }

  eliminarTransferencia(i: number) {
    if (confirm(otras.pregunta_eliminar_transferencia)) {
      this.factura.transferencias.splice(i, 1);
      this.dataSourceTransferencias = new MatTableDataSource<Transferencia>(this.factura.transferencias);
      this.dataSourceTransferencias.sort = this.sortTransferencias;
      this.dataSourceTransferencias.paginator = this.paginatorTransferencias;
      this.calcularRecaudacion();
    }
  }

  totalTransferencias() {
    return this.factura.transferencias.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  rellenarNumeroTransferencia() {
    this.transferencia.numeroTransaccion = this.pad(this.transferencia.numeroTransaccion, 13);
  }

  defectoTransferencia() {
  }

  // TARJETAS DE CREDITO
  agregarTarjetaCredito() {
    if (this.factura.totalRecaudacion + Number(this.tarjetaCredito.valor) <= this.factura.totalConDescuento) {
      this.tarjetaCredito.banco = this.controlBancoTarjetaCredito.value;
      this.factura.tarjetasCreditos.push(this.tarjetaCredito);
      this.tarjetaCredito = new TarjetaCredito();
      this.controlBancoTarjetaCredito.patchValue(valores.vacio);
      this.dataSourceTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.factura.tarjetasCreditos);
      this.dataSourceTarjetasCreditos.sort = this.sortTarjetasCredito;
      this.dataSourceTarjetasCreditos.paginator = this.paginatorTarjetasCredito;
    } else {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
    }
    this.defectoTarjetaCredito();
    this.calcularRecaudacion();
  }
  editarTarjetaCredito(i: number) {
    this.indiceTarjetaCredito = i;
    this.tarjetaCredito = { ... this.factura.tarjetasCreditos[this.indiceTarjetaCredito] };
    this.controlBancoTarjetaCredito.setValue(this.tarjetaCredito.banco);
  }

  confirmarEditarTarjetaCredito() {
    this.factura.tarjetasCreditos[this.indiceTarjetaCredito] = this.tarjetaCredito;
    this.tarjetaCredito = new TarjetaCredito();
    this.controlBancoTarjetaCredito.setValue(valores.vacio);
    this.dataSourceTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.factura.tarjetasCreditos);
    this.dataSourceTarjetasCreditos.sort = this.sortTarjetasCredito;
    this.dataSourceTarjetasCreditos.paginator = this.paginatorTarjetasCredito;
    this.calcularRecaudacion();
  }

  eliminarTarjetaCredito(i: number) {
    if (confirm(otras.pregunta_eliminar_tarjeta_credito)) {
      this.factura.tarjetasCreditos.splice(i, 1);
      this.dataSourceTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.factura.tarjetasCreditos);
      this.dataSourceTarjetasCreditos.sort = this.sortTarjetasCredito;
      this.dataSourceTarjetasCreditos.paginator = this.paginatorTarjetasCredito;
      this.calcularRecaudacion();
    }
  }

  totalTarjetasCreditos() {
    return this.factura.tarjetasCreditos.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  validarIdentificacionTarjetaCredito() {
    this.clienteService.validarIdentificacion(this.tarjetaCredito.identificacion).subscribe(
      res => {
        if (res.resultado != null) {
          Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        } else {
          this.tarjetaCredito.identificacion = valores.vacio;
          Swal.fire({ icon: error_swal, title: exito, text: res.mensaje });
        }
      },
      err => Swal.fire(error, err.error.mensaje, error_swal)
    );
  }

  asignarTitularTarjetaCredito() {
    if (this.tarjetaCredito.titular == valores.si) {
      this.tarjetaCredito.identificacion = this.factura.cliente.identificacion;
      this.tarjetaCredito.nombre = this.factura.cliente.razonSocial;
    }
    if (this.tarjetaCredito.titular == valores.no) {
      this.tarjetaCredito.identificacion = valores.vacio;
      this.tarjetaCredito.nombre = valores.vacio;
    }
  }

  defectoTarjetaCredito() {
    this.tarjetaCredito = new TarjetaCredito();
    this.tarjetaCredito.identificacion = this.factura.cliente.identificacion;
    this.tarjetaCredito.nombre = this.factura.cliente.razonSocial;
  }

  // TARJETAS DE DEBITO
  agregarTarjetaDebito() {
    if (this.factura.totalRecaudacion + Number(this.tarjetaDebito.valor) <= this.factura.totalConDescuento) {
      this.tarjetaDebito.banco = this.controlBancoTarjetaDebito.value;
      this.factura.tarjetasDebitos.push(this.tarjetaDebito);
      this.tarjetaDebito = new TarjetaDebito();
      this.controlBancoTarjetaDebito.setValue(valores.vacio);
      this.dataSourceTarjetasDebitos = new MatTableDataSource<TarjetaDebito>(this.factura.tarjetasDebitos);
      this.dataSourceTarjetasDebitos.sort = this.sortTarjetasDebito;
      this.dataSourceTarjetasDebitos.paginator = this.paginatorTarjetasDebito;
    } else {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
    }
    this.defectoTarjetaDebito();
    this.calcularRecaudacion();
  }

  editarTarjetaDebito(i: number) {
    this.indiceTarjetaDebito = i;
    this.tarjetaDebito = { ... this.factura.tarjetasDebitos[this.indiceTarjetaDebito] };
  }

  confirmarEditarTarjetaDebito() {
    this.factura.tarjetasDebitos[this.indiceTarjetaDebito] = this.tarjetaDebito;
    this.tarjetaDebito = new TarjetaDebito();
    this.controlBancoTarjetaDebito.setValue(valores.vacio);
    this.dataSourceTarjetasDebitos = new MatTableDataSource<TarjetaDebito>(this.factura.tarjetasDebitos);
    this.dataSourceTarjetasDebitos.sort = this.sortTarjetasDebito;
    this.dataSourceTarjetasDebitos.paginator = this.paginatorTarjetasDebito;
    this.calcularRecaudacion();
  }

  eliminarTarjetaDebito(i: number) {
    if (confirm(otras.pregunta_eliminar_tarjeta_debito)) {
      this.factura.tarjetasDebitos.splice(i, 1);
      this.dataSourceTarjetasDebitos = new MatTableDataSource<TarjetaDebito>(this.factura.tarjetasDebitos);
      this.dataSourceTarjetasDebitos.sort = this.sortTarjetasDebito;
      this.dataSourceTarjetasDebitos.paginator = this.paginatorTarjetasDebito;
      this.calcularRecaudacion();
    }
  }

  totalTarjetasDebitos() {
    return this.factura.tarjetasDebitos.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  validarIdentificacionTarjetaDebito() {
    this.clienteService.validarIdentificacion(this.tarjetaDebito.identificacion).subscribe(
      res => {
        if (res.resultado != null) {
          Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        } else {
          this.tarjetaDebito.identificacion = '';
          Swal.fire({ icon: error_swal, title: error, text: res.mensaje });
        }
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  asignarTitularTarjetaDebito() {
    if (this.tarjetaDebito.titular == valores.si) {
      this.tarjetaDebito.identificacion = this.factura.cliente.identificacion;
      this.tarjetaDebito.nombre = this.factura.cliente.razonSocial;
    }
    if (this.tarjetaCredito.titular == valores.no) {
      this.tarjetaDebito.identificacion = valores.vacio;
      this.tarjetaDebito.nombre = valores.vacio;
    }
  }

  defectoTarjetaDebito() {
    this.tarjetaDebito = new TarjetaDebito();
    this.tarjetaDebito.identificacion = this.factura.cliente.identificacion;
    this.tarjetaDebito.nombre = this.factura.cliente.razonSocial;
  }

  pad(numero: string, size: number): string {
    while (numero.length < size) numero = "0" + numero;
    return numero;
  }

  //STEEPER
  stepperPrevio(stepper: MatStepper){
    stepper.previous();
  }

  stepperSiguiente(stepper: MatStepper){
      stepper.next();
  }

  //FILTROS AUTOCOMPLETE
  inicializarFiltros() {
    this.filtroBancos = this.controlBancoCheque.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(banco => typeof banco === 'string' ? this.filtroBanco(banco) : this.bancos.slice())
      );
    this.filtroBancosDepositos = this.controlBancoDeposito.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(bancoDeposito => typeof bancoDeposito === 'string' ? this.filtroBancoDeposito(bancoDeposito) : this.bancosDepositos.slice())
      );
    this.filtroBancosTransferencias = this.controlBancoTransferencia.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(bancoTransferencia => typeof bancoTransferencia === 'string' ? this.filtroBancoTransferencia(bancoTransferencia) : this.bancosTransferencias.slice())
      );
    this.filtroBancosTarjetasCreditos = this.controlBancoTarjetaCredito.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(bancoTarjetaCredito => typeof bancoTarjetaCredito === 'string' ? this.filtroBancoTarjetaCredito(bancoTarjetaCredito) : this.bancosTarjetasCreditos.slice())
      );
    this.filtroBancosTarjetasDebitos = this.controlBancoTarjetaDebito.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(bancoTarjetaDebito => typeof bancoTarjetaDebito === 'string' ? this.filtroBancoTarjetaDebito(bancoTarjetaDebito) : this.bancosTarjetasDebitos.slice())
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

  private filtroBancoDeposito(value: string): Banco[] {
    if (this.bancosDepositos.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.bancosDepositos.filter(bancoDeposito => bancoDeposito.abreviatura.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verBancoDeposito(bancoDeposito: Banco): string {
    return bancoDeposito && bancoDeposito.abreviatura ? bancoDeposito.abreviatura : valores.vacio;
  }
  private filtroBancoTransferencia(value: string): Banco[] {
    if (this.bancosTransferencias.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.bancosTransferencias.filter(bancoTransferencia => bancoTransferencia.abreviatura.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verBancoTransferencia(bancoTransferencia: Banco): string {
    return bancoTransferencia && bancoTransferencia.abreviatura ? bancoTransferencia.abreviatura : valores.vacio;
  }

  private filtroBancoTarjetaCredito(value: string): Banco[] {
    if (this.bancosTarjetasCreditos.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.bancosTarjetasCreditos.filter(bancoTarjetaCredito => bancoTarjetaCredito.abreviatura.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verBancoTarjetaCredito(bancoTarjetaCredito: Banco): string {
    return bancoTarjetaCredito && bancoTarjetaCredito.abreviatura ? bancoTarjetaCredito.abreviatura : valores.vacio;
  }

  private filtroBancoTarjetaDebito(value: string): Banco[] {
    if (this.bancosTarjetasDebitos.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.bancosTarjetasDebitos.filter(banco_tarjeta_debito => banco_tarjeta_debito.abreviatura.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verBancoTarjetaDebito(banco_tarjeta_debito: Banco): string {
    return banco_tarjeta_debito && banco_tarjeta_debito.abreviatura ? banco_tarjeta_debito.abreviatura : valores.vacio;
  }

  //VALIDACIONES
  validarCheque(): boolean{
    if (this.factura.totalRecaudacion + Number(this.cheque.valor) > this.factura.totalConDescuento) {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
      return false;
    } 
    if (this.controlBancoCheque.value == null || this.controlBancoCheque.value == valores.vacio) {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
      return false;
    }
    if (this.cheque.fecha == null || this.cheque.tipo == null || this.cheque.valor == valores.cero) {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
      return false;
    }
    return true;
  }
  validarDeposito(): boolean{
    if (this.factura.totalRecaudacion + Number(this.deposito.valor) > this.factura.totalConDescuento) {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
      return false;
    } 
    if (this.controlBancoDeposito.value == null || this.controlBancoDeposito.value == valores.vacio) {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
      return false;
    }
    if (this.deposito.fecha == null || this.deposito.comprobante == null || this.deposito.valor == valores.cero) {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
      return false;
    }
    return true;
  }

  validarTransferencia(): boolean{
    if (this.factura.totalRecaudacion + Number(this.cheque.valor) > this.factura.totalConDescuento) {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
      return false;
    } 
    if (this.controlBancoCheque.value == null || this.controlBancoCheque.value == valores.vacio) {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
      return false;
    }
    if (this.cheque.fecha == null || this.cheque.tipo == null || this.cheque.valor == valores.cero) {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
      return false;
    }
    return true;
  }
}
