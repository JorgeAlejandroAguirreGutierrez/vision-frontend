import { Component, OnInit, ViewChild, HostListener, Renderer2, ElementRef } from '@angular/core';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { startWith, map, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

import { DatePipe } from '@angular/common';

import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Sesion } from '../../../modelos/usuario/sesion';
import { Empresa } from '../../../modelos/usuario/empresa';
import { Cliente } from '../../../modelos/cliente/cliente';
import { ClienteService } from '../../../servicios/cliente/cliente.service';
import { Factura } from '../../../modelos/venta/factura';
import { FacturaService } from '../../../servicios/venta/factura.service';
import { FacturaLinea } from '../../../modelos/venta/factura-linea';
import { NotaDebito } from '../../../modelos/venta/nota-debito';
import { NotaDebitoService } from '../../../servicios/venta/nota-debito.service';
import { NotaDebitoLinea } from '../../../modelos/venta/nota-debito-linea';
import { NotaDebitoElectronicaService } from '../../../servicios/venta/nota-debito-eletronica.service';
import { Producto } from '../../../modelos/inventario/producto';
import { ProductoService } from '../../../servicios/inventario/producto.service';
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
import { RecaudacionNDComponent } from '../../recaudacion/recaudacion-nd/recaudacion-nd.component';

@Component({
  selector: 'app-nota-debito',
  templateUrl: './nota-debito.component.html',
  styleUrls: ['./nota-debito.component.scss']
})

