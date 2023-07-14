import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { valores, mensajes, otras, tabs, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../../constantes';
import { UntypedFormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import Swal from 'sweetalert2';

import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Empresa } from '../../../modelos/usuario/empresa';
import { GuiaRemision } from '../../../modelos/entrega/guia-remision';
import { GuiaRemisionService } from '../../../servicios/entrega/guia-remision.service';
import { Factura } from '../../../modelos/venta/factura';
import { FacturaService } from '../../../servicios/venta/factura.service';
import { FacturaLinea } from '../../../modelos/venta/factura-linea';
import { Cliente } from '../../../modelos/cliente/cliente';
import { ClienteService } from '../../../servicios/cliente/cliente.service';
import { Transportista } from '../../../modelos/entrega/transportista';
import { TransportistaService } from '../../../servicios/entrega/transportista.service';
import { Vehiculo } from '../../../modelos/entrega/vehiculo';
import { VehiculoService } from '../../../servicios/entrega/vehiculo.service';
import { GuiaRemisionElectronicaService } from '../../../servicios/entrega/guia-remision-eletronica.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-guia-remision',
  templateUrl: './guia-remision.component.html',
  styleUrls: ['./guia-remision.component.scss']
})
export class GuiaRemisionComponent implements OnInit {

  panelOpenState = false;

  cargar = false;
  hoy = new Date();

  estadoActivo: string = valores.estadoActivo;
  estadoInactivo: string = valores.estadoInactivo;
  estadoInternoEmitida: string = valores.estadoInternoEmitida;
  estadoInternoRecaudada: string = valores.estadoInternoRecaudada;
  estadoInternoAnulada: string = valores.estadoInternoAnulada
  estadoSriPendiente: string = valores.estadoSriPendiente;
  estadoSriAutorizada: string = valores.estadoSriAutorizada;
  estadoSriAnulada: string = valores.estadoSriAnulada;
  
  si = valores.si;
  no = valores.no;
  clienteDireccion = valores.clienteDireccion;
  nuevaDireccion = valores.nuevaDireccion;

  habilitarNuevaDireccion = false;
  abrirPanelAdmin = false;

  sesion: Sesion;
  empresa: Empresa = new Empresa();
  guiaRemision: GuiaRemision = new GuiaRemision();
  guiasRemisiones: GuiaRemision[] = [];

