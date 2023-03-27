import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { DatePipe } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Cheque } from '../../modelos/recaudacion/cheque';
import { Deposito } from '../../modelos/recaudacion/deposito';
import { TarjetaCredito } from '../../modelos/recaudacion/tarjeta-credito';
import { TarjetaDebito } from '../../modelos/recaudacion/tarjeta-debito';
import { FacturaService } from '../../servicios/comprobante/factura.service';
import { Banco } from '../../modelos/recaudacion/banco';
import { startWith, map } from 'rxjs/operators';
import { ClienteService } from '../../servicios/cliente/cliente.service';
import { BancoService } from '../../servicios/recaudacion/banco.service';
import { FormaPagoService } from '../../servicios/cliente/forma-pago.service';
import { FormaPago } from '../../modelos/cliente/forma-pago';
import { CuentaPropia } from '../../modelos/recaudacion/cuenta-propia';
import { CuentaPropiaService } from '../../servicios/contabilidad/cuenta-propia.service';
import { Transferencia } from '../../modelos/recaudacion/transferencia';
import { FranquiciaTarjeta } from '../../modelos/recaudacion/franquicia-tarjeta';
import { FranquiciaTarjetaService } from '../../servicios/recaudacion/franquicia-tarjeta.service';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../modelos/format-date-picker';
import { OperadorTarjeta } from '../../modelos/recaudacion/operador-tarjeta';
import { OperadorTarjetaService } from '../../servicios/recaudacion/operador-tarjeta.service';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Sesion } from '../../modelos/usuario/sesion';
import { Parametro } from '../../modelos/configuracion/parametro';
import { ParametroService } from '../../servicios/configuracion/parametro.service';
import { valores, mensajes, otras, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import { MatStepper } from '@angular/material/stepper';
import { FacturaElectronicaService } from 'src/app/servicios/comprobante/factura-eletronica.service';
import { Factura } from 'src/app/modelos/comprobante/factura';

@Component({
  selector: 'app-recaudacion',
  templateUrl: './recaudacion.component.html',
  styleUrls: ['./recaudacion.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})

export class RecaudacionComponent implements OnInit {

  @Input('stepper') stepper: MatStepper;

  panelRecaudacion = false;
  panelCheques = false;
  panelDepositos = false;
  panelTransferencias = false;
  panelTarjetasCredito = false;
  panelTarjetasDebito = false;

  si = valores.si;
  no = valores.no;
  emitida = valores.emitida;
  anulada = valores.anulada;
  noFacturada = valores.noFacturada;
  facturada = valores.facturada;
  noRecaudada = valores.noRecaudada;
  recaudada = valores.recaudada;

  constructor(private facturaService: FacturaService, private facturaElectronicaService: FacturaElectronicaService, 
    private clienteService: ClienteService, private bancoService: BancoService, private sesionService: SesionService,
    private cuentaPropiaService: CuentaPropiaService, private operadorTarjetaService: OperadorTarjetaService, private datePipe: DatePipe,
    private franquiciaTarjetaService: FranquiciaTarjetaService, private formaPagoService: FormaPagoService,
    private parametroService: ParametroService, private router: Router) { }

  factura: Factura = new Factura();
  cheque: Cheque = new Cheque();
  deposito: Deposito = new Deposito();
  transferencia: Transferencia = new Transferencia();
  tarjetaDebito: TarjetaDebito = new TarjetaDebito();
  tarjetaCredito: TarjetaCredito = new TarjetaCredito();
  periodicidades: Parametro[];
  tiposTransacciones: Parametro[];
  formasPagos: FormaPago[]=[];
  cuentasPropias: CuentaPropia[]=[];
  franquiciasTarjetasCreditos: FranquiciaTarjeta[];
  franquiciasTarjetasDebitos: FranquiciaTarjeta[];
  operadoresTarjetasCreditos: OperadorTarjeta[]=[];
  operadoresTarjetasDebitos: OperadorTarjeta[]=[];
  bancosCheques: Banco[]=[];
  seleccionBancoCheque = new UntypedFormControl();
  filtroBancosCheques: Observable<Banco[]> = new Observable<Banco[]>();
  bancosDepositos: Banco[]=[];
  seleccionBancoDeposito = new UntypedFormControl();
  filtroBancosDepositos: Observable<Banco[]> = new Observable<Banco[]>();
  bancosTransferencias: Banco[]=[];
  seleccionBancoTransferencia = new UntypedFormControl();
  filtroBancosTransferencias: Observable<Banco[]> = new Observable<Banco[]>();
  bancosTarjetasCreditos: Banco[]=[];
  seleccionBancoTarjetaCredito = new UntypedFormControl();
  filtroBancosTarjetasCreditos: Observable<Banco[]> = new Observable<Banco[]>();
  bancosTarjetasDebitos: Banco[]=[];
  seleccionBancoTarjetaDebito = new UntypedFormControl();
  filtroBancosTarjetasDebitos: Observable<Banco[]> = new Observable<Banco[]>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  habilitarCheques: boolean = false;
  columnasCheques: string[] = ['id', 'fecha', 'tipo', 'numero', 'banco', 'valor', 'acciones'];
  dataCheques = new MatTableDataSource<Cheque>(this.factura.cheques);

  habilitarDepositos: boolean = false;
  columnasDepositos: string[] = ['id', 'fecha', 'cuenta', 'banco', 'comprobante', 'valor', 'acciones'];
  dataDepositos = new MatTableDataSource<Deposito>(this.factura.depositos);

  // Variables para transferencias
  habilitarTransferencias: boolean = false;
  columnasTransferencias: string[] = ['id', 'fecha', 'tipoTransaccion', 'numeroTransaccion', 'banco', 'valor', 'acciones'];;
  dataTransferencias = new MatTableDataSource<Transferencia>(this.factura.transferencias);

  // Variables para Tarjetas de crédito
  habilitarTarjetasCreditos: boolean = false;
  columnasTarjetasCredito: string[] = ['id', 'franquicia', 'banco', 'identificacion', 'nombre', 'titular', 'diferido', 'operador', 'lote', 'valor', 'acciones'];
  dataTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.factura.tarjetasCreditos);

  // Variables para Tarjetas de débito
  habilitarTarjetasDebitos: boolean = false;
  columnasTarjetasDebito: string[] = ['id', 'franquicia', 'banco', 'identificacion', 'nombre', 'titular', 'operador', 'lote', 'valor', 'acciones'];
  dataTarjetasDebitos= new MatTableDataSource<TarjetaDebito>(this.factura.tarjetasDebitos);

  sesion: Sesion;

  indiceEditar: number =-1;
  habilitarEditarCheque: boolean = false;
  habilitarEditarDeposito: boolean = false;
  habilitarEditarTransferencia: boolean = false;
  habilitarEditarTarjetaCredito: boolean = false;
  habilitarEditarTarjetaDebito: boolean = false;
  habilitarTitularTarjetaDebito: boolean = true;
  habilitarTitularTarjetaCredito: boolean = true;
  

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarCuentasPropias();
    this.consultarFranquiciasTarjetas();
    this.consultarOperadoresTarjetasCreditos();
    this.consultarOperadoresTarjetasDebitos();
    this.consultarPeriodicidades();
    this.consultarTiposTransacciones();
    this.consultarBancosCheques();
    this.consultarBancosDepositos();
    this.consultarBancosTransferencias();
    this.consultarBancosTarjetasCreditos();
    this.consultarBancosTarjetasDebitos();
    this.defectoTarjetaCredito();
    this.defectoTarjetaDebito();

    this.facturaService.eventoRecaudacion.subscribe((data: Factura) => {
        this.factura = data;
        this.calcular();
        this.defectoTarjetaCredito();
        this.defectoTarjetaDebito();
    });
    
    this.filtroBancosCheques = this.seleccionBancoCheque.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(banco => typeof banco === 'string' ? this.filtroBancoCheque(banco) : this.bancosCheques.slice())
      );
    this.filtroBancosDepositos = this.seleccionBancoDeposito.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(bancoDeposito => typeof bancoDeposito === 'string' ? this.filtroBancoDeposito(bancoDeposito) : this.bancosDepositos.slice())
      );
    this.filtroBancosTransferencias = this.seleccionBancoTransferencia.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(bancoTransferencia => typeof bancoTransferencia === 'string' ? this.filtroBancoTransferencia(bancoTransferencia) : this.bancosTransferencias.slice())
      );
    this.filtroBancosTarjetasCreditos = this.seleccionBancoTarjetaCredito.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(bancoTarjetaCredito => typeof bancoTarjetaCredito === 'string' ? this.filtroBancoTarjetaCredito(bancoTarjetaCredito) : this.bancosTarjetasCreditos.slice())
      );
    this.filtroBancosTarjetasDebitos = this.seleccionBancoTarjetaDebito.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(bancoTarjetaDebito => typeof bancoTarjetaDebito === 'string' ? this.filtroBancoTarjetaDebito(bancoTarjetaDebito) : this.bancosTarjetasDebitos.slice())
      );
  }

  cargar(){
    if(this.factura.cheques.length > valores.cero){
      this.habilitarSeccionPago(otras.formasPagos[0]);
      this.dataCheques = new MatTableDataSource<Cheque>(this.factura.cheques);
    }
    if(this.factura.depositos.length > valores.cero){
      this.habilitarSeccionPago(otras.formasPagos[1]);
      this.dataDepositos = new MatTableDataSource<Deposito>(this.factura.depositos);
    }
    if(this.factura.transferencias.length > valores.cero){
      this.habilitarSeccionPago(otras.formasPagos[2]);
      this.dataTransferencias = new MatTableDataSource<Transferencia>(this.factura.transferencias);
    }
    if(this.factura.tarjetasCreditos.length > valores.cero){
      this.habilitarSeccionPago(otras.formasPagos[3]);
      this.dataTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.factura.tarjetasCreditos);
    }
    if(this.factura.tarjetasDebitos.length > valores.cero){
      this.habilitarSeccionPago(otras.formasPagos[4]);
      this.dataTarjetasDebitos = new MatTableDataSource<TarjetaDebito>(this.factura.tarjetasDebitos);
    }
    this.calcular();
  }

  consultarCuentasPropias(){
    this.cuentaPropiaService.consultar().subscribe(
      res => {
        this.cuentasPropias = res.resultado as CuentaPropia[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  consultarFranquiciasTarjetas(){
    this.franquiciaTarjetaService.consultar().subscribe(
      res => {
        this.franquiciasTarjetasCreditos = res.resultado as FranquiciaTarjeta[]
        this.franquiciasTarjetasDebitos = res.resultado as FranquiciaTarjeta[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  consultarOperadoresTarjetasCreditos(){
    let tipo= otras.credito;
    this.operadorTarjetaService.consultarPorTipo(tipo).subscribe(
      res => {
        this.operadoresTarjetasCreditos = res.resultado as OperadorTarjeta[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  consultarOperadoresTarjetasDebitos(){
    let tipo= otras.debito;
    this.operadorTarjetaService.consultarPorTipo(tipo).subscribe(
      res => {
        this.operadoresTarjetasDebitos = res.resultado as OperadorTarjeta[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarPeriodicidades(){
    let tipo = otras.periodicidad;
    this.parametroService.consultarPorTipo(tipo).subscribe(
      res => {
        this.periodicidades = res.resultado as Parametro[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  consultarTiposTransacciones(){
    let tipo = otras.tipo_transaccion;
    this.parametroService.consultarPorTipo(tipo).subscribe(
      res => {
        this.tiposTransacciones = res.resultado as Parametro[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  consultarBancosCheques() {
    this.bancoService.consultar().subscribe(
    res => {
      this.bancosCheques = res.resultado as Banco[]
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
  consultarFormasPagos() {
    this.formaPagoService.consultar().subscribe(
    res => {
      this.formasPagos = res.resultado as FormaPago[]
    },
    err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  private filtroBancoCheque(value: string): Banco[] {
    if(this.bancosCheques.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.bancosCheques.filter(banco => banco.abreviatura.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verBancoCheque(banco: Banco): string {
    return banco && banco.nombre ? banco.nombre : valores.vacio;
  }

  private filtroBancoDeposito(value: string): Banco[] {
    if(this.bancosDepositos.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.bancosDepositos.filter(bancoDeposito => bancoDeposito.abreviatura.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verBancoDeposito(bancoDeposito: Banco): string {
    return bancoDeposito && bancoDeposito.nombre ? bancoDeposito.nombre : valores.vacio;
  }
  private filtroBancoTransferencia(value: string): Banco[] {
    if(this.bancosTransferencias.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.bancosTransferencias.filter(bancoTransferencia => bancoTransferencia.abreviatura.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verBancoTransferencia(bancoTransferencia: Banco): string {
    return bancoTransferencia && bancoTransferencia.nombre ? bancoTransferencia.nombre : valores.vacio;
  }

  private filtroBancoTarjetaCredito(value: string): Banco[] {
    if(this.bancosTarjetasCreditos.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.bancosTarjetasCreditos.filter(bancoTarjetaCredito => bancoTarjetaCredito.abreviatura.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verBancoTarjetaCredito(bancoTarjetaCredito: Banco): string {
    return bancoTarjetaCredito && bancoTarjetaCredito.nombre ? bancoTarjetaCredito.nombre : valores.vacio;
  }

  private filtroBancoTarjetaDebito(value: string): Banco[] {
    if(this.bancosTarjetasDebitos.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.bancosTarjetasDebitos.filter(banco_tarjeta_debito => banco_tarjeta_debito.abreviatura.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verBancoTarjetaDebito(banco_tarjeta_debito: Banco): string {
    return banco_tarjeta_debito && banco_tarjeta_debito.nombre ? banco_tarjeta_debito.nombre : valores.vacio;
  }

  habilitarSeccionPago(formaPago: string){
    if (formaPago == otras.formasPagos[0]){
      this.habilitarCheques = !this.habilitarCheques;
    }
    if (formaPago == otras.formasPagos[1]){
      this.habilitarDepositos = !this.habilitarDepositos;
    }
    if (formaPago == otras.formasPagos[2]){
      this.habilitarTransferencias = !this.habilitarTransferencias;
    }
    if (formaPago == otras.formasPagos[3]){
      this.habilitarTarjetasCreditos = !this.habilitarTarjetasCreditos;
      this.defectoTarjetaCredito();
    }
    if (formaPago == otras.formasPagos[4]){
      this.habilitarTarjetasDebitos = !this.habilitarTarjetasDebitos;
      this.defectoTarjetaDebito();
    }
    this.calcular();
  }

  agregarCheque() {
    if (this.factura.totalRecaudacion + Number(this.cheque.valor) <= this.factura.totalConDescuento && this.seleccionBancoCheque.value != null && this.cheque.tipo != null) {
      this.cheque.banco=this.seleccionBancoCheque.value;
      this.factura.cheques.push(this.cheque);
      this.factura.totalCheques;
      this.cheque=new Cheque();
      this.seleccionBancoCheque.patchValue(valores.vacio);
      this.dataCheques = new MatTableDataSource<Cheque>(this.factura.cheques);
      this.dataCheques.sort = this.sort;
      this.dataCheques.paginator = this.paginator;
    } else {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
    }
    this.calcular();
  }

  editarCheque(i: number){
    this.indiceEditar = i;
    this.cheque = {... this.factura.cheques[this.indiceEditar] };
    this.seleccionBancoCheque.setValue(this.cheque.banco);
    this.habilitarEditarCheque=true;
  }

  confirmarEditarCheque(){
    this.factura.cheques[this.indiceEditar]=this.cheque;
    this.cheque=new Cheque();
    this.seleccionBancoCheque.setValue(valores.vacio);
    this.habilitarEditarCheque=false;
    this.dataCheques = new MatTableDataSource<Cheque>(this.factura.cheques);
    this.dataCheques.sort = this.sort;
    this.dataCheques.paginator = this.paginator;
    this.calcular();
  }

  eliminarCheque(i: number) {
    if (confirm(otras.pregunta_eliminar_cheque)) {
      this.factura.cheques.splice(i, 1);
      this.dataCheques = new MatTableDataSource<Cheque>(this.factura.cheques);
      this.dataCheques.sort = this.sort;
      this.dataCheques.paginator = this.paginator;
      this.calcular();
    }
  }

  totalCheques() {
    return this.factura.cheques.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  agregarDeposito() {
    if (this.factura.totalRecaudacion + Number(this.deposito.valor) <= this.factura.totalConDescuento){
      this.deposito.banco=this.seleccionBancoDeposito.value;
      this.factura.depositos.push(this.deposito);
      this.deposito=new Deposito();
      this.seleccionBancoDeposito.patchValue(valores.vacio);
      this.dataDepositos = new MatTableDataSource<Deposito>(this.factura.depositos);
      this.dataDepositos.sort = this.sort;
      this.dataDepositos.paginator = this.paginator;
    } else {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
    }
    this.calcular();
  }

  editarDeposito(i: number){
    this.indiceEditar = i;
    this.deposito = {... this.factura.depositos [this.indiceEditar] };
    this.seleccionBancoDeposito.setValue(this.deposito.banco);
    this.habilitarEditarDeposito = true;
  }
  confirmarEditarDeposito(){
    this.factura.depositos[this.indiceEditar] = this.deposito;
    this.deposito=new Deposito();
    this.seleccionBancoDeposito.setValue(valores.vacio);
    this.habilitarEditarDeposito=false;
    this.dataDepositos = new MatTableDataSource<Deposito>(this.factura.depositos);
    this.dataDepositos.sort = this.sort;
    this.dataDepositos.paginator = this.paginator;
    this.calcular();
  }

  eliminarDeposito(i: number) {
    if (confirm(otras.pregunta_eliminar_deposito)) {
      this.factura.depositos.splice(i, 1);
      this.dataDepositos = new MatTableDataSource<Deposito>(this.factura.depositos);
      this.dataDepositos.sort = this.sort;
      this.dataDepositos.paginator = this.paginator;
      this.calcular();
    }
  }

  totalDepositos() {
    return this.factura.depositos.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  agregarTransferencia() {
    if (this.factura.totalRecaudacion + Number(this.transferencia.valor) <= this.factura.totalConDescuento){
      this.transferencia.banco = this.seleccionBancoTransferencia.value;
      this.factura.transferencias.push(this.transferencia);
      this.transferencia = new Transferencia();
      this.seleccionBancoTransferencia.patchValue(valores.vacio);
      this.dataTransferencias = new MatTableDataSource<Transferencia>(this.factura.transferencias);
      this.dataTransferencias.sort = this.sort;
      this.dataTransferencias.paginator = this.paginator;
    } else {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
    }
    this.defectoTransferencia();
    this.calcular();
  }

  editarTransferencia(i: number){
    this.indiceEditar = i;
    this.transferencia = { ... this.factura.transferencias[this.indiceEditar]};
    this.seleccionBancoTransferencia.setValue(this.transferencia.banco);
    this.habilitarEditarTransferencia=true;
  }
  confirmarEditarTransferencia(){
    this.factura.transferencias[this.indiceEditar] = this.transferencia;
    this.transferencia = new Transferencia();
    this.seleccionBancoTransferencia.setValue(valores.vacio);
    this.habilitarEditarTransferencia = false;
    this.dataTransferencias = new MatTableDataSource<Transferencia>(this.factura.transferencias);
    this.dataTransferencias.sort = this.sort;
    this.dataTransferencias.paginator = this.paginator;
    this.calcular();
  }

  eliminarTransferencia(i: number) {
    if (confirm(otras.pregunta_eliminar_transferencia)) {
      this.factura.transferencias.splice(i, 1);
      this.dataTransferencias = new MatTableDataSource<Transferencia>(this.factura.transferencias);
      this.dataTransferencias.sort = this.sort;
      this.dataTransferencias.paginator = this.paginator;
      this.calcular();
    }
  }

  totalTransferencias() {
    return this.factura.transferencias.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  agregarTarjetaCredito() {
    if (this.factura.totalRecaudacion + Number(this.tarjetaCredito.valor) <= this.factura.totalConDescuento){
      this.tarjetaCredito.banco=this.seleccionBancoTarjetaCredito.value;
      this.factura.tarjetasCreditos.push(this.tarjetaCredito);
      this.tarjetaCredito=new TarjetaCredito();
      this.seleccionBancoTarjetaCredito.patchValue(valores.vacio);
      this.dataTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.factura.tarjetasCreditos);
      this.dataTarjetasCreditos.sort = this.sort;
      this.dataTarjetasCreditos.paginator = this.paginator;
    } else {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
    }
    this.defectoTarjetaCredito();
    this.calcular();
  }
  editarTarjetaCredito(i: number){
    this.indiceEditar = i;
    this.tarjetaCredito = { ... this.factura.tarjetasCreditos[this.indiceEditar]};
    this.seleccionBancoTarjetaCredito.setValue(this.tarjetaCredito.banco);
    this.habilitarEditarTarjetaCredito = true;
  }

  confirmarEditarTarjetaCredito(){
    this.factura.tarjetasCreditos[this.indiceEditar] = this.tarjetaCredito;
    this.tarjetaCredito=new TarjetaCredito();
    this.seleccionBancoTarjetaCredito.setValue(valores.vacio);
    this.habilitarEditarTarjetaCredito=false;
    this.dataTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.factura.tarjetasCreditos);
    this.dataTarjetasCreditos.sort = this.sort;
    this.dataTarjetasCreditos.paginator = this.paginator;
    this.calcular();
  }

  eliminarTarjetaCredito(i: number) {
    if (confirm(otras.pregunta_eliminar_tarjeta_credito)) {
      this.factura.tarjetasCreditos.splice(i, 1);
      this.dataTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.factura.tarjetasCreditos);
      this.dataTarjetasCreditos.sort = this.sort;
      this.dataTarjetasCreditos.paginator = this.paginator;
      this.calcular();
    }
  }

  totalTarjetasCreditos() {
    return this.factura.tarjetasCreditos.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  validarIdentificacionTarjetaCredito(){
    this.clienteService.validarIdentificacion(this.tarjetaCredito.identificacion).subscribe(
      res => {
        if (res.resultado!=null){
          Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        } else {
          this.tarjetaCredito.identificacion=valores.vacio;
          Swal.fire({ icon: error_swal, title: exito, text: res.mensaje });
        } 
      },
      err => Swal.fire(error, err.error.mensaje, error_swal)
    );
  }

  agregarTarjetaDebito() {
    if (this.factura.totalRecaudacion + Number(this.tarjetaDebito.valor) <= this.factura.totalConDescuento){
      this.tarjetaDebito.banco=this.seleccionBancoTarjetaDebito.value;
      this.factura.tarjetasDebitos.push(this.tarjetaDebito);
      this.tarjetaDebito=new TarjetaDebito();
      this.seleccionBancoTarjetaDebito.setValue(valores.vacio);
      this.dataTarjetasDebitos = new MatTableDataSource<TarjetaDebito>(this.factura.tarjetasDebitos);
      this.dataTarjetasDebitos.sort = this.sort;
      this.dataTarjetasDebitos.paginator = this.paginator;
    } else {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
    }
    this.defectoTarjetaDebito();
    this.calcular();
  }

  editarTarjetaDebito(i: number){
    this.indiceEditar = i;
    this.tarjetaDebito = { ... this.factura.tarjetasDebitos[this.indiceEditar]};
    this.habilitarEditarTarjetaDebito = true;
  }
  
  confirmarEditarTarjetaDebito(){
    this.factura.tarjetasDebitos[this.indiceEditar] = this.tarjetaDebito;
    this.tarjetaDebito = new TarjetaDebito();
    this.seleccionBancoTarjetaDebito.setValue(valores.vacio);
    this.habilitarEditarTarjetaDebito = false;
    this.dataTarjetasDebitos = new MatTableDataSource<TarjetaDebito>(this.factura.tarjetasDebitos);
    this.dataTarjetasDebitos.sort = this.sort;
    this.dataTarjetasDebitos.paginator = this.paginator;
    this.calcular();
  }

  eliminarTarjetaDebito(i: number) {
    if (confirm(otras.pregunta_eliminar_tarjeta_debito)) {
      this.factura.tarjetasDebitos.splice(i, 1);
      this.dataTarjetasDebitos = new MatTableDataSource<TarjetaDebito>(this.factura.tarjetasDebitos);
      this.dataTarjetasDebitos.sort = this.sort;
      this.dataTarjetasDebitos.paginator = this.paginator;
      this.calcular();
    }
  }

  totalTarjetasDebitos() {
    return this.factura.tarjetasDebitos.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  validarIdentificacionTarjetaDebito(){
    this.clienteService.validarIdentificacion(this.tarjetaDebito.identificacion).subscribe(
      res => {
        if (res.resultado!=null){
          Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        } else {
          this.tarjetaDebito.identificacion='';
          Swal.fire({ icon: error_swal, title: error, text: res.mensaje });
        } 
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  calcular(){
    this.facturaService.calcularRecaudacion(this.factura).subscribe(
      res => {
        this.factura = res.resultado as Factura;
        this.cheque.valor = this.factura.porPagar;
	      this.deposito.valor = this.factura.porPagar;
	      this.transferencia.valor = this.factura.porPagar;
	      this.tarjetaCredito.valor = this.factura.porPagar;
	      this.tarjetaDebito.valor = this.factura.porPagar;
      }, err => Swal.fire(error, err.error.mensaje, error_swal)
    );
  }

  seleccionarEfectivo(){
    this.calcular();
  }

  actualizar(event){
    if (event!=null)
      event.preventDefault();
    this.facturaService.actualizar(this.factura).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.factura = res.resultado as Factura;
      }, 
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  pad(numero:string, size:number): string {
    while (numero.length < size) numero = "0" + numero;
    return numero;
  }
  rellenarNumeroCheque(){
    this.cheque.numero = this.pad(this.cheque.numero, 13);
  }
  rellenarNumeroDeposito(){
    this.deposito.comprobante = this.pad(this.deposito.comprobante, 13);
  }
  rellenarNumeroTransferencia(){
    this.transferencia.numeroTransaccion = this.pad(this.transferencia.numeroTransaccion, 13);
  }

  defectoTransferencia(){
  }

  defectoTarjetaCredito(){
    this.tarjetaCredito = new TarjetaCredito();
    this.tarjetaCredito.identificacion = this.factura.cliente.identificacion;
    this.tarjetaCredito.nombre = this.factura.cliente.razonSocial;
  }

  defectoTarjetaDebito(){
    this.tarjetaDebito = new TarjetaDebito();
    this.tarjetaDebito.identificacion = this.factura.cliente.identificacion;
    this.tarjetaDebito.nombre = this.factura.cliente.razonSocial;
  }

  asignarTitularTarjetaCredito(){
    if (this.tarjetaCredito.titular){
      this.tarjetaCredito.identificacion = this.factura.cliente.identificacion;
      this.tarjetaCredito.nombre = this.factura.cliente.razonSocial;
      this.habilitarTitularTarjetaCredito = true;
    } else{
      this.tarjetaCredito.identificacion = valores.vacio;
      this.tarjetaCredito.nombre = valores.vacio;
      this.habilitarTitularTarjetaCredito=false;
    }
  }
  asignarTitularTarjetaDebito(){
    if (this.tarjetaDebito.titular){
      this.tarjetaDebito.identificacion = this.factura.cliente.identificacion;
      this.tarjetaDebito.nombre = this.factura.cliente.razonSocial;
      this.habilitarTitularTarjetaDebito = true;
    } else{
      this.tarjetaDebito.identificacion = valores.vacio;
      this.tarjetaDebito.nombre = valores.vacio;
      this.habilitarEditarTarjetaDebito = false;
    }
  }

  crearFacturaElectronica(event){
    if (event != null)
      event.preventDefault();
    this.facturaElectronicaService.enviar(this.factura.id).subscribe(
      res => {
        let respuesta = res.resultado as String;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
}
