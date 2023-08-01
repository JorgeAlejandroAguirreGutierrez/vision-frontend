import { Component, HostListener, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { valores, mensajes, tablas, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

import { DatePipe } from '@angular/common';

import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Empresa } from '../../../modelos/usuario/empresa';
import { FacturaCompra } from 'src/app/modelos/compra/factura-compra';
import { FacturaCompraService } from 'src/app/servicios/compra/factura-compra.service';
import { FacturaCompraLinea } from 'src/app/modelos/compra/factura-compra-linea';
import { Proveedor } from 'src/app/modelos/compra/proveedor';
import { ProveedorService } from 'src/app/servicios/compra/proveedor.service';
import { Producto } from 'src/app/modelos/inventario/producto';
import { ProductoService } from 'src/app/servicios/inventario/producto.service';
import { Impuesto } from 'src/app/modelos/inventario/impuesto';
import { ImpuestoService } from 'src/app/servicios/inventario/impuesto.service';
import { Bodega } from 'src/app/modelos/inventario/bodega';
import { BodegaService } from 'src/app/servicios/inventario/bodega.service';
import { Kardex } from '../../../modelos/inventario/kardex';
import { KardexService } from '../../../servicios/inventario/kardex.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-factura-compra',
  templateUrl: './factura-compra.component.html',
  styleUrls: ['./factura-compra.component.scss']
})
export class FacturaCompraComponent implements OnInit {

  si: string = valores.si;
  no: string = valores.no;
  activo: string = valores.estadoActivo;
  inactivo: string = valores.estadoInactivo;
  ultimoCostoCompra: number = valores.cero;

  indiceLinea: number;

  abrirPanelFacturaCompra: boolean = true;
  abrirPanelFacturaCompraLinea: boolean = false;
  abrirPanelAdminFacturaCompra: boolean = true;
  verIconoEditarLinea: boolean = false;
  esBien: boolean = true;

  hoy = new Date();

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  facturaCompra: FacturaCompra = new FacturaCompra();
  facturaCompraLinea: FacturaCompraLinea = new FacturaCompraLinea();
  kardex: Kardex = new Kardex();
  kardexUltimaCompra: Kardex = new Kardex();

  facturasCompras: FacturaCompra[];
  proveedores: Proveedor[]=[];
  productos: Producto[] = [];
  bodegas: Bodega[]=[];
  impuestos: Impuesto[];

  controlProducto = new UntypedFormControl();
  controlIdentificacionProveedor = new UntypedFormControl();
  controlProveedor = new UntypedFormControl();

  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();
  filtroIdentificacionProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();
  filtroProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();

