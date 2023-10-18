import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2, Inject, Input } from '@angular/core';
import { valores, mensajes, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Sincronizacion } from 'src/app/modelos/configuracion/sincronizacion';
import { SincronizacionService } from 'src/app/servicios/configuracion/sincronizacion.service';
import { Empresa } from 'src/app/modelos/usuario/empresa';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FacturaCompra } from 'src/app/modelos/compra/factura-compra';
import { DatePipe } from '@angular/common';
import { FacturaCompraService } from 'src/app/servicios/compra/factura-compra.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TipoGasto } from 'src/app/modelos/inventario/tipo-gasto';
import { TipoGastoService } from 'src/app/servicios/inventario/tipo-gasto.service';
import { GastoPersonal } from 'src/app/modelos/compra/gasto-personal';
import { Modelo } from 'src/app/modelos/configuracion/modelo';
import { GastoPersonalService } from 'src/app/servicios/compra/gasto-personal.service';

@Component({
  selector: 'app-sincronizacion',
  templateUrl: './sincronizacion.component.html',
  styleUrls: ['./sincronizacion.component.scss']
})
export class SincronizacionComponent implements OnInit {

  estadoActivo: string = valores.estadoActivo;
  estadoInactivo: string = valores.estadoInactivo;
  recibidas: string = valores.recibidas;
  emitidas: string = valores.emitidas;
  mes01: string = valores.mes01;
  mes02: string = valores.mes02;
  mes03: string = valores.mes03;
  mes04: string = valores.mes04;
  mes05: string = valores.mes05;
  mes06: string = valores.mes06;
  mes07: string = valores.mes07;
  mes08: string = valores.mes08;
  mes09: string = valores.mes09;
  mes10: string = valores.mes10;
  mes11: string = valores.mes11;
  mes12: string = valores.mes12;
  anio2022: string = valores.anio2022;
  anio2023: string = valores.anio2023;