export class NotaDebitoComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;
  hoy = new Date();

  isLinear = false;
  isEditable = true;
  panelOpenState = false;
  verIconoEditarLinea: boolean = false;
  
  facturacionSteeperFormGroup: UntypedFormGroup;
  recaudacionSteeperFormGroup: UntypedFormGroup;
  steeperLinear: boolean = false;
  steeperEditable: boolean = true;
  
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
  

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: NotaDebito) => `${row.codigo}`},
    { nombreColumna: 'comprobante', cabecera: 'Comprobante', celda: (row: NotaDebito) => `${row.numeroComprobante}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: NotaDebito) => `${this.datepipe.transform(row.fecha, "dd-MM-yyyy")}`},
    { nombreColumna: 'cliente', cabecera: 'Cliente', celda: (row: NotaDebito) => `${row.factura.cliente.razonSocial}`},
    { nombreColumna: 'factura', cabecera: 'Factura', celda: (row: NotaDebito) => `${row.factura.numeroComprobante}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaDebito) => `$${row.total}`},
    { nombreColumna: 'proceso', cabecera: 'Proceso', celda: (row: NotaDebito) => `${row.estadoInterno}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: NotaDebito) => `${row.estado}`},
    { nombreColumna: 'estadoSri', cabecera: 'Estado SRI', celda: (row: NotaDebito) => `${row.estadoSri}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<NotaDebito>;
  clickedRows = new Set<NotaDebito>();
  abrirPanelAdmin = false;
  notasDebitos: NotaDebito[] = [];

  @ViewChild(RecaudacionNDComponent) recaudacionNDComponent: RecaudacionNDComponent;
  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("paginatorLinea") paginatorLinea: MatPaginator;
  @ViewChild("paginatorFacturaLinea") paginatorFacturaLinea: MatPaginator;
  @ViewChild('matSort') sort: MatSort;
  @ViewChild('matSortLinea') sortLinea: MatSort;
  @ViewChild('matSortFacturaLinea') sortFacturaLinea: MatSort;
  @ViewChild('inputFiltro') inputFiltro: ElementRef;
  @ViewChild('inputFiltroLinea') inputFiltroLinea: ElementRef;
  @ViewChild('inputFiltroFacturaLinea') inputFiltroFacturaLinea: ElementRef;

  notaDebito: NotaDebito = new NotaDebito();
  notaDebitoLinea: NotaDebitoLinea = new NotaDebitoLinea();
  categoriaProducto = valores.vacio;

  columnasFacturaLinea: any[] = [
    { nombreColumna: 'nombre', cabecera: 'Producto', celda: (row: FacturaLinea) => `${row.producto.nombre}` },
    { nombreColumna: 'medida', cabecera: 'Medida', celda: (row: FacturaLinea) => `${row.producto.medida.abreviatura}` },
    { nombreColumna: 'cantidad', cabecera: 'Cant.', celda: (row: FacturaLinea) => `${row.cantidad}` },
    { nombreColumna: 'valor', cabecera: 'P. Unit', celda: (row: FacturaLinea) => `$${row.precioUnitario}` },
    { nombreColumna: 'descuento', cabecera: 'Desc. $', celda: (row: FacturaLinea) => `$${row.valorDescuentoLinea}` },
    { nombreColumna: 'descuentoPorcentaje', cabecera: 'Desc. %', celda: (row: FacturaLinea) => `${row.porcentajeDescuentoLinea}%` },
    { nombreColumna: 'subtotal', cabecera: 'Subtotal', celda: (row: FacturaLinea) => `$${row.subtotalLinea}` },
    { nombreColumna: 'iva', cabecera: 'IVA', celda: (row: FacturaLinea) => `$${row.importeIvaLinea}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: FacturaLinea) => `$${row.totalLinea}` },
    { nombreColumna: 'entregado', cabecera: 'Entreg.', celda: (row: FacturaLinea) => `${row.entregado}` }
  ];
  cabeceraFacturaLinea: string[] = this.columnasFacturaLinea.map(titulo => titulo.nombreColumna);
  dataSourceFacturaLinea: MatTableDataSource<FacturaLinea> = new MatTableDataSource<FacturaLinea>(this.notaDebito.factura.facturaLineas);
  clickedRowsFacturaLinea = new Set<FacturaLinea>();

  columnasLinea: any[] = [
    { nombreColumna: 'nombre', cabecera: 'Producto', celda: (row: NotaDebitoLinea) => `${row.producto.nombre}` },
    { nombreColumna: 'medida', cabecera: 'Medida', celda: (row: NotaDebitoLinea) => `${row.producto.medida.abreviatura}` },
    { nombreColumna: 'cantidad', cabecera: 'Cant.', celda: (row: NotaDebitoLinea) => `${row.cantidad}` },
    { nombreColumna: 'valor', cabecera: 'P. Unit', celda: (row: NotaDebitoLinea) => `$${row.precioUnitario}` },
    { nombreColumna: 'descuento', cabecera: 'Desc. $', celda: (row: NotaDebitoLinea) => `$${row.valorDescuentoLinea}` },
    { nombreColumna: 'descuentoPorcentaje', cabecera: 'Desc. %', celda: (row: NotaDebitoLinea) => `${row.porcentajeDescuentoLinea} %` },
    { nombreColumna: 'subtotal', cabecera: 'Subtotal', celda: (row: NotaDebitoLinea) => `$${row.subtotalLinea}` },
    { nombreColumna: 'iva', cabecera: 'IVA', celda: (row: NotaDebitoLinea) => `$${row.importeIvaLinea}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaDebitoLinea) => `$${row.totalLinea}` },
    { nombreColumna: 'entregado', cabecera: 'Entreg.', celda: (row: NotaDebitoLinea) => `${row.entregado}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones' }
  ];
  cabeceraLinea: string[] = this.columnasLinea.map(titulo => titulo.nombreColumna);
  dataSourceLinea: MatTableDataSource<NotaDebitoLinea> = new MatTableDataSource<NotaDebitoLinea>(this.notaDebito.notaDebitoLineas);
  clickedRowsLinea = new Set<NotaDebitoLinea>();

  sesion: Sesion = null;
  empresa: Empresa = null;
  
  estadoActivo: string = valores.estadoActivo;
  estadoInactivo: string = valores.estadoInactivo;
  estadoInternoEmitida: string = valores.estadoInternoEmitida;
  estadoInternoRecaudada: string = valores.estadoInternoRecaudada;
  estadoInternoAnulada: string = valores.estadoInternoAnulada
  estadoSriPendiente: string = valores.estadoSriPendiente;
  estadoSriAutorizada: string = valores.estadoSriAutorizada;
  estadoSriAnulada: string = valores.estadoSriAnulada;
  si = valores.si;
  no = valores.no;

  constructor(private renderer: Renderer2, private clienteService: ClienteService, private sesionService: SesionService, private impuestoService: ImpuestoService, private bodegaService: BodegaService, 
    private router: Router, private notaDebitoService: NotaDebitoService, private facturaService: FacturaService, private productoService: ProductoService, private notaDebitoElectronicaService: NotaDebitoElectronicaService,
    private categoriaProductoService: CategoriaProductoService, private datepipe: DatePipe, private _formBuilder: UntypedFormBuilder, private spinnerService: NgxSpinnerService) { }

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
    this.consultarProductos();
    this.consultarImpuestos();
    this.consultarCategoriasProductos();
    this.consultarBodegas();
    this.inicializarSteeper();
    this.inicializarFiltros();
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
    this.notaDebito = new NotaDebito();
    this.hoy = new Date();
    this.notaDebito.fecha = this.hoy;
    this.notaDebito.establecimiento = this.sesion.usuario.estacion.establecimiento.codigoSRI;
    this.notaDebito.puntoVenta = this.sesion.usuario.estacion.codigoSRI;
    this.controlIdentificacionCliente.patchValue(valores.vacio);
    this.controlRazonSocialCliente.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<FacturaLinea>([]);
    this.clickedRows.clear();
    this.nuevoLinea();
  }

  nuevoLinea(){
    this.notaDebitoLinea = new NotaDebitoLinea();
    this.precioVentaPublicoManual = valores.cero;
    this.controlProducto.patchValue(valores.vacio);
    this.clickedRowsLinea.clear();
    this.verIconoEditarLinea = false;
  }

  construir() {
    let fecha = new Date(this.notaDebito.fecha);
    this.notaDebito.fecha = fecha;
    this.controlIdentificacionCliente.patchValue(this.notaDebito.factura.cliente);
    this.controlRazonSocialCliente.patchValue(this.notaDebito.factura.cliente);
    this.controlFactura.patchValue(this.notaDebito.factura);
    this.dataSourceFacturaLinea = new MatTableDataSource<FacturaLinea>(this.notaDebito.factura.facturaLineas);
    this.dataSourceFacturaLinea.paginator = this.paginatorFacturaLinea;
    this.dataSourceLinea = new MatTableDataSource<NotaDebitoLinea>(this.notaDebito.notaDebitoLineas);
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
      return this.facturas.filter(factura => factura.numeroComprobante.toUpperCase().includes(filterValue));
    }
    return [];
  }
  verFactura(factura: Factura): string {
    return factura && factura.numeroComprobante ? factura.numeroComprobante : valores.vacio;
  }

  consultar() {
    this.notaDebitoService.consultarPorEmpresa(this.empresa.id).subscribe(
      res => {
        this.notasDebitos = res.resultado as NotaDebito[]
        this.dataSource = new MatTableDataSource(this.notasDebitos);
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
    this.productoService.consultarPorCategoriaProductoYEmpresaYEstado(valores.servicio, this.empresa.id, valores.estadoActivo).subscribe(
      res => {
        this.productos = res.resultado as Producto[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      } 
    );
  }

  seleccionarProducto() {
    this.notaDebitoLinea.producto = this.controlProducto.value;
    this.notaDebitoLinea.impuesto = this.notaDebitoLinea.producto.impuesto;
    if(this.notaDebitoLinea.producto.id == valores.cero || this.notaDebito.factura.cliente.id == valores.cero){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_factura })
      return;
    }
    for(let precio of this.notaDebitoLinea.producto.precios){
      if (precio.segmento.id == this.notaDebito.factura.cliente.segmento.id){
        this.notaDebitoLinea.precio = precio;
        this.precioVentaPublicoManual = precio.precioVentaPublicoManual;
        this.calcularLinea();
      }
    }
  }

  consultarClientes(){
    this.clienteService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe(
      res => {
        this.clientes = res.resultado as Cliente[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarImpuestos(){
    this.impuestoService.consultarPorEstado(valores.estadoActivo).subscribe(
      res => {
        this.impuestos = res.resultado as Impuesto[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarBodegas(){
    this.bodegaService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe(
      res => {
        this.bodegas = res.resultado as Bodega[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarRazonSocialCliente() {
    this.spinnerService.show();
    let clienteId = this.controlRazonSocialCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe({
      next: res => {
        this.notaDebito.factura.cliente = res.resultado as Cliente;
        this.controlIdentificacionCliente.patchValue(this.notaDebito.factura.cliente);
        this.controlRazonSocialCliente.patchValue(this.notaDebito.factura.cliente);
        this.facturaService.consultarPorEmpresaYClienteYEstado(this.empresa.id, this.notaDebito.factura.cliente.id, this.estadoActivo).subscribe(
          res => {
            this.facturas = res.resultado as Factura[];
            this.spinnerService.hide();
          },
          err => {
            this.spinnerService.hide();
            Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
          }
        );
      },
      error: err => {
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }

  seleccionarIdentificacionCliente() {
    this.spinnerService.show();
    let clienteId = this.controlIdentificacionCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe({
      next: res => {
        this.notaDebito.factura.cliente = res.resultado as Cliente;
        this.controlIdentificacionCliente.patchValue(this.notaDebito.factura.cliente);
        this.controlRazonSocialCliente.patchValue(this.notaDebito.factura.cliente);
        this.facturaService.consultarPorCliente(this.notaDebito.factura.cliente.id).subscribe(
          res => {
            this.facturas = res.resultado as Factura[]
            this.spinnerService.show();
          },
          err => {
            this.spinnerService.hide();
            Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
          }
        );
      },
      error: err => { 
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
       }
    });
  }

  seleccionarFactura() {
    this.spinnerService.show();
    let facturaId = this.controlFactura.value.id;
    this.notaDebitoService.obtenerPorFactura(facturaId).subscribe(
      res => {
        this.notaDebito = res.resultado as NotaDebito;
        this.construir();
        this.spinnerService.hide();
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.spinnerService.hide();
      }
    );
  }

  agregarNotaDebitoLinea(event){
    if (event!=null)
      event.preventDefault();
    this.spinnerService.show();
    if (this.notaDebitoLinea.cantidad == valores.cero){
      return;
    }
    if (this.notaDebitoLinea.precio.id == valores.cero){
      return;
    }
    if (this.notaDebitoLinea.impuesto.id == valores.cero){
      return;
    }
    this.notaDebito.sesion = this.sesion;
    this.notaDebito.notaDebitoLineas.push(this.notaDebitoLinea);
    this.notaDebitoService.calcular(this.notaDebito).subscribe(
      res => {
        this.notaDebito = res.resultado as NotaDebito;
        this.construir();
        this.limpiarLinea();
        this.spinnerService.hide();
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      err => {
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
  }

  validarFormularioLinea(): boolean {
    if (this.notaDebitoLinea.cantidad <= valores.cero) {
      return false;
    }
    if (this.precioVentaPublicoManual <= valores.cero) {
      return false;
    }
    if (this.notaDebitoLinea.impuesto.id == valores.cero) {
      return false;
    }
    return true;
  }

  crearLinea() {
    if (!this.validarFormularioLinea())
      return;
    this.spinnerService.show();  
    this.notaDebito.sesion = this.sesion;
    this.notaDebito.empresa = this.empresa;
    this.notaDebito.notaDebitoLineas.push(this.notaDebitoLinea);
    this.notaDebitoService.calcular(this.notaDebito).subscribe({
      next: res => {
        this.notaDebito = res.resultado as NotaDebito;
        this.construir();
        this.nuevoLinea();
        this.spinnerService.hide();
      },
      error: err => {
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }

  actualizarLinea() {
    this.notaDebito.notaDebitoLineas[this.indiceLinea] = this.notaDebitoLinea;
    this.llenarTablaLinea(this.notaDebito.notaDebitoLineas);
    this.calcular();
    this.nuevoLinea();
    this.verIconoEditarLinea = false;
  }

  eliminarLinea(i: number){
    this.notaDebito.notaDebitoLineas.splice(i, 1);
    this.calcular();
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

  seleccionarLinea(notaDebitoLinea: NotaDebitoLinea, i:number) {
    if (!this.clickedRowsLinea.has(notaDebitoLinea)) {
      this.clickedRowsLinea.clear();
      this.clickedRowsLinea.add(notaDebitoLinea);
      this.notaDebitoLinea = { ...notaDebitoLinea };
      this.indiceLinea = i;
      this.construirLinea();
      this.verIconoEditarLinea = true;
    } else {
      this.nuevoLinea();
    }
  }

  construirLinea(){
    this.controlProducto.patchValue(this.notaDebitoLinea.producto);
    this.precioVentaPublicoManual = parseFloat((this.notaDebitoLinea.precioUnitario + (this.notaDebitoLinea.precioUnitario * this.notaDebitoLinea.impuesto.porcentaje/100)).toFixed(2));
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.spinnerService.show();
    this.notaDebito.sesion = this.sesion;
    this.notaDebito.establecimiento = this.sesion.usuario.estacion.establecimiento.codigoSRI;
    this.notaDebito.puntoVenta = this.sesion.usuario.estacion.codigoSRI;
    this.notaDebitoService.crear(this.notaDebito).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.notaDebito = res.resultado as NotaDebito;
        this.construir();
        this.consultar();
        this.spinnerService.hide();
        this.stepper.next();
      },
      err => {
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    );
  }

  actualizar(event){
    if (event!=null)
      event.preventDefault();
    this.spinnerService.show();
    this.notaDebitoService.actualizar(this.notaDebito).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });   
        this.notaDebito = res.resultado as NotaDebito;
        this.construir();
        this.consultar();
        this.spinnerService.hide();
        this.stepper.next();
      },
      err => {
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.notaDebitoService.activar(this.notaDebito).subscribe({
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
    this.notaDebitoService.inactivar(this.notaDebito).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  limpiarLinea(){
    this.notaDebitoLinea = new NotaDebitoLinea();
    this.controlProducto.patchValue(valores.vacio);
  }

  llenarTablaLinea(notaDebitoLineas: NotaDebitoLinea[]) {
    this.dataSourceLinea = new MatTableDataSource(notaDebitoLineas);
    this.dataSourceLinea.filterPredicate = (data: NotaDebitoLinea, filter: string): boolean =>
      data.producto.nombre.includes(filter) || data.producto.medida.abreviatura.includes(filter) || String(data.cantidad).includes(filter) || 
      String(data.precioUnitario).includes(filter) || String(data.totalLinea).includes(filter) || data.entregado.includes(filter);
    this.dataSourceLinea.paginator = this.paginatorLinea;
    this.dataSourceLinea.sort = this.sortLinea;
  }

  seleccionar(notaDebito: any) {
    if (!this.clickedRows.has(notaDebito)){
      this.clickedRows.clear();
      this.clickedRows.add(notaDebito);
      this.spinnerService.show();
      this.notaDebitoService.obtener(notaDebito.id).subscribe({
        next: res => {
          this.spinnerService.hide();
          this.notaDebito = res.resultado as NotaDebito;
          this.construir();
        },
        error: err => {
          this.spinnerService.hide();
          Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        }
      });
    } else {
      this.clickedRows.clear();
      this.notaDebito = new NotaDebito();
    }
  }

  calcular(){
    this.notaDebitoService.calcular(this.notaDebito).subscribe(
      res => {
        this.notaDebito = res.resultado as NotaDebito;
        this.construir();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  calcularLinea(){
    this.spinnerService.show();
    if (this.notaDebitoLinea.cantidad == valores.cero){
      return;
    }
    if (this.notaDebitoLinea.precio.id == valores.cero){
      return;
    }
    if (this.notaDebitoLinea.impuesto.id == valores.cero){
      return;
    }
    this.notaDebitoLinea.precioUnitario = Number((this.precioVentaPublicoManual * 100 / (100 + this.notaDebitoLinea.impuesto.porcentaje)).toFixed(4));
    this.notaDebitoService.calcularLinea(this.notaDebitoLinea).subscribe(
      res => {
        this.spinnerService.hide();
        this.notaDebitoLinea = res.resultado as NotaDebitoLinea;
      },
      err => {
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
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
    this.notaDebitoService.enviarEventoRecaudacion(this.notaDebito);
  }

  crearNotaDebitoElectronica(event){
    if (event != null)
      event.preventDefault();
    this.spinnerService.show();
    this.notaDebitoElectronicaService.enviar(this.notaDebito.id).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.notaDebito = res.resultado as NotaDebito;
        this.consultar();
        this.nuevo(null);
        this.spinnerService.hide();  
      },
      error: err => {
        this.spinnerService.hide(); 
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
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
        this.spinnerService.hide(); 
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      error: err => {
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
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

  actualizarRecaudacion(event: NotaDebito){
    if (event){
      this.notaDebito = event;
      let fecha = new Date(this.notaDebito.fecha);
      this.notaDebito.fecha = fecha;
      this.notaDebito.estado = event.estado;
    }
  }

  cambiarStepper(event){
    if (event.selectedIndex == 0 && event.previouslySelectedIndex == 1){
      this.recaudacionNDComponent.notaDebitoConRecaudacion.emit(this.notaDebito);
    }
    if (event.selectedIndex == 1 && event.previouslySelectedIndex == 0){
    }
  }

  formateaNumero (valor) {
    return isNaN (valor) ? valor : parseFloat (valor).toFixed (2);
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
