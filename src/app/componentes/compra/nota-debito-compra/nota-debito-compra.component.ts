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
import { Kardex } from 'src/app/modelos/inventario/kardex';
import { Impuesto } from 'src/app/modelos/inventario/impuesto';
import { ImpuestoService } from 'src/app/servicios/inventario/impuesto.service';
import { Bodega } from 'src/app/modelos/inventario/bodega';
import { BodegaService } from 'src/app/servicios/inventario/bodega.service';
import { ProductoService } from 'src/app/servicios/inventario/producto.service';
import { FacturaCompraLinea } from 'src/app/modelos/compra/factura-compra-linea';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-nota-debito-compra',
  templateUrl: './nota-debito-compra.component.html',
  styleUrls: ['./nota-debito-compra.component.scss']
})

export class NotaDebitoCompraComponent implements OnInit {

  panelOpenState = false;

  hoy = new Date();

  deshabilitarDevolucion = true;
  deshabilitarDescuento = true;
  
  si = valores.si;
  no = valores.no;
  estadoPorPagar: string = valores.estadoPorPagar;
  estadoPagada: string = valores.estadoPagada;
  estadoAnulada: string = valores.estadoAnulada;
  
  controlIdentificacionProveedor = new UntypedFormControl();
  controlNombreComercialProveedor = new UntypedFormControl();
  controlFacturaCompra = new UntypedFormControl();
  controlProducto = new UntypedFormControl();
  filtroIdentificacionProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();
  filtroNombreComercialProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();
  filtroFacturasCompras: Observable<FacturaCompra[]> = new Observable<FacturaCompra[]>();
  proveedores: Proveedor[] = [];  
  facturasCompras: FacturaCompra[] = [];
  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();
  productos: Producto[] = [];
  impuestos: Impuesto[] = [];
  bodegas: Bodega[] = [];

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
  abrirPanelAdmin = false;
  notasDebitosCompras: NotaDebitoCompra[] = [];
  
  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("paginatorLinea") paginatorLinea: MatPaginator;
  @ViewChild("paginatorFacturaCompraLinea") paginatorFacturaCompraLinea: MatPaginator;

  notaDebitoCompra: NotaDebitoCompra = new NotaDebitoCompra();
  notaDebitoCompraLinea: NotaDebitoCompraLinea = new NotaDebitoCompraLinea();
  kardex: Kardex = new Kardex();

  columnasLinea: string[] = ["codigo", 'nombre', 'medida', 'cantidad', 'costoUnitario', 'descuento', 'impuesto', 'bodega', 'total'];
  dataSourceLinea = new MatTableDataSource<NotaDebitoCompraLinea>(this.notaDebitoCompra.notaDebitoCompraLineas);
  columnasFacturaCompraLinea: string[] = ["codigo", 'nombre', 'medida', 'cantidad', 'costoUnitario', 'valorDescuento', 'porcentajeDescuento', 'impuesto', 'bodega', 'total'];
  dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>(this.notaDebitoCompra.facturaCompra.facturaCompraLineas);
  sesion: Sesion = null;
  empresa: Empresa = null;

