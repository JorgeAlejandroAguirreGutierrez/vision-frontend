import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { startWith, map } from 'rxjs/operators';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Sesion } from '../../modelos/usuario/sesion';
import { valores, validarSesion, otras, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { FacturaCompra } from 'src/app/modelos/compra/factura-compra';
import { Producto } from 'src/app/modelos/inventario/producto';
import { ImpuestoService } from 'src/app/servicios/inventario/impuesto.service';
import { ProveedorService } from 'src/app/servicios/compra/proveedor.service';
import { FacturaCompraLinea } from 'src/app/modelos/compra/factura-compra-linea';
import { Proveedor } from 'src/app/modelos/compra/proveedor';
import { Impuesto } from 'src/app/modelos/inventario/impuesto';
import { ProductoService } from 'src/app/servicios/inventario/producto.service';
import { FacturaCompraService } from 'src/app/servicios/compra/factura-compra.service';
import { Bodega } from 'src/app/modelos/inventario/bodega';
import { BodegaService } from 'src/app/servicios/inventario/bodega.service';

@Component({
  selector: 'app-factura-compra',
  templateUrl: './factura-compra.component.html',
  styleUrls: ['./factura-compra.component.scss']
})
export class FacturaCompraComponent implements OnInit {

  panelOpenState = false;

  deshabilitarProveedor = false;
  
  seleccionProducto = new UntypedFormControl();
  seleccionProveedor = new UntypedFormControl();

  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();
  filtroProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: FacturaCompra) => `${row.codigo}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: FacturaCompra) => `${row.fecha}`},
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
  

  constructor(private proveedorService: ProveedorService, private sesionService: SesionService,
    private impuestoService: ImpuestoService, private router: Router, private facturaCompraService: FacturaCompraService,
    private productoService: ProductoService, private bodegaService: BodegaService) { }

  facturaCompra: FacturaCompra = new FacturaCompra();
  facturaCompraLinea: FacturaCompraLinea = new FacturaCompraLinea();

  columnasFacturaCompraLinea: string[] = ["codigo", 'nombre', 'medida', 'cantidad', 'costoUnitario', 'valorDescuento', 'porcentajeDescuento', 'impuesto', 'bodega', 'total', 'acciones'];
  dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>(this.facturaCompra.facturaCompraLineas);

  proveedores: Proveedor[]=[];
  productos: Producto[] = [];
  bodegas: Bodega[]=[];

  sesion: Sesion;
  impuestos: Impuesto[];

  si = valores.si;
  no = valores.no;
  emitida = valores.emitida;
  anulada = valores.anulada;
  noFacturada = valores.noFacturada;
  facturada = valores.facturada;
  noRecaudada = valores.noRecaudada;
  recaudada = valores.recaudada;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G") //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N") //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "A") // SHIFT + A
      this.agregarFacturaCompraLinea(null);
  }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
    this.consultarProveedores();
    this.consultarImpuestos();
    this.consultarBodegas();

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

  nuevo(event){
    if (event!=null)
      event.preventDefault();
    this.facturaCompra = new FacturaCompra();
    this.seleccionProveedor.patchValue(valores.vacio);
    this.seleccionProducto.patchValue(valores.vacio);
    this.dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>([]);
    this.clickedRows.clear();
  }

  construirFactura() {
    if (this.facturaCompra.id != valores.cero) {
        this.seleccionProveedor.patchValue(this.facturaCompra.proveedor);
        this.dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>(this.facturaCompra.facturaCompraLineas);
        this.dataSourceFacturaCompraLinea.paginator = this.paginatorFacturaCompraLinea;
    }
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

  consultarImpuestos() {
    this.impuestoService.consultar().subscribe(
      res => {
        this.impuestos = res.resultado as Impuesto[]
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

  seleccionarProveedor() {
    let proveedorId = this.seleccionProveedor.value.id;
    this.proveedorService.obtener(proveedorId).subscribe(
      res => {
        this.facturaCompra.proveedor = res.resultado as Proveedor;
        this.seleccionProveedor.patchValue(this.facturaCompra.proveedor);
        this.consultarBienPorProveedor(this.facturaCompra.proveedor.id);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarProducto() {
    this.facturaCompraLinea.producto=this.seleccionProducto.value;
  }

  seleccionarCantidad() {
    if (this.facturaCompraLinea.cantidad <= valores.cero){
      return;
    }
    if (this.facturaCompraLinea.costoUnitario <= valores.cero){
      return;
    }
    if (this.facturaCompraLinea.impuesto.id == valores.cero){
      return;
    }
    if (this.facturaCompraLinea.producto.id == valores.cero){
      return;
    }
    if (this.facturaCompraLinea.bodega.id == valores.cero){
      return;
    }
    this.calcularLinea();
  }
  
  seleccionarValorDescuentoLinea() {
    if (this.facturaCompraLinea.cantidad <= valores.cero){
      return;
    }
    if (this.facturaCompraLinea.costoUnitario <= valores.cero){
      return;
    }
    if (this.facturaCompraLinea.impuesto.id == valores.cero){
      return;
    }
    if (this.facturaCompraLinea.producto.id == valores.cero){
      return;
    }
    if (this.facturaCompraLinea.bodega.id == valores.cero){
      return;
    }
    this.calcularLinea();
  }

  seleccionarPorcentajeDescuentoLinea() {
    if (this.facturaCompraLinea.cantidad <= valores.cero){
      return;
    }
    if (this.facturaCompraLinea.costoUnitario <= valores.cero){
      return;
    }
    if (this.facturaCompraLinea.impuesto.id == valores.cero){
      return;
    }
    if (this.facturaCompraLinea.producto.id == valores.cero){
      return;
    }
    if (this.facturaCompraLinea.bodega.id == valores.cero){
      return;
    }
    this.calcularLinea();
  }

  seleccionarBodega(){
    if (this.facturaCompraLinea.cantidad <= valores.cero){
      return;
    }
    if (this.facturaCompraLinea.costoUnitario <= valores.cero){
      return;
    }
    if (this.facturaCompraLinea.impuesto.id == valores.cero){
      return;
    }
    if (this.facturaCompraLinea.producto.id == valores.cero){
      return;
    }
    if (this.facturaCompraLinea.bodega.id == valores.cero){
      return;
    }
    this.calcularLinea();
  }

  seleccionarCostoUnitario(){
    if (this.facturaCompraLinea.cantidad <= valores.cero){
      return;
    }
    if (this.facturaCompraLinea.costoUnitario <= valores.cero){
      return;
    }
    if (this.facturaCompraLinea.impuesto.id == valores.cero){
      return;
    }
    if (this.facturaCompraLinea.producto.id == valores.cero){
      return;
    }
    if (this.facturaCompraLinea.bodega.id == valores.cero){
      return;
    }
    this.calcularLinea();
  }

  seleccionarImpuesto(){
    if (this.facturaCompraLinea.cantidad <= valores.cero){
      return;
    }
    if (this.facturaCompraLinea.costoUnitario <= valores.cero){
      return;
    }
    if (this.facturaCompraLinea.impuesto.id == valores.cero){
      return;
    }
    if (this.facturaCompraLinea.producto.id == valores.cero){
      return;
    }
    if (this.facturaCompraLinea.bodega.id == valores.cero){
      return;
    }
    this.calcularLinea();
  }

  agregarFacturaCompraLinea(event){
    if (event!=null)
      event.preventDefault();
    if (this.facturaCompraLinea.cantidad <= valores.cero){
      return;
    }
    if (this.facturaCompraLinea.costoUnitario <= valores.cero){
      return;
    }
    if (this.facturaCompraLinea.impuesto.id == valores.cero){
      return;
    }
    if (this.facturaCompraLinea.producto.id == valores.cero){
      return;
    }
    if (this.facturaCompraLinea.totalSinDescuentoLinea <= valores.cero){
      return;
    }
    this.facturaCompra.facturaCompraLineas.push(this.facturaCompraLinea);
    this.facturaCompraService.calcular(this.facturaCompra).subscribe(
      res => {
        this.facturaCompra = res.resultado as FacturaCompra;
        this.dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>(this.facturaCompra.facturaCompraLineas);
        this.deshabilitarProveedor = true;
        this.nuevoFacturaCompraLinea();
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  nuevoFacturaCompraLinea(){
    this.facturaCompraLinea = new FacturaCompraLinea();
    this.seleccionProducto.patchValue(valores.vacio)
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

  facturar(event){
    if (event != null)
      event.preventDefault();
    this.facturaCompraService.facturar(this.facturaCompra.id).subscribe({
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
          this.seleccionProveedor.patchValue(this.facturaCompra.proveedor);
          this.dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>(this.facturaCompra.facturaCompraLineas);
        },
        error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      });
    } else {
      this.clickedRows.clear();
      this.facturaCompra = new FacturaCompra();
    }
  }

  calcularLinea(){
    this.facturaCompraService.calcularLinea(this.facturaCompraLinea).subscribe(
      res => {
        this.facturaCompraLinea = res.resultado as FacturaCompraLinea;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  calcular(){
    this.facturaCompraService.calcular(this.facturaCompra).subscribe(
      res => {
        this.facturaCompra = res.resultado as FacturaCompra;
        this.dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>(this.facturaCompra.facturaCompraLineas);
        this.dataSourceFacturaCompraLinea.paginator = this.paginatorFacturaCompraLinea;
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

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

}
