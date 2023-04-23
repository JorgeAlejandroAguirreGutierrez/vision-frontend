import { Component, HostListener, OnInit, ViewChild, Type, ElementRef, Renderer2 } from '@angular/core';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../modelos/format-date-picker';

import { Router } from '@angular/router';
import { TabService } from '../../servicios/componente/tab/tab.service';
import { FooterComponent } from "../../componentes/footer/footer.component";
import { ClienteComponent } from '../../clientes/cliente/cliente.component';
import { ProductoComponent } from '../../inventarios/producto/producto.component';

import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Factura } from '../../modelos/venta/factura';
import { FacturaService } from '../../servicios/venta/factura.service';
import { FacturaElectronicaService } from 'src/app/servicios/venta/factura-eletronica.service';
import { Cliente } from '../../modelos/cliente/cliente';
import { ClienteService } from '../../servicios/cliente/cliente.service';
import { FacturaLinea } from '../../modelos/venta/factura-linea';
import { Producto } from '../../modelos/inventario/producto';
import { ProductoService } from '../../servicios/inventario/producto.service';
import { Impuesto } from '../../modelos/inventario/impuesto';
import { ImpuestoService } from '../../servicios/inventario/impuesto.service';
import { Bodega } from '../../modelos/inventario/bodega';
import { BodegaService } from '../../servicios/inventario/bodega.service';
import { CategoriaProducto } from '../../modelos/inventario/categoria-producto';
import { CategoriaProductoService } from '../../servicios/inventario/categoria-producto.service';
import { Kardex } from '../../modelos/inventario/kardex';
import { KardexService } from '../../servicios/inventario/kardex.service';

