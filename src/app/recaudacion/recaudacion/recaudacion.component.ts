import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { DatePipe } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Recaudacion } from '../../modelos/recaudacion/recaudacion';
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
import { RecaudacionService } from '../../servicios/recaudacion/recaudacion.service';
import { Parametro } from '../../modelos/configuracion/parametro';
import { ParametroService } from '../../servicios/configuracion/parametro.service';
import { valores, mensajes, otras, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import { MatStepper } from '@angular/material/stepper';
import { FacturacionElectronicaService } from 'src/app/servicios/comprobante/factura-eletronica.service';
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

  panelRecaudacion=false;
  panelCheques=false;
  panelDepositos=false;
  panelTransferencias=false;
  panelTarjetasCredito=false;
  panelTarjetasDebito=false;

  recaudado = valores.recaudado;
  noRecaudado = valores.noRecaudado;

  constructor(private facturaService: FacturaService, private facturacionElectronicaService: FacturacionElectronicaService, private clienteService: ClienteService, private bancoService: BancoService, private sesionService: SesionService,
    private cuentaPropiaService: CuentaPropiaService, private operadorTarjetaService: OperadorTarjetaService, private datePipe: DatePipe,
    private franquiciaTarjetaService: FranquiciaTarjetaService, private formaPagoService: FormaPagoService,
    private parametroService: ParametroService, private recaudacionService: RecaudacionService, private modalService: NgbModal, private router: Router) { }

  recaudacion: Recaudacion = new Recaudacion();
  cheque: Cheque = new Cheque();
  deposito: Deposito=new Deposito();
  transferencia: Transferencia=new Transferencia();
  tarjetaDebito: TarjetaDebito=new TarjetaDebito();
  tarjetaCredito: TarjetaCredito=new TarjetaCredito();
  periodicidades: Parametro[];
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

  sesion: Sesion;

  indiceEditar: number=-1;
  habilitarEditarCheque: boolean= false;
  habilitarEditarDeposito: boolean= false;
  habilitarEditarTransferencia: boolean= false;
  habilitarEditarTarjetaCredito: boolean= false;
  habilitarEditarTarjetaDebito: boolean= false;
  habilitarTitularTarjetaDebito: boolean=true;
  habilitarTitularTarjetaCredito: boolean= true;
  

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarCuentasPropias();
    this.consultarFranquiciasTarjetas();
    this.consultarOperadoresTarjetasCreditos();
    this.consultarOperadoresTarjetasDebitos();
    this.consultarPeriodicidades();
    this.consultarBancosCheques();
    this.consultarBancosDepositos();
    this.consultarBancosTransferencias();
    this.consultarBancosTarjetasCreditos();
    this.consultarBancosTarjetasDebitos();

    this.facturaService.eventoRecaudacion.subscribe((data: number) => {
        this.recaudacionService.obtenerPorFactura(data).subscribe(
          res => {
            if(res.resultado != null){
              this.recaudacion = res.resultado as Recaudacion;
              this.cargar();
            }
            if(res.resultado == null){
              this.facturaService.obtener(data).subscribe({
                next: res => {
                  this.recaudacion.factura = res.resultado as Factura;
                  this.cargar();
                },
                error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
              });
            }
          },
          err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        );
    });
    
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
        map(bancoDeposito => typeof bancoDeposito === 'string' ? this.filtroBancoDeposito(bancoDeposito) : this.bancosDepositos.slice())
      );
    this.filtroBancosTransferencias = this.seleccionBancoTransferencia.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(bancoTransferencia => typeof bancoTransferencia === 'string' ? this.filtroBancoTransferencia(bancoTransferencia) : this.bancosTransferencias.slice())
      );
    this.filtroBancosTarjetasCreditos = this.seleccionBancoTarjetaCredito.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(bancoTarjetaCredito => typeof bancoTarjetaCredito === 'string' ? this.filtroBancoTarjetaCredito(bancoTarjetaCredito) : this.bancosTarjetasCreditos.slice())
      );
    this.filtroBancosTarjetasDebitos = this.seleccionBancoTarjetaDebito.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(bancoTarjetaDebito => typeof bancoTarjetaDebito === 'string' ? this.filtroBancoTarjetaDebito(bancoTarjetaDebito) : this.bancosTarjetasDebitos.slice())
      );
  }

  cargar(){
    if(this.recaudacion.cheques.length > valores.cero){
      this.habilitarSeccionPago(otras.formasPagos[0]);
      this.dataCheques = new MatTableDataSource<Cheque>(this.recaudacion.cheques);
    }
    if(this.recaudacion.depositos.length > valores.cero){
      this.habilitarSeccionPago(otras.formasPagos[1]);
      this.dataDepositos = new MatTableDataSource<Deposito>(this.recaudacion.depositos);
    }
    if(this.recaudacion.transferencias.length > valores.cero){
      this.habilitarSeccionPago(otras.formasPagos[2]);
      this.dataTransferencias = new MatTableDataSource<Transferencia>(this.recaudacion.transferencias);
    }
    if(this.recaudacion.tarjetasCreditos.length > valores.cero){
      this.habilitarSeccionPago(otras.formasPagos[3]);
      this.dataTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.recaudacion.tarjetasCreditos);
    }
    if(this.recaudacion.tarjetasDebitos.length > valores.cero){
      this.habilitarSeccionPago(otras.formasPagos[4]);
      this.dataTarjetasDebitos = new MatTableDataSource<TarjetaDebito>(this.recaudacion.tarjetasDebitos);
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
    if (this.recaudacion.total+Number(this.cheque.valor)<=this.recaudacion.factura.totalConDescuento && this.seleccionBancoCheque.value!=null && this.cheque.tipo!=null) {
      this.cheque.banco=this.seleccionBancoCheque.value;
      this.recaudacion.cheques.push(this.cheque);
      this.recaudacion.totalCheques;
      this.cheque=new Cheque();
      this.seleccionBancoCheque.patchValue("");
      this.dataCheques = new MatTableDataSource<Cheque>(this.recaudacion.cheques);
      this.dataCheques.sort = this.sort;
      this.dataCheques.paginator = this.paginator;
    } else {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
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
    if (confirm(otras.pregunta_eliminar_cheque)) {
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
    if (this.recaudacion.total+Number(this.deposito.valor)<=this.recaudacion.factura.totalConDescuento){
      this.deposito.banco=this.seleccionBancoDeposito.value;
      this.recaudacion.depositos.push(this.deposito);
      this.deposito=new Deposito();
      this.seleccionBancoDeposito.patchValue("");
      this.dataDepositos = new MatTableDataSource<Deposito>(this.recaudacion.depositos);
      this.dataDepositos.sort = this.sort;
      this.dataDepositos.paginator = this.paginator;
    } else {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
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
    if (confirm(otras.pregunta_eliminar_deposito)) {
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
    if (this.recaudacion.total+Number(this.transferencia.valor)<=this.recaudacion.factura.totalConDescuento){
      this.transferencia.banco=this.seleccionBancoTransferencia.value;
      this.recaudacion.transferencias.push(this.transferencia);
      this.transferencia=new Transferencia();
      this.seleccionBancoTransferencia.patchValue("");
      this.dataTransferencias = new MatTableDataSource<Transferencia>(this.recaudacion.transferencias);
      this.dataTransferencias.sort = this.sort;
      this.dataTransferencias.paginator = this.paginator;
    } else {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
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
    if (confirm(otras.pregunta_eliminar_transferencia)) {
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
    if (this.recaudacion.total+Number(this.tarjetaCredito.valor)<=this.recaudacion.factura.totalConDescuento){
      this.tarjetaCredito.banco=this.seleccionBancoTarjetaCredito.value;
      this.recaudacion.tarjetasCreditos.push(this.tarjetaCredito);
      this.tarjetaCredito=new TarjetaCredito();
      this.seleccionBancoTarjetaCredito.patchValue("");
      this.dataTarjetasCreditos = new MatTableDataSource<TarjetaCredito>(this.recaudacion.tarjetasCreditos);
      this.dataTarjetasCreditos.sort = this.sort;
      this.dataTarjetasCreditos.paginator = this.paginator;
    } else {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
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
    if (confirm(otras.pregunta_eliminar_tarjeta_credito)) {
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
    if (this.recaudacion.total+Number(this.tarjetaDebito.valor)<=this.recaudacion.factura.totalConDescuento){
      this.tarjetaDebito.banco=this.seleccionBancoTarjetaDebito.value;
      this.recaudacion.tarjetasDebitos.push(this.tarjetaDebito);
      this.tarjetaDebito=new TarjetaDebito();
      this.seleccionBancoTarjetaDebito.setValue(null);
      this.dataTarjetasDebitos = new MatTableDataSource<TarjetaDebito>(this.recaudacion.tarjetasDebitos);
      this.dataTarjetasDebitos.sort = this.sort;
      this.dataTarjetasDebitos.paginator = this.paginator;
    } else {
      Swal.fire(error, mensajes.error_agregar_recaudacion, error_swal);
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
    if (confirm(otras.pregunta_eliminar_tarjeta_debito)) {
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
    this.recaudacionService.calcular(this.recaudacion).subscribe(
      res => {
        this.recaudacion = res.resultado as Recaudacion;
        this.cheque.valor=this.recaudacion.porPagar;
	      this.deposito.valor=this.recaudacion.porPagar;
	      this.transferencia.valor=this.recaudacion.porPagar;
	      this.tarjetaCredito.valor=this.recaudacion.porPagar;
	      this.tarjetaDebito.valor=this.recaudacion.porPagar;
      }, err => Swal.fire(error, err.error.mensaje, error_swal)
    );
  }

  seleccionarEfectivo(){
    this.calcular();
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
    let facturaId = this.recaudacion.factura.id;
    this.facturaService.obtener(facturaId).subscribe({
      next: res => {
        this.recaudacion = new Recaudacion();
        this.recaudacion.factura = res.resultado as Factura;
        this.cargar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.recaudacion.sesion = this.sesion;
    this.recaudacionService.crear(this.recaudacion).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.recaudacion = res.resultado as Recaudacion;
      }, 
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event){
    if (event!=null)
      event.preventDefault();
    this.recaudacionService.actualizar(this.recaudacion).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.facturaService.enviarEventoEntrega(res.resultado.id);
        this.stepper.next();
      }, 
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
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
    this.tarjetaCredito.identificacion=this.recaudacion.factura.cliente.identificacion;
    this.tarjetaCredito.nombre=this.recaudacion.factura.cliente.razonSocial;
  }

  defectoTarjetaDebito(){
    this.tarjetaDebito.titular=true;
    this.tarjetaDebito.identificacion=this.recaudacion.factura.cliente.identificacion;
    this.tarjetaDebito.nombre=this.recaudacion.factura.cliente.razonSocial;
  }

  asignarTitularTarjetaCredito(){
    if (this.tarjetaCredito.titular){
      this.tarjetaCredito.identificacion=this.recaudacion.factura.cliente.identificacion;
      this.tarjetaCredito.nombre=this.recaudacion.factura.cliente.razonSocial;
      this.habilitarTitularTarjetaCredito=true;
    } else{
      this.tarjetaCredito.identificacion = valores.vacio;
      this.tarjetaCredito.nombre = valores.vacio;
      this.habilitarTitularTarjetaCredito=false;
    }
  }
  asignarTitularTarjetaDebito(){
    if (this.tarjetaDebito.titular){
      this.tarjetaDebito.identificacion=this.recaudacion.factura.cliente.identificacion;
      this.tarjetaDebito.nombre=this.recaudacion.factura.cliente.razonSocial;
      this.habilitarTitularTarjetaDebito=true;
    } else{
      this.tarjetaDebito.identificacion = valores.vacio;
      this.tarjetaDebito.nombre = valores.vacio;
      this.habilitarEditarTarjetaDebito=false;
    }
  }

  crearFacturaElectronica(event){
    if (event != null)
      event.preventDefault();
    this.facturacionElectronicaService.enviar(this.recaudacion.factura).subscribe(
      res => {
        let respuesta = res.resultado as String;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
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
