import { Component, HostListener, OnInit, ViewChild, Type, ElementRef, Renderer2 } from '@angular/core';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { Router } from '@angular/router';
import { map, startWith, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

import { DatePipe } from '@angular/common';

import { TabService } from '../../../servicios/comun/tab/tab.service';
import { FooterComponent } from "../../comun/footer/footer.component";
import { ClienteComponent } from '../../cliente/cliente/cliente.component';
import { ProductoComponent } from '../../inventario/producto/producto.component';
import { RecaudacionComponent } from '../../recaudacion/recaudacion/recaudacion.component';

import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Empresa } from '../../../modelos/usuario/empresa';
import { Factura } from '../../../modelos/venta/factura';
import { FacturaService } from '../../../servicios/venta/factura.service';
import { FacturaElectronicaService } from 'src/app/servicios/venta/factura-eletronica.service';
import { Cliente } from '../../../modelos/cliente/cliente';
import { ClienteService } from '../../../servicios/cliente/cliente.service';
import { FacturaLinea } from '../../../modelos/venta/factura-linea';
import { Producto } from '../../../modelos/inventario/producto';
import { ProductoService } from '../../../servicios/inventario/producto.service';
import { Impuesto } from '../../../modelos/inventario/impuesto';
import { ImpuestoService } from '../../../servicios/inventario/impuesto.service';
import { Bodega } from '../../../modelos/inventario/bodega';
import { BodegaService } from '../../../servicios/inventario/bodega.service';
import { Kardex } from '../../../modelos/inventario/kardex';
import { KardexService } from '../../../servicios/inventario/kardex.service';

import { MatStepper } from '@angular/material/stepper';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss']
})

export class FacturaComponent implements OnInit {

  estadoActivo = valores.estadoActivo;
  estadoInactivo = valores.estadoInactivo;
  estadoInternoEmitida = valores.estadoInternoEmitida;
  estadoInternoRecaudada = valores.estadoInternoRecaudada;
  estadoInternoAnulada = valores.estadoInternoAnulada
  estadoSriPendiente = valores.estadoSriPendiente;
  estadoSriAutorizada = valores.estadoSriAutorizada;
  estadoSriAnulada = valores.estadoSriAnulada;
  si = valores.si;
  no = valores.no;
  categoriaProducto = valores.bien;
  saldo = valores.cero;
  saldoTotal = valores.cero;
  costoUnitario = valores.cero;
  costoPromedio = valores.cero;
  precioVentaPublicoManual = valores.cero;
  indiceLinea: number;

  steeperLinear: boolean = false;
  steeperEditable: boolean = true;
  abrirPanelFacturaCliente: boolean = true;
  abrirPanelFacturaLinea: boolean = false;
  abrirPanelAdminFactura: boolean = true;
  verIconoEditarLinea: boolean = false;
  esBien: boolean = true;

  hoy: Date = new Date();
  fechaMinima: Date = new Date();

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  factura: Factura = new Factura();
  facturaLinea: FacturaLinea = new FacturaLinea();
  kardex: Kardex = new Kardex();

  clientes: Cliente[] = [];
  productos: Producto[] = [];
  facturas: Factura[];
  bodegas: Bodega[] = [];
  impuestos: Impuesto[];

  facturacionSteeperFormGroup: UntypedFormGroup;
  recaudacionSteeperFormGroup: UntypedFormGroup;

  controlProducto = new UntypedFormControl();
  controlIdentificacionCliente = new UntypedFormControl();
  controlRazonSocialCliente = new UntypedFormControl();

  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();
  filtroIdentificacionClientes: Observable<Cliente[]> = new Observable<Cliente[]>();
  filtroRazonSocialClientes: Observable<Cliente[]> = new Observable<Cliente[]>();

