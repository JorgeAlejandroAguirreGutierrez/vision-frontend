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
import { GastoPersonal } from 'src/app/modelos/compra/gasto-personal';
import { GastoPersonalLinea } from 'src/app/modelos/compra/gasto-personal-linea';
import { GastoPersonalService } from 'src/app/servicios/compra/gasto-personal.service';

@Component({
  selector: 'app-gasto-personal',
  templateUrl: './gasto-personal.component.html',
  styleUrls: ['./gasto-personal.component.scss']
})
export class GastoPersonalComponent implements OnInit {

  si: string = valores.si;
  no: string = valores.no;
  
  estadoActivo: string = valores.estadoActivo;
  estadoInactivo: string = valores.estadoInactivo;
  estadoAnulada: string = valores.estadoAnulada;

  indiceLinea: number;

  abrirPanel: boolean = true;
  abrirPanelLinea: boolean = false;
  abrirPanelAdmin: boolean = true;

  hoy = new Date();

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  gastoPersonal: GastoPersonal = new GastoPersonal();
  gastoPersonalLinea: GastoPersonalLinea = new GastoPersonalLinea();

  gastosPersonales: GastoPersonal[];
  proveedores: Proveedor[]=[];
  impuestos: Impuesto[];

  controlIdentificacionProveedor = new UntypedFormControl();
  controlRazonSocialProveedor = new UntypedFormControl();

  filtroIdentificacionProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();
  filtroRazonSocialProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: GastoPersonal) => `${row.codigo}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: GastoPersonal) => `${this.datepipe.transform(row.fecha, "dd-MM-yyyy")}`},
    { nombreColumna: 'factura', cabecera: 'Factura', celda: (row: GastoPersonal) => `${row.numeroComprobante}`},
    { nombreColumna: 'proveedor', cabecera: 'Proveedor', celda: (row: GastoPersonal) => row.proveedor != null ? `${row.proveedor.razonSocial}`: valores.vacio },
    { nombreColumna: 'subtotal', cabecera: 'Subtotal', celda: (row: GastoPersonal) => `$${row.subtotal}`},
    { nombreColumna: 'descuento', cabecera: 'Desc.', celda: (row: GastoPersonal) => `$${row.descuento}`},
    { nombreColumna: 'impuesto', cabecera: 'IVA', celda: (row: GastoPersonal) => `$${row.importeIvaTotal}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: GastoPersonal) => `$${row.total}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: GastoPersonal) => `${row.estado}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<GastoPersonal>;
  clickedRows = new Set<GastoPersonal>();

  columnasLinea: any[] = [
    { nombreColumna: 'posicion', cabecera: 'No.', celda: (row: GastoPersonalLinea) => `${row.posicion}` },
    { nombreColumna: 'nombre', cabecera: 'Producto', celda: (row: GastoPersonalLinea) => `${row.nombreProducto}` },
    { nombreColumna: 'medida', cabecera: 'Medida', celda: (row: GastoPersonalLinea) => `${row.medida}` },
    { nombreColumna: 'cantidad', cabecera: 'Cant.', celda: (row: GastoPersonalLinea) => `${row.cantidad}` },
    { nombreColumna: 'valor', cabecera: 'C. Unit', celda: (row: GastoPersonalLinea) => `$${row.costoUnitario}` },
    { nombreColumna: 'descuento', cabecera: 'Desc. $', celda: (row: GastoPersonalLinea) => `$${row.valorDescuentoLinea}` },
    { nombreColumna: 'subtotal', cabecera: 'Subtotal', celda: (row: GastoPersonalLinea) => `$${row.subtotalLinea}` },
    { nombreColumna: 'impuesto', cabecera: 'IVA', celda: (row: GastoPersonalLinea) => `$${row.importeIvaLinea}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: GastoPersonalLinea) => `$${row.totalLinea}` }
  ];
  cabeceraLinea: string[] = this.columnasLinea.map(titulo => titulo.nombreColumna);
  dataSourceLinea: MatTableDataSource<GastoPersonalLinea> = new MatTableDataSource<GastoPersonalLinea>(this.gastoPersonal.gastoPersonalLineas);
  clickedRowsLinea = new Set<GastoPersonalLinea>();

  @ViewChild("paginator") paginator: MatPaginator;
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
      this.crearLinea();
  }

  constructor(private renderer: Renderer2, private proveedorService: ProveedorService, private sesionService: SesionService, 
    private datepipe: DatePipe, private impuestoService: ImpuestoService, private router: Router, 
    private gastoPersonalService: GastoPersonalService, private spinnerService: NgxSpinnerService) { }


  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
    this.consultar();
    this.consultarProveedores();
    this.consultarImpuestos();
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
  consultarImpuestos() {
    this.impuestoService.consultar().subscribe({
      next: res => {
        this.impuestos = res.resultado as Impuesto[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  nuevo(){
    this.gastoPersonal = new GastoPersonal();
    this.hoy = new Date();
    this.gastoPersonal.fecha = this.hoy;
    this.controlIdentificacionProveedor.patchValue(valores.vacio);
    this.controlRazonSocialProveedor.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<GastoPersonalLinea>([]);
    this.clickedRows.clear();
    this.nuevaLinea();
    this.abrirPanel = true;
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.spinnerService.show();
    this.gastoPersonal.usuario = this.sesion.usuario;
    this.gastoPersonal.empresa = this.empresa;
    this.gastoPersonalService.crear(this.gastoPersonal).subscribe({
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
    this.spinnerService.show();
    this.gastoPersonalService.actualizar(this.gastoPersonal).subscribe({
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

  anular(event) {
    if (event != null)
      event.preventDefault();
    this.gastoPersonalService.anular(this.gastoPersonal).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.gastoPersonalService.consultarPorEmpresa(this.empresa.id).subscribe({
      next: res => {
        this.gastosPersonales = res.resultado as GastoPersonal[];
        this.llenarTabla(this.gastosPersonales);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(gastosPersonales: GastoPersonal[]) {
    this.dataSource = new MatTableDataSource(gastosPersonales);
    this.dataSource.filterPredicate = (data: GastoPersonal, filter: string): boolean =>
      this.datepipe.transform(data.fecha, valores.fechaCorta).includes(filter) || data.numeroComprobante.includes(filter) || 
      data.proveedor.nombreComercial.includes(filter) || data.estado.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccionar(gastoPersonal: any) {
    if (!this.clickedRows.has(gastoPersonal)){
      this.clickedRows.clear();
      this.clickedRows.add(gastoPersonal);
      this.obtener(gastoPersonal.id)
    } else {
      this.nuevo();
    }
  }

  obtener(id: number){
    this.gastoPersonalService.obtener(id).subscribe({
      next: res => {
        this.gastoPersonal = res.resultado as GastoPersonal;
        this.construir();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  construir() {
    let fecha = new Date(this.gastoPersonal.fecha);
    this.gastoPersonal.fecha = fecha;
    this.controlIdentificacionProveedor.patchValue(this.gastoPersonal.proveedor);
    this.controlRazonSocialProveedor.patchValue(this.gastoPersonal.proveedor);
    this.llenarTablaLinea(this.gastoPersonal.gastoPersonalLineas);
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  borrarFiltro() {
    this.renderer.setProperty(this.inputFiltro.nativeElement, 'value', '');
    this.dataSource.filter = '';
  }

  seleccionarRazonSocialProveedor() {
    let proveedorId = this.controlRazonSocialProveedor.value.id;
    this.proveedorService.obtener(proveedorId).subscribe({
      next: res => {
        this.gastoPersonal.proveedor = res.resultado as Proveedor;
        this.controlIdentificacionProveedor.patchValue(this.gastoPersonal.proveedor);
        this.controlRazonSocialProveedor.patchValue(this.gastoPersonal.proveedor);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarIdentificacionProveedor() {
    let proveedorId = this.controlIdentificacionProveedor.value.id;
    this.proveedorService.obtener(proveedorId).subscribe({
      next: res => {
        this.gastoPersonal.proveedor = res.resultado as Proveedor;
        this.controlIdentificacionProveedor.patchValue(this.gastoPersonal.proveedor);
        this.controlRazonSocialProveedor.patchValue(this.gastoPersonal.proveedor);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  //CRUD FACTURA COMPRA LINEA
  nuevaLinea(){
    this.gastoPersonalLinea = new GastoPersonalLinea();
    this.clickedRowsLinea.clear();
  }

  crearLinea(){
    if (!this.validarFormularioLinea())
      return;
    this.spinnerService.show();
    this.gastoPersonal.usuario = this.sesion.usuario;
    this.gastoPersonal.gastoPersonalLineas.push(this.gastoPersonalLinea);
    this.llenarPosicion(this.gastoPersonal);
  }

  llenarPosicion(gastoPersonal: GastoPersonal){
    for (let i = 0; i < gastoPersonal.gastoPersonalLineas.length; i++) {
      this.gastoPersonal.gastoPersonalLineas[i].posicion = i+1;
    }
  }

  actualizarLinea() {
    if (!this.validarFormularioLinea())
      return;
    this.spinnerService.show();
    this.gastoPersonal.usuario = this.sesion.usuario;
    this.gastoPersonal.gastoPersonalLineas[this.indiceLinea] = this.gastoPersonalLinea;
    this.llenarPosicion(this.gastoPersonal);
  }

  eliminarLinea(i: number){
    this.gastoPersonal.gastoPersonalLineas.splice(i, 1);
  }

  llenarTablaLinea(gastoPersonalLineas: GastoPersonalLinea[]) {
    this.ordenarAsc(gastoPersonalLineas);
    this.dataSourceLinea = new MatTableDataSource(gastoPersonalLineas);
    this.dataSourceLinea.filterPredicate = (data: GastoPersonalLinea, filter: string): boolean =>
      data.nombreProducto.includes(filter) || String(data.cantidad).includes(filter) ||  String(data.totalLinea).includes(filter);
    this.dataSourceLinea.paginator = this.paginatorLinea;
    this.dataSourceLinea.sort = this.sortLinea;
  }

  ordenarAsc(arrayJson: any) {
    arrayJson.sort(function (a: any, b: any) {
      if(a.posicion > b.posicion) {
        return 1;
      } else if(a.posicion < b.posicion) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  filtroLinea(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceLinea.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceLinea.paginator) {
      this.dataSourceLinea.paginator.firstPage();
    }
  }

  borrarFiltroLinea() {
    this.renderer.setProperty(this.inputFiltroLinea.nativeElement, 'value', '');
    this.dataSourceLinea.filter = '';
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
    this.gastoPersonal.establecimiento = this.pad(this.gastoPersonal.establecimiento, 3);
  }

  rellenarNumeroPuntoVenta() {
    this.gastoPersonal.puntoVenta = this.pad(this.gastoPersonal.puntoVenta, 3);
  }

  rellenarNumeroSecuencial() {
    this.gastoPersonal.secuencial = this.pad(this.gastoPersonal.secuencial, 9);
  }

  validarNumeroEstablecimiento(){
    if (this.gastoPersonal.establecimiento.length > 3){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_establecimiento });
    }
  }
  validarNumeroPuntoVenta(){
    if (this.gastoPersonal.puntoVenta.length > 3){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_punto_venta });
    }
  }
  validarNumeroSecuencial(){
    if (this.gastoPersonal.secuencial.length > 9){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_secuencial });
    }
  }

  pad(numero: string, size: number): string {
    while (numero.length < size) numero = "0" + numero;
    return numero;
  }

  //FILTROS AUTOCOMPLETE
  inicializarFiltros() {
    this.filtroIdentificacionProveedores = this.controlIdentificacionProveedor.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(identificacion => typeof identificacion === 'string' ? this.filtrarIdentificacionProveedor(identificacion) : this.proveedores.slice())
    );
    this.filtroRazonSocialProveedores = this.controlRazonSocialProveedor.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(razonSocial => typeof razonSocial === 'string' ? this.filtrarRazonSocialProveedor(razonSocial) : this.proveedores.slice())
      );
  }

  private filtrarIdentificacionProveedor(value: string): Proveedor[] {
    if (this.proveedores.length > 0) {
      const filterValue = value.toUpperCase();
      return this.proveedores.filter(proveedor => proveedor.identificacion.toUpperCase().includes(filterValue));
    }
    return [];
  }
  verIdentificacionProveedor(proveedor: Proveedor): string {
    return proveedor && proveedor.identificacion ? proveedor.identificacion : valores.vacio;
  }

  private filtrarRazonSocialProveedor(value: string): Proveedor[] {
    if(this.proveedores.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.proveedores.filter(proveedor => proveedor.razonSocial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verRazonSocialProveedor(proveedor: Proveedor): string {
    return proveedor && proveedor.razonSocial ? proveedor.razonSocial : valores.vacio;
  }

  //VALIDACIONES
  validarFormulario(): boolean {
    if (this.gastoPersonal.fecha == null || this.gastoPersonal.fecha > this.hoy){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_fecha });
      return false;
    }
    if (this.gastoPersonal.proveedor.id == valores.cero){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.gastoPersonal.establecimiento == valores.vacio || this.gastoPersonal.puntoVenta == valores.vacio ||
      this.gastoPersonal.secuencial == valores.vacio){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.gastoPersonal.total <= valores.cero){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }  

  validarFormularioLinea(): boolean {
    if (this.gastoPersonalLinea.cantidad <= valores.cero){
      return false;
    }
    if (this.gastoPersonalLinea.costoUnitario <= valores.cero){
      return false;
    }
    if (this.gastoPersonalLinea.impuesto.id == valores.cero){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.gastoPersonalLinea.nombreProducto == valores.vacio){
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }  
}