  columnasFacturaCompra: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: FacturaCompra) => `${row.codigo}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: FacturaCompra) => `${this.datepipe.transform(row.fecha, "dd-MM-yyyy")}`},
    { nombreColumna: 'factura', cabecera: 'Factura', celda: (row: FacturaCompra) => `${row.numeroComprobante}`},
    { nombreColumna: 'proveedor', cabecera: 'Proveedor', celda: (row: FacturaCompra) => `${row.proveedor.nombreComercial}`},
    { nombreColumna: 'subtotal', cabecera: 'Subtotal', celda: (row: FacturaCompra) => `$${row.subtotalSinDescuento}`},
    { nombreColumna: 'descuento', cabecera: 'Descuento', celda: (row: FacturaCompra) => `$${row.valorTotal}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: FacturaCompra) => `$${row.valorTotal}`},
    { nombreColumna: 'proceso', cabecera: 'Proceso', celda: (row: FacturaCompra) => `${row.estadoInterno}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: FacturaCompra) => `${row.estado}`}
  ];
  cabeceraFacturaCompra: string[]  = this.columnasFacturaCompra.map(titulo => titulo.nombreColumna);
  dataSourceFacturaCompra: MatTableDataSource<FacturaCompra>;
  clickedRowsFacturaCompra = new Set<FacturaCompra>();

  columnasLinea: any[] = [
    { nombreColumna: 'nombre', cabecera: 'Producto', celda: (row: FacturaCompraLinea) => `${row.producto.nombre}` },
    { nombreColumna: 'medida', cabecera: 'Medida', celda: (row: FacturaCompraLinea) => `${row.producto.medida.abreviatura}` },
    { nombreColumna: 'cantidad', cabecera: 'Cant.', celda: (row: FacturaCompraLinea) => `${row.cantidad}` },
    { nombreColumna: 'valor', cabecera: 'P. Unit', celda: (row: FacturaCompraLinea) => `$ ${row.costoPromedio}` },
    { nombreColumna: 'descuento', cabecera: 'Desc. $', celda: (row: FacturaCompraLinea) => `$ ${row.valorDescuentoLinea}` },
    { nombreColumna: 'descuentoPorcentaje', cabecera: 'Desc. %', celda: (row: FacturaCompraLinea) => `${row.porcentajeDescuentoLinea} %` },
    { nombreColumna: 'subtotal', cabecera: 'Subtotal', celda: (row: FacturaCompraLinea) => `$ ${row.subtotalConDescuentoLinea}` },
    { nombreColumna: 'impuesto', cabecera: 'IVA', celda: (row: FacturaCompraLinea) => `$ ${row.importeIvaLinea}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: FacturaCompraLinea) => `$ ${row.totalLinea}` },
    { nombreColumna: 'bodega', cabecera: 'bodega', celda: (row: FacturaCompraLinea) => `${row.bodega.abreviatura}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones' }
  ];
  cabeceraLinea: string[] = this.columnasLinea.map(titulo => titulo.nombreColumna);
  dataSourceLinea: MatTableDataSource<FacturaCompraLinea> = new MatTableDataSource<FacturaCompraLinea>(this.facturaCompra.facturaCompraLineas);
  clickedRowsLinea = new Set<FacturaCompraLinea>();

  @ViewChild("paginatorFacturaCompra") paginatorFacturaCompra: MatPaginator;
  @ViewChild("paginatorLinea") paginatorLinea: MatPaginator;
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
      this.crearFacturaCompraLinea();
  }

  constructor(private renderer: Renderer2, private proveedorService: ProveedorService, private sesionService: SesionService, 
    private datepipe: DatePipe, private kardexService: KardexService, private impuestoService: ImpuestoService, 
    private router: Router, private facturaCompraService: FacturaCompraService, private productoService: ProductoService, 
    private bodegaService: BodegaService, private spinnerService: NgxSpinnerService) { }


  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.empresa;
    this.consultar();
    this.consultarProveedores();
    this.consultarProductos();
    this.consultarImpuestos();
    this.consultarBodegas();
    this.inicializarFiltros();
  }

  consultarProveedores(){
    this.proveedorService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.proveedores = res.resultado as Proveedor[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
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
    this.impuestoService.consultar().subscribe({
      next: res => {
        this.impuestos = res.resultado as Impuesto[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  consultarBodegas(){
    this.bodegaService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe(
      res => {
        this.bodegas = res.resultado as Bodega[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  nuevo(){
    this.facturaCompra = new FacturaCompra();
    this.hoy = new Date();
    this.facturaCompra.fecha = this.hoy;
    this.controlIdentificacionProveedor.patchValue(valores.vacio);
    this.controlProveedor.patchValue(valores.vacio);
    this.controlProducto.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<FacturaCompraLinea>([]);
    this.clickedRowsFacturaCompra.clear();
    this.nuevoFacturaCompraLinea();
    this.abrirPanelFacturaCompra = true;
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.spinnerService.show();   
    this.facturaCompra.numeroComprobante = this.facturaCompra.establecimiento + valores.guion + this.facturaCompra.puntoVenta + valores.guion + this.facturaCompra.secuencial;
    this.facturaCompra.sesion = this.sesion;
    this.facturaCompra.empresa = this.empresa;
    this.facturaCompraService.crear(this.facturaCompra).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
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

  actualizar(event){
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;  
    console.log(this.facturaCompra);  
    this.spinnerService.show();
    this.facturaCompraService.actualizar(this.facturaCompra).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
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

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.facturaCompraService.activar(this.facturaCompra).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inactivar(event) {
    if (event != null)
      event.preventDefault();
    this.facturaCompraService.inactivar(this.facturaCompra).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.facturaCompraService.consultarPorEmpresa(this.empresa.id).subscribe({
      next: res => {
        this.facturasCompras = res.resultado as FacturaCompra[];
        this.llenarTablaFacturaCompra(this.facturasCompras);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaFacturaCompra(facturasCompras: FacturaCompra[]) {
    this.dataSourceFacturaCompra = new MatTableDataSource(facturasCompras);
    this.dataSourceFacturaCompra.filterPredicate = (data: FacturaCompra, filter: string): boolean =>
      this.datepipe.transform(data.fecha, valores.fechaCorta).includes(filter) || data.numeroComprobante.includes(filter) || 
      data.proveedor.nombreComercial.includes(filter) || data.estadoInterno.includes(filter) || data.estado.includes(filter);
      this.dataSourceFacturaCompra.paginator = this.paginatorFacturaCompra;
    this.dataSourceFacturaCompra.sort = this.sort;
  }

  seleccion(facturaCompra: any) {
    if (!this.clickedRowsFacturaCompra.has(facturaCompra)){
      this.clickedRowsFacturaCompra.clear();
      this.clickedRowsFacturaCompra.add(facturaCompra);
      this.obtenerFacturaCompra(facturaCompra.id)
    } else {
      this.nuevo();
    }
  }

  obtenerFacturaCompra(id: number){
    this.facturaCompraService.obtener(id).subscribe({
      next: res => {
        this.facturaCompra = res.resultado as FacturaCompra;
        this.construir();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  construir() {
    let fecha = new Date(this.facturaCompra.fecha);
    this.facturaCompra.fecha = fecha;
    this.controlIdentificacionProveedor.patchValue(this.facturaCompra.proveedor);
    this.controlProveedor.patchValue(this.facturaCompra.proveedor);
    this.llenarTablaFacturaCompraLinea(this.facturaCompra.facturaCompraLineas);
  }

  filtroFacturaCompra(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFacturaCompra.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceFacturaCompra.paginator) {
      this.dataSourceFacturaCompra.paginator.firstPage();
    }
  }
  borrarFiltroFacturaCompra() {
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', '');
    this.dataSourceFacturaCompra.filter = '';
  }

  seleccionarProveedor() {
    let proveedorId = this.controlProveedor.value.id;
    this.proveedorService.obtener(proveedorId).subscribe({
      next: res => {
        this.facturaCompra.proveedor = res.resultado as Proveedor;
        this.controlIdentificacionProveedor.patchValue(this.facturaCompra.proveedor);
        this.controlProveedor.patchValue(this.facturaCompra.proveedor);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarIdentificacionProveedor() {
    let proveedorId = this.controlIdentificacionProveedor.value.id;
    this.proveedorService.obtener(proveedorId).subscribe({
      next: res => {
        Object.assign(this.facturaCompra.proveedor, res.resultado as Proveedor);
        this.controlIdentificacionProveedor.patchValue(this.facturaCompra.proveedor);
        this.controlProveedor.patchValue(this.facturaCompra.proveedor);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  //CRUD FACTURA COMPRA LINEA
  nuevoFacturaCompraLinea(){
    this.facturaCompraLinea = new FacturaCompraLinea();
    this.kardex = new Kardex();
    this.controlProducto.patchValue(valores.vacio)
    this.clickedRowsLinea.clear();
    this.verIconoEditarLinea = false;
  }

  crearFacturaCompraLinea(){
    if (!this.validarFormularioLinea())
      return;
    this.spinnerService.show();
    this.facturaCompra.sesion = this.sesion;
    this.facturaCompra.facturaCompraLineas.push(this.facturaCompraLinea);
    this.facturaCompraService.calcular(this.facturaCompra).subscribe({
      next: res => {
        this.facturaCompra = res.resultado as FacturaCompra;
        this.construir();
        this.nuevoFacturaCompraLinea();
        this.spinnerService.hide();
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.spinnerService.hide();
      }  
    });
  }

  actualizarFacturaCompraLinea() {
    this.facturaCompra.facturaCompraLineas[this.indiceLinea] = this.facturaCompraLinea;
    this.llenarTablaFacturaCompraLinea(this.facturaCompra.facturaCompraLineas);
    this.calcularTotales();
    this.nuevoFacturaCompraLinea();
    this.verIconoEditarLinea = false;
  }

  eliminarFacturaCompraLinea(i: number){
    this.facturaCompra.facturaCompraLineas.splice(i, 1);
    this.calcularTotales();
    this.nuevoFacturaCompraLinea();
  }

  llenarTablaFacturaCompraLinea(facturaCompraLineas: FacturaCompraLinea[]) {
    this.dataSourceLinea = new MatTableDataSource(facturaCompraLineas);
    this.dataSourceLinea.filterPredicate = (data: FacturaCompraLinea, filter: string): boolean =>
      data.producto.nombre.includes(filter) || data.producto.medida.abreviatura.includes(filter) || String(data.cantidad).includes(filter) || 
      String(data.costoPromedio).includes(filter) || String(data.totalLinea).includes(filter) || data.bodega.abreviatura.includes(filter);
    this.dataSourceLinea.paginator = this.paginatorLinea;
    this.dataSourceLinea.sort = this.sortLinea;
  }

  seleccionFacturaCompraLinea(facturaCompraLinea: FacturaCompraLinea, i:number) {
    if (!this.clickedRowsLinea.has(facturaCompraLinea)) {
      this.clickedRowsLinea.clear();
      this.clickedRowsLinea.add(facturaCompraLinea);
      this.facturaCompraLinea = { ...facturaCompraLinea };
      this.indiceLinea = i;
      this.construirFacturaCompraLinea();
      this.verIconoEditarLinea = true;
    } else {
      this.nuevoFacturaCompraLinea();
    }
  }

  construirFacturaCompraLinea(){
    this.controlProducto.patchValue(this.facturaCompraLinea.producto);
  }

  filtroFacturaCompraLinea(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceLinea.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceLinea.paginator) {
      this.dataSourceLinea.paginator.firstPage();
    }
  }

  borrarFiltroFacturaCompraLinea() {
    this.renderer.setProperty(this.inputFiltroLinea.nativeElement, 'value', '');
    this.dataSourceLinea.filter = '';
  }

  calcularFacturaCompraLinea(){
    if (!this.validarFormularioLinea())
    return;
    this.facturaCompraService.calcularLinea(this.facturaCompraLinea).subscribe({
      next: res => {
        this.facturaCompraLinea = res.resultado as FacturaCompraLinea;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  calcularTotales(){
    this.facturaCompraService.calcular(this.facturaCompra).subscribe({
      next: res => {
        this.facturaCompra = res.resultado as FacturaCompra;
        this.llenarTablaFacturaCompraLinea(this.facturaCompra.facturaCompraLineas);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarProducto() {
    this.facturaCompraLinea.producto = this.controlProducto.value;
    this.facturaCompraLinea.impuesto = this.facturaCompraLinea.producto.impuesto;
    if (this.facturaCompraLinea.producto.categoriaProducto.id == 1){
      this.esBien = true } else { this.esBien = false };
    this.inicializarOpciones();
    if (this.esBien){
      this.obtenerUltimoKardex();
      this.obtenerUltimaCompra();
    }
  }

  obtenerUltimoKardex(){
    this.kardexService.obtenerUltimoPorProductoYBodega(this.facturaCompraLinea.producto.id, this.facturaCompraLinea.bodega.id).subscribe({
      next: res => {
        if (res.resultado == null) {
          Swal.fire({ icon: error_swal, title: error, text: mensajes.error_kardex_vacio });
          return;
        }
        this.kardex = res.resultado as Kardex;
        this.facturaCompraLinea.costoUnitario = this.kardex.costoPromedio;
        this.calcularFacturaCompraLinea();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  obtenerUltimaCompra(){
    this.kardexService.obtenerUltimoPorProductoYBodegaYTablaTipoComprobante(this.facturaCompraLinea.producto.id, this.facturaCompraLinea.bodega.id, tablas.facturaCompra).subscribe({
      next: res => {
        if (res.resultado == null) {
          this.ultimoCostoCompra = valores.cero;
          return;
        }
        this.kardexUltimaCompra = res.resultado as Kardex;
        this.ultimoCostoCompra = this.kardexUltimaCompra.debe;
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  inicializarOpciones() {
    this.facturaCompraLinea.bodega = this.bodegas[0];
  }

  pagar(event){
    if (event != null)
      event.preventDefault();
    this.facturaCompraService.pagar(this.facturaCompra.id).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo();
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }  
    });
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

  rellenarNumeroEstablecimiento() {
    this.facturaCompra.establecimiento = this.pad(this.facturaCompra.establecimiento, 3);
  }

  rellenarNumeroPuntoVenta() {
    this.facturaCompra.puntoVenta = this.pad(this.facturaCompra.puntoVenta, 3);
  }

  rellenarNumeroSecuencial() {
    this.facturaCompra.secuencial = this.pad(this.facturaCompra.secuencial, 9);
  }

  pad(numero: string, size: number): string {
    while (numero.length < size) numero = "0" + numero;
    return numero;
  }

  //FILTROS AUTOCOMPLETE
  inicializarFiltros() {
    this.filtroProductos = this.controlProducto.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(nombre => typeof nombre === 'string' ? this.filtroProducto(nombre) : this.productos.slice())
      );
    this.filtroIdentificacionProveedores = this.controlIdentificacionProveedor.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(identificacion => typeof identificacion === 'string' ? this.filtroIdentificacionProveedor(identificacion) : this.proveedores.slice())
    );
    this.filtroProveedores = this.controlProveedor.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(proveedor => typeof proveedor === 'string' ? this.filtroProveedor(proveedor) : this.proveedores.slice())
      );
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

  private filtroIdentificacionProveedor(value: string): Proveedor[] {
    if (this.proveedores.length > 0) {
      const filterValue = value.toUpperCase();
      return this.proveedores.filter(proveedor => proveedor.identificacion.toUpperCase().includes(filterValue));
    }
    return [];
  }
  verIdentificacionProveedor(proveedor: Proveedor): string {
    return proveedor && proveedor.identificacion ? proveedor.identificacion : valores.vacio;
  }

  private filtroProveedor(value: string): Proveedor[] {
    if(this.proveedores.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.proveedores.filter(proveedor => proveedor.razonSocial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verProveedor(proveedor: Proveedor): string {
    return proveedor && proveedor.razonSocial ? proveedor.razonSocial : valores.vacio;
  }

  //VALIDACIONES
  validarFormulario(): boolean {
    if (this.facturaCompra.fecha == null || this.facturaCompra.fecha > this.hoy){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_fecha });
      return false;
    }
    if (this.facturaCompra.proveedor.id == valores.cero){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.facturaCompra.establecimiento == valores.vacio || this.facturaCompra.puntoVenta == valores.vacio ||
      this.facturaCompra.secuencial == valores.vacio){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.facturaCompra.valorTotal <= valores.cero){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }  

  validarFormularioLinea(): boolean {
    if (this.facturaCompraLinea.cantidad <= valores.cero){
      return false;
    }
    if (this.facturaCompraLinea.costoUnitario <= valores.cero){
      return false;
    }
    if (this.facturaCompraLinea.impuesto.id == valores.cero){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.facturaCompraLinea.producto.id == valores.cero){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.facturaCompraLinea.bodega.id == valores.cero){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }  
}
