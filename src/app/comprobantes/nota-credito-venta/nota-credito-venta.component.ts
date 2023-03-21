import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { startWith, map } from 'rxjs/operators';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Sesion } from '../../modelos/usuario/sesion';
import { valores, validarSesion, otras, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { ClienteService } from 'src/app/servicios/cliente/cliente.service';
import { Cliente } from 'src/app/modelos/cliente/cliente';
import { NotaCreditoVentaLinea } from 'src/app/modelos/comprobante/nota-credito-venta-linea';
import { NotaCreditoVenta } from 'src/app/modelos/comprobante/nota-credito-venta';
import { NotaCreditoVentaService } from 'src/app/servicios/comprobante/nota-credito-venta.service';
import { Factura } from 'src/app/modelos/comprobante/factura';
import { FacturaService } from 'src/app/servicios/comprobante/factura.service';
import { NotaCreditoElectronicaService } from 'src/app/servicios/comprobante/nota-credito-eletronica.service';

@Component({
  selector: 'app-nota-credito-venta',
  templateUrl: './nota-credito-venta.component.html',
  styleUrls: ['./nota-credito-venta.component.scss']
})
export class NotaCreditoVentaComponent implements OnInit {

  panelOpenState = false;

  deshabilitarDevolucion = true;
  deshabilitarDescuento = true;

  devolucion = valores.devolucion;
  descuento = valores.descuento;
  conjunta = valores.conjunta;

  si = valores.si;
  no = valores.no;
  emitida = valores.emitida;
  anulada = valores.anulada;
  noFacturada = valores.noFacturada;
  facturada = valores.facturada;
  noRecaudada = valores.noRecaudada;
  recaudada = valores.recaudada;
  
  seleccionCliente = new UntypedFormControl();
  filtroClientes: Observable<Cliente[]> = new Observable<Cliente[]>();
  clientes: Cliente[] = [];
  seleccionFactura = new UntypedFormControl();
  filtroFacturas: Observable<Factura[]> = new Observable<Factura[]>();
  facturas: Factura[] = [];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: NotaCreditoVenta) => `${row.codigo}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: NotaCreditoVenta) => `${row.fecha}`},
    { nombreColumna: 'cliente', cabecera: 'Cliente', celda: (row: NotaCreditoVenta) => `${row.factura.cliente.razonSocial}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaCreditoVenta) => `$${row.totalConDescuento}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: NotaCreditoVenta) => `${row.estado}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<NotaCreditoVenta>;
  clickedRows = new Set<NotaCreditoVenta>();
  abrirPanelAdmin = false;
  notasCreditosVentas: NotaCreditoVenta[] = [];
  
  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("paginatorLinea") paginatorLinea: MatPaginator;

  notaCreditoVenta: NotaCreditoVenta = new NotaCreditoVenta();
  notaCreditoVentaLinea: NotaCreditoVentaLinea = new NotaCreditoVentaLinea();

  columnasLinea: string[] = ["codigo", 'nombre', 'medida', 'cantidad', 'devolucion', 'costoUnitario', 'valorDescuento', 'porcentajeDescuento', 'impuesto', 'bodega', 'total'];
  dataSourceLinea = new MatTableDataSource<NotaCreditoVentaLinea>(this.notaCreditoVenta.notaCreditoVentaLineas);
  sesion: Sesion;

  constructor(private clienteService: ClienteService, private sesionService: SesionService, private notaCreditoElectronicaService: NotaCreditoElectronicaService,
    private router: Router, private notaCreditoVentaService: NotaCreditoVentaService, private facturaService: FacturaService,
    private modalService: NgbModal) { }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G") //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N") //ASHIFT + N
      this.nuevo(null);
  }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
    this.consultarClientes();
    this.filtroClientes = this.seleccionCliente.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(cliente => typeof cliente === 'string' ? this.filtroCliente(cliente) : this.clientes.slice())
      );
    this.filtroFacturas = this.seleccionFactura.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(factura => typeof factura === 'string' ? this.filtroFactura(factura) : this.facturas.slice())
      );
  }
  
  private filtroCliente(value: string): Cliente[] {
    if(this.clientes.length > 0) {
      const filterValue = value.toLowerCase();
      return this.clientes.filter(cliente => cliente.razonSocial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verCliente(cliente: Cliente): string {
    return cliente && cliente.razonSocial ? cliente.razonSocial : '';
  }

  private filtroFactura(value: string): Factura[] {
    if(this.facturas.length > 0) {
      const filterValue = value.toLowerCase();
      return this.facturas.filter(factura => factura.secuencia.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verFactura(factura: Factura): string {
    return factura && factura.secuencia ? factura.secuencia : '';
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
    this.notaCreditoVenta = new NotaCreditoVenta();
    this.seleccionCliente.patchValue(valores.vacio);
    this.seleccionFactura.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<NotaCreditoVentaLinea>([]);
    this.clickedRows.clear();
  }

  construirFactura() {
    if (this.notaCreditoVenta.id != valores.cero) {
      this.seleccionCliente.patchValue(this.notaCreditoVenta.factura.cliente);
      this.seleccionFactura.patchValue(this.notaCreditoVenta.factura);
      this.dataSourceLinea = new MatTableDataSource<NotaCreditoVentaLinea>(this.notaCreditoVenta.notaCreditoVentaLineas);
      this.dataSourceLinea.paginator = this.paginatorLinea;
    }
  }

  consultar() {
    this.notaCreditoVentaService.consultar().subscribe(
      res => {
        this.notasCreditosVentas = res.resultado as NotaCreditoVenta[]
        this.dataSource = new MatTableDataSource(this.notasCreditosVentas);
        this.dataSource.paginator = this.paginator;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarClientes(){
    this.clienteService.consultar().subscribe(
      res => {
        this.clientes = res.resultado as Cliente[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  seleccionarCliente() {
    let clienteId = this.seleccionCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe(
      res => {
        this.notaCreditoVenta.factura.cliente = res.resultado as Cliente;
        this.seleccionCliente.patchValue(this.notaCreditoVenta.factura.cliente);
        this.facturaService.consultarPorCliente(this.notaCreditoVenta.factura.cliente.id).subscribe(
          res => {
            this.facturas = res.resultado as Factura[]
          },
          err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        );
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarFactura() {
    let facturaId = this.seleccionFactura.value.id;
    this.notaCreditoVentaService.obtenerPorFactura(facturaId).subscribe(
      res => {
        this.notaCreditoVenta = res.resultado as NotaCreditoVenta;
        this.seleccionFactura.patchValue(this.notaCreditoVenta.factura);
        this.dataSourceLinea = new MatTableDataSource(this.notaCreditoVenta.notaCreditoVentaLineas);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarOperacion(){
    if(this.notaCreditoVenta.operacion == valores.devolucion){
      this.deshabilitarDevolucion = false;
      this.deshabilitarDescuento = true;
    }
    if(this.notaCreditoVenta.operacion == valores.descuento){
      this.deshabilitarDevolucion = true;
      this.deshabilitarDescuento = false;
    }
    if(this.notaCreditoVenta.operacion == valores.conjunta){
      this.deshabilitarDevolucion = false;
      this.deshabilitarDescuento = false;
    }
  }

  seleccionarDevolucion() {
    this.calcular();
  }
  
  seleccionarValorDescuentoLinea() {
    this.calcular();
  }

  seleccionarPorcentajeDescuentoLinea() {
    this.calcular();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.notaCreditoVenta.sesion=this.sesion;
    this.notaCreditoVentaService.crear(this.notaCreditoVenta).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event){
    if (event!=null)
      event.preventDefault();
    this.notaCreditoVentaService.actualizar(this.notaCreditoVenta).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);        
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.notaCreditoVentaService.activar(this.notaCreditoVenta).subscribe({
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
    this.notaCreditoVentaService.inactivar(this.notaCreditoVenta).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccion(notaCreditoCompra: any) {
    if (!this.clickedRows.has(notaCreditoCompra)){
      this.clickedRows.clear();
      this.clickedRows.add(notaCreditoCompra);
      this.notaCreditoVentaService.obtener(notaCreditoCompra.id).subscribe({
        next: res => {
          this.notaCreditoVenta = res.resultado as NotaCreditoVenta;
          this.seleccionCliente.patchValue(this.notaCreditoVenta.factura.cliente);
          this.seleccionFactura.patchValue(this.notaCreditoVenta.factura);
          this.dataSourceLinea = new MatTableDataSource<NotaCreditoVentaLinea>(this.notaCreditoVenta.notaCreditoVentaLineas);
        },
        error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      });
    } else {
      this.clickedRows.clear();
      this.notaCreditoVenta = new NotaCreditoVenta();
    }
  }

  calcular(){
    this.notaCreditoVentaService.calcular(this.notaCreditoVenta).subscribe(
      res => {
        this.notaCreditoVenta = res.resultado as NotaCreditoVenta;
        this.dataSourceLinea = new MatTableDataSource<NotaCreditoVentaLinea>(this.notaCreditoVenta.notaCreditoVentaLineas);
        this.dataSourceLinea.paginator = this.paginatorLinea;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarValorDescuentoTotal(){
    this.calcular(); 
  }
  seleccionarPorcentajeDescuentoTotal(){
    this.calcular();   
  }

  crearNotaCreditoElectronica(event){
    if (event != null)
      event.preventDefault();
    this.notaCreditoElectronicaService.enviar(this.notaCreditoVenta.id).subscribe(
      res => {
        let respuesta = res.resultado as String;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

}
