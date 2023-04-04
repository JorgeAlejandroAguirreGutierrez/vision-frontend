import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { startWith, map } from 'rxjs/operators';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Sesion } from '../../modelos/usuario/sesion';
import { valores, mensajes, validarSesion, otras, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
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
import { CategoriaProducto } from 'src/app/modelos/inventario/categoria-producto';
import { CategoriaProductoService } from 'src/app/servicios/inventario/categoria-producto.service';
import { BodegaService } from 'src/app/servicios/inventario/bodega.service';
import { ProductoService } from 'src/app/servicios/inventario/producto.service';
import { FacturaCompraLinea } from 'src/app/modelos/compra/factura-compra-linea';

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
  emitida = valores.emitida;
  anulada = valores.anulada;
  noFacturada = valores.noFacturada;
  facturada = valores.facturada;
  noRecaudada = valores.noRecaudada;
  recaudada = valores.recaudada;
  
  seleccionProveedor = new UntypedFormControl();
  filtroProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();
  proveedores: Proveedor[] = [];
  seleccionFacturaCompra = new UntypedFormControl();
  filtroFacturasCompras: Observable<FacturaCompra[]> = new Observable<FacturaCompra[]>();
  facturasCompras: FacturaCompra[] = [];
  seleccionProducto = new UntypedFormControl();
  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();
  productos: Producto[] = [];
  impuestos: Impuesto[] = [];
  bodegas: Bodega[] = []; 
  categoriasProductos: CategoriaProducto[] = [] 

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: NotaDebitoCompra) => `${row.codigo}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: NotaDebitoCompra) => `${this.datepipe.transform(row.fecha, "dd-MM-yyyy")}`},
    { nombreColumna: 'proveedor', cabecera: 'Proveedor', celda: (row: NotaDebitoCompra) => `${row.facturaCompra.proveedor.razonSocial}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaDebitoCompra) => `$${row.totalSinDescuento}`},
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
  categoriaProducto = valores.vacio;

  columnasLinea: string[] = ["codigo", 'nombre', 'medida', 'cantidad', 'costoUnitario', 'valorDescuento', 'porcentajeDescuento', 'impuesto', 'bodega', 'total'];
  dataSourceLinea = new MatTableDataSource<NotaDebitoCompraLinea>(this.notaDebitoCompra.notaDebitoCompraLineas);
  columnasFacturaCompraLinea: string[] = ["codigo", 'nombre', 'medida', 'cantidad', 'costoUnitario', 'valorDescuento', 'porcentajeDescuento', 'impuesto', 'bodega', 'total'];
  dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>(this.notaDebitoCompra.facturaCompra.facturaCompraLineas);
  sesion: Sesion;

  constructor(private proveedorService: ProveedorService, private sesionService: SesionService, private kardexService: KardexService, private impuestoService: ImpuestoService, private productoService: ProductoService, private datepipe: DatePipe,
    private router: Router, private notaDebitoCompraService: NotaDebitoCompraService, private facturaCompraService: FacturaCompraService, private bodegaService: BodegaService, private categoriaProductoService: CategoriaProductoService) { }

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
    this.consultarProveedores();
    this.consultarFacturasCompras();
    this.consultarImpuestos();
    this.consultarBodegas();
    this.consultarCategoriasProductos();
    this.filtroProveedores = this.seleccionProveedor.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(proveedor => typeof proveedor === 'string' ? this.filtroProveedor(proveedor) : this.proveedores.slice())
      );
    this.filtroFacturasCompras = this.seleccionFacturaCompra.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(facturaCompra => typeof facturaCompra === 'string' ? this.filtroFacturaCompra(facturaCompra) : this.facturasCompras.slice())
      );
    this.filtroProductos = this.seleccionProducto.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(producto => typeof producto === 'string' ? this.filtroProducto(producto) : this.productos.slice())
      );
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

  private filtroFacturaCompra(value: string): FacturaCompra[] {
    if(this.facturasCompras.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.facturasCompras.filter(facturaCompra => facturaCompra.secuencia.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verFacturaCompra(facturaCompra: FacturaCompra): string {
    return facturaCompra && facturaCompra.secuencia ? facturaCompra.secuencia : valores.vacio;
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
    this.seleccionProveedor.patchValue(valores.vacio);
    this.seleccionFacturaCompra.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<NotaDebitoCompraLinea>([]);
    this.dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>([]);
    this.clickedRows.clear();
  }

  construir() {
    if (this.notaDebitoCompra.id != valores.cero) {
      let fecha = new Date(this.notaDebitoCompra.fecha);
      this.notaDebitoCompra.fecha = fecha;
      this.seleccionProveedor.patchValue(this.notaDebitoCompra.facturaCompra.proveedor);
      this.seleccionFacturaCompra.patchValue(this.notaDebitoCompra.facturaCompra);
      this.dataSourceLinea = new MatTableDataSource<NotaDebitoCompraLinea>(this.notaDebitoCompra.notaDebitoCompraLineas);
      this.dataSourceLinea.paginator = this.paginatorLinea;
      this.dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>(this.notaDebitoCompra.facturaCompra.facturaCompraLineas);
      this.dataSourceFacturaCompraLinea.paginator = this.paginatorFacturaCompraLinea;
    }
  }

  consultar() {
    this.notaDebitoCompraService.consultar().subscribe(
      res => {
        this.notasDebitosCompras = res.resultado as NotaDebitoCompra[]
        this.dataSource = new MatTableDataSource(this.notasDebitosCompras);
        this.dataSource.paginator = this.paginator;
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

  consultarFacturasCompras(){
    this.facturaCompraService.consultar().subscribe(
      res => {
        this.facturasCompras = res.resultado as FacturaCompra[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarImpuestos(){
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
    if (this.categoriaProducto == valores.bien){
      this.consultarBienPorProveedor(this.notaDebitoCompra.facturaCompra.proveedor.id);
    }
    if (this.categoriaProducto == valores.servicio){
      this.consultarServicioPorProveedor(this.notaDebitoCompra.facturaCompra.proveedor.id);
    }
    if (this.categoriaProducto == valores.activoFijo){
      this.consultarActivoFijoPorProveedor(this.notaDebitoCompra.facturaCompra.proveedor.id);
    }
  }
  consultarBienPorProveedor(proveedorId: number) {
    this.productoService.consultarBienPorProveedor(proveedorId).subscribe(
      res => {
        this.productos = res.resultado as Producto[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      } 
    );
  }
  consultarServicioPorProveedor(proveedorId: number) {
    this.productoService.consultarServicioPorProveedor(proveedorId).subscribe(
      res => {
        this.productos = res.resultado as Producto[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      } 
    );
  }
  consultarActivoFijoPorProveedor(proveedorId: number) {
    this.productoService.consultarActivoFijoPorProveedor(proveedorId).subscribe(
      res => {
        this.productos = res.resultado as Producto[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }

  seleccionarProveedor() {
    let proveedorId = this.seleccionProveedor.value.id;
    this.proveedorService.obtener(proveedorId).subscribe(
      res => {
        this.notaDebitoCompra.facturaCompra.proveedor = res.resultado as Proveedor;
        this.seleccionProveedor.patchValue(this.notaDebitoCompra.facturaCompra.proveedor);
        this.facturaCompraService.consultarPorProveedor(this.notaDebitoCompra.facturaCompra.proveedor.id).subscribe(
          res => {
            this.facturasCompras = res.resultado as FacturaCompra[]
          },
          err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        );
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarFacturaCompra() {
    let facturaCompraId = this.seleccionFacturaCompra.value.id;
    this.notaDebitoCompraService.obtenerPorFacturaCompra(facturaCompraId).subscribe(
      res => {
        this.notaDebitoCompra = res.resultado as NotaDebitoCompra;
        this.seleccionFacturaCompra.patchValue(this.notaDebitoCompra.facturaCompra);
        this.dataSourceFacturaCompraLinea = new MatTableDataSource(this.notaDebitoCompra.facturaCompra.facturaCompraLineas);
        this.dataSourceFacturaCompraLinea.paginator = this.paginatorFacturaCompraLinea;
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
    this.notaDebitoCompra.sesion=this.sesion;
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

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.notaDebitoCompraService.activar(this.notaDebitoCompra).subscribe({
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
    this.notaDebitoCompraService.inactivar(this.notaDebitoCompra).subscribe({
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
          this.seleccionProveedor.patchValue(this.notaDebitoCompra.facturaCompra.proveedor);
          this.seleccionFacturaCompra.patchValue(this.notaDebitoCompra.facturaCompra);
          this.dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>(this.notaDebitoCompra.facturaCompra.facturaCompraLineas);
          this.dataSourceFacturaCompraLinea.paginator = this.paginatorFacturaCompraLinea;
          this.dataSourceLinea = new MatTableDataSource<NotaDebitoCompraLinea>(this.notaDebitoCompra.notaDebitoCompraLineas);
          this.dataSourceLinea.paginator = this.paginatorLinea;
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
        this.dataSourceLinea = new MatTableDataSource<NotaDebitoCompraLinea>(this.notaDebitoCompra.notaDebitoCompraLineas);
        this.dataSourceLinea.paginator = this.paginatorLinea;
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
        console.log(this.notaDebitoCompraLinea);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarBodega(){
    if(this.notaDebitoCompraLinea.producto.id == valores.cero || this.notaDebitoCompraLinea.bodega.id == valores.cero || this.notaDebitoCompra.facturaCompra.proveedor.id == valores.cero){
      return;
    }
    this.kardexService.obtenerUltimoPorFecha(this.notaDebitoCompraLinea.bodega.id, this.notaDebitoCompraLinea.producto.id).subscribe(
      res => {
        if (res.resultado == null){
          Swal.fire({ icon: error_swal, title: error, text: mensajes.error_kardex_vacio });
          return;
        }
        this.kardex = res.resultado as Kardex;
        this.notaDebitoCompraLinea.costoUnitario = this.kardex.costoUnitario;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
    this.calcularLinea();
  }

  seleccionarProducto() {
    this.notaDebitoCompraLinea.producto=this.seleccionProducto.value;
    if(this.notaDebitoCompraLinea.producto.id == valores.cero || this.notaDebitoCompraLinea.bodega.id == valores.cero || this.notaDebitoCompra.facturaCompra.proveedor.id == valores.cero){
      return;
    }
    this.kardexService.obtenerUltimoPorFecha(this.notaDebitoCompraLinea.bodega.id, this.notaDebitoCompraLinea.producto.id).subscribe(
      res => {
        if (res.resultado == null){
          Swal.fire({ icon: error_swal, title: error, text: mensajes.error_kardex_vacio });
          return;
        }
        this.kardex = res.resultado as Kardex;
        this.notaDebitoCompraLinea.costoUnitario = this.kardex.costoUnitario;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  limpiarNotaDebitoCompraLinea(){
    this.notaDebitoCompraLinea = new NotaDebitoCompraLinea();
    this.kardex = new Kardex();
    this.seleccionProducto.patchValue(valores.vacio);
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
        this.notaDebitoCompra = res.resultado as NotaDebitoCompra;
        this.dataSourceLinea = new MatTableDataSource<NotaDebitoCompraLinea>(this.notaDebitoCompra.notaDebitoCompraLineas);
        this.dataSourceLinea.paginator = this.paginatorLinea;
        this.limpiarNotaDebitoCompraLinea();
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminarNotaDebitoCompraLinea(i: number){
    this.notaDebitoCompra.notaDebitoCompraLineas.splice(i, 1);
    this.calcular();
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