  seleccionCliente = new UntypedFormControl();
  filtroClientes: Observable<Cliente[]> = new Observable<Cliente[]>();
  clientes: Cliente[] = [];
  seleccionFactura = new UntypedFormControl();
  filtroFacturas: Observable<Factura[]> = new Observable<Factura[]>();
  facturas: Factura[] = [];
  transportistas: Transportista[] = [];
  vehiculos: Vehiculo[] = [];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: GuiaRemision) => `${row.codigo}` },
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: GuiaRemision) => `${this.datepipe.transform(row.fecha, "dd/MM/yyyy")}` },
    { nombreColumna: 'cliente', cabecera: 'Cliente', celda: (row: GuiaRemision) => `${row.factura.cliente.razonSocial}` },
    { nombreColumna: 'factura', cabecera: 'Factura', celda: (row: GuiaRemision) => `${row.factura.secuencial}` },
    { nombreColumna: 'direccion', cabecera: 'Direccion', celda: (row: GuiaRemision) => row.opcionGuia == valores.clienteDireccion ? `${row.factura.cliente.direccion}` : `${row.direccionDestinatario}` },
    { nombreColumna: 'transportista', cabecera: 'Transportista', celda: (row: GuiaRemision) => `${row.transportista.nombre}` },
    { nombreColumna: 'placa', cabecera: 'Placa', celda: (row: GuiaRemision) => `${row.vehiculo.placa}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: GuiaRemision) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<GuiaRemision>;
  clickedRows = new Set<GuiaRemision>();

  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("paginatorLinea") paginatorLinea: MatPaginator;


  columnasLinea: string[] = ["codigo", "bodega", "nombre", "medida", "cantidad", "precio", "descuento", "descuentoPorcentaje", "impuesto", "total"];
  dataSourceLinea = new MatTableDataSource<FacturaLinea>(this.guiaRemision.factura.facturaLineas);

  constructor(private clienteService: ClienteService, private sesionService: SesionService, private guiaRemisionElectronicaService: GuiaRemisionElectronicaService, 
    private vehiculoService: VehiculoService, private spinnerService: NgxSpinnerService, private datepipe: DatePipe,
    private router: Router, private guiaRemisionService: GuiaRemisionService, private facturaService: FacturaService, private transportistaService: TransportistaService, private dateAdapter: DateAdapter<Date>) { this.dateAdapter.setLocale('en-GB') }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G") //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N") //ASHIFT + N
      this.nuevo(null);
  }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.empresa = this.sesion.empresa;
    this.consultar();
    this.consultarClientes();
    this.consultarTransportistas();
    this.consultarVehiculos();
    this.inicializarFiltros();
  }

  consultarClientes() {
    this.clienteService.consultar().subscribe(
      res => {
        this.clientes = res.resultado as Cliente[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  consultarTransportistas() {
    this.transportistaService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe({
      next: res => {
        this.transportistas = res.resultado as Transportista[]
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }
  consultarVehiculos(){
    this.vehiculoService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe(
      res => {
        this.vehiculos = res.resultado as Vehiculo[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  nuevo(event) {
    if (event != null)
      event.preventDefault();
    this.guiaRemision = new GuiaRemision();
    this.seleccionCliente.patchValue(valores.vacio);
    this.seleccionFactura.patchValue(valores.vacio);
    this.dataSourceLinea = new MatTableDataSource<FacturaLinea>([]);
    this.clickedRows.clear();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.guiaRemision.sesion = this.sesion;
    this.guiaRemisionService.crear(this.guiaRemision).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  crearGuiaRemisionElectronica(event) {
    if (event != null)
      event.preventDefault();
    this.cargar = true;
    this.guiaRemisionElectronicaService.enviar(this.guiaRemision.id).subscribe(
      res => {
        let respuesta = res.resultado as String;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
        this.cargar = false;
      },
      err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.cargar = false;
      }
    );
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.guiaRemisionService.actualizar(this.guiaRemision).subscribe(
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
    this.guiaRemisionService.activar(this.guiaRemision).subscribe({
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
    this.guiaRemisionService.inactivar(this.guiaRemision).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    });
  }

  seleccionarOpcionGuia() {
    if (this.guiaRemision.opcionGuia == valores.clienteDireccion) {
      this.habilitarNuevaDireccion = true;
    }
    if (this.guiaRemision.opcionGuia == valores.nuevaDireccion) {
      this.habilitarNuevaDireccion = false;
    }
    this.guiaRemision.identificacionDestinatario = valores.vacio;
    this.guiaRemision.razonSocialDestinatario = valores.vacio;
    this.guiaRemision.direccionDestinatario = valores.vacio;
    this.guiaRemision.telefonoDestinatario = valores.vacio;
    this.guiaRemision.celularDestinatario = valores.vacio;
    this.guiaRemision.correoDestinatario = valores.vacio;
  }

  seleccion(guiaRemision: any) {
    if (!this.clickedRows.has(guiaRemision)) {
      this.clickedRows.clear();
      this.clickedRows.add(guiaRemision);
      this.guiaRemisionService.obtener(guiaRemision.id).subscribe({
        next: res => {
          this.guiaRemision = res.resultado as GuiaRemision;
          this.construir();
          this.seleccionarOpcionGuia();
        },
        error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      });
    } else {
      this.clickedRows.clear();
      this.guiaRemision = new GuiaRemision();
    }
  }

  consultar() {
    this.guiaRemisionService.consultar().subscribe(
      res => {
        this.guiasRemisiones = res.resultado as GuiaRemision[]
        this.dataSource = new MatTableDataSource(this.guiasRemisiones);
        this.dataSource.paginator = this.paginator;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarCliente() {
    let clienteId = this.seleccionCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe(
      res => {
        this.guiaRemision.factura.cliente = res.resultado as Cliente;
        this.seleccionCliente.patchValue(this.guiaRemision.factura.cliente);
        this.facturaService.consultarPorCliente(this.guiaRemision.factura.cliente.id).subscribe(
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
    this.facturaService.obtener(facturaId).subscribe(
      res => {
        this.guiaRemision.factura = res.resultado as Factura;
        this.seleccionFactura.patchValue(this.guiaRemision.factura);
        this.dataSourceLinea = new MatTableDataSource(this.guiaRemision.factura.facturaLineas);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  construir(){
    if (this.guiaRemision.id != valores.cero) {
      let fecha = new Date(this.guiaRemision.fecha);
      this.guiaRemision.fecha = fecha;
      this.seleccionCliente.patchValue(this.guiaRemision.factura.cliente);
      this.seleccionFactura.patchValue(this.guiaRemision.factura);
      this.dataSourceLinea = new MatTableDataSource<FacturaLinea>(this.guiaRemision.factura.facturaLineas);
    }
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

  //FILTROS AUTOCOMPLETE
  inicializarFiltros(){
    this.filtroClientes = this.seleccionCliente.valueChanges
    .pipe(
      startWith(valores.vacio),
      map(value => typeof value === 'string' || value == null ? value : value.id),
      map(cliente => typeof cliente === 'string' ? this.filtroCliente(cliente) : this.clientes.slice())
    );
  this.filtroFacturas = this.seleccionFactura.valueChanges
    .pipe(
      startWith(valores.vacio),
      map(value => typeof value === 'string' || value == null ? value : value.id),
      map(factura => typeof factura === 'string' ? this.filtroFactura(factura) : this.facturas.slice())
    );
  }

  private filtroCliente(value: string): Cliente[] {
    if (this.clientes.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.clientes.filter(cliente => cliente.razonSocial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verCliente(cliente: Cliente): string {
    return cliente && cliente.razonSocial ? cliente.razonSocial : valores.vacio;
  }

  private filtroFactura(value: string): Factura[] {
    if (this.facturas.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.facturas.filter(factura => factura.secuencial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verFactura(factura: Factura): string {
    return factura && factura.secuencial ? factura.secuencial : valores.vacio;
  }

  obtenerPDF(event){
    if (event != null)
      event.preventDefault();
    this.guiaRemisionElectronicaService.obtenerPDF(this.guiaRemision.id);
  }
  
  enviarPDFYXML(event){
    if (event != null)
      event.preventDefault();
    this.spinnerService.show();
    this.guiaRemisionElectronicaService.enviarPDFYXML(this.guiaRemision.id).subscribe({
      next: res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.spinnerService.hide();  
      },
      error: err => {
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        this.spinnerService.hide();  
      }
    });
  }
}
