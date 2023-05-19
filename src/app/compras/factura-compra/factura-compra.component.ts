import { Component, HostListener, OnInit, ViewChild, Type, ElementRef, Renderer2 } from '@angular/core';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../modelos/format-date-picker';

import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
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

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-factura-compra',
  templateUrl: './factura-compra.component.html',
  styleUrls: ['./factura-compra.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class FacturaCompraComponent implements OnInit {

  si = valores.si;
  no = valores.no;
  emitida = valores.emitida;
  anulada = valores.anulada;
  noFacturada = valores.noFacturada;
  facturada = valores.facturada;
  noRecaudada = valores.noRecaudada;
  recaudada = valores.recaudada;

  abrirPanelFacturaCompra: boolean = true;
  abrirPanelFacturaCompraLinea: boolean = false;
  abrirPanelAdminFacturaCompra: boolean = true;
  deshabilitarProveedor = false;

  hoy = new Date();

  sesion: Sesion;

  proveedores: Proveedor[]=[];
  productos: Producto[] = [];
  bodegas: Bodega[]=[];
  impuestos: Impuesto[];

  seleccionProducto = new UntypedFormControl();
  seleccionProveedor = new UntypedFormControl();

  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();
  filtroProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: FacturaCompra) => `${row.codigo}`},
    { nombreColumna: 'serie', cabecera: 'Serie', celda: (row: FacturaCompra) => `${row.serie}`},
    { nombreColumna: 'secuencial', cabecera: 'Secuencial', celda: (row: FacturaCompra) => `${row.secuencial}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: FacturaCompra) => `${this.datepipe.transform(row.fecha, "dd-MM-yyyy")}`},
    { nombreColumna: 'proveedor', cabecera: 'Proveedor', celda: (row: FacturaCompra) => `${row.proveedor.razonSocial}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: FacturaCompra) => `$${row.totalSinDescuento}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: FacturaCompra) => `${row.estado}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSourceFacturaCompra: MatTableDataSource<FacturaCompra>;
  clickedRows = new Set<FacturaCompra>();
  abrirPanelAdmin = false;
  facturasCompras: FacturaCompra[];
  
  @ViewChild("paginatorFacturaCompra") paginatorFacturaCompra: MatPaginator;
  @ViewChild("paginatorFacturaCompraLinea") paginatorFacturaCompraLinea: MatPaginator;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G") //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N") //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "A") // SHIFT + A
      this.agregarFacturaCompraLinea(null);
  }
  
  constructor(private proveedorService: ProveedorService, private sesionService: SesionService, private datepipe: DatePipe,
    private impuestoService: ImpuestoService, private router: Router, private facturaCompraService: FacturaCompraService,
    private productoService: ProductoService, private bodegaService: BodegaService) { }

  facturaCompra: FacturaCompra = new FacturaCompra();
  facturaCompraLinea: FacturaCompraLinea = new FacturaCompraLinea();

  columnasFacturaCompraLinea: string[] = ["codigo", 'nombre', 'medida', 'cantidad', 'costoUnitario', 'valorDescuento', 'porcentajeDescuento', 'impuesto', 'bodega', 'total', 'acciones'];
  dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>(this.facturaCompra.facturaCompraLineas);

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
    this.consultarProveedores();
    this.consultarImpuestos();
    this.consultarBodegas();
    this.inicializarFiltros();
  }

  consultar() {
    this.facturaCompraService.consultar().subscribe(
      res => {
        this.facturasCompras = res.resultado as FacturaCompra[]
        this.dataSourceFacturaCompra = new MatTableDataSource(this.facturasCompras);
        this.dataSourceFacturaCompra.paginator = this.paginatorFacturaCompra;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
 consultarProveedores(){
    this.proveedorService.consultar().subscribe(
      res => {
        this.proveedores = res.resultado as Proveedor[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  consultarImpuestos() {
    this.impuestoService.consultar().subscribe(
      res => {
        this.impuestos = res.resultado as Impuesto[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  consultarBodegas(){
    this.bodegaService.consultar().subscribe(
      res => {
        this.bodegas = res.resultado as Bodega[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarBienPorProveedor(proveedorId: number) {
    this.productoService.consultarBienPorProveedor(proveedorId).subscribe(
      res => {
        this.productos = res.resultado as Producto[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarServicios() {
    this.productoService.consultarServicio().subscribe(
      res => {
        this.productos = res.resultado as Producto[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarActivosFijos() {
    this.productoService.consultarActivoFijo().subscribe(
      res => {
        this.productos = res.resultado as Producto[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
    this.facturaCompra = new FacturaCompra();
    this.seleccionProveedor.patchValue(valores.vacio);
    this.seleccionProducto.patchValue(valores.vacio);
    this.dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>([]);
    this.clickedRows.clear();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.facturaCompra.sesion=this.sesion;
    this.facturaCompraService.crear(this.facturaCompra).subscribe(
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
    this.facturaCompraService.actualizar(this.facturaCompra).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);        
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  construir() {
    let fecha = new Date(this.facturaCompra.fecha);
    this.facturaCompra.fecha = fecha;
    this.seleccionProveedor.patchValue(this.facturaCompra.proveedor);
    this.dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>(this.facturaCompra.facturaCompraLineas);
    this.dataSourceFacturaCompraLinea.paginator = this.paginatorFacturaCompraLinea;
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.facturaCompraService.activar(this.facturaCompra).subscribe({
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
    this.facturaCompraService.inactivar(this.facturaCompra).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  eliminarFacturaCompraLinea(i: number){
    this.facturaCompra.facturaCompraLineas.splice(i, 1);
    this.calcular();
  }

  seleccion(facturaCompra: any) {
    if (!this.clickedRows.has(facturaCompra)){
      this.clickedRows.clear();
      this.clickedRows.add(facturaCompra);
      this.facturaCompraService.obtener(facturaCompra.id).subscribe({
        next: res => {
          this.facturaCompra = res.resultado as FacturaCompra;
          this.construir();
        },
        error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      });
    } else {
      this.nuevo(null);
    }
  }

  seleccionarProveedor() {
    let proveedorId = this.seleccionProveedor.value.id;
    this.proveedorService.obtener(proveedorId).subscribe(
      res => {
        this.facturaCompra.proveedor = res.resultado as Proveedor;
        this.construir();
        this.consultarBienPorProveedor(this.facturaCompra.proveedor.id);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  calcular(){
    this.facturaCompraService.calcular(this.facturaCompra).subscribe(
      res => {
        this.facturaCompra = res.resultado as FacturaCompra;
        this.construir();
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

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFacturaCompra.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceFacturaCompra.paginator) {
      this.dataSourceFacturaCompra.paginator.firstPage();
    }
  }

  seleccionarProducto() {
    this.facturaCompraLinea.producto=this.seleccionProducto.value;
  }

  seleccionarCantidad() {
    if (!this.validarFormularioLinea())
      return;
    this.calcularLinea();
  }
  
  seleccionarValorDescuentoLinea() {
    if (!this.validarFormularioLinea())
      return;
    this.calcularLinea();
  }

  seleccionarPorcentajeDescuentoLinea() {
    if (!this.validarFormularioLinea())
      return;
    this.calcularLinea();
  }

  seleccionarBodega(){
    if (!this.validarFormularioLinea())
      return;
    this.calcularLinea();
  }

  seleccionarCostoUnitario(){
    if (!this.validarFormularioLinea())
      return;
    this.calcularLinea();
  }

  seleccionarImpuesto(){
    if (!this.validarFormularioLinea())
      return;
    this.calcularLinea();
  }

  nuevoFacturaCompraLinea(){
    this.facturaCompraLinea = new FacturaCompraLinea();
    this.seleccionProducto.patchValue(valores.vacio)
  }

  agregarFacturaCompraLinea(event){
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormularioLinea())
      return;
    if (this.facturaCompraLinea.totalSinDescuentoLinea <= valores.cero){
      return;
    }
    this.facturaCompra.facturaCompraLineas.push(this.facturaCompraLinea);
    this.facturaCompraService.calcular(this.facturaCompra).subscribe(
      res => {
        this.facturaCompra = res.resultado as FacturaCompra;
        this.construir();
        this.deshabilitarProveedor = true;
        this.nuevoFacturaCompraLinea();
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  calcularLinea(){
    this.facturaCompraService.calcularLinea(this.facturaCompraLinea).subscribe(
      res => {
        this.facturaCompraLinea = res.resultado as FacturaCompraLinea;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }


  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  //FILTROS AUTOCOMPLETE
  inicializarFiltros() {
    this.filtroProductos = this.seleccionProducto.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(nombre => typeof nombre === 'string' ? this.filtroProducto(nombre) : this.productos.slice())
      );
    this.filtroProveedores = this.seleccionProveedor.valueChanges
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
  validarFormularioLinea(): boolean {
    if (this.facturaCompraLinea.cantidad <= valores.cero){
      return false;
    }
    if (this.facturaCompraLinea.costoUnitario <= valores.cero){
      return false;
    }
    if (this.facturaCompraLinea.impuesto.id == valores.cero){
      return false;
    }
    if (this.facturaCompraLinea.producto.id == valores.cero){
      return false;
    }
    if (this.facturaCompraLinea.bodega.id == valores.cero){
      return false;
    }
    return true;
  }  
}
