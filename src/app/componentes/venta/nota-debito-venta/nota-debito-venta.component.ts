import { Component, OnInit, ViewChild, HostListener, Renderer2, ElementRef } from '@angular/core';
import { valores, mensajes, validarSesion, otras, tab_activo, exito, exito_swal, error, error_swal } from '../../../constantes';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { startWith, map, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../modelos/format-date-picker';

import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Sesion } from '../../../modelos/usuario/sesion';
import { Empresa } from '../../../modelos/usuario/empresa';
import { Cliente } from '../../../modelos/cliente/cliente';
import { ClienteService } from '../../../servicios/cliente/cliente.service';
import { Factura } from '../../../modelos/venta/factura';
import { FacturaService } from '../../../servicios/venta/factura.service';
import { FacturaLinea } from '../../../modelos/venta/factura-linea';
import { NotaDebitoVenta } from '../../../modelos/venta/nota-debito-venta';
import { NotaDebitoVentaService } from '../../../servicios/venta/nota-debito-venta.service';
import { NotaDebitoVentaLinea } from '../../../modelos/venta/nota-debito-venta-linea';
import { NotaDebitoElectronicaService } from '../../../servicios/venta/nota-debito-eletronica.service';
import { Producto } from '../../../modelos/inventario/producto';
import { ProductoService } from '../../../servicios/inventario/producto.service';
import { Kardex } from '../../../modelos/inventario/kardex';
import { KardexService } from '../../../servicios/inventario/kardex.service';
import { Impuesto } from '../../../modelos/inventario/impuesto';
import { ImpuestoService } from '../../../servicios/inventario/impuesto.service';
import { Bodega } from '../../../modelos/inventario/bodega';
import { BodegaService } from '../../../servicios/inventario/bodega.service';
import { CategoriaProducto } from '../../../modelos/inventario/categoria-producto';
import { CategoriaProductoService } from '../../../servicios/inventario/categoria-producto.service';