  constructor(private proveedorService: ProveedorService, private sesionService: SesionService, private kardexService: KardexService, private impuestoService: ImpuestoService, private productoService: ProductoService, private datepipe: DatePipe,
    private router: Router, private notaDebitoCompraService: NotaDebitoCompraService, private facturaCompraService: FacturaCompraService, private bodegaService: BodegaService) { }

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
    this.consultarImpuestos();
    this.consultarBodegas();
    this.filtroIdentificacionProveedores = this.controlIdentificacionProveedor.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(proveedor => typeof proveedor === 'string' ? this.filtroIdentificacionProveedor(proveedor) : this.proveedores.slice())
      );  
    this.filtroNombreComercialProveedores = this.controlNombreComercialProveedor.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(proveedor => typeof proveedor === 'string' ? this.filtroNombreComercialProveedor(proveedor) : this.proveedores.slice())
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

  private filtroNombreComercialProveedor(value: string): Proveedor[] {
    if(this.proveedores.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.proveedores.filter(proveedor => proveedor.nombreComercial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verNombreComercialProveedor(proveedor: Proveedor): string {
    return proveedor && proveedor.nombreComercial ? proveedor.nombreComercial : valores.vacio;
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
    this.controlNombreComercialProveedor.patchValue(valores.vacio);
    this.controlFacturaCompra.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<NotaDebitoCompraLinea>([]);
    this.dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>([]);
    this.clickedRows.clear();
  }

  construir() {
    let fecha = new Date(this.notaDebitoCompra.fecha);
    this.notaDebitoCompra.fecha = fecha;
    this.controlIdentificacionProveedor.patchValue(this.notaDebitoCompra.facturaCompra.proveedor);
    this.controlNombreComercialProveedor.patchValue(this.notaDebitoCompra.facturaCompra.proveedor);
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
    this.facturaCompraService.consultarPorEmpresaYProveedorYEstado(this.empresa.id, this.notaDebitoCompra.facturaCompra.proveedor.id, valores.estadoEmitida).subscribe(
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

  consultarBodegas(){
    this.bodegaService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe(
      res => {
        this.bodegas = res.resultado as Bodega[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarProductos(){
    this.productoService.consultarPorCategoriaProductoYProveedorYEmpresaYEstado(valores.bien, this.notaDebitoCompra.facturaCompra.proveedor.id, this.empresa.id, valores.estadoActivo).subscribe(
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
        this.controlNombreComercialProveedor.patchValue(this.notaDebitoCompra.facturaCompra.proveedor);
        this.consultarFacturasCompras();
        this.consultarProductos();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }


  seleccionarNombreComercialProveedor() {
    let proveedorId = this.controlNombreComercialProveedor.value.id;
    this.proveedorService.obtener(proveedorId).subscribe(
      res => {
        this.notaDebitoCompra.facturaCompra.proveedor = res.resultado as Proveedor;
        this.controlIdentificacionProveedor.patchValue(this.notaDebitoCompra.facturaCompra.proveedor);
        this.controlNombreComercialProveedor.patchValue(this.notaDebitoCompra.facturaCompra.proveedor);
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

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.notaDebitoCompra.sesion = this.sesion;
    this.notaDebitoCompra.empresa = this.empresa;
    this.notaDebitoCompraService.crear(this.notaDebitoCompra).subscribe(
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

  seleccion(notaDebitoCompra: any) {
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

  seleccionarBodega(){
    if(this.notaDebitoCompraLinea.producto.id == valores.cero || this.notaDebitoCompraLinea.bodega.id == valores.cero || this.notaDebitoCompra.facturaCompra.proveedor.id == valores.cero){
      return;
    }
    this.kardexService.obtenerUltimoPorProductoYBodega(this.notaDebitoCompraLinea.producto.id, this.notaDebitoCompraLinea.bodega.id).subscribe(
      res => {
        if (res.resultado == null){
          Swal.fire({ icon: error_swal, title: error, text: mensajes.error_kardex_vacio });
          return;
        }
        this.kardex = res.resultado as Kardex;
        this.notaDebitoCompraLinea.costoUnitario = this.kardex.costoPromedio;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
    this.calcularLinea();
  }

  seleccionarProducto() {
    this.notaDebitoCompraLinea.producto = this.controlProducto.value;
    this.notaDebitoCompraLinea.impuesto = this.notaDebitoCompraLinea.producto.impuesto;
    if(this.notaDebitoCompraLinea.producto.id == valores.cero || this.notaDebitoCompraLinea.bodega.id == valores.cero || this.notaDebitoCompra.facturaCompra.proveedor.id == valores.cero){
      return;
    }
    this.kardexService.obtenerUltimoPorProductoYBodega(this.notaDebitoCompraLinea.producto.id, this.notaDebitoCompraLinea.bodega.id).subscribe(
      res => {
        if (res.resultado == null){
          Swal.fire({ icon: error_swal, title: error, text: mensajes.error_kardex_vacio });
          return;
        }
        this.kardex = res.resultado as Kardex;
        this.notaDebitoCompraLinea.costoUnitario = this.kardex.costoPromedio;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  limpiarNotaDebitoCompraLinea(){
    this.notaDebitoCompraLinea = new NotaDebitoCompraLinea();
    this.kardex = new Kardex();
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

  eliminarNotaDebitoCompraLinea(i: number){
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

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

}