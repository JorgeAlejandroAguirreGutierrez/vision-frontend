import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { startWith, map } from 'rxjs/operators';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Sesion } from '../../modelos/usuario/sesion';
import { valores, mensajes, validarSesion, otras, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { NotaDebitoVenta } from 'src/app/modelos/comprobante/nota-debito-venta';
import { ClienteService } from 'src/app/servicios/cliente/cliente.service';
import { Factura } from 'src/app/modelos/comprobante/factura';
import { Cliente } from 'src/app/modelos/cliente/cliente';
import { NotaDebitoVentaLinea } from 'src/app/modelos/comprobante/nota-debito-venta-linea';
import { FacturaService } from 'src/app/servicios/comprobante/factura.service';
import { NotaDebitoVentaService } from 'src/app/servicios/comprobante/nota-debito-venta.service';
import { Producto } from 'src/app/modelos/inventario/producto';
import { Kardex } from 'src/app/modelos/inventario/kardex';
import { Impuesto } from 'src/app/modelos/inventario/impuesto';
import { ImpuestoService } from 'src/app/servicios/inventario/impuesto.service';
import { Bodega } from 'src/app/modelos/inventario/bodega';
import { BodegaService } from 'src/app/servicios/inventario/bodega.service';
import { ProductoService } from 'src/app/servicios/inventario/producto.service';
import { CategoriaProducto } from 'src/app/modelos/inventario/categoria-producto';
import { CategoriaProductoService } from 'src/app/servicios/inventario/categoria-producto.service';
import { KardexService } from 'src/app/servicios/inventario/kardex.service';
import { FacturaLinea } from 'src/app/modelos/comprobante/factura-linea';

@Component({
  selector: 'app-nota-debito-venta',
  templateUrl: './nota-debito-venta.component.html',
  styleUrls: ['./nota-debito-venta.component.scss']
})
export class NotaDebitoVentaComponent implements OnInit {

  panelOpenState = false;

  deshabilitarDevolucion = true;
  deshabilitarDescuento = true;  
  
  seleccionCliente = new UntypedFormControl();
  filtroClientes: Observable<Cliente[]> = new Observable<Cliente[]>();
  clientes: Cliente[] = [];
  seleccionFactura = new UntypedFormControl();
  filtroFacturas: Observable<Factura[]> = new Observable<Factura[]>();
  facturas: Factura[] = [];
  seleccionProducto = new UntypedFormControl();
  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();
  productos: Producto[] = [];
  impuestos: Impuesto[] = [];
  bodegas: Bodega[] = []; 
  categoriasProductos: CategoriaProducto[] = [] 

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: NotaDebitoVenta) => `${row.codigo}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: NotaDebitoVenta) => `${row.fecha}`},
    { nombreColumna: 'cliente', cabecera: 'Cliente', celda: (row: NotaDebitoVenta) => `${row.factura.cliente.razonSocial}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaDebitoVenta) => `$${row.totalSinDescuento}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: NotaDebitoVenta) => `$${row.estado}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<NotaDebitoVenta>;
  clickedRows = new Set<NotaDebitoVenta>();
  abrirPanelAdmin = false;
  notasDebitosVentas: NotaDebitoVenta[] = [];
  
  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("paginatorLinea") paginatorLinea: MatPaginator;
  @ViewChild("paginatorFacturaLinea") paginatorFacturaLinea: MatPaginator;

  notaDebitoVenta: NotaDebitoVenta = new NotaDebitoVenta();
  notaDebitoVentaLinea: NotaDebitoVentaLinea = new NotaDebitoVentaLinea();
  kardex: Kardex = new Kardex();
  categoriaProducto = valores.bien;

  columnasLinea: string[] = ["codigo", 'nombre', 'medida', 'cantidad', 'costoUnitario', 'valorDescuento', 'porcentajeDescuento', 'impuesto', 'bodega', 'total'];
  dataSourceLinea = new MatTableDataSource<NotaDebitoVentaLinea>(this.notaDebitoVenta.notaDebitoVentaLineas);
  columnasFacturaLinea: string[] = ['nombre', 'medida', 'cantidad', 'valor', 'descuento', 'descuentoPorcentaje', 'impuesto', 'total', 'entregado'];
  dataSourceFacturaLinea = new MatTableDataSource<FacturaLinea>(this.notaDebitoVenta.factura.facturaLineas);
  sesion: Sesion;
  si = valores.si;
  no = valores.no;

  constructor(private clienteService: ClienteService, private sesionService: SesionService, private impuestoService: ImpuestoService, private bodegaService: BodegaService,
    private router: Router, private notaDebitoVentaService: NotaDebitoVentaService, private facturaService: FacturaService, private productoService: ProductoService,
    private categoriaProductoService: CategoriaProductoService, private kardexService: KardexService, private modalService: NgbModal) { }

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
    this.consultarClientes();
    this.consultarImpuestos();
    this.filtroClientes = this.seleccionCliente.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(cliente => typeof cliente === 'string' ? this.filtroCliente(cliente) : this.clientes.slice())
      );
    this.filtroFacturas = this.seleccionFactura.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(factura => typeof factura === 'string' ? this.filtroFactura(factura) : this.facturas.slice())
      );
    this.filtroProductos = this.seleccionProducto.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(producto => typeof producto === 'string' ? this.filtroProducto(producto) : this.productos.slice())
      );
  }
  
  private filtroCliente(value: string): Cliente[] {
    if(this.clientes.length > 0) {
      const filterValue = value.toLowerCase();
      return this.clientes.filter(cliente => cliente.razonSocial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verCliente(cliente: Cliente): string {
    return cliente && cliente.razonSocial ? cliente.razonSocial : '';
  }

  private filtroFactura(value: string): Factura[] {
    if(this.facturas.length > 0) {
      const filterValue = value.toLowerCase();
      return this.facturas.filter(factura => factura.secuencia.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verFactura(factura: Factura): string {
    return factura && factura.secuencia ? factura.secuencia : '';
  }

  private filtroProducto(value: string): Producto[] {
    if(this.productos.length > 0) {
      const filterValue = value.toLowerCase();
      return this.productos.filter(producto => producto.nombre.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verProducto(producto: Producto): string {
    return producto && producto.nombre ? producto.nombre : '';
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
    this.notaDebitoVenta = new NotaDebitoVenta();
    this.seleccionCliente.patchValue(valores.vacio);
    this.seleccionFactura.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<NotaDebitoVentaLinea>([]);
  }

  construir() {
    if (this.notaDebitoVenta.id != valores.cero) {
      this.seleccionCliente.patchValue(this.notaDebitoVenta.factura.cliente);
      this.seleccionFactura.patchValue(this.notaDebitoVenta.factura);
      this.dataSourceLinea = new MatTableDataSource<NotaDebitoVentaLinea>(this.notaDebitoVenta.notaDebitoVentaLineas);
      this.dataSourceLinea.paginator = this.paginatorLinea;
    }
  }

  consultar() {
    this.notaDebitoVentaService.consultar().subscribe(
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
    if (this.categoriaProducto == valores.bien){
      this.consultarBienes();
    }
    if (this.categoriaProducto == valores.servicio){
      this.consultarServicios();
    }
    if (this.categoriaProducto == valores.activoFijo){
      this.consultarActivosFijos();
    }
  }
  consultarBienes() {
    this.productoService.consultarBien().subscribe(
      res => {
        this.productos = res.resultado as Producto[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      } 
    );
  }
  consultarServicios() {
    this.productoService.consultarServicio().subscribe(
      res => {
        this.productos = res.resultado as Producto[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      } 
    );
  }
  consultarActivosFijos() {
    this.productoService.consultarActivoFijo().subscribe(
      res => {
        this.productos = res.resultado as Producto[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }

  seleccionarProducto() {
    this.notaDebitoVentaLinea.producto=this.seleccionProducto.value;
    if(this.notaDebitoVentaLinea.producto.id == valores.cero || this.notaDebitoVentaLinea.bodega.id == valores.cero || this.notaDebitoVenta.factura.cliente.id == valores.cero){
      return;
    }
    for(let precio of this.notaDebitoVentaLinea.producto.precios){
      if (precio.segmento.id == this.notaDebitoVenta.factura.cliente.segmento.id){
        this.notaDebitoVentaLinea.precio = precio;
      }
    }
    this.kardexService.obtenerUltimoPorFecha(this.notaDebitoVentaLinea.bodega.id, this.notaDebitoVentaLinea.producto.id).subscribe(
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
    this.clienteService.consultar().subscribe(
      res => {
        this.clientes = res.resultado as Cliente[]
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

  seleccionarCliente() {
    let clienteId = this.seleccionCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe(
      res => {
        this.notaDebitoVenta.factura.cliente = res.resultado as Cliente;
        this.seleccionCliente.patchValue(this.notaDebitoVenta.factura.cliente);
        this.facturaService.consultarPorCliente(this.notaDebitoVenta.factura.cliente.id).subscribe(
          res => {
            this.facturas = res.resultado as Factura[]
          },
          err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        );
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarFactura() {
    let facturaId = this.seleccionFactura.value.id;
    this.notaDebitoVentaService.obtenerPorFactura(facturaId).subscribe(
      res => {
        this.notaDebitoVenta = res.resultado as NotaDebitoVenta;
        console.log(this.notaDebitoVenta);
        this.seleccionFactura.patchValue(this.notaDebitoVenta.factura);
        this.dataSourceLinea = new MatTableDataSource(this.notaDebitoVenta.notaDebitoVentaLineas);
        this.dataSourceFacturaLinea = new MatTableDataSource(this.notaDebitoVenta.factura.facturaLineas);
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
        this.dataSourceLinea = new MatTableDataSource<NotaDebitoVentaLinea>(this.notaDebitoVenta.notaDebitoVentaLineas);
        this.limpiarNotaDebitoVentaLinea();
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarCantidad() {
    this.calcular();
  }

  seleccionarBodega(){
    this.calcular();
  }

  seleccionarImpuesto(){
    this.calcular();
  }
  
  seleccionarValorDescuentoLinea() {
    this.calcular();
  }

  seleccionarPorcentajeDescuentoLinea() {
    this.calcular();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.notaDebitoVenta.sesion=this.sesion;
    this.notaDebitoVentaService.crear(this.notaDebitoVenta).subscribe(
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
    this.notaDebitoVentaService.actualizar(this.notaDebitoVenta).subscribe(
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

  limpiarNotaDebitoVentaLinea(){
    this.notaDebitoVentaLinea = new NotaDebitoVentaLinea();
    this.kardex = new Kardex();
    this.seleccionProducto.patchValue(valores.vacio);
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

  seleccion(notaDebitoVenta: any) {
    if (!this.clickedRows.has(notaDebitoVenta)){
      this.clickedRows.clear();
      this.clickedRows.add(notaDebitoVenta);
      this.notaDebitoVentaService.obtener(notaDebitoVenta.id).subscribe({
        next: res => {
          this.notaDebitoVenta = res.resultado as NotaDebitoVenta;
          this.seleccionCliente.patchValue(this.notaDebitoVenta.factura.cliente);
          this.seleccionFactura.patchValue(this.notaDebitoVenta.factura);
          this.dataSourceLinea = new MatTableDataSource<NotaDebitoVentaLinea>(this.notaDebitoVenta.notaDebitoVentaLineas);
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
        this.dataSourceLinea = new MatTableDataSource<NotaDebitoVentaLinea>(this.notaDebitoVenta.notaDebitoVentaLineas);
        this.dataSourceLinea.paginator = this.paginatorLinea;
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
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }
}