import { MatStepper } from '@angular/material/stepper';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-nota-debito-venta',
  templateUrl: './nota-debito-venta.component.html',
  styleUrls: ['./nota-debito-venta.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class NotaDebitoVentaComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;

  cargar = false;
  hoy = new Date();

  isLinear = false;
  isEditable = true;
  panelOpenState = false;
  verIconoEditarLinea: boolean = false;
  
  facturacionSteeperFormGroup: UntypedFormGroup;
  recaudacionSteeperFormGroup: UntypedFormGroup;
  
  controlProducto = new UntypedFormControl();
  controlIdentificacionCliente = new UntypedFormControl();
  controlRazonSocialCliente = new UntypedFormControl();
  controlFactura = new UntypedFormControl();
  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();
  filtroIdentificacionClientes: Observable<Cliente[]> = new Observable<Cliente[]>();
  filtroRazonSocialClientes: Observable<Cliente[]> = new Observable<Cliente[]>();
  filtroFacturas: Observable<Factura[]> = new Observable<Factura[]>();
  clientes: Cliente[] = [];
  facturas: Factura[] = [];
  productos: Producto[] = [];

  impuestos: Impuesto[] = [];
  bodegas: Bodega[] = []; 
  categoriasProductos: CategoriaProducto[] = [];
  precioVentaPublicoManual: number = valores.cero;
  indiceLinea: number;
  esBien: boolean = true; 
  

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: NotaDebitoVenta) => `${row.codigo}`},
    { nombreColumna: 'serie', cabecera: 'Serie', celda: (row: NotaDebitoVenta) => `${row.serie}`},
    { nombreColumna: 'secuencial', cabecera: 'Secuencial', celda: (row: NotaDebitoVenta) => `${row.secuencial}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: NotaDebitoVenta) => `${this.datepipe.transform(row.fecha, "dd/MM/yyyy")}`},
    { nombreColumna: 'cliente', cabecera: 'Cliente', celda: (row: NotaDebitoVenta) => `${row.factura.cliente.razonSocial}`},
    { nombreColumna: 'factura', cabecera: 'Factura', celda: (row: NotaDebitoVenta) => `${row.factura.secuencial}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaDebitoVenta) => `$${row.totalConDescuento}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: NotaDebitoVenta) => `${row.estado}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<NotaDebitoVenta>;
  clickedRows = new Set<NotaDebitoVenta>();
  abrirPanelAdmin = false;
  notasDebitosVentas: NotaDebitoVenta[] = [];
  
  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("paginatorLinea") paginatorLinea: MatPaginator;
  @ViewChild("paginatorFacturaLinea") paginatorFacturaLinea: MatPaginator;
  @ViewChild('matSort') sort: MatSort;
  @ViewChild('matSortLinea') sortLinea: MatSort;
  @ViewChild('matSortFacturaLinea') sortFacturaLinea: MatSort;
  @ViewChild('inputFiltro') inputFiltro: ElementRef;
  @ViewChild('inputFiltroLinea') inputFiltroLinea: ElementRef;
  @ViewChild('inputFiltroFacturaLinea') inputFiltroFacturaLinea: ElementRef;

  notaDebitoVenta: NotaDebitoVenta = new NotaDebitoVenta();
  notaDebitoVentaLinea: NotaDebitoVentaLinea = new NotaDebitoVentaLinea();
  kardex: Kardex = new Kardex();
  categoriaProducto = valores.vacio;

  columnasFacturaLinea: any[] = [
    { nombreColumna: 'nombre', cabecera: 'Producto', celda: (row: FacturaLinea) => `${row.producto.nombre}` },
    { nombreColumna: 'medida', cabecera: 'Medida', celda: (row: FacturaLinea) => `${row.producto.medida.abreviatura}` },
    { nombreColumna: 'cantidad', cabecera: 'Cant.', celda: (row: FacturaLinea) => `${row.cantidad}` },
    { nombreColumna: 'valor', cabecera: 'P. Unit', celda: (row: FacturaLinea) => `${row.precioUnitario}` },
    { nombreColumna: 'descuento', cabecera: 'Desc. $', celda: (row: FacturaLinea) => `${row.valorDescuentoLinea}` },
    { nombreColumna: 'descuentoPorcentaje', cabecera: 'Desc. %', celda: (row: FacturaLinea) => `${row.porcentajeDescuentoLinea} %` },
    { nombreColumna: 'subtotal', cabecera: 'Subtotal', celda: (row: FacturaLinea) => `${row.subtotalConDescuentoLinea}` },
    { nombreColumna: 'iva', cabecera: 'IVA', celda: (row: FacturaLinea) => `${row.ivaConDescuentoLinea}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: FacturaLinea) => `${row.totalConDescuentoLinea}` },
    { nombreColumna: 'entregado', cabecera: 'Entreg.', celda: (row: FacturaLinea) => `${row.entregado}` }
  ];
  cabeceraFacturaLinea: string[] = this.columnasFacturaLinea.map(titulo => titulo.nombreColumna);
  dataSourceFacturaLinea: MatTableDataSource<FacturaLinea> = new MatTableDataSource<FacturaLinea>(this.notaDebitoVenta.factura.facturaLineas);
  clickedRowsFacturaLinea = new Set<FacturaLinea>();

  columnasLinea: any[] = [
    { nombreColumna: 'nombre', cabecera: 'Producto', celda: (row: NotaDebitoVentaLinea) => `${row.producto.nombre}` },
    { nombreColumna: 'medida', cabecera: 'Medida', celda: (row: NotaDebitoVentaLinea) => `${row.producto.medida.abreviatura}` },
    { nombreColumna: 'cantidad', cabecera: 'Cant.', celda: (row: NotaDebitoVentaLinea) => `${row.cantidad}` },
    { nombreColumna: 'valor', cabecera: 'P. Unit', celda: (row: NotaDebitoVentaLinea) => `${row.precioUnitario}` },
    { nombreColumna: 'descuento', cabecera: 'Desc. $', celda: (row: NotaDebitoVentaLinea) => `${row.valorDescuentoLinea}` },
    { nombreColumna: 'descuentoPorcentaje', cabecera: 'Desc. %', celda: (row: NotaDebitoVentaLinea) => `${row.porcentajeDescuentoLinea} %` },
    { nombreColumna: 'subtotal', cabecera: 'Subtotal', celda: (row: NotaDebitoVentaLinea) => `${row.subtotalConDescuentoLinea}` },
    { nombreColumna: 'iva', cabecera: 'IVA', celda: (row: NotaDebitoVentaLinea) => `${row.ivaConDescuentoLinea}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaDebitoVentaLinea) => `${row.totalConDescuentoLinea}` },
    { nombreColumna: 'entregado', cabecera: 'Entreg.', celda: (row: NotaDebitoVentaLinea) => `${row.entregado}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones' }
  ];
  cabeceraLinea: string[] = this.columnasLinea.map(titulo => titulo.nombreColumna);
  dataSourceLinea: MatTableDataSource<NotaDebitoVentaLinea> = new MatTableDataSource<NotaDebitoVentaLinea>(this.notaDebitoVenta.notaDebitoVentaLineas);
  clickedRowsLinea = new Set<NotaDebitoVentaLinea>();

  sesion: Sesion = null;
  empresa: Empresa = null;
  
  si = valores.si;
  no = valores.no;
  emitida = valores.emitida;
  anulada = valores.anulada;
  noFacturada = valores.noFacturada;
  facturada = valores.facturada;
  noRecaudada = valores.noRecaudada;
  recaudada = valores.recaudada;

  constructor(private renderer: Renderer2, private clienteService: ClienteService, private sesionService: SesionService, private impuestoService: ImpuestoService, private bodegaService: BodegaService, private dateAdapter: DateAdapter<Date>,
    private router: Router, private notaDebitoVentaService: NotaDebitoVentaService, private facturaService: FacturaService, private productoService: ProductoService, private notaDebitoElectronicaService: NotaDebitoElectronicaService,
    private categoriaProductoService: CategoriaProductoService, private kardexService: KardexService, private datepipe: DatePipe, private _formBuilder: UntypedFormBuilder, private spinnerService: NgxSpinnerService) { this.dateAdapter.setLocale('en-GB') }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G") //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N") //ASHIFT + N
      this.nuevo(null);
  }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
    this.consultar();
    this.consultarClientes();
    this.consultarImpuestos();
    this.consultarCategoriasProductos();
    this.consultarBodegas();
    this.inicializarSteeper();
    this.inicializarFiltros();
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
    this.notaDebitoVenta = new NotaDebitoVenta();
    this.clickedRows.clear();
    this.controlIdentificacionCliente.patchValue(valores.vacio);
    this.controlRazonSocialCliente.patchValue(valores.vacio);
    this.dataSourceFacturaLinea = new MatTableDataSource<FacturaLinea>([]);
    this.dataSourceFacturaLinea.paginator = this.paginatorFacturaLinea;
    this.dataSourceLinea = new MatTableDataSource<NotaDebitoVentaLinea>([]);
    this.dataSourceLinea.paginator = this.paginatorLinea;
    this.nuevoLinea();
  }

  nuevoLinea(){
    this.notaDebitoVentaLinea = new NotaDebitoVentaLinea();
    this.kardex = new Kardex();
    this.precioVentaPublicoManual = valores.cero;
    this.controlProducto.patchValue(valores.vacio);
    this.clickedRowsLinea.clear();
    this.verIconoEditarLinea = false;
  }

  construir() {
    console.log(this.notaDebitoVenta);
    let fecha = new Date(this.notaDebitoVenta.fecha);
    this.notaDebitoVenta.fecha = fecha;
    this.controlIdentificacionCliente.patchValue(this.notaDebitoVenta.factura.cliente);
    this.controlRazonSocialCliente.patchValue(this.notaDebitoVenta.factura);
    this.dataSourceFacturaLinea = new MatTableDataSource<FacturaLinea>(this.notaDebitoVenta.factura.facturaLineas);
    this.dataSourceFacturaLinea.paginator = this.paginatorFacturaLinea;
    this.dataSourceLinea = new MatTableDataSource<NotaDebitoVentaLinea>(this.notaDebitoVenta.notaDebitoVentaLineas);
    this.dataSourceLinea.paginator = this.paginatorLinea;
  }

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
    this.filtroFacturas = this.controlFactura.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(secuencial => typeof secuencial === 'string' ? this.filtroFactura(secuencial) : this.facturas.slice())
      );
  }

  private filtroProducto(value: string): Producto[] {
    if (this.productos.length > valores.cero) {
      const filterValue = value.toUpperCase();
      return this.productos.filter(producto => producto.nombre.toUpperCase().includes(filterValue));
    }
    return [];
  }
  verProducto(producto: Producto): string {
    return producto && producto.nombre ? producto.nombre : valores.vacio;
  }

  private filtroIdentificacionCliente(value: string): Cliente[] {
    if (this.clientes.length > valores.cero) {
      const filterValue = value.toUpperCase();
      return this.clientes.filter(cliente => cliente.identificacion.toUpperCase().includes(filterValue));
    }
    return [];
  }
  verIdentificacionCliente(cliente: Cliente): string {
    return cliente && cliente.identificacion ? cliente.identificacion : valores.vacio;
  }
  private filtroRazonSocialCliente(value: string): Cliente[] {
    if (this.clientes.length > valores.cero) {
      const filterValue = value.toUpperCase();
      return this.clientes.filter(cliente => cliente.razonSocial.toUpperCase().includes(filterValue));
    }
    return [];
  }
  verRazonSocialCliente(cliente: Cliente): string {
    return cliente && cliente.razonSocial ? cliente.razonSocial : valores.vacio;
  }
  private filtroFactura(value: string): Factura[] {
    if (this.facturas.length > valores.cero) {
      const filterValue = value.toUpperCase();
      return this.facturas.filter(factura => factura.secuencial.toUpperCase().includes(filterValue));
    }
    return [];
  }
  verFactura(factura: Factura): string {
    return factura && factura.secuencial ? factura.secuencial : valores.vacio;
  }

  consultar() {
    this.notaDebitoVentaService.consultarPorEmpresa(this.empresa.id).subscribe(
      res => {
        this.notasDebitosVentas = res.resultado as NotaDebitoVenta[]
        this.dataSource = new MatTableDataSource(this.notasDebitosVentas);
        this.dataSource.paginator = this.paginator;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarCategoriasProductos(){
    this.categoriaProductoService.consultar().subscribe(
      res => {
        this.categoriasProductos = res.resultado as CategoriaProducto[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      } 
    );
  }

  consultarProductos(){
    this.productoService.consultarPorCategoriaProductoYEmpresaYEstado(valores.servicio, this.empresa.id, valores.activo).subscribe(
      res => {
        this.productos = res.resultado as Producto[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      } 
    );
  }

  seleccionarProducto() {
    this.notaDebitoVentaLinea.producto = this.controlProducto.value;
    this.notaDebitoVentaLinea.impuesto = this.notaDebitoVentaLinea.producto.impuesto;
    if (this.notaDebitoVentaLinea.producto.categoriaProducto.id == 1){
      this.esBien = true } else { this.esBien = false };
    if(this.notaDebitoVentaLinea.producto.id == valores.cero || this.notaDebitoVentaLinea.bodega.id == valores.cero || this.notaDebitoVenta.factura.cliente.id == valores.cero){
      return;
    }
    for(let precio of this.notaDebitoVentaLinea.producto.precios){
      if (precio.segmento.id == this.notaDebitoVenta.factura.cliente.segmento.id){
        this.notaDebitoVentaLinea.precio = precio;
        this.precioVentaPublicoManual = precio.precioVentaPublicoManual;
        this.calcularLinea();
      }
    }
    this.inicializarOpciones(); // Error si no tiene bodega
    if (this.esBien){
      this.obtenerUltimoKardex();
    }
  }

  inicializarOpciones() {
    this.notaDebitoVentaLinea.bodega = this.bodegas[0];
  }

  obtenerUltimoKardex(){
    this.kardexService.obtenerUltimoPorBodega(this.notaDebitoVentaLinea.bodega.id, this.notaDebitoVentaLinea.producto.id).subscribe(
      res => {
        if (res.resultado == null){
          Swal.fire({ icon: error_swal, title: error, text: mensajes.error_kardex_vacio });
          return;
        }
        this.kardex = res.resultado as Kardex;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarClientes(){
    this.clienteService.consultarPorEmpresaYEstado(this.empresa.id, valores.activo).subscribe(
      res => {
        this.clientes = res.resultado as Cliente[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarImpuestos(){
    this.impuestoService.consultarPorEstado(valores.activo).subscribe(
      res => {
        this.impuestos = res.resultado as Impuesto[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarBodegas(){
    this.bodegaService.consultarPorEmpresaYEstado(this.empresa.id, valores.activo).subscribe(
      res => {
        this.bodegas = res.resultado as Bodega[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarRazonSocialCliente() {
    let clienteId = undefined;
    clienteId = this.controlRazonSocialCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe({
      next: res => {
        this.notaDebitoVenta.factura.cliente = res.resultado as Cliente;
        this.controlIdentificacionCliente.patchValue(this.notaDebitoVenta.factura.cliente);
        this.controlRazonSocialCliente.patchValue(this.notaDebitoVenta.factura.cliente);
        this.facturaService.consultarPorCliente(this.notaDebitoVenta.factura.cliente.id).subscribe(
          res => {
            this.facturas = res.resultado as Factura[]
          },
          err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        );
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarIdentificacionCliente() {
    let clienteId = this.controlIdentificacionCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe({
      next: res => {
        this.notaDebitoVenta.factura.cliente = res.resultado as Cliente;
        this.controlIdentificacionCliente.patchValue(this.notaDebitoVenta.factura.cliente);
        this.controlRazonSocialCliente.patchValue(this.notaDebitoVenta.factura.cliente);
        this.facturaService.consultarPorCliente(this.notaDebitoVenta.factura.cliente.id).subscribe(
          res => {
            this.facturas = res.resultado as Factura[]
          },
          err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        );
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarFactura() {
    let facturaId = this.controlFactura.value.id;
    this.notaDebitoVentaService.obtenerPorFactura(facturaId).subscribe(
      res => {
        this.notaDebitoVenta = res.resultado as NotaDebitoVenta;
        this.construir();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  agregarNotaDebitoVentaLinea(event){
    if (event!=null)
      event.preventDefault();
    if (this.notaDebitoVentaLinea.cantidad == valores.cero){
      return;
    }
    if (this.notaDebitoVentaLinea.precio.id == valores.cero){
      return;
    }
    if (this.notaDebitoVentaLinea.impuesto.id == valores.cero){
      return;
    }
    this.notaDebitoVenta.sesion = this.sesion;
    this.notaDebitoVenta.notaDebitoVentaLineas.push(this.notaDebitoVentaLinea);
    this.notaDebitoVentaService.calcular(this.notaDebitoVenta).subscribe(
      res => {
        this.notaDebitoVenta = res.resultado as NotaDebitoVenta;
        this.construir();
        this.limpiarLinea();
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  validarFormularioLinea(): boolean {
    if (this.notaDebitoVentaLinea.cantidad <= valores.cero) {
      return false;
    }
    if (this.precioVentaPublicoManual <= valores.cero) {
      return false;
    }
    if (this.notaDebitoVentaLinea.impuesto.id == valores.cero) {
      return false;
    }
    return true;
  }

  crearLinea() {
    if (!this.validarFormularioLinea())
      return;
    this.spinnerService.show();  
    this.notaDebitoVenta.sesion = this.sesion;
    this.notaDebitoVenta.empresa = this.empresa;
    this.notaDebitoVenta.notaDebitoVentaLineas.push(this.notaDebitoVentaLinea);
    this.notaDebitoVentaService.calcular(this.notaDebitoVenta).subscribe({
      next: res => {
        this.notaDebitoVenta = res.resultado as NotaDebitoVenta;
        this.construir();
        this.nuevoLinea();
        this.spinnerService.hide();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  actualizarLinea() {
    this.notaDebitoVenta.notaDebitoVentaLineas[this.indiceLinea] = this.notaDebitoVentaLinea;
    this.llenarTablaLinea(this.notaDebitoVenta.notaDebitoVentaLineas);
    this.calcular();
    this.nuevoLinea();
    this.verIconoEditarLinea = false;
  }

  eliminarLinea(i: number){
    this.notaDebitoVenta.notaDebitoVentaLineas.splice(i, 1);
    this.calcular();
  }

  seleccionarBodega(){
    if(this.notaDebitoVentaLinea.producto.id == valores.cero || this.notaDebitoVentaLinea.bodega.id == valores.cero || this.notaDebitoVenta.factura.id == valores.cero){
      return;
    }
    for(let precio of this.notaDebitoVentaLinea.producto.precios){
      if (precio.segmento.id == this.notaDebitoVenta.factura.cliente.segmento.id){
        this.notaDebitoVentaLinea.precio = precio;
      }
    }
    this.kardexService.obtenerUltimoPorBodega(this.notaDebitoVentaLinea.bodega.id, this.notaDebitoVentaLinea.producto.id).subscribe(
      res => {
        if (res.resultado == null){
          Swal.fire({ icon: error_swal, title: error, text: mensajes.error_kardex_vacio });
          return;
        }
        this.kardex = res.resultado as Kardex;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
    this.calcularLinea();
  }

  seleccionarCantidad() {
    this.calcularLinea();
  }

  seleccionarImpuesto(){
    this.calcularLinea();
  }
  
  seleccionarValorDescuentoLinea() {
    this.calcularLinea();
  }

  seleccionarPorcentajeDescuentoLinea() {
    this.calcularLinea();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.notaDebitoVenta.sesion=this.sesion;
    console.log(this.notaDebitoVenta);
    this.notaDebitoVentaService.crear(this.notaDebitoVenta).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.notaDebitoVenta = res.resultado as NotaDebitoVenta;
        this.construir();
        this.consultar();
        this.stepper.next();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event){
    if (event!=null)
      event.preventDefault();
    this.notaDebitoVentaService.actualizar(this.notaDebitoVenta).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });   
        this.notaDebitoVenta = res.resultado as NotaDebitoVenta;
        this.construir();
        this.consultar();
        this.stepper.next();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.notaDebitoVentaService.activar(this.notaDebitoVenta).subscribe({
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
    this.notaDebitoVentaService.inactivar(this.notaDebitoVenta).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  limpiarLinea(){
    this.notaDebitoVentaLinea = new NotaDebitoVentaLinea();
    this.kardex = new Kardex();
    this.controlProducto.patchValue(valores.vacio);
  }

  seleccionLinea(notaDebitoVentaLinea: any, i:number){
    if (!this.clickedRowsLinea.has(notaDebitoVentaLinea)) {
      this.clickedRowsLinea.clear();
      this.clickedRowsLinea.add(notaDebitoVentaLinea);
      this.notaDebitoVentaLinea = { ...notaDebitoVentaLinea };
      this.indiceLinea = i;
      this.construirLinea();
      this.verIconoEditarLinea = true;
    } else {
      this.nuevoLinea();
    }
  }

  construirLinea(){
    this.controlProducto.patchValue(this.notaDebitoVentaLinea.producto);
    this.precioVentaPublicoManual = parseFloat((this.notaDebitoVentaLinea.precioUnitario+(this.notaDebitoVentaLinea.precioUnitario*this.notaDebitoVentaLinea.impuesto.porcentaje/100)).toFixed(2));
  }

  llenarTablaLinea(notaDebitoVentaLineas: NotaDebitoVentaLinea[]) {
    this.dataSourceLinea = new MatTableDataSource(notaDebitoVentaLineas);
    this.dataSourceLinea.filterPredicate = (data: NotaDebitoVentaLinea, filter: string): boolean =>
      data.producto.nombre.includes(filter) || data.producto.medida.abreviatura.includes(filter) || String(data.cantidad).includes(filter) || 
      String(data.precioUnitario).includes(filter) || String(data.totalConDescuentoLinea).includes(filter) || data.entregado.includes(filter);
    this.dataSourceLinea.paginator = this.paginatorLinea;
    this.dataSourceLinea.sort = this.sortLinea;
  }

  seleccion(notaDebitoVenta: any) {
    if (!this.clickedRows.has(notaDebitoVenta)){
      this.clickedRows.clear();
      this.clickedRows.add(notaDebitoVenta);
      this.notaDebitoVentaService.obtener(notaDebitoVenta.id).subscribe({
        next: res => {
          this.notaDebitoVenta = res.resultado as NotaDebitoVenta;
          this.construir();
        },
        error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      });
    } else {
      this.clickedRows.clear();
      this.notaDebitoVenta = new NotaDebitoVenta();
    }
  }

  calcular(){
    this.notaDebitoVentaService.calcular(this.notaDebitoVenta).subscribe(
      res => {
        this.notaDebitoVenta = res.resultado as NotaDebitoVenta;
        this.construir();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  calcularLinea(){
    if (this.notaDebitoVentaLinea.cantidad == valores.cero){
      return;
    }
    if (this.notaDebitoVentaLinea.precio.id == valores.cero){
      return;
    }
    if (this.notaDebitoVentaLinea.impuesto.id == valores.cero){
      return;
    }
    this.notaDebitoVentaService.calcularLinea(this.notaDebitoVentaLinea).subscribe(
      res => {
        this.notaDebitoVentaLinea = res.resultado as NotaDebitoVentaLinea;
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

  enviarEvento(){
    this.consultar();
    this.notaDebitoVentaService.enviarEventoRecaudacion(this.notaDebitoVenta);
  }

  crearNotaDebitoElectronica(event){
    this.cargar = true;
    if (event != null)
      event.preventDefault();
    this.notaDebitoElectronicaService.enviar(this.notaDebitoVenta.id).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
        this.cargar = false;
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
        this.cargar = false;
      }
    });
  }

  borrarFiltroLinea() {
    this.renderer.setProperty(this.inputFiltroLinea.nativeElement, 'value', '');
    this.dataSourceLinea.filter = '';
  }

  borrarFiltroFacturaLinea() {
    this.renderer.setProperty(this.inputFiltroFacturaLinea.nativeElement, 'value', '');
    this.dataSourceFacturaLinea.filter = '';
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filtroLinea(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceLinea.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceLinea.paginator) {
      this.dataSourceLinea.paginator.firstPage();
    }
  }

  filtroFacturaLinea(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFacturaLinea.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceFacturaLinea.paginator) {
      this.dataSourceFacturaLinea.paginator.firstPage();
    }
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }  

  public showSpinner(): void {
    this.spinnerService.show();

    setTimeout(() => {
      this.spinnerService.hide();
    }, 5000); // 5 seconds
  }
}