import { MatStepper } from '@angular/material/stepper';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class FacturaComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;
  si: string = valores.si;
  no: string = valores.no;
  emitida: string = valores.emitida;
  anulada: string = valores.anulada;
  noFacturada: string = valores.noFacturada;
  facturada: string = valores.facturada;
  noRecaudada: string = valores.noRecaudada;
  recaudada: string = valores.recaudada;
  categoriaProducto: string = valores.bien;

  saldo: number = valores.cero;
  saldoTotal: number = valores.cero;
  costoUnitario: number = valores.cero;
  costoPromedio: number = valores.cero;
  precioVentaPublicoManual: number = valores.cero;
  indiceLinea: number;

  cargar: boolean = false;
  steeperLinear: boolean = false;
  steeperEditable: boolean = true;
  abrirPanelFacturaCliente: boolean = true;
  abrirPanelFacturaLinea: boolean = false;
  abrirPanelAdminFactura: boolean = false;
  verIconoEditarLinea: boolean = false;

  hoy = new Date();

  sesion: Sesion;
  factura: Factura = new Factura();
  kardex: Kardex = new Kardex();
  facturaLinea: FacturaLinea = new FacturaLinea();

  clientes: Cliente[] = [];
  productos: Producto[] = [];
  facturas: Factura[];
  bodegas: Bodega[] = [];
  impuestos: Impuesto[];
  categoriasProductos: CategoriaProducto[] = [];

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
    { nombreColumna: 'serie', cabecera: 'Serie', celda: (row: Factura) => `${row.serie}` },
    { nombreColumna: 'secuencial', cabecera: 'Secuencial', celda: (row: Factura) => `${row.secuencial}` },
    { nombreColumna: 'cliente', cabecera: 'Cliente', celda: (row: Factura) => `${row.cliente.razonSocial}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: Factura) => `${row.totalConDescuento}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Factura) => `${row.estado}` }
  ];
  cabeceraFactura: string[] = this.columnasFactura.map(titulo => titulo.nombreColumna);
  dataSourceFactura: MatTableDataSource<Factura>;
  clickedRowsFactura = new Set<Factura>();

  columnasLinea: any[] = [
    { nombreColumna: 'nombre', cabecera: 'Producto', celda: (row: FacturaLinea) => `${row.producto.nombre}` },
    { nombreColumna: 'medida', cabecera: 'Medida', celda: (row: FacturaLinea) => `${row.producto.medida.abreviatura}` },
    { nombreColumna: 'cantidad', cabecera: 'Cant.', celda: (row: FacturaLinea) => `${row.cantidad}` },
    { nombreColumna: 'valor', cabecera: 'Precio', celda: (row: FacturaLinea) => `${row.precioUnitario}` },
    { nombreColumna: 'impuesto', cabecera: 'IVA', celda: (row: FacturaLinea) => `${row.impuesto.porcentaje} %` },
    { nombreColumna: 'descuento', cabecera: 'Desc. $', celda: (row: FacturaLinea) => `${row.valorDescuentoLinea}` },
    { nombreColumna: 'descuentoPorcentaje', cabecera: 'Desc. %', celda: (row: FacturaLinea) => `${row.porcentajeDescuentoLinea} %` },
    { nombreColumna: 'total', cabecera: 'Subtotal', celda: (row: FacturaLinea) => `${row.totalConDescuentoLinea}` },
    { nombreColumna: 'entregado', cabecera: 'Entregado', celda: (row: FacturaLinea) => `${row.entregado}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones' }
  ];
  cabeceraLinea: string[] = this.columnasLinea.map(titulo => titulo.nombreColumna);
  dataSourceLinea: MatTableDataSource<FacturaLinea> = new MatTableDataSource<FacturaLinea>(this.factura.facturaLineas);
  clickedRowsLinea = new Set<FacturaLinea>();

  piePagina: Type<any> = FooterComponent;

  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("paginatorLinea") paginatorLinea: MatPaginator;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;
  @ViewChild("inputFiltroLinea") inputFiltroLinea: ElementRef;
  

  @HostListener('window:keypress', ['$event'])
    keyEvent($event: KeyboardEvent) {
      if (($event.shiftKey || $event.metaKey) && $event.key == "G") //SHIFT + G
        this.crear(null);
      if (($event.shiftKey || $event.metaKey) && $event.key == "N") //ASHIFT + N
        this.nuevo(null);
      if (($event.shiftKey || $event.metaKey) && $event.key == "A") // SHIFT + A
        this.crearFacturaLinea();
    }

  constructor(private renderer: Renderer2, private clienteService: ClienteService, private sesionService: SesionService,
    private impuestoService: ImpuestoService, private router: Router, private datepipe: DatePipe, private dateAdapter: DateAdapter<Date>,
    private facturaService: FacturaService, private facturaElectronicaService: FacturaElectronicaService,
    private productoService: ProductoService, private bodegaService: BodegaService, private kardexService: KardexService,
    private categoriaProductoService: CategoriaProductoService, private tabService: TabService,
    private _formBuilder: UntypedFormBuilder) { }


  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.consultar();
    this.consultarClientes();
    this.consultarCategoriasProductos();
    this.consultarProductos();
    this.consultarImpuestos();
    this.consultarBodegas();
    this.inicializarSteeper();
    this.inicializarFiltros();
  }

  consultarClientes() {
    this.clienteService.consultarActivos().subscribe({
      next: res => {
        this.clientes = res.resultado as Cliente[]
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  consultarCategoriasProductos() {
    this.categoriaProductoService.consultar().subscribe({
      next: res => {
        this.categoriasProductos = res.resultado as CategoriaProducto[]
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  consultarProductos() {
    this.productoService.consultarActivos().subscribe({
      next: res => {
        this.productos = res.resultado as Producto[];
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    })
  }

  consultarImpuestos() {
    this.impuestoService.consultar().subscribe({
      next: res => {
        this.impuestos = res.resultado as Impuesto[]
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  consultarBodegas() {
    this.bodegaService.consultar().subscribe({
      next: res => {
        this.bodegas = res.resultado as Bodega[]
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    });
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.factura = new Factura();
    this.clickedRowsFactura.clear();
    this.cargar = false;
    this.controlIdentificacionCliente.patchValue(valores.vacio);
    this.controlRazonSocialCliente.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<FacturaLinea>([]);
    this.nuevoFacturaLinea();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.factura.sesion = this.sesion;
    this.factura.serie = this.sesion.usuario.estacion.establecimiento.codigoSRI + this.sesion.usuario.estacion.codigoSRI
    this.facturaService.crear(this.factura).subscribe({
      next: res => {
        this.factura = res.resultado as Factura;
        this.consultar();
        this.stepper.next();
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  crearFacturaElectronica(event) {
    this.cargar = true;
    if (event != null)
      event.preventDefault();
    this.facturaElectronicaService.enviar(this.factura.id).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.factura = res.resultado as Factura;
        this.consultar();
        this.nuevo(null);
        this.cargar = false;
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.cargar = false;
      }
    });
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.facturaService.actualizar(this.factura).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.stepper.next();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
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
    this.facturaService.consultar().subscribe({
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
      this.datepipe.transform(data.fecha, "dd-MM-yyyy").includes(filter) || data.serie.includes(filter) || data.secuencial.includes(filter) || 
      data.cliente.razonSocial.includes(filter) || data.estado.includes(filter);
    this.dataSourceFactura.paginator = this.paginator;
  }

  seleccion(factura: any) {
    if (!this.clickedRowsFactura.has(factura)) {
      this.clickedRowsFactura.clear();
      this.clickedRowsFactura.add(factura);
      this.obtenerFactura(factura.id)
    } else {
      this.nuevo(null);
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

  construir() {
    let fecha = new Date(this.factura.fecha);
    this.factura.fecha = fecha;
    this.controlIdentificacionCliente.patchValue(this.factura.cliente);
    this.controlRazonSocialCliente.patchValue(this.factura.cliente);
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
    let clienteId = undefined;
    clienteId = this.controlRazonSocialCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe({
      next: res => {
        Object.assign(this.factura.cliente, res.resultado as Cliente);
        this.controlIdentificacionCliente.patchValue(this.factura.cliente);
        this.controlRazonSocialCliente.patchValue(this.factura.cliente);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarIdentificacionCliente() {
    let clienteId = undefined;
    clienteId = this.controlIdentificacionCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe({
      next: res => {
        Object.assign(this.factura.cliente, res.resultado as Cliente);
        this.controlIdentificacionCliente.patchValue(this.factura.cliente);
        this.controlRazonSocialCliente.patchValue(this.factura.cliente);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  //CRUD FACTURURA LINEA
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
    this.factura.sesion = this.sesion;
    this.factura.facturaLineas.push(this.facturaLinea);
    this.facturaService.calcular(this.factura).subscribe({
      next: res => {
        this.factura = res.resultado as Factura;
        this.construir();
        this.nuevoFacturaLinea();
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  actualizarFacturaLinea() {
    this.factura.facturaLineas[this.indiceLinea] = this.facturaLinea;
    //console.log(this.factura.facturaLineas);
    this.llenarTablaFacturaLinea(this.factura.facturaLineas);
    this.calcularTotales();
    this.nuevoFacturaLinea();
    this.verIconoEditarLinea = false;
  }

  eliminarFacturaLinea(i: number) {
    this.factura.facturaLineas.splice(i, 1);
    this.calcularTotales();
    this.nuevoFacturaLinea();
  }

  llenarTablaFacturaLinea(facturaLineas: FacturaLinea[]) {
    this.dataSourceLinea = new MatTableDataSource(facturaLineas);
    this.dataSourceLinea.filterPredicate = (data: FacturaLinea, filter: string): boolean =>
      data.producto.nombre.includes(filter) || data.producto.medida.abreviatura.includes(filter) || String(data.cantidad).includes(filter) || 
      String(data.impuesto.porcentaje).includes(filter) || data.entregado.includes(filter);
    this.dataSourceLinea.paginator = this.paginatorLinea;
  }

  seleccionFacturaLinea(facturaLinea: FacturaLinea, i:number) {
    //console.log(i);
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

  calcularFacturaLinea() {
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

  calcularTotales() {
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
    this.inicializarOpciones();
    if (this.facturaLinea.producto.id == valores.cero || this.factura.cliente.id == valores.cero) {
      return;
    }
    for (let precio of this.facturaLinea.producto.precios) {
      if (precio.segmento.id == this.factura.cliente.segmento.id) {
        this.facturaLinea.precio = precio; //Servira para la v2, cuando no se modifica el precio
        this.precioVentaPublicoManual = precio.precioVentaPublicoManual;
        this.calcularFacturaLinea();
      }
    }
    this.obtenerUltimoKardex();
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
    this.kardexService.obtenerUltimoPorFecha(this.facturaLinea.bodega.id, this.facturaLinea.producto.id).subscribe({
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

  enviarEventoRecaudacion() {
    this.construir();
    this.consultar();
    this.facturaService.enviarEventoRecaudacion(this.factura);
  }

  stepperSiguiente(stepper: MatStepper){
      stepper.next();
  }

  //FILTROS AUTOCOMPLETE
  inicializarFiltros() {
    this.filtroProductos = this.controlProducto.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(nombre => typeof nombre === 'string' ? this.filtroProducto(nombre) : this.productos.slice())
      );
    this.filtroIdentificacionClientes = this.controlIdentificacionCliente.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(identificacion => typeof identificacion === 'string' ? this.filtroIdentificacionCliente(identificacion) : this.clientes.slice())
      );
    this.filtroRazonSocialClientes = this.controlRazonSocialCliente.valueChanges
      .pipe(
        startWith(''),
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

}