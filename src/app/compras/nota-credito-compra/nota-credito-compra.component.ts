import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../modelos/format-date-picker';
import { UntypedFormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { startWith, map } from 'rxjs/operators';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Sesion } from '../../modelos/usuario/sesion';
import { valores, validarSesion, otras, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { ProveedorService } from 'src/app/servicios/compra/proveedor.service';
import { Proveedor } from 'src/app/modelos/compra/proveedor';
import { NotaCreditoCompraLinea } from 'src/app/modelos/compra/nota-credito-compra-linea';
import { NotaCreditoCompra } from 'src/app/modelos/compra/nota-credito-compra';
import { NotaCreditoCompraService } from 'src/app/servicios/compra/nota-credito-compra.service';
import { FacturaCompra } from 'src/app/modelos/compra/factura-compra';
import { FacturaCompraService } from 'src/app/servicios/compra/factura-compra.service';

@Component({
  selector: 'app-nota-credito-compra',
  templateUrl: './nota-credito-compra.component.html',
  styleUrls: ['./nota-credito-compra.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class NotaCreditoCompraComponent implements OnInit {

  panelOpenState = false;

  hoy = new Date();

  deshabilitarDevolucion = true;
  deshabilitarDescuento = true;

  devolucion = valores.devolucion;
  descuento = valores.descuento;
  conjunta = valores.conjunta;

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

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: NotaCreditoCompra) => `${row.codigo}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: NotaCreditoCompra) => `${this.datepipe.transform(row.fecha, "dd-MM-yyyy")}`},
    { nombreColumna: 'proveedor', cabecera: 'Proveedor', celda: (row: NotaCreditoCompra) => `${row.facturaCompra.proveedor.razonSocial}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaCreditoCompra) => `$${row.totalSinDescuento}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: NotaCreditoCompra) => `${row.estado}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<NotaCreditoCompra>;
  clickedRows = new Set<NotaCreditoCompra>();
  abrirPanelAdmin = false;
  notasCreditosCompras: NotaCreditoCompra[] = [];
  
  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("paginatorLinea") paginatorLinea: MatPaginator;

  notaCreditoCompra: NotaCreditoCompra = new NotaCreditoCompra();
  notaCreditoCompraLinea: NotaCreditoCompraLinea = new NotaCreditoCompraLinea();

  columnasLinea: string[] = ["codigo", 'nombre', 'medida', 'cantidad', 'devolucion', 'costoUnitario', 'valorDescuento', 'porcentajeDescuento', 'impuesto', 'bodega', 'total'];
  dataSourceLinea = new MatTableDataSource<NotaCreditoCompraLinea>(this.notaCreditoCompra.notaCreditoCompraLineas);
  sesion: Sesion;

  constructor(private proveedorService: ProveedorService, private sesionService: SesionService, private datepipe: DatePipe,
    private router: Router, private notaCreditoCompraService: NotaCreditoCompraService, private facturaCompraService: FacturaCompraService) { }

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
  }
  
  private filtroProveedor(value: string): Proveedor[] {
    if(this.proveedores.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.proveedores.filter(proveedor => proveedor.razonSocial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verProveedor(proveedor: Proveedor): string {
    return proveedor && proveedor.razonSocial ? proveedor.razonSocial : '';
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

  nuevo(event){
    if (event!=null)
      event.preventDefault();
    this.notaCreditoCompra = new NotaCreditoCompra();
    this.seleccionProveedor.patchValue(valores.vacio);
    this.seleccionFacturaCompra.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<NotaCreditoCompraLinea>([]);
    this.clickedRows.clear();
  }

  construir() {
    if (this.notaCreditoCompra.id != valores.cero) {
      let fecha = new Date(this.notaCreditoCompra.fecha);
      this.notaCreditoCompra.fecha = fecha;
      this.seleccionProveedor.patchValue(this.notaCreditoCompra.facturaCompra.proveedor);
      this.seleccionFacturaCompra.patchValue(this.notaCreditoCompra.facturaCompra);
      this.dataSourceLinea = new MatTableDataSource<NotaCreditoCompraLinea>(this.notaCreditoCompra.notaCreditoCompraLineas);
      this.dataSourceLinea.paginator = this.paginatorLinea;
      this.seleccionarOperacion();
    }
  }

  consultar() {
    this.notaCreditoCompraService.consultar().subscribe(
      res => {
        this.notasCreditosCompras = res.resultado as NotaCreditoCompra[]
        this.dataSource = new MatTableDataSource(this.notasCreditosCompras);
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

  seleccionarProveedor() {
    let proveedorId = this.seleccionProveedor.value.id;
    this.proveedorService.obtener(proveedorId).subscribe(
      res => {
        this.notaCreditoCompra.facturaCompra.proveedor = res.resultado as Proveedor;
        this.seleccionProveedor.patchValue(this.notaCreditoCompra.facturaCompra.proveedor);
        this.facturaCompraService.consultarPorProveedor(this.notaCreditoCompra.facturaCompra.proveedor.id).subscribe(
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
    this.notaCreditoCompraService.obtenerPorFacturaCompra(facturaCompraId).subscribe(
      res => {
        this.notaCreditoCompra = res.resultado as NotaCreditoCompra;
        this.seleccionFacturaCompra.patchValue(this.notaCreditoCompra.facturaCompra);
        this.dataSourceLinea = new MatTableDataSource(this.notaCreditoCompra.notaCreditoCompraLineas);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarOperacion(){
    for(let notaCreditoCompraLinea of this.notaCreditoCompra.notaCreditoCompraLineas){
      notaCreditoCompraLinea.devolucion = valores.cero;
      notaCreditoCompraLinea.porcentajeDescuentoLinea = valores.cero;
      notaCreditoCompraLinea.valorDescuentoLinea = valores.cero;
    }
    if(this.notaCreditoCompra.operacion == valores.devolucion){
      this.deshabilitarDevolucion = false;
      this.deshabilitarDescuento = true;
    }
    if(this.notaCreditoCompra.operacion == valores.descuento){
      this.deshabilitarDevolucion = true;
      this.deshabilitarDescuento = false;
    }
    if(this.notaCreditoCompra.operacion == valores.conjunta){
      this.deshabilitarDevolucion = false;
      this.deshabilitarDescuento = false;
    }
  }

  seleccionarDevolucion() {
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
    this.notaCreditoCompra.sesion=this.sesion;
    this.notaCreditoCompraService.crear(this.notaCreditoCompra).subscribe(
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
  
  seleccion(notaCreditoCompra: any) {
    if (!this.clickedRows.has(notaCreditoCompra)){
      this.clickedRows.clear();
      this.clickedRows.add(notaCreditoCompra);
      this.notaCreditoCompraService.obtener(notaCreditoCompra.id).subscribe({
        next: res => {
          this.notaCreditoCompra = res.resultado as NotaCreditoCompra;
          this.construir();
        },
        error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      });
    } else {
      this.clickedRows.clear();
      this.notaCreditoCompra = new NotaCreditoCompra();
    }
  }

  calcular(){
    this.notaCreditoCompraService.calcular(this.notaCreditoCompra).subscribe(
      res => {
        this.notaCreditoCompra = res.resultado as NotaCreditoCompra;
        this.dataSourceLinea = new MatTableDataSource<NotaCreditoCompraLinea>(this.notaCreditoCompra.notaCreditoCompraLineas);
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
