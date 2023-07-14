import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { valores, validarSesion, otras, tab_activo, exito, exito_swal, error, error_swal } from '../../../constantes';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../comun/formato/format-date-picker';

import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Empresa } from '../../../modelos/usuario/empresa';
import { Proveedor } from '../../../modelos/compra/proveedor';
import { ProveedorService } from '../../../servicios/compra/proveedor.service';
import { NotaCreditoCompra } from '../../../modelos/compra/nota-credito-compra';
import { NotaCreditoCompraService } from '../../../servicios/compra/nota-credito-compra.service';
import { NotaCreditoCompraLinea } from '../../../modelos/compra/nota-credito-compra-linea';
import { FacturaCompra } from '../../../modelos/compra/factura-compra';
import { FacturaCompraService } from '../../../servicios/compra/factura-compra.service';
import { FacturaCompraLinea } from 'src/app/modelos/compra/factura-compra-linea';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-nota-credito-compra',
  templateUrl: './nota-credito-compra.component.html',
  styleUrls: ['./nota-credito-compra.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class NotaCreditoCompraComponent implements OnInit {

  abrirPanelNuevoNC: boolean = true;
  abrirPanelNCLinea: boolean = false;
  abrirPanelAdmin: boolean = true;

  deshabilitarDevolucion = true;
  deshabilitarDescuento = true;

  estadoActivo: string = valores.estadoActivo;
  estadoInactivo: string = valores.estadoInactivo;
  estadoInternoPorPagar: string = valores.estadoInternoPorPagar;
  estadoInternoPagada: string = valores.estadoInternoPagada;
  si: string = valores.si;
  no: string = valores.no;
  devolucion: string = valores.devolucion;
  descuento: string = valores.descuento;
  conjunta: string = valores.conjunta;

  hoy = new Date();

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  facturaCompra: FacturaCompra = new FacturaCompra();
  notaCreditoCompra: NotaCreditoCompra = new NotaCreditoCompra();
  notaCreditoCompraLinea: NotaCreditoCompraLinea = new NotaCreditoCompraLinea();

  proveedores: Proveedor[] = [];
  notasCreditosCompras: NotaCreditoCompra[] = [];
  facturasCompras: FacturaCompra[] = [];

  seleccionProveedor = new UntypedFormControl();
  seleccionFacturaCompra = new UntypedFormControl();
  controlIdentificacionProveedor = new UntypedFormControl();
  controlProveedor = new UntypedFormControl();

  filtroProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();
  filtroFacturasCompras: Observable<FacturaCompra[]> = new Observable<FacturaCompra[]>();
  filtroIdentificacionProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: NotaCreditoCompra) => `${row.codigo}` },
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: NotaCreditoCompra) => `${this.datepipe.transform(row.fecha, "dd-MM-yyyy")}` },
    { nombreColumna: 'serie', cabecera: 'Serie', celda: (row: NotaCreditoCompra) => `${row.serie}` },
    { nombreColumna: 'secuencial', cabecera: 'Código', celda: (row: NotaCreditoCompra) => `${row.secuencial}` },
    { nombreColumna: 'proveedor', cabecera: 'Proveedor', celda: (row: NotaCreditoCompra) => `${row.facturaCompra.proveedor.razonSocial}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaCreditoCompra) => `$${row.totalSinDescuento}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: NotaCreditoCompra) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<NotaCreditoCompra>;
  clickedRows = new Set<NotaCreditoCompra>();

  columnasLinea: any[] = [
    { nombreColumna: 'producto', cabecera: 'Producto', celda: (row: NotaCreditoCompraLinea) => `${row.producto.nombre}` },
    { nombreColumna: 'medida', cabecera: 'Medida', celda: (row: NotaCreditoCompraLinea) => `${row.producto.medida.abreviatura}` },
    { nombreColumna: 'cantidad', cabecera: 'Cantidad', celda: (row: NotaCreditoCompraLinea) => `${row.cantidad}` },
    { nombreColumna: 'devolucion', cabecera: 'Cant Dev', celda: (row: NotaCreditoCompraLinea) => `${row.devolucion}` },
    { nombreColumna: 'costounitario', cabecera: 'C. Unit', celda: (row: NotaCreditoCompraLinea) => `${row.costoUnitario}` },
    { nombreColumna: 'valorDescuento', cabecera: 'Descuento', celda: (row: NotaCreditoCompraLinea) => `${row.valorDescuentoLinea}` },
    { nombreColumna: 'porcentajeDescuento', cabecera: 'Descuento %', celda: (row: NotaCreditoCompraLinea) => `${row.porcentajeDescuentoLinea}` },
    { nombreColumna: 'impuesto', cabecera: 'Importe', celda: (row: NotaCreditoCompraLinea) => `${row.producto.impuesto.porcentaje}` },
    { nombreColumna: 'subtotal', cabecera: 'Subtotal', celda: (row: NotaCreditoCompraLinea) => `${row.totalSinDescuentoLinea}` },
  ];
  cabeceraLinea: string[] = this.columnasLinea.map(titulo => titulo.nombreColumna);
  dataSourceLinea: MatTableDataSource<NotaCreditoCompraLinea>;
  clickedRowsLinea = new Set<NotaCreditoCompra>();

  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("paginatorLinea") paginatorLinea: MatPaginator;
  @ViewChild('matSort') sort: MatSort;
  @ViewChild('matSortLinea') sortLinea: MatSort;

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G") //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N") //ASHIFT + N
      this.nuevo(null);
  }

  constructor(private proveedorService: ProveedorService, private sesionService: SesionService, private datepipe: DatePipe,
    private router: Router, private notaCreditoCompraService: NotaCreditoCompraService, private facturaCompraService: FacturaCompraService) { }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.empresa;
    this.consultar();
    this.consultarProveedores();
    this.consultarFacturasCompras();
    this.inicializarFiltros();
  }

  consultarProveedores() {
    this.proveedorService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.proveedores = res.resultado as Proveedor[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }


  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.controlIdentificacionProveedor.patchValue(valores.vacio);
    this.notaCreditoCompra = new NotaCreditoCompra();
    this.seleccionProveedor.patchValue(valores.vacio);
    this.seleccionFacturaCompra.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<NotaCreditoCompraLinea>([]);
    this.clickedRows.clear();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.notaCreditoCompra.sesion = this.sesion;
    this.notaCreditoCompra.empresa = this.empresa;
    this.notaCreditoCompraService.crear(this.notaCreditoCompra).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.notaCreditoCompraService.actualizar(this.notaCreditoCompra).subscribe(
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
    this.notaCreditoCompraService.activar(this.notaCreditoCompra).subscribe({
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
    this.notaCreditoCompraService.inactivar(this.notaCreditoCompra).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.notaCreditoCompraService.consultarPorEmpresa(this.empresa.id).subscribe(
      res => {
        this.notasCreditosCompras = res.resultado as NotaCreditoCompra[]
        this.llenarTablaNotaCreditoCompra(this.notasCreditosCompras);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  llenarTablaNotaCreditoCompra(notasCreditosCompras: NotaCreditoCompra[]) {
    this.dataSource = new MatTableDataSource(notasCreditosCompras);
    this.dataSource.filterPredicate = (data: NotaCreditoCompra, filter: string): boolean =>
      this.datepipe.transform(data.fecha, "dd-MM-yyyy").includes(filter) || data.serie.includes(filter) || data.secuencial.includes(filter) || 
      data.facturaCompra.proveedor.razonSocial.includes(filter) || data.estado.includes(filter);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seleccion(notaCreditoCompra: any) {
    if (!this.clickedRows.has(notaCreditoCompra)) {
      this.clickedRows.clear();
      this.clickedRows.add(notaCreditoCompra);
      this.obtenerNotaCredito(notaCreditoCompra);
    } else {
      this.nuevo(null);
    }
  }

  obtenerNotaCredito(notaCreditoCompra: NotaCreditoCompra){
    this.notaCreditoCompraService.obtener(notaCreditoCompra.id).subscribe({
      next: res => {
        this.notaCreditoCompra = res.resultado as NotaCreditoCompra;
        this.construir();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  construir() {
    let fecha = new Date(this.notaCreditoCompra.fecha);
    this.notaCreditoCompra.fecha = fecha;
    this.controlIdentificacionProveedor.patchValue(this.notaCreditoCompra.facturaCompra.proveedor);
    this.seleccionProveedor.patchValue(this.notaCreditoCompra.facturaCompra.proveedor);
    this.seleccionFacturaCompra.patchValue(this.notaCreditoCompra.facturaCompra);
    this.dataSourceLinea = new MatTableDataSource<NotaCreditoCompraLinea>(this.notaCreditoCompra.notaCreditoCompraLineas);
    this.dataSourceLinea.paginator = this.paginatorLinea;
    this.seleccionarOperacion();
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
  verIdentificacionProveedor(proveedor: Proveedor): string {
    return proveedor && proveedor.identificacion ? proveedor.identificacion : valores.vacio;
  }

  seleccionarProveedor() {
    let proveedorId = this.controlProveedor.value.id;
    this.proveedorService.obtener(proveedorId).subscribe({
      next: res => {
        this.facturaCompra.proveedor = res.resultado as Proveedor;
        this.controlIdentificacionProveedor.patchValue(this.facturaCompra.proveedor);
        this.controlProveedor.patchValue(this.facturaCompra.proveedor);
        this.consultarFacturasCompras();
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  verProveedor(proveedor: Proveedor): string {
    return proveedor && proveedor.razonSocial ? proveedor.razonSocial : '';
  }

  consultarFacturasCompras() {
    this.facturaCompraService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe(
      res => {
        this.facturasCompras = res.resultado as FacturaCompra[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarFacturaCompra() {
    let facturaCompraId = this.seleccionFacturaCompra.value.id;
    this.notaCreditoCompraService.obtenerPorFacturaCompra(facturaCompraId).subscribe({
      next: res => {
        this.notaCreditoCompra = res.resultado as NotaCreditoCompra;
        this.llenarTablaFacturaCompra(this.notaCreditoCompra.notaCreditoCompraLineas);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTablaFacturaCompra(notasCreditoComprasLineas: NotaCreditoCompraLinea[]) {
    this.dataSourceLinea = new MatTableDataSource(notasCreditoComprasLineas);
    this.dataSourceLinea.filterPredicate = (data: NotaCreditoCompraLinea, filter: string): boolean =>
      data.producto.nombre.includes(filter) || data.producto.medida.abreviatura.includes(filter) || 
      data.producto.impuesto.abreviatura.includes(filter) || data.bodega.abreviatura.includes(filter);
      this.dataSourceLinea.paginator = this.paginatorLinea;
    this.dataSourceLinea.sort = this.sortLinea;
  }

  seleccionarOperacion() {
    for (let notaCreditoCompraLinea of this.notaCreditoCompra.notaCreditoCompraLineas) {
      notaCreditoCompraLinea.devolucion = valores.cero;
      notaCreditoCompraLinea.porcentajeDescuentoLinea = valores.cero;
      notaCreditoCompraLinea.valorDescuentoLinea = valores.cero;
    }
    if (this.notaCreditoCompra.operacion == valores.devolucion) {
      this.deshabilitarDevolucion = false;
      this.deshabilitarDescuento = true;
    }
    if (this.notaCreditoCompra.operacion == valores.descuento) {
      this.deshabilitarDevolucion = true;
      this.deshabilitarDescuento = false;
    }
    if (this.notaCreditoCompra.operacion == valores.conjunta) {
      this.deshabilitarDevolucion = false;
      this.deshabilitarDescuento = false;
    }
  }

  actualizarDevolucion(i: number, devolucion: number) {
    this.calcular();
  }

  actualizarCostoUnitario(i: number, costoUnitario: number) {
    this.calcular();
  }

  actualizarValorDescuentoLinea(i: number, valorDescuento: number) {
    this.calcular();
  }

  actualizarPorcentajeDescuentoLinea(i: number, porcentajeDescuento: number) {
    this.calcular();
  }

  calcular() {
    this.notaCreditoCompraService.calcular(this.notaCreditoCompra).subscribe(
      res => {
        this.notaCreditoCompra = res.resultado as NotaCreditoCompra;
        this.construir();
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarValorDescuentoTotal() {
    this.calcular();
  }
  seleccionarPorcentajeDescuentoTotal() {
    this.calcular();
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  rellenarNumeroEstablecimiento() {
    this.notaCreditoCompra.serie = this.pad(this.notaCreditoCompra.serie, 3);
  }

  rellenarNumeroPuntoVenta() {
    this.notaCreditoCompra.serie = this.pad(this.notaCreditoCompra.serie, 3);
  }

  rellenarNumeroSecuencial() {
    this.notaCreditoCompra.secuencial = this.pad(this.notaCreditoCompra.secuencial, 9);
  }

  pad(numero: string, size: number): string {
    while (numero.length < size) numero = "0" + numero;
    return numero;
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }



  //FILTROS AUTOCOMPLETE
  inicializarFiltros() {
    this.filtroIdentificacionProveedores = this.controlIdentificacionProveedor.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(identificacion => typeof identificacion === 'string' ? this.filtroIdentificacionProveedor(identificacion) : this.proveedores.slice())
      );
    this.filtroProveedores = this.controlProveedor.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(proveedor => typeof proveedor === 'string' ? this.filtroProveedor(proveedor) : this.proveedores.slice())
      );
    this.filtroFacturasCompras = this.seleccionFacturaCompra.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(facturaCompra => typeof facturaCompra === 'string' ? this.filtroFacturaCompra(facturaCompra) : this.facturasCompras.slice())
      );
  }

  private filtroProveedor(value: string): Proveedor[] {
    if (this.proveedores.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.proveedores.filter(proveedor => proveedor.razonSocial.toLowerCase().includes(filterValue));
    }
    return [];
  }

  private filtroIdentificacionProveedor(value: string): Proveedor[] {
    if (this.proveedores.length > 0) {
      const filterValue = value.toUpperCase();
      return this.proveedores.filter(proveedor => proveedor.identificacion.toUpperCase().includes(filterValue));
    }
    return [];
  }

  private filtroFacturaCompra(value: string): FacturaCompra[] {
    if (this.facturasCompras.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.facturasCompras.filter(facturaCompra => facturaCompra.numeroComprobante.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verFacturaCompra(facturaCompra: FacturaCompra): string {
    return facturaCompra && facturaCompra.numeroComprobante ? facturaCompra.numeroComprobante : valores.vacio;
  }
}
