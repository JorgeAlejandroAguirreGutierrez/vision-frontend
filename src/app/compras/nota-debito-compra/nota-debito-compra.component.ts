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
import { valores, validarSesion, otras, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { ProveedorService } from 'src/app/servicios/compra/proveedor.service';
import { Proveedor } from 'src/app/modelos/compra/proveedor';
import { NotaCreditoCompraLinea } from 'src/app/modelos/compra/nota-credito-compra-linea';
import { NotaCreditoCompra } from 'src/app/modelos/compra/nota-credito-compra';
import { NotaDebitoCompraService } from 'src/app/servicios/compra/nota-debito-compra.service';
import { FacturaCompra } from 'src/app/modelos/compra/factura-compra';
import { FacturaCompraService } from 'src/app/servicios/compra/factura-compra.service';
import { NotaDebitoCompra } from 'src/app/modelos/compra/nota-debito-compra';
import { NotaDebitoCompraLinea } from 'src/app/modelos/compra/nota-debito-compra-linea';

@Component({
  selector: 'app-nota-debito-compra',
  templateUrl: './nota-debito-compra.component.html',
  styleUrls: ['./nota-debito-compra.component.scss']
})
export class NotaDebitoCompraComponent implements OnInit {

  panelOpenState = false;

  deshabilitarDevolucion = true;
  deshabilitarDescuento = true;  
  
  seleccionProveedor = new UntypedFormControl();
  filtroProveedores: Observable<Proveedor[]> = new Observable<Proveedor[]>();
  proveedores: Proveedor[] = [];
  seleccionFacturaCompra = new UntypedFormControl();
  filtroFacturasCompras: Observable<FacturaCompra[]> = new Observable<FacturaCompra[]>();
  facturasCompras: FacturaCompra[] = [];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: NotaDebitoCompra) => `${row.codigo}`},
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: NotaDebitoCompra) => `${row.fecha}`},
    { nombreColumna: 'proveedor', cabecera: 'Proveedor', celda: (row: NotaDebitoCompra) => `${row.facturaCompra.proveedor.razonSocial}`},
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: NotaDebitoCompra) => `$${row.totalSinDescuento}`},
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: NotaDebitoCompra) => `$${row.estado}`}
  ];
  cabecera: string[]  = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<NotaDebitoCompra>;
  clickedRows = new Set<NotaDebitoCompra>();
  abrirPanelAdmin = false;
  notasDebitosCompras: NotaDebitoCompra[] = [];
  
  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("paginatorLinea") paginatorLinea: MatPaginator;

  notaDebitoCompra: NotaDebitoCompra = new NotaDebitoCompra();
  notaDebitoCompraLinea: NotaDebitoCompraLinea = new NotaDebitoCompraLinea();

  columnasLinea: string[] = ["codigo", 'nombre', 'medida', 'cantidad', 'costoUnitario', 'valorDescuento', 'porcentajeDescuento', 'impuesto', 'bodega', 'total'];
  dataSourceLinea = new MatTableDataSource<NotaDebitoCompraLinea>(this.notaDebitoCompra.notaDebitoCompraLineas);
  sesion: Sesion;
  si = valores.si;
  no = valores.no;

  constructor(private proveedorService: ProveedorService, private sesionService: SesionService,
    private router: Router, private notaDebitoCompraService: NotaDebitoCompraService, private facturaCompraService: FacturaCompraService,
    private modalService: NgbModal) { }

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
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(proveedor => typeof proveedor === 'string' ? this.filtroProveedor(proveedor) : this.proveedores.slice())
      );
    this.filtroFacturasCompras = this.seleccionFacturaCompra.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' || value==null ? value : value.id),
        map(facturaCompra => typeof facturaCompra === 'string' ? this.filtroFacturaCompra(facturaCompra) : this.facturasCompras.slice())
      );
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

  private filtroFacturaCompra(value: string): FacturaCompra[] {
    if(this.facturasCompras.length > 0) {
      const filterValue = value.toLowerCase();
      return this.facturasCompras.filter(facturaCompra => facturaCompra.secuencia.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verFacturaCompra(facturaCompra: FacturaCompra): string {
    return facturaCompra && facturaCompra.secuencia ? facturaCompra.secuencia : '';
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
    this.notaDebitoCompra = new NotaDebitoCompra();
    this.seleccionProveedor.patchValue(valores.vacio);
    this.seleccionFacturaCompra.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<NotaCreditoCompraLinea>([]);
  }

  construir() {
    if (this.notaDebitoCompra.id != valores.cero) {
      this.seleccionProveedor.patchValue(this.notaDebitoCompra.facturaCompra.proveedor);
      this.seleccionFacturaCompra.patchValue(this.notaDebitoCompra.facturaCompra);
      this.dataSourceLinea = new MatTableDataSource<NotaDebitoCompraLinea>(this.notaDebitoCompra.notaDebitoCompraLineas);
      this.dataSourceLinea.paginator = this.paginatorLinea;
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
        this.dataSourceLinea = new MatTableDataSource(this.notaDebitoCompra.notaDebitoCompraLineas);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarCantidad() {
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

  seleccion(notaDebitoCompra: any) {
    if (!this.clickedRows.has(notaDebitoCompra)){
      this.clickedRows.clear();
      this.clickedRows.add(notaDebitoCompra);
      this.notaDebitoCompraService.obtener(notaDebitoCompra.id).subscribe({
        next: res => {
          this.notaDebitoCompra = res.resultado as NotaDebitoCompra;
          this.seleccionProveedor.patchValue(this.notaDebitoCompra.facturaCompra.proveedor);
          this.seleccionFacturaCompra.patchValue(this.notaDebitoCompra.facturaCompra);
          this.dataSourceLinea = new MatTableDataSource<NotaDebitoCompraLinea>(this.notaDebitoCompra.notaDebitoCompraLineas);
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