  columnasFactura: any[] = [
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: Factura) => `${this.datepipe.transform(row.fecha, "dd-MM-yyyy")}` },
    { nombreColumna: 'comprobante', cabecera: 'Comprobante', celda: (row: Factura) => `${row.numeroComprobante}` },
    { nombreColumna: 'cliente', cabecera: 'Cliente', celda: (row: Factura) => `${row.cliente.razonSocial}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: Factura) => `$${row.valorTotal}` },
    { nombreColumna: 'proceso', cabecera: 'Proceso', celda: (row: Factura) => `${row.estadoInterno}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Factura) => `${row.estado}` },
    { nombreColumna: 'estadoSri', cabecera: 'Estado SRI', celda: (row: Factura) => `${row.estadoSri}` }
  ];
  cabeceraFactura: string[] = this.columnasFactura.map(titulo => titulo.nombreColumna);
  dataSourceFactura: MatTableDataSource<Factura>;
  clickedRowsFactura = new Set<Factura>();

  columnasLinea: any[] = [
    { nombreColumna: 'nombre', cabecera: 'Producto', celda: (row: FacturaLinea) => `${row.producto.nombre}` },
    { nombreColumna: 'medida', cabecera: 'Medida', celda: (row: FacturaLinea) => `${row.producto.medida.abreviatura}` },
    { nombreColumna: 'cantidad', cabecera: 'Cant.', celda: (row: FacturaLinea) => `${row.cantidad}` },
    { nombreColumna: 'valor', cabecera: 'P. Unit', celda: (row: FacturaLinea) => `${row.precioUnitario}` },
    { nombreColumna: 'descuento', cabecera: 'Desc. $', celda: (row: FacturaLinea) => `${row.valorDescuentoLinea}` },
    { nombreColumna: 'descuentoPorcentaje', cabecera: 'Desc. %', celda: (row: FacturaLinea) => `${row.porcentajeDescuentoLinea} %` },
    { nombreColumna: 'subtotal', cabecera: 'Subtotal', celda: (row: FacturaLinea) => `${row.subtotalLinea}` },
    { nombreColumna: 'iva', cabecera: 'IVA', celda: (row: FacturaLinea) => `${row.importeIvaLinea}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: FacturaLinea) => `${row.totalLinea}` },
    { nombreColumna: 'entregado', cabecera: 'Entreg.', celda: (row: FacturaLinea) => `${row.entregado}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones' }
  ];
  cabeceraLinea: string[] = this.columnasLinea.map(titulo => titulo.nombreColumna);
  dataSourceLinea: MatTableDataSource<FacturaLinea> = new MatTableDataSource<FacturaLinea>(this.factura.facturaLineas);
  clickedRowsLinea = new Set<FacturaLinea>();

  piePagina: Type<any> = FooterComponent;

  @ViewChild(RecaudacionComponent) recaudacionComponent: RecaudacionComponent;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorLinea') paginatorLinea: MatPaginator;
  @ViewChild('matSort') sort: MatSort;
  @ViewChild('matSortLinea') sortLinea: MatSort;
  @ViewChild('inputFiltro') inputFiltro: ElementRef;
  @ViewChild('inputFiltroLinea') inputFiltroLinea: ElementRef;
  
  @HostListener('window:keypress', ['$event'])
    keyEvent($event: KeyboardEvent) {
      if (($event.shiftKey || $event.metaKey) && $event.key == "G") //SHIFT + G
        this.crear(null);
      if (($event.shiftKey || $event.metaKey) && $event.key == "N") //ASHIFT + N
        this.nuevo();
      if (($event.shiftKey || $event.metaKey) && $event.key == "A") // SHIFT + A
        this.crearFacturaLinea();
    }

  constructor(private renderer: Renderer2, private clienteService: ClienteService, private sesionService: SesionService,
    private impuestoService: ImpuestoService, private router: Router, private datepipe: DatePipe, 
    private facturaService: FacturaService, private facturaElectronicaService: FacturaElectronicaService,
    private productoService: ProductoService, private bodegaService: BodegaService, private kardexService: KardexService,
    private tabService: TabService, private _formBuilder: UntypedFormBuilder, private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.empresa;
    this.fechaMinima = new Date(this.fechaMinima.setDate(this.hoy.getDate() - 3))
    this.factura.establecimiento = this.sesion.usuario.estacion.establecimiento.codigoSRI;
    this.factura.puntoVenta = this.sesion.usuario.estacion.codigoSRI;
    this.consultar();
    this.consultarClientes();
    this.consultarProductos();
    this.consultarImpuestos();
    this.consultarBodegas();
    this.inicializarSteeper();
    this.inicializarFiltros();
  }

  consultarClientes() {
    this.clienteService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.clientes = res.resultado as Cliente[]
        this.factura.cliente = this.clientes[0];
        this.controlIdentificacionCliente.patchValue(this.factura.cliente);
        this.controlRazonSocialCliente.patchValue(this.factura.cliente);
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }
  consultarProductos() {
    this.productoService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.productos = res.resultado as Producto[];
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    })
  }
  consultarImpuestos() {
    this.impuestoService.consultarPorEstado(valores.estadoActivo).subscribe({
      next: res => {
        this.impuestos = res.resultado as Impuesto[]
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }
  consultarBodegas() {
    this.bodegaService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.bodegas = res.resultado as Bodega[]
        this.facturaLinea.bodega = this.bodegas[0];
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  nuevo() {
    this.factura = new Factura();
    this.hoy = new Date();
    this.factura.fecha = this.hoy;
    this.factura.establecimiento = this.sesion.usuario.estacion.establecimiento.codigoSRI;
    this.factura.puntoVenta = this.sesion.usuario.estacion.codigoSRI;
    this.controlIdentificacionCliente.patchValue(valores.vacio);
    this.controlRazonSocialCliente.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<FacturaLinea>([]);
    this.clickedRowsFactura.clear();
    this.nuevoFacturaLinea();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;  
    this.spinnerService.show();    
    this.factura.sesion = this.sesion;
    this.factura.empresa = this.empresa;
    this.facturaService.crear(this.factura).subscribe({
      next: res => {
        this.factura = res.resultado as Factura;
        this.consultar();
        this.spinnerService.hide();  
        this.stepper.next();
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
    if (!this.validarFormulario())
      return;  
    this.spinnerService.show();
    this.facturaElectronicaService.enviar(this.factura.id).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.factura = res.resultado as Factura;
        this.consultar();
        this.nuevo();
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

  obtenerTicket(event){
    if (event != null)
      event.preventDefault();
    this.facturaElectronicaService.obtenerTicket(this.factura.id);
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.spinnerService.show();    
    this.facturaService.actualizar(this.factura).subscribe({
      next: res => {
        this.factura = res.resultado as Factura;
        this.consultar();
        this.spinnerService.hide();  
        this.stepper.next();
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.spinnerService.hide();
      }  
    });
  }

  actualizarRecaudacion(event: Factura){
    if (event){
      this.factura = event;
      this.llenarFecha();
      this.factura.estado = event.estado;
    }
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.facturaService.activar(this.factura).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inactivar(event) {
    if (event != null)
      event.preventDefault();
    this.facturaService.inactivar(this.factura).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.facturaService.consultarPorEmpresa(this.empresa.id).subscribe({
      next: res => {
        this.facturas = res.resultado as Factura[];
        this.llenarTablaFactura(this.facturas);
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  llenarTablaFactura(facturas: Factura[]) {
    this.dataSourceFactura = new MatTableDataSource(facturas);
    this.dataSourceFactura.filterPredicate = (data: Factura, filter: string): boolean =>
      this.datepipe.transform(data.fecha, "dd-MM-yyyy").includes(filter) || data.numeroComprobante.includes(filter) || data.secuencial.includes(filter) || 
      data.cliente.razonSocial.includes(filter) || data.estadoInterno.includes(filter) || data.estado.includes(filter) || data.estadoSri.includes(filter);
    this.dataSourceFactura.paginator = this.paginator;
    this.dataSourceFactura.sort = this.sort;
  }

  seleccion(factura: any) {
    if (!this.clickedRowsFactura.has(factura)) {
      this.clickedRowsFactura.clear();
      this.clickedRowsFactura.add(factura);
      this.obtenerFactura(factura.id)
    } else {
      this.nuevo();
    }
  }

  obtenerFactura(id: number) {
    this.facturaService.obtener(id).subscribe({
      next: res => {
        this.factura = res.resultado as Factura;
        this.construir();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarFecha() {
    let fecha = new Date(this.factura.fecha);
    this.factura.fecha = fecha;
  }

  construir() {
    this.controlIdentificacionCliente.patchValue(this.factura.cliente);
    this.controlRazonSocialCliente.patchValue(this.factura.cliente);
    this.llenarFecha();
    this.llenarTablaFacturaLinea(this.factura.facturaLineas);
  }

  filtroFactura(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFactura.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceFactura.paginator) {
      this.dataSourceFactura.paginator.firstPage();
    }
  }
  borrarFiltroFactura() {
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', '');
    this.dataSourceFactura.filter = '';
  }

  seleccionarRazonSocialCliente() {
    let clienteId = this.controlRazonSocialCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe({
      next: res => {
        Object.assign(this.factura.cliente, res.resultado as Cliente);
        this.controlIdentificacionCliente.patchValue(this.factura.cliente);
        this.controlRazonSocialCliente.patchValue(this.factura.cliente);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  borrarRazonSocial(){
    this.controlIdentificacionCliente.patchValue(valores.vacio);
    this.controlRazonSocialCliente.patchValue(valores.vacio);
  }

  seleccionarIdentificacionCliente() {
    let clienteId = this.controlIdentificacionCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe({
      next: res => {
        Object.assign(this.factura.cliente, res.resultado as Cliente);
        this.controlIdentificacionCliente.patchValue(this.factura.cliente);
        this.controlRazonSocialCliente.patchValue(this.factura.cliente);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  //CRUD FACTURA LINEA
  nuevoFacturaLinea() {
    this.facturaLinea = new FacturaLinea();
    this.kardex = new Kardex();
    this.precioVentaPublicoManual = valores.cero;
    this.controlProducto.patchValue(valores.vacio);
    this.clickedRowsLinea.clear();
    this.verIconoEditarLinea = false;
  }

  crearFacturaLinea() {
    if (!this.validarFormularioLinea())
      return;
    this.spinnerService.show();  
    this.factura.sesion = this.sesion;
    this.factura.facturaLineas.push(this.facturaLinea);
    this.facturaService.calcular(this.factura).subscribe({
      next: res => {
        this.factura = res.resultado as Factura;
        this.construir();
        this.nuevoFacturaLinea();
        this.spinnerService.hide();
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.spinnerService.hide();
      }  
    });
  }

  actualizarFacturaLinea() {
    this.factura.facturaLineas[this.indiceLinea] = this.facturaLinea;
    this.llenarTablaFacturaLinea(this.factura.facturaLineas);
    this.calcular();
    this.nuevoFacturaLinea();
    this.verIconoEditarLinea = false;
  }

  eliminarFacturaLinea(i: number) {
    this.factura.facturaLineas.splice(i, 1);
    this.calcular();
    this.nuevoFacturaLinea();
  }

  llenarTablaFacturaLinea(facturaLineas: FacturaLinea[]) {
    this.dataSourceLinea = new MatTableDataSource(facturaLineas);
    this.dataSourceLinea.filterPredicate = (data: FacturaLinea, filter: string): boolean =>
      data.producto.nombre.includes(filter) || data.producto.medida.abreviatura.includes(filter) || String(data.cantidad).includes(filter) || 
      String(data.precioUnitario).includes(filter) || String(data.subtotalLinea).includes(filter) || data.entregado.includes(filter);
    this.dataSourceLinea.paginator = this.paginatorLinea;
    this.dataSourceLinea.sort = this.sortLinea;
  }

  seleccionFacturaLinea(facturaLinea: FacturaLinea, i:number) {
    if (!this.clickedRowsLinea.has(facturaLinea)) {
      this.clickedRowsLinea.clear();
      this.clickedRowsLinea.add(facturaLinea);
      this.facturaLinea = { ...facturaLinea };
      this.indiceLinea = i;
      this.construirFacturaLinea();
      this.verIconoEditarLinea = true;
    } else {
      this.nuevoFacturaLinea();
    }
  }

  construirFacturaLinea(){
    this.controlProducto.patchValue(this.facturaLinea.producto);
    this.precioVentaPublicoManual = parseFloat((this.facturaLinea.precioUnitario+(this.facturaLinea.precioUnitario*this.facturaLinea.impuesto.porcentaje/100)).toFixed(2));
  }

  filtroFacturaLinea(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceLinea.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceLinea.paginator) {
      this.dataSourceLinea.paginator.firstPage();
    }
  }
  borrarFiltroFacturaLinea() {
    this.renderer.setProperty(this.inputFiltroLinea.nativeElement, 'value', '');
    this.dataSourceLinea.filter = '';
  }

  calcularLinea() {
    if (!this.validarFormularioLinea())
      return;
    this.facturaLinea.precioUnitario = Number((this.precioVentaPublicoManual * 100 / (100 + this.facturaLinea.impuesto.porcentaje)).toFixed(4));
    this.facturaService.calcularLinea(this.facturaLinea).subscribe({
      next: res => {
        this.facturaLinea = res.resultado as FacturaLinea;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  calcular() {
    this.facturaService.calcular(this.factura).subscribe({
      next: res => {
        this.factura = res.resultado as Factura;
        this.llenarTablaFacturaLinea(this.factura.facturaLineas);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarProducto() {
    this.facturaLinea.producto = this.controlProducto.value;
    this.facturaLinea.impuesto = this.facturaLinea.producto.impuesto;
    if (this.facturaLinea.producto.categoriaProducto.id == 1){
      this.esBien = true } else { this.esBien = false };
    if (this.facturaLinea.producto.id == valores.cero || this.factura.cliente.id == valores.cero) {
      return;
    }
    this.inicializarOpciones(); // Error si no tiene bodega
    for (let precio of this.facturaLinea.producto.precios) {
      if (precio.segmento.id == this.factura.cliente.segmento.id) {
        this.facturaLinea.precio = precio; //Servira para la v2, cuando no se modifica el precio
        this.precioVentaPublicoManual = precio.precioVentaPublicoManual;
        this.calcularLinea();
      }
    }
    if (this.esBien){
      this.obtenerUltimoKardex();
    }
  }

  seleccionarBodega() {
    if (this.facturaLinea.producto.id == valores.cero || this.facturaLinea.bodega.id == valores.cero || this.factura.cliente.id == valores.cero) {
      return;
    }
    for (let precio of this.facturaLinea.producto.precios) {
      if (precio.segmento.id == this.factura.cliente.segmento.id) {
        this.facturaLinea.precio = precio;
      }
    }
    this.obtenerUltimoKardex();
  }

  obtenerUltimoKardex(){
    this.kardexService.obtenerUltimoPorProductoYBodega(this.facturaLinea.producto.id, this.facturaLinea.bodega.id).subscribe({
      next: res => {
        if (res.resultado == null) {
          Swal.fire({ icon: error_swal, title: error, text: mensajes.error_kardex_vacio });
          return;
        }
        this.kardex = res.resultado as Kardex;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inicializarOpciones() {
    this.facturaLinea.bodega = this.bodegas[0];
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  formateaValor (valor) {
    valor.target.value = parseFloat(valor.target.value).toFixed(2);
  }

  formateaNumero (valor) {
    // si no es un número devuelve el valor, o lo convierte a número con 2 decimales
    return isNaN (valor) ? valor : parseFloat (valor).toFixed (2);
  }

  abrirTabCliente(event) {
    if (event != null)
      event.preventDefault();
    this.tabService.abrirTab(this.piePagina, 'CLIENTES');
    this.tabService.addNewTab(ClienteComponent, 'Cliente');
  }

  abrirTabProducto(event) {
    if (event != null)
      event.preventDefault();
    this.tabService.abrirTab(this.piePagina, 'INVENTARIOS');
    this.tabService.addNewTab(ProductoComponent, 'Producto');
  }

  //STEEPER
  inicializarSteeper(){
    this.facturacionSteeperFormGroup = new UntypedFormGroup({
      primerControl: new UntypedFormControl()
    });

    this.facturacionSteeperFormGroup = this._formBuilder.group({
      primerControl: ['', Validators.required]
    });

    this.recaudacionSteeperFormGroup = new UntypedFormGroup({
      segundoControl: new UntypedFormControl()
    });

    this.recaudacionSteeperFormGroup = this._formBuilder.group({
      segundoControl: ['', Validators.required]
    });
  }

  cambiarStepper(event){
    if (event.selectedIndex == 0 && event.previouslySelectedIndex == 1){
      this.recaudacionComponent.facturaConRecaudacion.emit(this.factura);
    }
    if (event.selectedIndex == 1 && event.previouslySelectedIndex == 0){
    }
  }

  stepperSiguiente(stepper: MatStepper){
      stepper.next();
  }

  //FILTROS AUTOCOMPLETE
  inicializarFiltros() {
    this.filtroProductos = this.controlProducto.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(nombre => typeof nombre === 'string' ? this.filtroProducto(nombre) : this.productos.slice())
      );
    this.filtroIdentificacionClientes = this.controlIdentificacionCliente.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(identificacion => typeof identificacion === 'string' ? this.filtroIdentificacionCliente(identificacion) : this.clientes.slice())
      );
    this.filtroRazonSocialClientes = this.controlRazonSocialCliente.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(razon_social => typeof razon_social === 'string' ? this.filtroRazonSocialCliente(razon_social) : this.clientes.slice())
      );
  }

  private filtroProducto(value: string): Producto[] {
    if (this.productos.length > 0) {
      const filterValue = value.toUpperCase();
      return this.productos.filter(producto => producto.nombre.toUpperCase().includes(filterValue));
    }
    return [];
  }
  verProducto(producto: Producto): string {
    return producto && producto.nombre ? producto.nombre : valores.vacio;
  }

  private filtroIdentificacionCliente(value: string): Cliente[] {
    if (this.clientes.length > 0) {
      const filterValue = value.toUpperCase();
      return this.clientes.filter(cliente => cliente.identificacion.toUpperCase().includes(filterValue));
    }
    return [];
  }
  verIdentificacionCliente(cliente: Cliente): string {
    return cliente && cliente.identificacion ? cliente.identificacion : valores.vacio;
  }

  private filtroRazonSocialCliente(value: string): Cliente[] {
    if (this.clientes.length > 0) {
      const filterValue = value.toUpperCase();
      return this.clientes.filter(cliente => cliente.razonSocial.toUpperCase().includes(filterValue));
    }
    return [];
  }
  verRazonSocialCliente(cliente: Cliente): string {
    return cliente && cliente.razonSocial ? cliente.razonSocial : valores.vacio;
  }

  //VALIDACIONES
  validarFormulario(): boolean {
    if (this.factura.fecha == null || this.factura.fecha > this.hoy ||
      this.datepipe.transform(this.factura.fecha, "yyyyMMdd") < this.datepipe.transform(this.fechaMinima, "yyyyMMdd")){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_fecha });
      return false;
    }
    if (this.factura.cliente.id == valores.cero){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.factura.valorTotal <= valores.cero){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }  

  validarFormularioLinea(): boolean {
    if (this.facturaLinea.cantidad <= valores.cero) {
      return false;
    }
    if (this.precioVentaPublicoManual <= valores.cero) {
      return false;
    }
    if (this.facturaLinea.impuesto.id == valores.cero) {
      return false;
    }
    return true;
  }

  public showSpinner(): void {
    this.spinnerService.show();

    setTimeout(() => {
      this.spinnerService.hide();
    }, 5000); // 5 seconds
  }
}