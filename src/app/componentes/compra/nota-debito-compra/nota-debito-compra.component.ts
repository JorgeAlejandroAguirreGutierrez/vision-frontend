import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { DatePipe } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { startWith, map } from 'rxjs/operators';

import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Empresa } from 'src/app/modelos/usuario/empresa';
import { ProveedorService } from 'src/app/servicios/compra/proveedor.service';
import { Proveedor } from 'src/app/modelos/compra/proveedor';
import { NotaDebitoCompraService } from 'src/app/servicios/compra/nota-debito-compra.service';
import { FacturaCompra } from 'src/app/modelos/compra/factura-compra';
import { FacturaCompraService } from 'src/app/servicios/compra/factura-compra.service';
import { NotaDebitoCompra } from 'src/app/modelos/compra/nota-debito-compra';
import { NotaDebitoCompraLinea } from 'src/app/modelos/compra/nota-debito-compra-linea';
import { Producto } from 'src/app/modelos/inventario/producto';
import { KardexService } from 'src/app/servicios/inventario/kardex.service';
import { Impuesto } from 'src/app/modelos/inventario/impuesto';
import { ImpuestoService } from 'src/app/servicios/inventario/impuesto.service';
import { ProductoService } from 'src/app/servicios/inventario/producto.service';
import { FacturaCompraLinea } from 'src/app/modelos/compra/factura-compra-linea';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-nota-debito-compra',
  templateUrl: './nota-debito-compra.component.html',
  styleUrls: ['./nota-debito-compra.component.scss']
})

export class NotaDebitoCompraComponent implements OnInit {

  panelOpenState = false;
  abrirPanelAdmin = false;

  sesion: Sesion = null;
  empresa: Empresa = null;
  hoy = new Date();
  deshabilitarDevolucion = true;
  deshabilitarDescuento = true;
  
  si = valores.si;
  no = valores.no;
  estadoPorPagar: string = valores.estadoPorPagar;
  estadoPagada: string = valores.estadoPagada;
  estadoAnulada: string = valores.estadoAnulada;

