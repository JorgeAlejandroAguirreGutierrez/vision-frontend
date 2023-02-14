import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UntypedFormControl, FormBuilder, FormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Factura } from '../../modelos/comprobante/factura';
import { startWith, map } from 'rxjs/operators';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../modelos/format-date-picker';
import { TipoComprobante } from '../../modelos/comprobante/tipo-comprobante';
import { TipoComprobanteService } from '../../servicios/comprobante/tipo-comprobante.service';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Sesion } from '../../modelos/usuario/sesion';
import { Parametro } from '../../modelos/configuracion/parametro';
import { ParametroService } from '../../servicios/configuracion/parametro.service';
import { valores, validarSesion, otras, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { FacturaCompra } from 'src/app/modelos/compra/factura-compra';
import { Producto } from 'src/app/modelos/inventario/producto';
import { ImpuestoService } from 'src/app/servicios/inventario/impuesto.service';
import { ProveedorService } from 'src/app/servicios/compra/proveedor.service';
import { BodegaService } from 'src/app/servicios/inventario/bodega.service';
import { FacturaCompraLinea } from 'src/app/modelos/compra/factura-compra-linea';
import { Proveedor } from 'src/app/modelos/compra/proveedor';
import { Impuesto } from 'src/app/modelos/inventario/impuesto';
import { ProductoService } from 'src/app/servicios/inventario/producto.service';
import { FacturaCompraService } from 'src/app/servicios/compra/factura-compra.service';
import { Bodega } from 'src/app/modelos/inventario/bodega';
import { FacturaCompraLineaService } from 'src/app/servicios/compra/factura-compra-linea.service';

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
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: FacturaCompra) => `${row.totalSinDescuento}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSourceFacturaCompra: MatTableDataSource<FacturaCompra>;
  clickedRows = new Set<FacturaCompra>();
  abrirPanelAdmin = false;
  facturasCompras: FacturaCompra[];
  
  @ViewChild("paginatorFacturaCompra") paginatorFacturaCompra: MatPaginator;
  @ViewChild("paginatorFacturaCompraLinea") paginatorFacturaCompraLinea: MatPaginator;
  

  constructor(private proveedorService: ProveedorService, private sesionService: SesionService, private facturaCompraLineaService: FacturaCompraLineaService,
    private impuestoService: ImpuestoService, private router: Router, private facturaCompraService: FacturaCompraService,
    private productoService: ProductoService,
    private modalService: NgbModal, private _formBuilder: UntypedFormBuilder) { }

  facturaCompra: FacturaCompra = new FacturaCompra();
  facturaCompraLinea: FacturaCompraLinea = new FacturaCompraLinea();

  columnasFacturaCompraLinea: string[] = ["codigo", 'nombre', 'medida', 'cantidad', 'costoUnitario', 'valorDescuento', 'porcentajeDescuento', 'impuesto', 'total', 'acciones'];
  dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>(this.facturaCompra.facturaCompraLineas);

  proveedores: Proveedor[]=[];
  productos: Producto[] = [];
  bodegas: Bodega[]=[];

  sesion: Sesion;
  impuestos: Impuesto[];

  si = valores.si;
  no = valores.no;

  //VARIABLES MUESTRA
  telefono: string = valores.vacio;
  celular: string = valores.vacio;
  correo: string = valores.vacio;

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

    this.filtroProductos = this.seleccionProducto.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(nombre => typeof nombre === 'string' ? this.filtroProducto(nombre) : this.productos.slice())
      );
    this.filtroProveedores = this.seleccionProveedor.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(proveedor => typeof proveedor === 'string' ? this.filtroProveedor(proveedor) : this.proveedores.slice())
      );
  }

  private filtroProducto(value: string): Producto[] {
    if(this.productos.length>0) {
      const filterValue = value.toLowerCase();
      return this.productos.filter(producto => producto.nombre.toLowerCase().includes(filterValue));
    }
    return [];
  }

  verProducto(producto: Producto): string {
    return producto && producto.nombre ? producto.nombre : '';
  }

  private filtroProveedor(value: string): Proveedor[] {
    if(this.proveedores.length > 0) {
      const filterValue = value.toLowerCase();
      return this.proveedores.filter(proveedor => proveedor.razonSocial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verProveedor(proveedor: Proveedor): string {
    return proveedor && proveedor.razonSocial ? proveedor.razonSocial : '';
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
    this.facturaCompra = new FacturaCompra();
  }

  construirFactura() {
    if (this.facturaCompra.id != 0) {
        this.seleccionProveedor.patchValue(this.facturaCompra.proveedor);
        this.telefono = this.facturaCompra.proveedor.telefonosProveedor.length > 0 ? this.facturaCompra.proveedor.telefonosProveedor[0].numero: valores.vacio;
        this.celular = this.facturaCompra.proveedor.celularesProveedor.length > 0 ? this.facturaCompra.proveedor.celularesProveedor[0].numero: valores.vacio;
        this.correo = this.facturaCompra.proveedor.correosProveedor.length > 0 ? this.facturaCompra.proveedor.correosProveedor[0].email: valores.vacio;
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

  consultarBienes() {
    this.productoService.consultarBien().subscribe(
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
        if (this.facturaCompra.proveedor.telefonosProveedor.length > valores.cero)
          this.telefono = this.facturaCompra.proveedor.telefonosProveedor[0].numero;
        if (this.facturaCompra.proveedor.celularesProveedor.length > valores.cero)
          this.celular = this.facturaCompra.proveedor.celularesProveedor[0].numero;
        if (this.facturaCompra.proveedor.correosProveedor.length > valores.cero)
          this.correo = this.facturaCompra.proveedor.correosProveedor[0].email;
        this.consultarProductos();
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
    if (this.facturaCompraLinea.totalSinDescuentoLinea <= valores.cero){
      return;
    }
    this.facturaCompra.facturaCompraLineas.push(this.facturaCompraLinea);
    console.log(this.facturaCompra);
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
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultarProductos(){
    this.productoService.consultarPorProveedor(this.facturaCompra.proveedor.id).subscribe({
      next: res => {
        this.productos = res.resultado as Producto[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  open(content: any) {
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  eliminarFacturaCompraLinea(i: number){
    this.facturaCompra.facturaCompraLineas.splice(i, 1);
    this.calcular();
  }

  seleccion(factura: any) {
    if (!this.clickedRows.has(factura)){
      this.clickedRows.clear();
      this.clickedRows.add(factura);
      //Falta llamar para traer del backend la factura compra
    } else {
      this.clickedRows.clear();
      this.facturaCompra = new FacturaCompra();
    }
  }

  calcularLinea(){
    this.facturaCompraLineaService.calcularLinea(this.facturaCompraLinea).subscribe(
      res => {
        this.facturaCompraLinea = res.resultado as FacturaCompraLinea;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message })
    );
  }

  calcular(){
    this.facturaCompraService.calcular(this.facturaCompra).subscribe(
      res => {
        this.facturaCompra = res.resultado as FacturaCompra;
        this.dataSourceFacturaCompraLinea = new MatTableDataSource<FacturaCompraLinea>(this.facturaCompra.facturaCompraLineas);
        this.dataSourceFacturaCompraLinea.paginator = this.paginatorFacturaCompraLinea;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message })
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
