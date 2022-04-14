import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as util from '../../../util';
import Swal from 'sweetalert2';
import { Recaudacion } from '../../../modelos/recaudacion';
import { Cheque } from '../../../modelos/cheque';
import { Deposito } from '../../../modelos/deposito';
import { TarjetaCredito } from '../../../modelos/tarjeta-credito';
import { TarjetaDebito } from '../../../modelos/tarjeta-debito';
import { Compensacion } from '../../../modelos/compensacion';
import { FacturaService } from '../../../servicios/factura.service';
import { Factura } from '../../../modelos/factura';
import { Banco } from '../../../modelos/banco';
import { Cliente } from '../../../modelos/cliente';
import { startWith, map } from 'rxjs/operators';
import { ClienteService } from '../../../servicios/cliente.service';
import { BancoService } from '../../../servicios/banco.service';
import { FormaPagoService } from '../../../servicios/forma-pago.service';
import { FormaPago } from '../../../modelos/forma-pago';
import { CuentaPropia } from '../../../modelos/cuenta-propia';
import { CuentaPropiaService } from '../../../servicios/cuenta-propia.service';
import { Transferencia } from '../../../modelos/transferencia';
import { FranquiciaTarjeta } from '../../../modelos/franquicia-tarjeta';
import { FranquiciaTarjetaService } from '../../../servicios/franquicia-tarjeta.service';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../modelos/format-date-picker';
import { OperadorTarjeta } from '../../../modelos/operador-tarjeta';
import { Comprobante } from '../../../modelos/comprobante';
import { OperadorTarjetaService } from '../../../servicios/operador-tarjeta.service';
import { TipoComprobante } from '../../../modelos/tipo-comprobante';
import { TipoComprobanteService } from '../../../servicios/tipo-comprobante.service';
import { SesionService } from '../../../servicios/sesion.service';
import { Sesion } from '../../../modelos/sesion';
import { RecaudacionService } from '../../../servicios/recaudacion.service';
import { RetencionVenta } from '../../../modelos/retencion-venta';
import { EstablecimientoService } from '../../../servicios/establecimiento.service';
import { Establecimiento } from '../../../modelos/establecimiento';
import { PuntoVenta } from '../../../modelos/punto-venta';
import { PuntoVentaService } from '../../../servicios/punto-venta.service';
import { Parametro } from '../../../modelos/parametro';
import { ParametroService } from '../../../servicios/parametro.service';
import * as constantes from '../../../constantes';
import { CreditoService } from '../../../servicios/credito.service';
import { Credito } from '../../../modelos/credito';
import { MatStepper } from '@angular/material/stepper';

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

  constructor(private facturaService: FacturaService, private clienteService: ClienteService, private bancoService: BancoService, private sesionService: SesionService,
    private cuentaPropiaService: CuentaPropiaService, private operadorTarjetaService: OperadorTarjetaService, private datePipe: DatePipe,
    private franquiciaTarjetaService: FranquiciaTarjetaService, private formaPagoService: FormaPagoService, private creditoService: CreditoService,
    private parametroService: ParametroService, private establecimientoService: EstablecimientoService, private puntoVentaService: PuntoVentaService,
    private tipoComprobanteService: TipoComprobanteService, private recaudacionService: RecaudacionService, private modalService: NgbModal, private router: Router) { }

  factura: Factura= new Factura();
  recaudacion: Recaudacion = new Recaudacion();
  cheque: Cheque=new Cheque();
  deposito: Deposito=new Deposito();
  transferencia: Transferencia=new Transferencia();
  tarjetaDebito: TarjetaDebito=new TarjetaDebito();
  tarjetaCredito: TarjetaCredito=new TarjetaCredito();
  compensacion: Compensacion=new Compensacion();
  retencionVenta: RetencionVenta= new RetencionVenta();
  compensaciones: Compensacion[]=[];
  modelosAmortizaciones: Parametro[];
  periodicidades: Parametro[];
  formasPagos: FormaPago[]=[];
  comprobantes: Comprobante[]=[];
  clientes: Cliente[]=[];
  cuentasPropias: CuentaPropia[]=[];
  franquiciasTarjetasCreditos: FranquiciaTarjeta[];
  franquiciasTarjetasDebitos: FranquiciaTarjeta[];
  operadoresTarjetasCreditos: OperadorTarjeta[]=[];
  operadoresTarjetasDebitos: OperadorTarjeta[]=[];
  tiposComprobantes: TipoComprobante[]=[];
  establecimientos: Establecimiento[]=[];
  puntosVentas: PuntoVenta[]=[];

  seleccionRazonSocialCliente = new FormControl();
  filtroRazonSocialClientes: Observable<Cliente[]> = new Observable<Cliente[]>();
  bancosCheques: Banco[]=[];
  seleccionBancoCheque = new FormControl();
  filtroBancosCheques: Observable<Banco[]> = new Observable<Banco[]>();
  bancosDepositos: Banco[];
  seleccionBancoDeposito = new FormControl();
  filtroBancosDepositos: Observable<Banco[]> = new Observable<Banco[]>();
  bancosTransferencias: Banco[];
  seleccionBancoTransferencia = new FormControl();
  filtroBancosTransferencias: Observable<Banco[]> = new Observable<Banco[]>();
  bancosTarjetasCreditos: Banco[];
  seleccionBancoTarjetaCredito = new FormControl();
  filtroBancosTarjetasCreditos: Observable<Banco[]> = new Observable<Banco[]>();
  bancosTarjetasDebitos: Banco[];
  seleccionBancoTarjetaDebito = new FormControl();
  filtroBancosTarjetasDebitos: Observable<Banco[]> = new Observable<Banco[]>();
  formasPagoLista: string[] = constantes.formas_pago
  formaPagoSelecionada:string="";
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  habilitarCheques: boolean = false;
  columnasCheques: string[] = ['id', 'fecha', 'tipo', 'numero', 'banco', 'valor', 'acciones'];
  dataCheques = new MatTableDataSource<Cheque>(this.recaudacion.cheques);

  habilitarDepositos: boolean = false;
  columnasDepositos: string[] = ['id', 'fecha', 'cuenta', 'banco', 'comprobante', 'valor', 'acciones'];
  dataDepositos = new MatTableDataSource<Deposito>(this.recaudacion.depositos);

  // Variables para transferencias
  habilitarTransferencias: boolean = false;
  columnasTransferencias: string[] = ['id', 'fecha', 'cuenta', 'banco', 'comprobante', 'valor', 'acciones'];
  dataTransferencias = new MatTableDataSource<Transferencia>(this.recaudacion.transferencias);

  // Variables para Tarjetas de crédito
  habilitarTarjetasCreditos: boolean = false;
  columnasTarjetasCredito: string[] = ['id', 'franquicia', 'banco', 'identificacion', 'nombre', 'titular', 'diferido', 'operador', 'lote', 'valor', 'acciones'];
  dataTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.recaudacion.tarjetasCreditos);

  // Variables para Tarjetas de débito
  habilitarTarjetasDebitos: boolean = false;
  columnasTarjetasDebito: string[] = ['id', 'franquicia', 'banco', 'identificacion', 'nombre', 'operador', 'lote', 'valor', 'acciones'];
  dataTarjetasDebitos= new MatTableDataSource<TarjetaDebito>(this.recaudacion.tarjetasDebitos);

  // Variables para Compensaciones
  habilitarCompensaciones: boolean = false;
  columnasCompensaciones: string[] = ['id', 'tipo', 'comprobante', 'fecha', 'origen', 'motivo', 'fechaVencimiento', 'valorInicial', 'valorCompensado', 'acciones'];
  dataCompensaciones = new MatTableDataSource<Compensacion>(this.recaudacion.compensaciones);
  
  // Variables para RetencionesVentas
  habilitarRetencionesVentas: boolean = false;
  columnasRetencionesVentas: string[] = ['id', 'secuencia', 'autorizacion', 'cod Ret', 'denominacion', 'base', '%', 'valor', 'acciones'];
  dataRetencionesVentas = new MatTableDataSource<RetencionVenta>(this.recaudacion.retencionesVentas);

  sesion: Sesion;
  estado: string="";

  indiceEditar: number=-1;
  habilitarEditarCheque: boolean= false;
  habilitarEditarDeposito: boolean= false;
  habilitarEditarTransferencia: boolean= false;
  habilitarEditarTarjetaCredito: boolean= false;
  habilitarEditarTarjetaDebito: boolean= false;
  habilitarEditarCompensacion: boolean = false;
  habilitarEditarRetencionVenta: boolean = false;
  habilitarTitularTarjetaDebito: boolean=true;
  habilitarTitularTarjetaCredito: boolean= true;
  banderaCredito: boolean=false;
  

  ngOnInit() {
    util.validarSesion(this.sesion, this.sesionService, this.router);
    this.consultarEstablecimientos();
    this.consultarCuentasPropias();
    this.consultarFranquiciasTarjetas();
    this.consultarOperadoresTarjetasCreditos();
    this.consultarOperadoresTarjetasDebitos();
    this.consultarModelosAmortizaciones();
    this.consultarPeriodicidades();
    this.consultarTiposComprobantes();
    this.consultarBancosCheques();
    this.consultarBancosDepositos();
    this.consultarBancosTransferencias();
    this.consultarBancosTarjetasCreditos();
    this.consultarBancosTarjetasDebitos();

    this.facturaService.eventoRecaudacion.subscribe((data:Factura) => {
        this.factura=data;
        this.cargar();
        this.calcular();
    });
    
    this.filtroRazonSocialClientes = this.seleccionRazonSocialCliente.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(razon_social => typeof razon_social === 'string' ? this.filtroRazonSocialCliente(razon_social) : this.clientes.slice())
      );
    this.filtroBancosCheques = this.seleccionBancoCheque.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(banco => typeof banco === 'string' ? this.filtroBancoCheque(banco) : this.bancosCheques.slice())
      );
    this.filtroBancosDepositos = this.seleccionBancoDeposito.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(banco_deposito => typeof banco_deposito === 'string' ? this.filtroBancoDeposito(banco_deposito) : this.bancosDepositos.slice())
      );
    this.filtroBancosTransferencias = this.seleccionBancoTransferencia.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(banco_transferencia => typeof banco_transferencia === 'string' ? this.filtroBancoTransferencia(banco_transferencia) : this.bancosTransferencias.slice())
      );
    this.filtroBancosTarjetasCreditos = this.seleccionBancoTarjetaCredito.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(banco_tarjeta_credito => typeof banco_tarjeta_credito === 'string' ? this.filtroBancoTarjetaCredito(banco_tarjeta_credito) : this.bancosTarjetasCreditos.slice())
      );
    this.filtroBancosTarjetasDebitos = this.seleccionBancoTarjetaDebito.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(banco_tarjeta_debito => typeof banco_tarjeta_debito === 'string' ? this.filtroBancoTarjetaDebito(banco_tarjeta_debito) : this.bancosTarjetasDebitos.slice())
      );
  }

  cargar(){
    if(this.factura.id!=0){
      this.recaudacionService.obtenerPorFactura(this.factura.id).subscribe(
        res => {
          let recaudacion=new Recaudacion();
          if(res.resultado==null){
            recaudacion.factura=this.factura;
          } else{
            Object.assign(recaudacion, res.resultado as Recaudacion);
          }
          recaudacion.normalizar();
          this.recaudacion=recaudacion;
          if(this.recaudacion.cheques.length>0){
            this.habilitarSeccionPago(constantes.formas_pago[0]);
            this.dataCheques = new MatTableDataSource<Cheque>(this.recaudacion.cheques);
          }
          if(this.recaudacion.depositos.length>0){
            this.habilitarSeccionPago(constantes.formas_pago[1]);
            this.dataDepositos = new MatTableDataSource<Deposito>(this.recaudacion.depositos);
          }
          if(this.recaudacion.transferencias.length>0){
            this.habilitarSeccionPago(constantes.formas_pago[2]);
            this.dataTransferencias = new MatTableDataSource<Transferencia>(this.recaudacion.transferencias);
          }
          if(this.recaudacion.tarjetasCreditos.length>0){
            this.habilitarSeccionPago(constantes.formas_pago[3]);
            this.dataTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.recaudacion.tarjetasCreditos);
          }
          if(this.recaudacion.tarjetasDebitos.length>0){
            this.habilitarSeccionPago(constantes.formas_pago[4]);
            this.dataTarjetasDebitos = new MatTableDataSource<TarjetaDebito>(this.recaudacion.tarjetasDebitos);
          }
          if(this.recaudacion.compensaciones.length>0){
            this.habilitarSeccionPago(constantes.formas_pago[5]);
            this.dataCompensaciones = new MatTableDataSource<Compensacion>(this.recaudacion.compensaciones);
          }
          if(this.recaudacion.retencionesVentas.length>0){
            this.habilitarSeccionPago(constantes.formas_pago[6]);
            this.dataRetencionesVentas = new MatTableDataSource<RetencionVenta>(this.recaudacion.retencionesVentas);
          }
          this.calcular();
        },
        err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
      );
    }
  }

  consultarEstablecimientos(){
    this.establecimientoService.consultar().subscribe(
      res => {
        this.establecimientos = res.resultado as Establecimiento[]
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  consultarPuntosVentas(){
    this.puntoVentaService.consultarEstablecimiento(this.retencionVenta.establecimiento.id).subscribe(
      res => {
        this.puntosVentas = res.resultado as PuntoVenta[]
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  consultarCuentasPropias(){
    this.cuentaPropiaService.consultar().subscribe(
      res => {
        this.cuentasPropias = res.resultado as CuentaPropia[]
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }
  consultarFranquiciasTarjetas(){
    this.franquiciaTarjetaService.consultar().subscribe(
      res => {
        this.franquiciasTarjetasCreditos = res.resultado as FranquiciaTarjeta[]
        this.franquiciasTarjetasDebitos = res.resultado as FranquiciaTarjeta[]
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }
  consultarOperadoresTarjetasCreditos(){
    this.operadorTarjetaService.consultarTipo("CREDITO").subscribe(
      res => {
        this.operadoresTarjetasCreditos = res.resultado as OperadorTarjeta[]
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }
  consultarOperadoresTarjetasDebitos(){
    this.operadorTarjetaService.consultarTipo("DEBITO").subscribe(
      res => {
        this.operadoresTarjetasDebitos = res.resultado as OperadorTarjeta[]
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }
  consultarModelosAmortizaciones(){
    let parametro=new Parametro();
    parametro.tipo=constantes.modelo_amortizacion;
    this.parametroService.consultarTipo(parametro).subscribe(
      res => {
        this.modelosAmortizaciones = res.resultado as Parametro[]
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }
  consultarPeriodicidades(){
    let parametro=new Parametro();
    parametro.tipo=constantes.periodicidad;
    this.parametroService.consultarTipo(parametro).subscribe(
      res => {
        this.periodicidades = res.resultado as Parametro[]
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }
  consultarTiposComprobantes(){
    this.tipoComprobanteService.consultar().subscribe(
      res => {
        this.tiposComprobantes = res.resultado as TipoComprobante[]
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }
  consultarClientes() {
    this.clienteService.consultar().subscribe(
     res => {
       this.clientes = res.resultado as Cliente[]
     },
     err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
   );
  }
  consultarBancosCheques() {
    this.bancoService.consultar().subscribe(
    res => {
      this.bancosCheques = res.resultado as Banco[]
    },
    err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal));
  }
  consultarBancosDepositos() {
    this.bancoService.consultar().subscribe(
    res => {
      this.bancosDepositos = res.resultado as Banco[]
    },
    err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal));
  }  
  consultarBancosTransferencias() {
    this.bancoService.consultar().subscribe(
    res => {
      this.bancosTransferencias = res.resultado as Banco[]
    },
    err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal));
  } 
  consultarBancosTarjetasCreditos() {
    this.bancoService.consultar().subscribe(
    res => {
      this.bancosTarjetasCreditos = res.resultado as Banco[]
    },
    err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal));
  }
  consultarBancosTarjetasDebitos() {
    this.bancoService.consultar().subscribe(
    res => {
      this.bancosTarjetasDebitos = res.resultado as Banco[]
    },
    err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal));
  }
  consultarFormasPagos() {
    this.formaPagoService.consultar().subscribe(
    res => {
      this.formasPagos = res.resultado as FormaPago[]
    },
    err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal));
  }  

  private filtroRazonSocialCliente(value: string): Cliente[] {
    if(this.clientes.length>0) {
      const filterValue = value.toLowerCase();
      return this.clientes.filter(cliente => cliente.razonSocial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verRazonSocialCliente(cliente: Cliente): string {
    return cliente && cliente.razonSocial ? cliente.razonSocial : '';
  }
  private filtroBancoCheque(value: string): Banco[] {
    if(this.bancosCheques.length>0) {
      const filterValue = value.toLowerCase();
      return this.bancosCheques.filter(banco => banco.abreviatura.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verBancoCheque(banco: Banco): string {
    return banco && banco.nombre ? banco.nombre : '';
  }

  private filtroBancoDeposito(value: string): Banco[] {
    if(this.bancosDepositos.length>0) {
      const filterValue = value.toLowerCase();
      return this.bancosDepositos.filter(bancoDeposito => bancoDeposito.abreviatura.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verBancoDeposito(bancoDeposito: Banco): string {
    return bancoDeposito && bancoDeposito.nombre ? bancoDeposito.nombre : '';
  }
  private filtroBancoTransferencia(value: string): Banco[] {
    if(this.bancosTransferencias.length>0) {
      const filterValue = value.toLowerCase();
      return this.bancosTransferencias.filter(bancoTransferencia => bancoTransferencia.abreviatura.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verBancoTransferencia(bancoTransferencia: Banco): string {
    return bancoTransferencia && bancoTransferencia.nombre ? bancoTransferencia.nombre : '';
  }

  private filtroBancoTarjetaCredito(value: string): Banco[] {
    if(this.bancosTarjetasCreditos.length>0) {
      const filterValue = value.toLowerCase();
      return this.bancosTarjetasCreditos.filter(bancoTarjetaCredito => bancoTarjetaCredito.abreviatura.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verBancoTarjetaCredito(bancoTarjetaCredito: Banco): string {
    return bancoTarjetaCredito && bancoTarjetaCredito.nombre ? bancoTarjetaCredito.nombre : '';
  }

  private filtroBancoTarjetaDebito(value: string): Banco[] {
    if(this.bancosTarjetasDebitos.length>0) {
      const filterValue = value.toLowerCase();
      return this.bancosTarjetasDebitos.filter(banco_tarjeta_debito => banco_tarjeta_debito.abreviatura.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verBancoTarjetaDebito(banco_tarjeta_debito: Banco): string {
    return banco_tarjeta_debito && banco_tarjeta_debito.nombre ? banco_tarjeta_debito.nombre : '';
  }
  seleccionarCliente(){

  }
  seleccionarBancoCheque(){

  }
  seleccionarBancoDeposito(){

  }
  seleccionarBancoTransferencia(){

  }
  seleccionarBancoTarjetaCredito(){

  }
  seleccionarBancoTarjetaDebito(){

  }

  habilitarSeccionPago(formaPago: string){
    if (formaPago == constantes.formas_pago[0]){
      this.habilitarCheques = !this.habilitarCheques;
    }
    if (formaPago == constantes.formas_pago[1]){
      this.habilitarDepositos = !this.habilitarDepositos;
    }
    if (formaPago == constantes.formas_pago[2]){
      this.habilitarTransferencias = !this.habilitarTransferencias;
    }
    if (formaPago == constantes.formas_pago[3]){
      this.habilitarTarjetasCreditos = !this.habilitarTarjetasCreditos;
      this.defectoTarjetaCredito();
    }
    if (formaPago == constantes.formas_pago[4]){
      this.habilitarTarjetasDebitos = !this.habilitarTarjetasDebitos;
      this.defectoTarjetaDebito();
    }
    if (formaPago == constantes.formas_pago[5]){
      this.habilitarCompensaciones = !this.habilitarCompensaciones;
    }
    if (formaPago == constantes.formas_pago[6]){
      this.habilitarRetencionesVentas = !this.habilitarRetencionesVentas;
    }
    this.calcular();
  }

  agregarCheque() {
    if (this.recaudacion.total+Number(this.cheque.valor)<=this.factura.totalConDescuento && this.seleccionBancoCheque.value!=null && this.cheque.tipo!=null) {
      this.cheque.banco=this.seleccionBancoCheque.value;
      this.recaudacion.cheques.push(this.cheque);
      this.recaudacion.totalCheques;
      this.cheque=new Cheque();
      this.seleccionBancoCheque.patchValue("");
      this.dataCheques = new MatTableDataSource<Cheque>(this.recaudacion.cheques);
      this.dataCheques.sort = this.sort;
      this.dataCheques.paginator = this.paginator;
    } else {
      Swal.fire(constantes.error, constantes.error_agregar_recaudacion, constantes.error_swal);
    }
    this.calcular();
  }

  editarCheque(i: number){
    this.indiceEditar=i;
    this.cheque={... this.recaudacion.cheques[this.indiceEditar] };
    this.seleccionBancoCheque.setValue(this.cheque.banco);
    this.habilitarEditarCheque=true;
  }

  confirmarEditarCheque(){
    this.recaudacion.cheques[this.indiceEditar]=this.cheque;
    this.cheque=new Cheque();
    this.seleccionBancoCheque.setValue(null);
    this.habilitarEditarCheque=false;
    this.dataCheques = new MatTableDataSource<Cheque>(this.recaudacion.cheques);
    this.dataCheques.sort = this.sort;
    this.dataCheques.paginator = this.paginator;
    this.calcular();
  }

  eliminarCheque(i: number) {
    if (confirm(constantes.pregunta_eliminar_cheque)) {
      this.recaudacion.cheques.splice(i, 1);
      this.dataCheques = new MatTableDataSource<Cheque>(this.recaudacion.cheques);
      this.dataCheques.sort = this.sort;
      this.dataCheques.paginator = this.paginator;
      this.calcular();
    }
  }

  totalCheques() {
    return this.recaudacion.cheques.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  agregarDeposito() {
    if (this.recaudacion.total+Number(this.deposito.valor)<=this.factura.totalConDescuento){
      this.deposito.banco=this.seleccionBancoDeposito.value;
      this.recaudacion.depositos.push(this.deposito);
      this.deposito=new Deposito();
      this.seleccionBancoDeposito.patchValue("");
      this.dataDepositos = new MatTableDataSource<Deposito>(this.recaudacion.depositos);
      this.dataDepositos.sort = this.sort;
      this.dataDepositos.paginator = this.paginator;
    } else {
      Swal.fire(constantes.error, constantes.error_agregar_recaudacion, constantes.error_swal);
    }
    this.calcular();
  }

  editarDeposito(i: number){
    this.indiceEditar=i;
    this.deposito= {... this.recaudacion.depositos [this.indiceEditar] };
    this.seleccionBancoDeposito.setValue(this.deposito.banco);
    this.habilitarEditarDeposito=true;
  }
  confirmarEditarDeposito(){
    this.recaudacion.depositos[this.indiceEditar]=this.deposito;
    this.deposito=new Deposito();
    this.seleccionBancoDeposito.setValue(null);
    this.habilitarEditarDeposito=false;
    this.dataDepositos = new MatTableDataSource<Deposito>(this.recaudacion.depositos);
    this.dataDepositos.sort = this.sort;
    this.dataDepositos.paginator = this.paginator;
    this.calcular();
  }

  eliminarDeposito(i: number) {
    if (confirm(constantes.pregunta_eliminar_deposito)) {
      this.recaudacion.depositos.splice(i, 1);
      this.dataDepositos = new MatTableDataSource<Deposito>(this.recaudacion.depositos);
      this.dataDepositos.sort = this.sort;
      this.dataDepositos.paginator = this.paginator;
      this.calcular();
    }
  }

  totalDepositos() {
    return this.recaudacion.depositos.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  agregarTransferencia() {
    if (this.recaudacion.total+Number(this.transferencia.valor)<=this.factura.totalConDescuento){
      this.transferencia.banco=this.seleccionBancoTransferencia.value;
      this.recaudacion.transferencias.push(this.transferencia);
      this.transferencia=new Transferencia();
      this.seleccionBancoTransferencia.patchValue("");
      this.dataTransferencias = new MatTableDataSource<Transferencia>(this.recaudacion.transferencias);
      this.dataTransferencias.sort = this.sort;
      this.dataTransferencias.paginator = this.paginator;
    } else {
      Swal.fire(constantes.error, constantes.error_agregar_recaudacion, constantes.error_swal);
    }
    this.defectoTransferencia();
    this.calcular();
  }

  editarTransferencia(i: number){
    this.indiceEditar=i;
    this.transferencia={ ... this.recaudacion.transferencias[this.indiceEditar]};
    this.seleccionBancoTransferencia.setValue(this.transferencia.banco);
    this.habilitarEditarTransferencia=true;
  }
  confirmarEditarTransferencia(){
    this.recaudacion.transferencias[this.indiceEditar]=this.transferencia;
    this.transferencia=new Deposito();
    this.seleccionBancoTransferencia.setValue(null);
    this.habilitarEditarTransferencia=false;
    this.dataTransferencias = new MatTableDataSource<Transferencia>(this.recaudacion.transferencias);
    this.dataTransferencias.sort = this.sort;
    this.dataTransferencias.paginator = this.paginator;
    this.calcular();
  }

  eliminarTransferencia(i: number) {
    if (confirm(constantes.pregunta_eliminar_transferencia)) {
      this.recaudacion.transferencias.splice(i, 1);
      this.dataTransferencias = new MatTableDataSource<Transferencia>(this.recaudacion.transferencias);
      this.dataTransferencias.sort = this.sort;
      this.dataTransferencias.paginator = this.paginator;
      this.calcular();
    }
  }

  totalTransferencias() {
    return this.recaudacion.transferencias.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  agregarTarjetaCredito() {
    if (this.recaudacion.total+Number(this.tarjetaCredito.valor)<=this.factura.totalConDescuento){
      this.tarjetaCredito.banco=this.seleccionBancoTarjetaCredito.value;
      this.recaudacion.tarjetasCreditos.push(this.tarjetaCredito);
      this.tarjetaCredito=new TarjetaCredito();
      this.seleccionBancoTarjetaCredito.patchValue("");
      this.dataTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.recaudacion.tarjetasCreditos);
      this.dataTarjetasCreditos.sort = this.sort;
      this.dataTarjetasCreditos.paginator = this.paginator;
    } else {
      Swal.fire(constantes.error, constantes.error_agregar_recaudacion, constantes.error_swal);
    }
    this.defectoTarjetaCredito();
    this.calcular();
  }
  editarTarjetaCredito(i: number){
    this.indiceEditar=i;
    this.tarjetaCredito={ ... this.recaudacion.tarjetasCreditos[this.indiceEditar]};
    this.seleccionBancoTarjetaCredito.setValue(this.tarjetaCredito.banco);
    this.habilitarEditarTarjetaCredito=true;
  }

  confirmarEditarTarjetaCredito(){
    this.recaudacion.tarjetasCreditos[this.indiceEditar]=this.tarjetaCredito;
    this.tarjetaCredito=new TarjetaCredito();
    this.seleccionBancoTarjetaCredito.setValue(null);
    this.habilitarEditarTarjetaCredito=false;
    this.dataTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.recaudacion.tarjetasCreditos);
    this.dataTarjetasCreditos.sort = this.sort;
    this.dataTarjetasCreditos.paginator = this.paginator;
    this.calcular();
  }

  eliminarTarjetaCredito(i: number) {
    if (confirm(constantes.pregunta_eliminar_tarjeta_credito)) {
      this.recaudacion.tarjetasCreditos.splice(i, 1);
      this.dataTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.recaudacion.tarjetasCreditos);
      this.dataTarjetasCreditos.sort = this.sort;
      this.dataTarjetasCreditos.paginator = this.paginator;
      this.calcular();
    }
  }

  totalTarjetasCreditos() {
    return this.recaudacion.tarjetasCreditos.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  validarIdentificacionTarjetaCredito(){
    this.clienteService.validarIdentificacion(this.tarjetaCredito.identificacion).subscribe(
      res => {
        if (res.resultado!=null){
          Swal.fire(constantes.exito, 'Identificacion verificada', constantes.exito_swal);
        } else {
          this.tarjetaCredito.identificacion='';
          Swal.fire(constantes.error, "Error al validar la identificacion", constantes.error_swal);
        } 
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  agregarTarjetaDebito() {
    if (this.recaudacion.total+Number(this.tarjetaDebito.valor)<=this.factura.totalConDescuento){
      this.tarjetaDebito.banco=this.seleccionBancoTarjetaDebito.value;
      this.recaudacion.tarjetasDebitos.push(this.tarjetaDebito);
      this.tarjetaDebito=new TarjetaDebito();
      this.seleccionBancoTarjetaDebito.setValue(null);
      this.dataTarjetasDebitos = new MatTableDataSource<TarjetaDebito>(this.recaudacion.tarjetasDebitos);
      this.dataTarjetasDebitos.sort = this.sort;
      this.dataTarjetasDebitos.paginator = this.paginator;
    } else {
      Swal.fire(constantes.error, constantes.error_agregar_recaudacion, constantes.error_swal);
    }
    this.defectoTarjetaDebito();
    this.calcular();
  }

  editarTarjetaDebito(i: number){
    this.indiceEditar=i;
    this.tarjetaDebito={ ... this.recaudacion.tarjetasDebitos[this.indiceEditar]};
    this.habilitarEditarTarjetaDebito=true;
  }
  
  confirmarEditarTarjetaDebito(){
    this.recaudacion.tarjetasDebitos[this.indiceEditar]=this.tarjetaDebito;
    this.tarjetaDebito=new TarjetaDebito();
    this.seleccionBancoTarjetaDebito.setValue(null);
    this.habilitarEditarTarjetaDebito=false;
    this.dataTarjetasDebitos = new MatTableDataSource<TarjetaDebito>(this.recaudacion.tarjetasDebitos);
    this.dataTarjetasDebitos.sort = this.sort;
    this.dataTarjetasDebitos.paginator = this.paginator;
    this.calcular();
  }

  eliminarTarjetaDebito(i: number) {
    if (confirm(constantes.pregunta_eliminar_tarjeta_debito)) {
      this.recaudacion.tarjetasDebitos.splice(i, 1);
      this.dataTarjetasDebitos = new MatTableDataSource<TarjetaDebito>(this.recaudacion.tarjetasDebitos);
      this.dataTarjetasDebitos.sort = this.sort;
      this.dataTarjetasDebitos.paginator = this.paginator;
      this.calcular();
    }
  }

  totalTarjetasDebitos() {
    return this.recaudacion.tarjetasDebitos.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  validarIdentificacionTarjetaDebito(){
    this.clienteService.validarIdentificacion(this.tarjetaDebito.identificacion).subscribe(
      res => {
        if (res.resultado!=null){
          Swal.fire(constantes.exito, 'Identificacion verificada', constantes.exito_swal);
        } else {
          this.tarjetaDebito.identificacion='';
          Swal.fire(constantes.error, "Error al validar la identificacion", constantes.error_swal);
        } 
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  agregarCompensacion() {
    this.recaudacion.compensaciones.push(this.compensacion);
    this.dataCompensaciones = new MatTableDataSource<Compensacion>(this.recaudacion.compensaciones);
    this.dataCompensaciones.sort = this.sort;
    this.dataCompensaciones.paginator = this.paginator;
    this.calcular();
  }

  editarCompensacion(i: number){
    this.indiceEditar=i;
    this.compensacion={ ... this.recaudacion.compensaciones[this.indiceEditar]};
    this.habilitarEditarCompensacion=true;
  }
  confirmarEditarCompensacion(){
    this.recaudacion.compensaciones[this.indiceEditar]=this.compensacion;
    this.compensacion=new Compensacion();
    this.habilitarEditarCompensacion=false;
    this.dataCompensaciones = new MatTableDataSource<Compensacion>(this.recaudacion.compensaciones);
    this.dataCompensaciones.sort = this.sort;
    this.dataCompensaciones.paginator = this.paginator;
    this.calcular();
  }

  eliminarCompensacion(i: number) {
    if (confirm(constantes.pregunta_eliminar_compensacion)) {
      this.recaudacion.compensaciones.splice(i, 1);
      this.dataCompensaciones = new MatTableDataSource<Compensacion>(this.recaudacion.compensaciones);
      this.dataCompensaciones.sort = this.sort;
      this.dataCompensaciones.paginator = this.paginator;
      this.calcular();
    }
  }

  totalCompensaciones() {
    return this.recaudacion.compensaciones.map(t => Number(t.valorCompensado)).reduce((acc, value) => acc + value, 0);
  }

  agregarRetencionVenta(){
    this.recaudacion.retencionesVentas.push(this.retencionVenta);
    this.dataRetencionesVentas = new MatTableDataSource<RetencionVenta>(this.recaudacion.retencionesVentas);
    this.dataRetencionesVentas.sort = this.sort;
    this.dataRetencionesVentas.paginator = this.paginator;
    this.calcular();
  }

  editarRetencionVenta(i: number){
    this.indiceEditar=i;
    this.retencionVenta={ ... this.recaudacion.retencionesVentas[this.indiceEditar]};
    this.habilitarEditarRetencionVenta=true;
  }

  confirmarEditarRetencionVenta(){
    this.recaudacion.retencionesVentas[this.indiceEditar]=this.retencionVenta;
    this.retencionVenta=new RetencionVenta();
    this.habilitarEditarRetencionVenta=false;
    this.dataRetencionesVentas = new MatTableDataSource<RetencionVenta>(this.recaudacion.retencionesVentas);
    this.dataRetencionesVentas.sort = this.sort;
    this.dataRetencionesVentas.paginator = this.paginator;
    this.calcular();
  }

  eliminarRetencionVenta(i: number) {
    if (confirm(constantes.pregunta_eliminar_retencion_venta)) {
      this.recaudacion.retencionesVentas.splice(i, 1);
      this.dataRetencionesVentas = new MatTableDataSource<RetencionVenta>(this.recaudacion.retencionesVentas);
      this.dataCompensaciones.sort = this.sort;
      this.dataCompensaciones.paginator = this.paginator;
      this.calcular();
    }
  }

  totalRetencionesVentas() {
    return this.recaudacion.retencionesVentas.map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
  }

  totalCreditos() {
    return 0;
  }

  calcular(){
    this.recaudacionService.calcular(this.recaudacion).subscribe(
      res => {
        this.recaudacion = res.resultado as Recaudacion;
        this.cheque.valor=this.recaudacion.credito.saldo;
	      this.deposito.valor=this.recaudacion.credito.saldo;
	      this.transferencia.valor=this.recaudacion.credito.saldo;
	      this.tarjetaCredito.valor=this.recaudacion.credito.saldo;
	      this.tarjetaDebito.valor=this.recaudacion.credito.saldo;
      }, err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  seleccionarEfectivo(){
    if (this.recaudacion.efectivo>=this.factura.totalConDescuento){
      this.recaudacion.cambio=Number(this.recaudacion.efectivo)-Number(this.factura.totalConDescuento);
      this.recaudacion.cambio=Number(this.recaudacion.cambio.toFixed(2));
    }
    this.calcular();
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.recaudacion.sesion = this.sesion;
    this.recaudacion.factura = this.factura;
    if (this.factura.totalConDescuento-this.recaudacion.total>0){
      if(this.recaudacion.credito.periodicidad=="" || this.recaudacion.credito.cuotas<1 
      || this.recaudacion.credito.fechaPrimeraCuota==null){
        Swal.fire(constantes.error, 'Por favor validar el credito', constantes.error_swal);
        return;
      }
    }
    this.recaudacionService.crear(this.recaudacion).subscribe(
      res => {
        this.recaudacion = res.resultado as Recaudacion;
        Swal.fire(constantes.error, "Se creo la recaudacion", constantes.error_swal);
        this.facturaService.enviarEventoEntrega(this.factura);
        this.stepper.next();
      }, err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizar(event){
    if (event!=null)
      event.preventDefault();
    this.recaudacionService.actualizar(this.recaudacion).subscribe(
      res => {
        this.recaudacion = res.resultado as Recaudacion;
        Swal.fire(constantes.exito, 'Se actualizo la Recaudacion', constantes.exito_swal);
        this.facturaService.enviarEventoEntrega(this.factura)
        this.stepper.next();
      }, err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  pad(numero:string, size:number): string {
    while (numero.length < size) numero = "0" + numero;
    return numero;
  }
  rellenarNumeroCheque(){
    this.cheque.numero= this.pad(this.cheque.numero, 13);
  }
  rellenarNumeroDeposito(){
    this.deposito.comprobante= this.pad(this.deposito.comprobante, 13);
  }
  rellenarNumeroTransferencia(){
    this.transferencia.comprobante= this.pad(this.transferencia.comprobante, 13);
  }

  defectoTransferencia(){
  }

  defectoTarjetaCredito(){
    this.tarjetaCredito.titular=true;
    this.tarjetaCredito.identificacion=this.factura.cliente.identificacion;
    this.tarjetaCredito.nombre=this.factura.cliente.razonSocial;
  }

  defectoTarjetaDebito(){
    this.tarjetaDebito.titular=true;
    this.tarjetaDebito.identificacion=this.factura.cliente.identificacion;
    this.tarjetaDebito.nombre=this.factura.cliente.razonSocial;
  }

  asignarTitularTarjetaCredito(){
    if (this.tarjetaCredito.titular){
      this.tarjetaCredito.identificacion=this.factura.cliente.identificacion;
      this.tarjetaCredito.nombre=this.factura.cliente.razonSocial;
      this.habilitarTitularTarjetaCredito=true;
    } else{
      this.tarjetaCredito.identificacion="";
      this.tarjetaCredito.nombre="";
      this.habilitarTitularTarjetaCredito=false;
    }
  }
  asignarTitularTarjetaDebito(){
    if (this.tarjetaDebito.titular){
      this.tarjetaDebito.identificacion=this.factura.cliente.identificacion;
      this.tarjetaDebito.nombre=this.factura.cliente.razonSocial;
      this.habilitarEditarTarjetaDebito=true;
    } else{
      this.tarjetaDebito.identificacion="";
      this.tarjetaDebito.nombre="";
      this.habilitarEditarTarjetaDebito=false;
    }
  }

  cambiarTipoPeriodicidad(){
    let parametro=new Parametro();
    parametro.tipo=this.recaudacion.credito.periodicidad;
    this.parametroService.obtenerTipo(parametro).subscribe(
      res => {
        parametro = res.resultado as Parametro
        this.recaudacion.credito.periodicidadNumero=Number(parametro.nombre);
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
    parametro.tipo=constantes.periodo+"_"+this.recaudacion.credito.periodicidad;
    this.parametroService.obtenerTipo(parametro).subscribe(
      res => {
        parametro = res.resultado as Parametro
        this.recaudacion.credito.periodicidadTotal=Number(parametro.nombre);
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  amortizacion(content: any){
    this.calcular();
    let fecha: Date=this.recaudacion.credito.fechaPrimeraCuota;
    this.creditoService.construir(this.recaudacion.credito).subscribe(
      res => {
        this.recaudacion.credito = res.resultado as Credito
        this.recaudacion.credito.fechaPrimeraCuota=fecha;
        this.modalService.open(content, { size: 'lg' }).result.then((result) => {
        }, (reason) => {
          console.log(`Dismissed ${this.getDismissReason(reason)}`);
        });
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  sinIntereses(){
    this.recaudacion.credito.tipo="";
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