  notaDebitoCompra: NotaDebitoCompra = new NotaDebitoCompra();
  notaDebitoCompraLinea: NotaDebitoCompraLinea = new NotaDebitoCompraLinea();
  notasDebitosCompras: NotaDebitoCompra[] = [];  
  controlIdentificacionProveedor = new UntypedFormControl();
  controlRazonSocialProveedor = new UntypedFormControl();
  controlFacturaCompra = new UntypedFormControl();
  controlProducto = new UntypedFormControl();
  filtroIdentificacionProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();
  filtroRazonSocialProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();
  filtroFacturasCompras: Observable<FacturaCompra[]> = new Observable<FacturaCompra[]>();
  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();
  proveedores: Proveedor[] = [];  
  facturasCompras: FacturaCompra[] = [];
  productos: Producto[] = [];
  impuestos: Impuesto[] = [];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: NotaDebitoCompra) => `${row.codigo}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: NotaDebitoCompra) => `${this.datepipe.transform(row.fecha, valores.fechaCorta)}`},
    { nombreColumna: 'comprobante', cabecera: 'Comprobante', celda: (row: NotaDebitoCompra) => `${row.numeroComprobante}`},
    { nombreColumna: 'proveedor', cabecera: 'Proveedor', celda: (row: NotaDebitoCompra) => `${row.facturaCompra.proveedor.razonSocial}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaDebitoCompra) => `$${row.total}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: NotaDebitoCompra) => `${row.estado}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<NotaDebitoCompra>;
  clickedRows = new Set<NotaDebitoCompra>();

  columnasFacturaCompraLinea: any[] = [
    { nombreColumna: 'nombre', cabecera: 'Producto', celda: (row: FacturaCompraLinea) => `${row.producto.nombre}` },
    { nombreColumna: 'medida', cabecera: 'Medida', celda: (row: FacturaCompraLinea) => `${row.producto.medida.abreviatura}` },
    { nombreColumna: 'cantidad', cabecera: 'Cant.', celda: (row: FacturaCompraLinea) => `${row.cantidad}` },
    { nombreColumna: 'costoUnitario', cabecera: 'Costo. Unit', celda: (row: FacturaCompraLinea) => `$${row.costoUnitario}` },
    { nombreColumna: 'valorDescuento', cabecera: 'Desc. $', celda: (row: FacturaCompraLinea) => `$${row.valorDescuentoLinea}` },
    { nombreColumna: 'porcentajeDescuento', cabecera: 'Desc. %', celda: (row: FacturaCompraLinea) => `${row.porcentajeDescuentoLinea}%` },
    { nombreColumna: 'impuesto', cabecera: 'Impuesto', celda: (row: FacturaCompraLinea) => `${row.porcentajeDescuentoLinea}%` },
    { nombreColumna: 'subtotal', cabecera: 'Subtotal', celda: (row: FacturaCompraLinea) => `$${row.subtotalLinea}` },
    { nombreColumna: 'iva', cabecera: 'IVA', celda: (row: FacturaCompraLinea) => `$${row.importeIvaLinea}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: FacturaCompraLinea) => `$${row.totalLinea}` }
  ];
  cabeceraFacturaCompraLinea: string[] = this.columnasFacturaCompraLinea.map(titulo => titulo.nombreColumna);
  dataSourceFacturaCompraLinea: MatTableDataSource<FacturaCompraLinea> = new MatTableDataSource<FacturaCompraLinea>(this.notaDebitoCompra.facturaCompra.facturaCompraLineas);
  
  columnasLinea: any[] = [
    { nombreColumna: 'nombre', cabecera: 'Producto', celda: (row: NotaDebitoCompraLinea) => `${row.producto.nombre}` },
    { nombreColumna: 'medida', cabecera: 'Medida', celda: (row: NotaDebitoCompraLinea) => `${row.producto.medida.abreviatura}` },
    { nombreColumna: 'cantidad', cabecera: 'Cant.', celda: (row: NotaDebitoCompraLinea) => `${row.cantidad}` },
    { nombreColumna: 'costoUnitario', cabecera: 'P. Unit', celda: (row: NotaDebitoCompraLinea) => `$${row.costoUnitario}` },
    { nombreColumna: 'valorDescuentoLinea', cabecera: 'Desc. $', celda: (row: NotaDebitoCompraLinea) => `$${row.valorDescuentoLinea}` },
    { nombreColumna: 'subtotalLinea', cabecera: 'Subtotal', celda: (row: NotaDebitoCompraLinea) => `$${row.subtotalLinea}` },
    { nombreColumna: 'importeIvaLinea', cabecera: 'IVA', celda: (row: NotaDebitoCompraLinea) => `$${row.importeIvaLinea}` },
    { nombreColumna: 'totalLinea', cabecera: 'Total', celda: (row: NotaDebitoCompraLinea) => `$${row.totalLinea}` },
    { nombreColumna: 'entregado', cabecera: 'Entreg.', celda: (row: NotaDebitoCompraLinea) => `${row.entregado}` }
  ];
  cabeceraLinea: string[] = this.columnasLinea.map(titulo => titulo.nombreColumna);
  dataSourceLinea: MatTableDataSource<NotaDebitoCompraLinea> = new MatTableDataSource<NotaDebitoCompraLinea>(this.notaDebitoCompra.notaDebitoCompraLineas);
  clickedRowsLinea = new Set<NotaDebitoCompraLinea>();

  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("paginatorLinea") paginatorLinea: MatPaginator;
  @ViewChild("paginatorFacturaCompraLinea") paginatorFacturaCompraLinea: MatPaginator;

  constructor(private proveedorService: ProveedorService, private sesionService: SesionService, private impuestoService: ImpuestoService, private productoService: ProductoService, private datepipe: DatePipe,
    private router: Router, private notaDebitoCompraService: NotaDebitoCompraService, private facturaCompraService: FacturaCompraService, private spinnerService: NgxSpinnerService) { }

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
    this.consultarProveedores();
    this.consultarProductos();
    this.consultarImpuestos();
    this.inicializarFiltros();
  }

  inicializarFiltros(){
    this.filtroIdentificacionProveedores = this.controlIdentificacionProveedor.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(proveedor => typeof proveedor === 'string' ? this.filtroIdentificacionProveedor(proveedor) : this.proveedores.slice())
      );  
    this.filtroRazonSocialProveedores = this.controlRazonSocialProveedor.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(proveedor => typeof proveedor === 'string' ? this.filtroRazonSocialProveedor(proveedor) : this.proveedores.slice())
      );
    this.filtroFacturasCompras = this.controlFacturaCompra.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(facturaCompra => typeof facturaCompra === 'string' ? this.filtroFacturaCompra(facturaCompra) : this.facturasCompras.slice())
      );
    this.filtroProductos = this.controlProducto.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(producto => typeof producto === 'string' ? this.filtroProducto(producto) : this.productos.slice())
      );
  }
  
  private filtroIdentificacionProveedor(value: string): Proveedor[] {
    if(this.proveedores.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.proveedores.filter(proveedor => proveedor.identificacion.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verIdentificacionProveedor(proveedor: Proveedor): string {
    return proveedor && proveedor.identificacion ? proveedor.identificacion : valores.vacio;
  }

  private filtroRazonSocialProveedor(value: string): Proveedor[] {
    if(this.proveedores.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.proveedores.filter(proveedor => proveedor.razonSocial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verRazonSocialProveedor(proveedor: Proveedor): string {
    return proveedor && proveedor.razonSocial ? proveedor.razonSocial : valores.vacio;
  }

  private filtroFacturaCompra(value: string): FacturaCompra[] {
    if(this.facturasCompras.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.facturasCompras.filter(facturaCompra => facturaCompra.numeroComprobante.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verFacturaCompra(facturaCompra: FacturaCompra): string {
    return facturaCompra && facturaCompra.numeroComprobante ? facturaCompra.numeroComprobante : valores.vacio;
  }

  private filtroProducto(value: string): Producto[] {
    if(this.productos.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.productos.filter(producto => producto.nombre.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verProducto(producto: Producto): string {
    return producto && producto.nombre ? producto.nombre : valores.vacio;
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
    this.notaDebitoCompra = new NotaDebitoCompra();
    this.controlIdentificacionProveedor.patchValue(valores.vacio);
    this.controlRazonSocialProveedor.patchValue(valores.vacio);
    this.controlFacturaCompra.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<NotaDebitoCompraLinea>([]);
    this.dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>([]);
    this.clickedRows.clear();
  }

  nuevoLinea(){
    this.notaDebitoCompraLinea = new NotaDebitoCompraLinea();
    this.controlProducto.patchValue(valores.vacio);
  }

  construir() {
    let fecha = new Date(this.notaDebitoCompra.fecha);
    this.notaDebitoCompra.fecha = fecha;
    this.controlIdentificacionProveedor.patchValue(this.notaDebitoCompra.facturaCompra.proveedor);
    this.controlRazonSocialProveedor.patchValue(this.notaDebitoCompra.facturaCompra.proveedor);
    this.controlFacturaCompra.patchValue(this.notaDebitoCompra.facturaCompra);
    this.dataSourceLinea = new MatTableDataSource<NotaDebitoCompraLinea>(this.notaDebitoCompra.notaDebitoCompraLineas);
    this.dataSourceLinea.paginator = this.paginatorLinea;
    this.dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>(this.notaDebitoCompra.facturaCompra.facturaCompraLineas);
    this.dataSourceFacturaCompraLinea.paginator = this.paginatorFacturaCompraLinea;
  }

  consultar() {
    this.notaDebitoCompraService.consultarPorEmpresa(this.empresa.id).subscribe(
      res => {
        this.notasDebitosCompras = res.resultado as NotaDebitoCompra[]
        this.dataSource = new MatTableDataSource(this.notasDebitosCompras);
        this.dataSource.paginator = this.paginator;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarProveedores(){
    this.proveedorService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe(
      res => {
        this.proveedores = res.resultado as Proveedor[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarFacturasCompras(){
    this.facturaCompraService.consultarPorProveedorYEmpresaYEstadoDiferente(this.notaDebitoCompra.facturaCompra.proveedor.id, this.empresa.id, valores.estadoAnulada).subscribe(
      res => {
        this.facturasCompras = res.resultado as FacturaCompra[]
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

  seleccionarIdentificacionProveedor() {
    let proveedorId = this.controlIdentificacionProveedor.value.id;
    this.proveedorService.obtener(proveedorId).subscribe(
      res => {
        this.notaDebitoCompra.facturaCompra.proveedor = res.resultado as Proveedor;
        this.controlIdentificacionProveedor.patchValue(this.notaDebitoCompra.facturaCompra.proveedor);
        this.controlRazonSocialProveedor.patchValue(this.notaDebitoCompra.facturaCompra.proveedor);
        this.consultarFacturasCompras();
        this.consultarProductos();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarRazonSocialProveedor() {
    let proveedorId = this.controlRazonSocialProveedor.value.id;
    this.proveedorService.obtener(proveedorId).subscribe(
      res => {
        this.notaDebitoCompra.facturaCompra.proveedor = res.resultado as Proveedor;
        this.controlIdentificacionProveedor.patchValue(this.notaDebitoCompra.facturaCompra.proveedor);
        this.controlRazonSocialProveedor.patchValue(this.notaDebitoCompra.facturaCompra.proveedor);
        this.consultarFacturasCompras();
        this.consultarProductos();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarFacturaCompra() {
    let facturaCompraId = this.controlFacturaCompra.value.id;
    this.notaDebitoCompraService.obtenerPorFacturaCompra(facturaCompraId).subscribe(
      res => {
        this.notaDebitoCompra = res.resultado as NotaDebitoCompra;
        this.construir();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
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

  validarFormularioLinea(): boolean {
    if (this.notaDebitoCompraLinea.cantidad <= valores.cero) {
      return false;
    }
    if (this.notaDebitoCompraLinea.costoUnitario <= valores.cero) {
      return false;
    }
    if (this.notaDebitoCompraLinea.impuesto.id == valores.cero) {
      return false;
    }
    return true;
  }

  crearLinea() {
    if (!this.validarFormularioLinea())
      return;
    this.spinnerService.show();  
    this.notaDebitoCompra.sesion = this.sesion;
    this.notaDebitoCompra.empresa = this.empresa;
    this.notaDebitoCompra.notaDebitoCompraLineas.push(this.notaDebitoCompraLinea);
    this.notaDebitoCompraService.calcular(this.notaDebitoCompra).subscribe({
      next: res => {
        this.notaDebitoCompra = res.resultado as NotaDebitoCompra;
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

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.spinnerService.show();  
    this.notaDebitoCompra.sesion = this.sesion;
    this.notaDebitoCompra.empresa = this.empresa;
    this.notaDebitoCompraService.crear(this.notaDebitoCompra).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
        this.spinnerService.hide();
      },
      err => {
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }

  actualizar(event){
    if (event!=null)
      event.preventDefault();
    this.notaDebitoCompraService.actualizar(this.notaDebitoCompra).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);        
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  anular(event) {
    if (event != null)
      event.preventDefault();
    this.notaDebitoCompraService.anular(this.notaDebitoCompra).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionar(notaDebitoCompra: any) {
    if (!this.clickedRows.has(notaDebitoCompra)){
      this.clickedRows.clear();
      this.clickedRows.add(notaDebitoCompra);
      this.notaDebitoCompraService.obtener(notaDebitoCompra.id).subscribe({
        next: res => {
          this.notaDebitoCompra = res.resultado as NotaDebitoCompra;
          this.construir();
        },
        error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      });
    } else {
      this.clickedRows.clear();
      this.notaDebitoCompra = new NotaDebitoCompra();
    }
  }

  calcular(){
    this.notaDebitoCompraService.calcular(this.notaDebitoCompra).subscribe(
      res => {
        this.notaDebitoCompra = res.resultado as NotaDebitoCompra;
        this.construir();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  calcularLinea(){
    if (this.notaDebitoCompraLinea.cantidad == valores.cero){
      return;
    }
    if (this.notaDebitoCompraLinea.costoUnitario <= valores.cero){
      return;
    }
    if (this.notaDebitoCompraLinea.impuesto.id == valores.cero){
      return;
    }
    this.notaDebitoCompraService.calcularLinea(this.notaDebitoCompraLinea).subscribe(
      res => {
        this.notaDebitoCompraLinea = res.resultado as NotaDebitoCompraLinea;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  filtroFacturaCompraLinea(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFacturaCompraLinea.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceFacturaCompraLinea.paginator) {
      this.dataSourceFacturaCompraLinea.paginator.firstPage();
    }
  }

  filtroLinea(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceLinea.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceLinea.paginator) {
      this.dataSourceLinea.paginator.firstPage();
    }
  }

  seleccionarProducto() {
    this.notaDebitoCompraLinea.producto = this.controlProducto.value;
    this.notaDebitoCompraLinea.impuesto = this.notaDebitoCompraLinea.producto.impuesto;
  }

  limpiarNotaDebitoCompraLinea(){
    this.notaDebitoCompraLinea = new NotaDebitoCompraLinea();
    this.controlProducto.patchValue(valores.vacio);
  }

  agregarNotaDebitoCompraLinea(event){
    if (event != null)
      event.preventDefault();
    if (this.notaDebitoCompraLinea.cantidad == valores.cero){
      return;
    }
    if (this.notaDebitoCompraLinea.costoUnitario == valores.cero){
      return;
    }
    if (this.notaDebitoCompraLinea.impuesto.id == valores.cero){
      return;
    }
    this.notaDebitoCompra.sesion = this.sesion;
    this.notaDebitoCompra.notaDebitoCompraLineas.push(this.notaDebitoCompraLinea);
    this.notaDebitoCompraService.calcular(this.notaDebitoCompra).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.notaDebitoCompra = res.resultado as NotaDebitoCompra;
        this.construir();
        this.limpiarNotaDebitoCompraLinea();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminarLinea(i: number){
    this.notaDebitoCompra.notaDebitoCompraLineas.splice(i, 1);
    this.calcular();
  }

  rellenarNumeroEstablecimiento() {
    this.notaDebitoCompra.establecimiento = this.pad(this.notaDebitoCompra.establecimiento, 3);
  }

  rellenarNumeroPuntoVenta() {
    this.notaDebitoCompra.puntoVenta = this.pad(this.notaDebitoCompra.puntoVenta, 3);
  }

  rellenarNumeroSecuencial() {
    this.notaDebitoCompra.secuencial = this.pad(this.notaDebitoCompra.secuencial, 9);
  }

  private pad(numero: string, size: number): string {
    while (numero.length < size) numero = "0" + numero;
    return numero;
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  formateaNumero (valor) {
    return isNaN (valor) ? valor : parseFloat (valor).toFixed (2);
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

}