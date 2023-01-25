import { Router } from '@angular/router';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Factura } from '../../modelos/comprobante/factura';
import { ClienteService } from '../../servicios/cliente/cliente.service';
import { Cliente } from '../../modelos/cliente/cliente';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { FacturaDetalle } from '../../modelos/comprobante/factura-detalle';
import { ProductoService } from '../../servicios/inventario/producto.service';
import { Producto } from '../../modelos/inventario/producto';
import { ImpuestoService } from '../../servicios/inventario/impuesto.service';
import { Impuesto } from '../../modelos/inventario/impuesto';
import { FacturaService } from '../../servicios/comprobante/factura.service';
import { DependienteService } from '../../servicios/cliente/dependiente.service';
import { Dependiente } from '../../modelos/cliente/dependiente';
import { Caracteristica } from '../../modelos/inventario/caracteristica';
import { Bodega } from '../../modelos/inventario/bodega';
import { BodegaService } from '../../servicios/inventario/bodega.service';
import { Precio } from '../../modelos/inventario/precio';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import { FacturaDetalleService } from '../../servicios/comprobante/factura-detalle.service';
import { MatSort } from '@angular/material/sort';
import { TabService } from 'src/app/componentes/services/tab.service';
import { FacturacionElectronicaService } from 'src/app/servicios/comprobante/factura-eletronica.service';
import { CategoriaProducto } from 'src/app/modelos/inventario/categoria-producto';
import { CategoriaProductoService } from 'src/app/servicios/inventario/categoria-producto.service';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss']
})
export class FacturaComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;

  collapsed = true;
  isLinear = false;
  isEditable = false;
  completed = false;
  facturaDetalleIndice = valores.cero;
  serieBuscar = valores.vacio;

  panelOpenState=false;
  seleccionDependiente: boolean = false;
  seleccionFacturar: boolean = false;

  firstFormGroup: UntypedFormGroup;
  secondFormGroup: UntypedFormGroup;
  thirdFormGroup: UntypedFormGroup;

  seleccionProducto = new UntypedFormControl();
  seleccionIdentificacionCliente = new UntypedFormControl();
  seleccionRazonSocialCliente = new UntypedFormControl();
  seleccionIdentificacionClienteFactura = new UntypedFormControl();
  seleccionRazonSocialClienteFactura = new UntypedFormControl();

  filtroProductos: Observable<Producto[]> = new Observable<Producto[]>();
  filtroIdentificacionClientes: Observable<Cliente[]> = new Observable<Cliente[]>();
  filtroRazonSocialClientes: Observable<Cliente[]> = new Observable<Cliente[]>();
  filtroIdentificacionClientesFactura: Observable<Cliente[]> = new Observable<Cliente[]>();
  filtroRazonSocialClientesFactura: Observable<Cliente[]> = new Observable<Cliente[]>();

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Factura) => `${row.codigo}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: Factura) => `${row.fecha}`},
    { nombreColumna: 'cliente', cabecera: 'Cliente', celda: (row: Factura) => `${row.cliente.razonSocial}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: Factura) => `${row.totalConDescuento}`}
  ];
  columnasFactura: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSourceFactura: MatTableDataSource<Factura>;
  clickedRows = new Set<Factura>();
  abrirPanelNuevoFactura = true;
  abrirPanelAdminFactura = false;
  facturas: Factura[];
  deshabilitarAgregarFacturaDetalle: boolean = false;
  verAcordeonFacturaDetalle: boolean = true;
  
  @ViewChild("paginatorFactura") paginatorFactura: MatPaginator;
  @ViewChild("paginatorFacturaDetalle") paginatorFacturaDetalle: MatPaginator;
  

  constructor(private clienteService: ClienteService, private dependienteService: DependienteService, private sesionService: SesionService, 
    private impuestoService: ImpuestoService, private facturaDetalleService: FacturaDetalleService, private router: Router,
    private facturaService: FacturaService, private facturacionElectronicaService: FacturacionElectronicaService,
    private productoService: ProductoService, private bodegaService: BodegaService, 
    private categoriaProductoService: CategoriaProductoService, private tabService: TabService,
    private modalService: NgbModal, private _formBuilder: UntypedFormBuilder) { }

  factura: Factura = new Factura();
  dependienteBuscar: Dependiente=new Dependiente();

  columnasDetalleFactura: string[] = ['nombre', 'medida', 'cantidad', 'valor', 'descuento', 'descuentoPorcentaje', 'impuesto', 'total', 'entregado', 'acciones'];
  dataSourceFacturaDetalle = new MatTableDataSource<FacturaDetalle>(this.factura.facturaDetalles);

  clientes: Cliente[]=[];
  dependientes: Dependiente[]= [];
  productos: Producto[] = [];
  bodegas: Bodega[]=[];
  categoriasProductos: CategoriaProducto[] = [];
  categoriaProducto = valores.bien;

  preciosSeleccionados: Precio[]=[];
  sesion: Sesion;
  habilitar: boolean = true;
  habilitarClienteTce: boolean =true;
  habilitarClienteFacturaTce: boolean =true;
  impuestos: Impuesto[];

  //VARIABLES MUESTRA
  primerTelefonoCliente: string = valores.vacio;
  primerCelularCliente: string = valores.vacio;
  primerCorreoCliente: string = valores.vacio;

  primerTelefonoDependiente: string = valores.vacio;
  primerCelularDependiente: string = valores.vacio;
  primerCorreoDependiente: string = valores.vacio;

  primerTelefonoClienteFactura: string = valores.vacio;
  primerCelularClienteFactura: string = valores.vacio;
  primerCorreoClienteFactura: string = valores.vacio;

  caracteristica: string= valores.vacio;

  habilitarSeleccionDependiente= true;
  habilitarFacturar= false;

  dependienteIndice= -1;
  dependiente: Dependiente= null;

  saldoTotal = valores.cero;
  saldo = valores.cero;
  costoUnitario = valores.cero;
  costoPromedio = valores.cero;
  productoIndice = valores.cero;
  cantidadTransferencia = valores.cero;
  facturaDetalle: FacturaDetalle=new FacturaDetalle();
  

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G") //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N") //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "A") // SHIFT + A
      this.agregarFacturaDetalle(null);
  }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();
    this.consultarClientes();
    this.construirFactura();
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

    this.thirdFormGroup = new UntypedFormGroup({
      thirdCtrl: new UntypedFormControl()
    });

    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
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
    return producto && producto.nombre ? producto.nombre : '';
  }

  private filtroIdentificacionCliente(value: string): Cliente[] {
    if(this.clientes.length>0) {
      const filterValue = value.toLowerCase();
      return this.clientes.filter(cliente => cliente.identificacion.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verIdentificacionCliente(cliente: Cliente): string {
    return cliente && cliente.identificacion ? cliente.identificacion : '';
  }
  private filtroRazonSocialCliente(value: string): Cliente[] {
    if(this.clientes.length>0) {
      const filterValue = value.toLowerCase();
      return this.clientes.filter(cliente => cliente.razonSocial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verRazonSocialCliente(cliente: Cliente): string {
    return cliente && cliente.razonSocial ? cliente.razonSocial : '';
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
    this.factura = new Factura();
  }

  construirFactura() {
    if (this.factura.id != 0) {
        this.factura.normalizar();
        this.seleccionIdentificacionCliente.patchValue(this.factura.cliente);
        this.seleccionRazonSocialCliente.patchValue(this.factura.cliente);
        this.primerTelefonoCliente= this.factura.cliente.telefonos.length>0? this.factura.cliente.telefonos[0].numero: "";
        this.primerCelularCliente= this.factura.cliente.celulares.length>0? this.factura.cliente.celulares[0].numero: "";
        this.primerCorreoCliente= this.factura.cliente.correos.length>0? this.factura.cliente.correos[0].email: "";
        this.habilitarClienteTce=false;
        this.dataSourceFacturaDetalle = new MatTableDataSource<FacturaDetalle>(this.factura.facturaDetalles);
        this.dataSourceFacturaDetalle.paginator = this.paginatorFacturaDetalle;
    }
  }

  consultar() {
    this.facturaService.consultar().subscribe(
      res => {
        this.facturas = res.resultado as Factura[]
        this.dataSourceFactura = new MatTableDataSource(this.facturas);
        this.dataSourceFactura.paginator = this.paginatorFactura;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarClientes() {
     this.clienteService.consultarActivos().subscribe(
      res => {
        this.clientes = res.resultado as Cliente[]
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

  consultarCategoriasProductos(){
    this.categoriaProductoService.consultar().subscribe(
      res => {
        this.categoriasProductos = res.resultado as CategoriaProducto[]
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

  seleccionarRazonSocialCliente() {
    let clienteId=undefined;
    clienteId=this.seleccionRazonSocialCliente.value.id;
    this.dependienteBuscar.cliente.id=clienteId;
    this.clienteService.obtener(clienteId).subscribe(
      res => {
        Object.assign(this.factura.cliente, res.resultado as Cliente);
        this.factura.cliente.normalizar();
        this.seleccionIdentificacionCliente.patchValue(this.factura.cliente);
        this.seleccionRazonSocialCliente.patchValue(this.factura.cliente);
        if (this.factura.cliente.telefonos.length>0)
          this.primerTelefonoCliente = this.factura.cliente.telefonos[0].numero;
        if (this.factura.cliente.celulares.length>0)
          this.primerCelularCliente = this.factura.cliente.celulares[0].numero;
        if (this.factura.cliente.correos.length>0)
          this.primerCorreoCliente = this.factura.cliente.correos[0].email;
        if (this.factura.cliente.identificacion!="9999999999999")
        {
          this.habilitarSeleccionDependiente=false;
          this.habilitarFacturar=false;
          this.seleccionFacturar=false;
        } else {
          this.habilitarFacturar=true;
          this.seleccionFacturar=false;
          this.seleccionIdentificacionClienteFactura.enable();
          this.seleccionRazonSocialClienteFactura.enable();
        }
        this.habilitarClienteTce=false;
        this.verAcordeonFacturaDetalle=true;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarIdentificacionCliente() {
    let cliente_id=undefined;
    cliente_id=this.seleccionIdentificacionCliente.value.id;
    this.dependienteBuscar.cliente.id=cliente_id;
    this.clienteService.obtener(cliente_id).subscribe(
      res => {
        Object.assign(this.factura.cliente,res.resultado as Cliente);
        this.factura.cliente.normalizar();
          this.seleccionIdentificacionCliente.patchValue(this.factura.cliente);
          this.seleccionRazonSocialCliente.patchValue(this.factura.cliente);     
        if (this.factura.cliente.telefonos.length>0)
          this.primerTelefonoCliente = this.factura.cliente.telefonos[0].numero;
        if (this.factura.cliente.celulares.length>0)
          this.primerCelularCliente = this.factura.cliente.celulares[0].numero;
        if (this.factura.cliente.correos.length>0)
          this.primerCorreoCliente = this.factura.cliente.correos[0].email;
        if (this.factura.cliente.identificacion!="9999999999999")
        {
          this.habilitarSeleccionDependiente=false;
          this.habilitarFacturar=false;
          this.seleccionFacturar=false;
        } else {
          this.habilitarFacturar=true;
          this.seleccionFacturar=false;
          this.seleccionIdentificacionClienteFactura.enable();
          this.seleccionRazonSocialClienteFactura.enable();
        }
        this.habilitarClienteTce=false;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  asignarFacturar(){
    if (this.seleccionFacturar){
      this.seleccionIdentificacionClienteFactura.enable();
      this.seleccionRazonSocialClienteFactura.enable();
    } else {
      this.seleccionIdentificacionClienteFactura.patchValue("");
      this.seleccionRazonSocialClienteFactura.patchValue("");
      this.seleccionIdentificacionClienteFactura.disable();
      this.seleccionRazonSocialClienteFactura.disable();
    }
    
  }
  
  seleccionarDependiente(i: number){
    this.dependienteIndice=i;
  }

  seleccionarHabilitar() {
    if (this.habilitar) {
      this.habilitar = false;
    } else {
      this.habilitar = true;
    }
  }

  limpiarProducto(){
    this.facturaDetalle= new FacturaDetalle();
    this.seleccionProducto.patchValue("");
    this.costoPromedio=0;
    this.saldo=0;
    this.saldoTotal=0;
  }

  seleccionarProducto() {
    this.facturaDetalle.producto=this.seleccionProducto.value;
    if(this.facturaDetalle.producto.kardexs.length==0){
      this.facturaDetalle.producto=new Producto();
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_kardex_vacio, footer: mensajes.error_kardex_vacio_mensaje });
      return;
    }
    this.costoPromedio=this.facturaDetalle.producto.kardexs[this.facturaDetalle.producto.kardexs.length-1].costoPromedio;
    this.saldo=this.facturaDetalle.producto.kardexs[this.facturaDetalle.producto.kardexs.length-1].cantidad;
    this.saldoTotal=this.facturaDetalle.producto.kardexs[this.facturaDetalle.producto.kardexs.length-1].cantidad;
  }

  calcularFacturaDetalle(){
    this.facturaDetalleService.calcular(this.facturaDetalle).subscribe(
      res => {
        this.facturaDetalle = res.resultado as FacturaDetalle;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarMedida(){
    if (this.facturaDetalle.bodega.id==0){
      return;
    }
    if (this.facturaDetalle.cantidad==0){
      return;
    }
    if (this.facturaDetalle.precio.id==0){
      return;
    }
    if (this.facturaDetalle.impuesto.id==0){
      return;
    }
    this.calcularFacturaDetalle();
  }

  seleccionarPrecio() {
    if (this.facturaDetalle.bodega.id==0){
      return;
    }
    if (this.facturaDetalle.cantidad==0){
      return;
    }
    if (this.facturaDetalle.precio.id==0){
      return;
    }
    if (this.facturaDetalle.impuesto.id==0){
      return;
    }
    this.calcularFacturaDetalle();
  }
  seleccionarCantidad() {
    if (this.facturaDetalle.bodega.id==0){
      return;
    }
    if (this.facturaDetalle.cantidad==0){
      return;
    }
    if (this.facturaDetalle.precio.id==0){
      return;
    }
    if (this.facturaDetalle.impuesto.id==0){
      return;
    }
    this.calcularFacturaDetalle();
  }

  seleccionarImpuesto(){
    if (this.facturaDetalle.bodega.id==0){
      return;
    }
    if (this.facturaDetalle.cantidad==0){
      return;
    }
    if (this.facturaDetalle.precio.id==0){
      return;
    }
    if (this.facturaDetalle.impuesto.id==0){
      return;
    }
    this.calcularFacturaDetalle();
  }

  seleccionarBodega(){
    if (this.facturaDetalle.bodega.id==0){
      return;
    }
    if (this.facturaDetalle.cantidad==0){
      return;
    }
    if (this.facturaDetalle.precio.id==0){
      return;
    }
    if (this.facturaDetalle.impuesto.id==0){
      return;
    }
    this.calcularFacturaDetalle();
  }

  seleccionarValorDescuentoLinea() {
    if (this.facturaDetalle.bodega.id==0){
      return;
    }
    if (this.facturaDetalle.cantidad==0){
      return;
    }
    if (this.facturaDetalle.precio.id==0){
      return;
    }
    if (this.facturaDetalle.impuesto.id==0){
      return;
    }
    this.calcularFacturaDetalle();
  }

  seleccionarPorcentajeDescuentoLinea() {
    if (this.facturaDetalle.bodega.id==0){
      return;
    }
    if (this.facturaDetalle.cantidad==0){
      return;
    }
    if (this.facturaDetalle.precio.id==0){
      return;
    }
    if (this.facturaDetalle.impuesto.id==0){
      return;
    }
    this.calcularFacturaDetalle();
  }

  agregarFacturaDetalle(event){
    if (event!=null)
      event.preventDefault();
    if (this.facturaDetalle.bodega.id == valores.cero){
      return;
    }
    if (this.facturaDetalle.cantidad == valores.cero){
      return;
    }
    if (this.facturaDetalle.precio.id == valores.cero){
      return;
    }
    if (this.facturaDetalle.impuesto.id == valores.cero){
      return;
    }
    this.factura.sesion=this.sesion;
    this.factura.facturaDetalles.push(this.facturaDetalle);
    this.facturaService.calcular(this.factura).subscribe(
      res => {
        this.factura = res.resultado as Factura;
        this.limpiarProducto();
        this.dataSourceFacturaDetalle = new MatTableDataSource<FacturaDetalle>(this.factura.facturaDetalles);
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
        this.facturaService.enviarEventoRecaudacion(res.resultado.id);
        this.stepper.next();
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
        this.facturaService.enviarEventoRecaudacion(res.resultado.id);
        this.stepper.next();
        
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
    this.primerTelefonoCliente = valores.vacio;
    this.primerCelularCliente = valores.vacio;
    this.primerCorreoCliente = valores.vacio;
    this.factura.cliente.formaPago.abreviatura = valores.vacio;
    this.factura.cliente.montoFinanciamiento = valores.cero;
  }

  eliminarFacturaDetalle(i: number){
    this.factura.facturaDetalles.splice(i, 1);
    this.calcular();
  }

  seleccionActualizar(factura: any) {
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
        this.dataSourceFacturaDetalle = new MatTableDataSource<FacturaDetalle>(this.factura.facturaDetalles);
        this.dataSourceFacturaDetalle.paginator = this.paginatorFacturaDetalle;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message })
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
    if (event != null)
      event.preventDefault();
    this.facturacionElectronicaService.enviar(this.factura).subscribe(
      res => {
        let respuesta = res.resultado as String;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje, footer: respuesta });
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.message })
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
    this.dataSourceFactura.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceFactura.paginator) {
      this.dataSourceFactura.paginator.firstPage();
    }
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }
}