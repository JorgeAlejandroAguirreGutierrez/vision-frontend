import { Router } from '@angular/router';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Factura } from '../../modelos/comprobante/factura';
import { ClienteService } from '../../servicios/cliente/cliente.service';
import { Cliente } from '../../modelos/cliente/cliente';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { FacturaLinea } from '../../modelos/comprobante/factura-linea';
import { ProductoService } from '../../servicios/inventario/producto.service';
import { Producto } from '../../modelos/inventario/producto';
import { ImpuestoService } from '../../servicios/inventario/impuesto.service';
import { Impuesto } from '../../modelos/inventario/impuesto';
import { FacturaService } from '../../servicios/comprobante/factura.service';
import { Bodega } from '../../modelos/inventario/bodega';
import { BodegaService } from '../../servicios/inventario/bodega.service';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import { MatSort } from '@angular/material/sort';
import { TabService } from 'src/app/servicios/componente/tab/tab.service';
import { FacturaElectronicaService } from 'src/app/servicios/comprobante/factura-eletronica.service';
import { CategoriaProducto } from 'src/app/modelos/inventario/categoria-producto';
import { CategoriaProductoService } from 'src/app/servicios/inventario/categoria-producto.service';
import { KardexService } from 'src/app/servicios/inventario/kardex.service';
import { Kardex } from 'src/app/modelos/inventario/kardex';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss']
})
export class FacturaComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;

  cargar = false;
  hoy = new Date();

  isLinear = false;
  isEditable = true;
  panelOpenState = false;

  firstFormGroup: UntypedFormGroup;
  secondFormGroup: UntypedFormGroup;

  seleccionProducto = new UntypedFormControl();
  seleccionIdentificacionCliente = new UntypedFormControl();
  seleccionRazonSocialCliente = new UntypedFormControl();

  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();
  filtroIdentificacionClientes: Observable<Cliente[]> = new Observable<Cliente[]>();
  filtroRazonSocialClientes: Observable<Cliente[]> = new Observable<Cliente[]>();

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Factura) => `${row.codigo}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: Factura) => `${this.datepipe.transform(row.fecha, "dd/MM/yyyy")}`},
    { nombreColumna: 'cliente', cabecera: 'Cliente', celda: (row: Factura) => `${row.cliente.razonSocial}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: Factura) => `${row.totalConDescuento}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Factura) => `${row.estado}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Factura>;
  clickedRows = new Set<Factura>();
  abrirPanelAdminFactura = false;
  facturas: Factura[];
  
  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("paginatorLinea") paginatorLinea: MatPaginator;
  

  constructor(private clienteService: ClienteService, private sesionService: SesionService, 
    private impuestoService: ImpuestoService, private router: Router, private datepipe: DatePipe, private dateAdapter: DateAdapter<Date>,
    private facturaService: FacturaService, private facturaElectronicaService: FacturaElectronicaService,
    private productoService: ProductoService, private bodegaService: BodegaService, private kardexService: KardexService,
    private categoriaProductoService: CategoriaProductoService, private tabService: TabService,
    private _formBuilder: UntypedFormBuilder) { this.dateAdapter.setLocale('en-GB') }

  factura: Factura = new Factura();

  columnasLinea: string[] = ['nombre', 'medida', 'cantidad', 'valor', 'descuento', 'descuentoPorcentaje', 'impuesto', 'total', 'entregado', 'acciones'];
  dataSourceLinea = new MatTableDataSource<FacturaLinea>(this.factura.facturaLineas);

  clientes: Cliente[]=[];
  productos: Producto[] = [];
  bodegas: Bodega[]=[];
  categoriasProductos: CategoriaProducto[] = [];
  categoriaProducto = valores.bien;
  kardex: Kardex = new Kardex();

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

  saldoTotal = valores.cero;
  saldo = valores.cero;
  costoUnitario = valores.cero;
  costoPromedio = valores.cero;
  productoIndice = valores.cero;
  facturaLinea: FacturaLinea = new FacturaLinea();
  

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G") //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N") //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "A") // SHIFT + A
      this.agregarFacturaLinea(null);
  }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
    this.consultarClientes();
    this.consultarCategoriasProductos();
    this.consultarProductos();
    this.consultarImpuestos();
    this.consultarBodegas();
    
    this.firstFormGroup = new UntypedFormGroup({
      firstCtrl: new UntypedFormControl()
    });

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });

    this.secondFormGroup = new UntypedFormGroup({
      secondCtrl: new UntypedFormControl()
    });

    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.filtroProductos = this.seleccionProducto.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(nombre => typeof nombre === 'string' ? this.filtroProducto(nombre) : this.productos.slice())
      );
    this.filtroIdentificacionClientes = this.seleccionIdentificacionCliente.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(identificacion => typeof identificacion === 'string' ? this.filtroIdentificacionCliente(identificacion) : this.clientes.slice())
      );
    this.filtroRazonSocialClientes = this.seleccionRazonSocialCliente.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(razon_social => typeof razon_social === 'string' ? this.filtroRazonSocialCliente(razon_social) : this.clientes.slice())
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
    return producto && producto.nombre ? producto.nombre : valores.vacio;
  }

  private filtroIdentificacionCliente(value: string): Cliente[] {
    if(this.clientes.length>0) {
      const filterValue = value.toLowerCase();
      return this.clientes.filter(cliente => cliente.identificacion.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verIdentificacionCliente(cliente: Cliente): string {
    return cliente && cliente.identificacion ? cliente.identificacion : valores.vacio;
  }
  private filtroRazonSocialCliente(value: string): Cliente[] {
    if(this.clientes.length>0) {
      const filterValue = value.toLowerCase();
      return this.clientes.filter(cliente => cliente.razonSocial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verRazonSocialCliente(cliente: Cliente): string {
    return cliente && cliente.razonSocial ? cliente.razonSocial : valores.vacio;
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
    this.factura = new Factura();
    this.seleccionIdentificacionCliente.patchValue(valores.vacio);
    this.seleccionRazonSocialCliente.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<FacturaLinea>([]);
    this.clickedRows.clear();
  }

  construirFactura() {
    if (this.factura.id != valores.cero) {
        this.seleccionIdentificacionCliente.patchValue(this.factura.cliente);
        this.seleccionRazonSocialCliente.patchValue(this.factura.cliente);
        this.dataSourceLinea = new MatTableDataSource<FacturaLinea>(this.factura.facturaLineas);
        this.dataSourceLinea.paginator = this.paginatorLinea;
    }
  }

  consultar() {
    this.facturaService.consultar().subscribe(
      res => {
        this.facturas = res.resultado as Factura[]
        this.dataSource = new MatTableDataSource(this.facturas);
        this.dataSource.paginator = this.paginator;
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      } 
    );
  }

  consultarClientes() {
     this.clienteService.consultarActivos().subscribe(
      res => {
        this.clientes = res.resultado as Cliente[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      } 
    );
  }

  consultarImpuestos() {
    this.impuestoService.consultar().subscribe(
      res => {
        this.impuestos = res.resultado as Impuesto[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      } 
    );
  }
  consultarBodegas(){
    this.bodegaService.consultar().subscribe(
      res => {
        this.bodegas = res.resultado as Bodega[]
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      } 
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

  seleccionarRazonSocialCliente() {
    let clienteId=undefined;
    clienteId = this.seleccionRazonSocialCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe(
      res => {
        Object.assign(this.factura.cliente, res.resultado as Cliente);
        this.seleccionIdentificacionCliente.patchValue(this.factura.cliente);
        this.seleccionRazonSocialCliente.patchValue(this.factura.cliente);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarIdentificacionCliente() {
    let clienteId=undefined;
    clienteId = this.seleccionIdentificacionCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe(
      res => {
        Object.assign(this.factura.cliente,res.resultado as Cliente);
          this.seleccionIdentificacionCliente.patchValue(this.factura.cliente);
          this.seleccionRazonSocialCliente.patchValue(this.factura.cliente);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  limpiarFacturaLinea(){
    this.facturaLinea = new FacturaLinea();
    this.kardex = new Kardex();
    this.seleccionProducto.patchValue(valores.vacio);
  }

  seleccionarProducto() {
    this.facturaLinea.producto=this.seleccionProducto.value;
    if(this.facturaLinea.producto.id == valores.cero || this.facturaLinea.bodega.id == valores.cero || this.factura.cliente.id == valores.cero){
      return;
    }
    for(let precio of this.facturaLinea.producto.precios){
      if (precio.segmento.id == this.factura.cliente.segmento.id){
        this.facturaLinea.precio = precio;
      }
    }
    this.kardexService.obtenerUltimoPorFecha(this.facturaLinea.bodega.id, this.facturaLinea.producto.id).subscribe(
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

  calcularLinea(){
    this.facturaService.calcularLinea(this.facturaLinea).subscribe(
      res => {
        this.facturaLinea = res.resultado as FacturaLinea;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarMedida(){
    if (this.facturaLinea.cantidad == valores.cero){
      return;
    }
    if (this.facturaLinea.precio.id == valores.cero){
      return;
    }
    if (this.facturaLinea.impuesto.id == valores.cero){
      return;
    }
    this.calcularLinea();
  }

  seleccionarPrecio() {
    if (this.facturaLinea.cantidad == valores.cero){
      return;
    }
    if (this.facturaLinea.precio.id == valores.cero){
      return;
    }
    if (this.facturaLinea.impuesto.id == valores.cero){
      return;
    }
    this.calcularLinea();
  }
  seleccionarCantidad() {
    if (this.facturaLinea.cantidad == valores.cero){
      return;
    }
    if (this.facturaLinea.precio.id == valores.cero){
      return;
    }
    if (this.facturaLinea.impuesto.id == valores.cero){
      return;
    }
    this.calcularLinea();
  }

  seleccionarImpuesto(){
    if (this.facturaLinea.cantidad == valores.cero){
      return;
    }
    if (this.facturaLinea.precio.id == valores.cero){
      return;
    }
    if (this.facturaLinea.impuesto.id == valores.cero){
      return;
    }
    this.calcularLinea();
  }

  seleccionarBodega(){
    if(this.facturaLinea.producto.id == valores.cero || this.facturaLinea.bodega.id == valores.cero || this.factura.cliente.id == valores.cero){
      return;
    }
    for(let precio of this.facturaLinea.producto.precios){
      if (precio.segmento.id == this.factura.cliente.segmento.id){
        this.facturaLinea.precio = precio;
      }
    }
    this.kardexService.obtenerUltimoPorFecha(this.facturaLinea.bodega.id, this.facturaLinea.producto.id).subscribe(
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

  seleccionarValorDescuentoLinea() {
    if (this.facturaLinea.cantidad == valores.cero){
      return;
    }
    if (this.facturaLinea.precio.id == valores.cero){
      return;
    }
    if (this.facturaLinea.impuesto.id == valores.cero){
      return;
    }
    this.calcularLinea();
  }

  seleccionarPorcentajeDescuentoLinea() {
    if (this.facturaLinea.cantidad == valores.cero){
      return;
    }
    if (this.facturaLinea.precio.id == valores.cero){
      return;
    }
    if (this.facturaLinea.impuesto.id == valores.cero){
      return;
    }
    this.calcularLinea();
  }

  agregarFacturaLinea(event){
    if (event!=null)
      event.preventDefault();
    if (this.facturaLinea.cantidad == valores.cero){
      return;
    }
    if (this.facturaLinea.precio.id == valores.cero){
      return;
    }
    if (this.facturaLinea.impuesto.id == valores.cero){
      return;
    }
    this.factura.sesion = this.sesion;
    this.factura.facturaLineas.push(this.facturaLinea);
    this.facturaService.calcular(this.factura).subscribe(
      res => {
        this.factura = res.resultado as Factura;
        this.dataSourceLinea = new MatTableDataSource<FacturaLinea>(this.factura.facturaLineas);
        this.limpiarFacturaLinea();
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.factura.sesion=this.sesion;
    this.facturaService.crear(this.factura).subscribe(
      res => {
        this.factura = res.resultado as Factura;
        this.stepper.next();
        this.consultar();
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event){
    if (event!=null)
      event.preventDefault();
    this.facturaService.actualizar(this.factura).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.stepper.next();
        this.consultar();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
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

  enviarEvento(){
    this.consultar();
    this.facturaService.enviarEventoRecaudacion(this.factura);
  }

  limpiarIdentificacionCliente(){
    if (this.seleccionIdentificacionCliente.value.id==null ||this.seleccionIdentificacionCliente.value.id==undefined){
      this.limpiarCliente();
    }
  }
  limpiarRazonSocialCliente(){
    if (this.seleccionRazonSocialCliente.value.id==null ||this.seleccionRazonSocialCliente.value.id==undefined){
      this.limpiarCliente();
    }
  }
  limpiarCliente(){
    this.factura.cliente.direccion = valores.vacio;
    this.factura.cliente.formaPago.abreviatura = valores.vacio;
    this.factura.cliente.montoFinanciamiento = valores.cero;
  }

  eliminarFacturaLinea(i: number){
    this.factura.facturaLineas.splice(i, 1);
    this.calcular();
  }

  seleccion(factura: any) {
    if (!this.clickedRows.has(factura)){
      this.clickedRows.clear();
      this.clickedRows.add(factura);
      Object.assign(this.factura, factura as Factura);
      this.construirFactura();
    } else {
      this.clickedRows.clear();
      this.factura = new Factura();
    }
  }

  calcular(){
    this.facturaService.calcular(this.factura).subscribe(
      res => {
        this.factura = res.resultado as Factura;
        this.dataSourceLinea = new MatTableDataSource<FacturaLinea>(this.factura.facturaLineas);
        this.dataSourceLinea.paginator = this.paginatorLinea;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarValorDescuentoSubtotal(){
    this.calcular();
  }
  seleccionarPorcentajeDescuentoSubtotal(){
    this.calcular();
  }
  seleccionarValorDescuentoTotal(){
    this.calcular(); 
  }
  seleccionarPorcentajeDescuentoTotal(){
    this.calcular();   
  }

  crearFacturaElectronica(event){
    this.cargar = true;
    if (event != null)
      event.preventDefault();
    this.facturaElectronicaService.enviar(this.factura.id).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.factura = res.resultado as Factura;
        this.consultar();
        this.nuevo(null);
        this.cargar = true;
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.cargar = false;
      }
    );
  }

  abrirTabProducto(event){
    if (event != null)
      event.preventDefault();
    let indice_tab_activo
    this.tabService.removeTab(indice_tab_activo);
  }

  filtroFactura(event: Event) {
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