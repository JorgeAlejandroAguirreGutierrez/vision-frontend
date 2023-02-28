import { Component, OnInit, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../constantes';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { CalificacionCliente } from '../../modelos/cliente/calificacion-cliente';
import { CalificacionClienteService } from '../../servicios/cliente/calificacion-cliente.service';
import { Factura } from '../../modelos/comprobante/factura';
import { FacturaService } from '../../servicios/comprobante/factura.service';
import { FacturaDetalle } from '../../modelos/comprobante/factura-detalle';
import { FacturaDetalleService } from '../../servicios/comprobante/factura-detalle.service';
import { NotaCreditoVenta } from '../../modelos/comprobante/nota-credito-venta';
import { NotaCreditoVentaService } from '../../servicios/comprobante/nota-credito-venta.service';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-nota-credito-venta',
  templateUrl: './nota-credito-venta.component.html',
  styleUrls: ['./nota-credito-venta.component.scss']
})
export class NotaCreditoVentaComponent implements OnInit {

  activo: string = valores.activo;
  inactivo: string = valores.inactivo;

  abrirPanelNuevo : boolean = true;
  abrirPanelFactura : boolean = true;
  abrirPanelAdmin: boolean = true;

  sesion: Sesion=null;
  factura = new Factura();
  notaCreditoVenta = new NotaCreditoVenta();
  facturas: Factura[];

  firstFormGroup: UntypedFormGroup;

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Factura) => `${row.codigo}` },
    { nombreColumna: 'numero', cabecera: 'Número', celda: (row: Factura) => `${row.codigoNumerico}` },
    { nombreColumna: 'autorizacion', cabecera: 'Autorización', celda: (row: Factura) => `${row.claveAcceso}` },
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: Factura) => `${row.fecha}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Factura) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Factura>;
  clickedRows = new Set<Factura>();

  columnasDetalleFactura: string[] = ['nombre', 'medida', 'cantidad', 'valor', 'descuento', 'descuentoPorcentaje', 'impuesto', 'total', 'entregado', 'acciones'];
  dataSourceFacturaDetalle = new MatTableDataSource<FacturaDetalle>(this.notaCreditoVenta.facturaDetalles);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private calificacionClienteService: CalificacionClienteService,
        private sesionService: SesionService, private router: Router, private _formBuilder: UntypedFormBuilder,
        private facturaService: FacturaService) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultar();

    this.firstFormGroup = new UntypedFormGroup({
      firstCtrl: new UntypedFormControl()
    });

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
  }
  
  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.factura = new Factura();
    this.clickedRows.clear();
    this.borrarFiltro();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.facturaService.crear(this.factura).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;  
    this.facturaService.actualizar(this.factura).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  activar(event) {
    if (event != null)
      event.preventDefault();
    this.facturaService.activar(this.factura).subscribe({
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
    this.facturaService.inactivar(this.factura).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  consultar() {
    this.facturaService.consultar().subscribe({
      next: res => {
        this.facturas = res.resultado as Factura[];
        this.llenarTabla(this.facturas);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(facturas: Factura[]) {
    this.ordenarAsc(facturas, 'id');
    this.dataSource = new MatTableDataSource(facturas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  seleccion(factura: Factura) {
    if (!this.clickedRows.has(factura)){
      this.clickedRows.clear();
      this.clickedRows.add(factura);
      this.factura = { ... factura};
    } else {
      this.nuevo(null);
    }
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

  calcular(){

  }

  agregarFactura(){

  }

  eliminarFacturaDetalle(i: number){
    this.notaCreditoVenta.facturaDetalles.splice(i, 1);
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

  validarFormulario(): boolean {
    //validar que los campos esten llenos antes de guardar
    if (this.factura.codigo == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.factura.codigoNumerico == '') {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }

}