  abrirPanelNuevo = true;
  abrirPanelAdmin = true;

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  sincronizacion = new Sincronizacion();
  sincronizaciones: Sincronizacion[];
  facturasCompras: FacturaCompra[] = [];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: Sincronizacion) => `${row.codigo}` },
    { nombreColumna: 'tipo', cabecera: 'Tipo', celda: (row: Sincronizacion) => `${row.tipo}` },
    { nombreColumna: 'mes', cabecera: 'Mes', celda: (row: Sincronizacion) => `${row.mes}` },
    { nombreColumna: 'anio', cabecera: 'Año', celda: (row: Sincronizacion) => `${row.anio}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: Sincronizacion) => `${row.estado}` },
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Sincronizacion>;
  clickedRows = new Set<Sincronizacion>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(private renderer: Renderer2, private sincronizacionService: SincronizacionService, public dialog: MatDialog,
    private sesionService: SesionService, private spinnerService: NgxSpinnerService, private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
    this.consultar();
  }
  
  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.sincronizacion = new Sincronizacion();
    this.clickedRows.clear();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.sincronizacion.usuario = this.sesion.usuario;
    this.sincronizacion.empresa = this.empresa;
    this.sincronizacionService.crear(this.sincronizacion).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.sincronizacion = res.resultado as Sincronizacion;
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  procesar(event) {
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.spinnerService.show();
    this.sincronizacionService.procesar(this.sincronizacion.id).subscribe({
      next: res => {
        this.facturasCompras = res.resultado as FacturaCompra[];
        this.dialogoSincronizaciones(this.facturasCompras);
        this.consultar();
        this.nuevo(null);
        this.spinnerService.hide();
      },
      error: err => { 
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje }) 
      }
    });
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    if (!this.validarFormulario())
      return;
    this.sincronizacionService.actualizar(this.sincronizacion).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.sincronizacion = res.resultado as Sincronizacion;
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  
  consultar() {
    this.sincronizacionService.consultar().subscribe({
      next: res => {
        this.sincronizaciones = res.resultado as Sincronizacion[]
        this.llenarTabla(this.sincronizaciones);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  llenarTabla(sincronizaciones: Sincronizacion[]) {
    this.ordenarAsc(sincronizaciones, 'id');
    this.dataSource = new MatTableDataSource(sincronizaciones);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
  }

  seleccion(sincronizacion: Sincronizacion) {
    if (!this.clickedRows.has(sincronizacion)){
      this.clickedRows.clear();
      this.clickedRows.add(sincronizacion);
      this.sincronizacion = { ... sincronizacion};
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

  validarFormulario(): boolean {
    if (this.sincronizacion.tipo == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.sincronizacion.mes == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    if (this.sincronizacion.anio == valores.vacio) {
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_falta_datos });
      return false;
    }
    return true;
  }

  dialogoSincronizaciones(facturasCompras: FacturaCompra[]): void {
    const dialogRef = this.dialog.open(DialogoSincronizacionComponent, {
      width: '80%',
      data: {facturasCompras: facturasCompras}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
}

@Component({
  selector: 'dialogo-sincronizacion',
  templateUrl: 'dialogo-sincronizacion.component.html',
})
export class DialogoSincronizacionComponent {

  modelos: Modelo[] = [];

  modelosFacturasCompras: Modelo[] = [];
  modelosGastosPersonales: Modelo[] = [];

  tiposGastos: TipoGasto[] = [];
  tipoGasto: TipoGasto = new TipoGasto();

  opcionesFacturaCompra: boolean[] = [];
  opcionesGastoPersonal: boolean[] = [];
  opcionesTipoGasto: TipoGasto[] = [];

  columnas: any[] = [
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: Modelo) => `${this.datepipe.transform(row.fecha, "dd-MM-yyyy")}` },
    { nombreColumna: 'numeroComprobante', cabecera: 'Numero de Comprobante', celda: (row: Modelo) => `${row.numeroComprobante}` },
    { nombreColumna: 'proveedor', cabecera: 'Proveedor', celda: (row: Modelo) => `${row.razonSocial}` },
    { nombreColumna: 'descuento', cabecera: 'Descuento', celda: (row: Modelo) => `${row.totalDescuento}` },
    { nombreColumna: 'subtotal', cabecera: 'Subtotal', celda: (row: Modelo) => `${row.totalSinImpuestos}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: Modelo) => `${row.importeTotal}` },
    { nombreColumna: 'acciones', cabecera: 'Acciones' }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<Modelo>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("inputFiltro") inputFiltro: ElementRef;

  constructor(public dialogRef: MatDialogRef<DialogoSincronizacionComponent>, private renderer: Renderer2, private facturaCompraService: FacturaCompraService,
    private gastoPersonalService: GastoPersonalService, private tipoGastoService: TipoGastoService, private datepipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: {modelos: Modelo[]}) { 
    this.modelos = data.modelos;
    this.llenarTabla(this.modelos);
    this.llenarOpciones();
    this.consultarTipoGasto();
  }
  
  llenarTabla(modelos: Modelo[]) {
    this.ordenarAsc(modelos, 'id');
    this.dataSource = new MatTableDataSource(modelos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  llenarOpciones(){
    for (let i = 0; i < this.modelos.length; i++) {
      this.opcionesFacturaCompra.push(false);
      this.opcionesGastoPersonal.push(false);
      this.opcionesTipoGasto.push(new TipoGasto());
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  consultarTipoGasto() {
    this.tipoGastoService.consultar().subscribe({
      next: res => {
        this.tiposGastos = res.resultado as TipoGasto[];
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });    
  }

  guardar() {
    /*if(this.modelosFacturasCompras.length > 0){
      this.facturaCompraService.crearModelos(this.modelosFacturasCompras).subscribe({
        next: res => {
          Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        },
        error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      });    
    }
    if(this.modelosGastosPersonales.length > 0){
      this.gastoPersonalService.crearModelos(this.modelosGastosPersonales).subscribe({
        next: res => {
          Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        },
        error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      });    
    }*/
    
  }

  seleccionarFacturaCompra(evento: boolean, i: number) {
    if(evento == true){
      this.modelosFacturasCompras.push(this.modelos[i]);
      this.modelosGastosPersonales.splice(this.modelosGastosPersonales.indexOf(this.modelos[i]), 1);
      this.opcionesFacturaCompra[i] = true;
      this.opcionesGastoPersonal[i] = false;
      this.opcionesTipoGasto[i] = new TipoGasto();  
    }
    if(evento == false){
      this.modelosFacturasCompras.splice(this.modelosFacturasCompras.indexOf(this.modelos[i]), 1);
      this.opcionesFacturaCompra[i] = false;
    }
  }

  seleccionarGastoPersonal(evento: boolean, i: number) {
    if(evento == true){
      this.modelosGastosPersonales.push(this.modelos[i]);
      this.modelosFacturasCompras.splice(this.modelosFacturasCompras.indexOf(this.modelos[i]), 1);
      this.opcionesFacturaCompra[i] = false;
      this.opcionesGastoPersonal[i] = true;
      this.opcionesTipoGasto[i] = new TipoGasto();  
    }
    if(evento == false){
      this.modelosGastosPersonales.splice(this.modelosGastosPersonales.indexOf(this.modelos[i]), 1);
      this.opcionesGastoPersonal[i] = false;
    }
  }

  ordenarAsc(arrayJson: any, pKey: any) {
    arrayJson.sort(function (a: any, b: any) {
      return a[pKey] > b[pKey];
    });
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

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }
}