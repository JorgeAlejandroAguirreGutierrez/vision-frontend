import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { valores, mensajes, otras, validarSesion, exito, exito_swal, error, error_swal } from '../../../constantes';
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
  hoy = new Date();

  estadoEmitida: string = valores.estadoEmitida;
  estadoRecaudada: string = valores.estadoRecaudada;
  estadoAnulada: string = valores.estadoAnulada
  procesoSRIPendiente: string = valores.procesoSRIPendiente;
  procesoSRIAutorizada: string = valores.procesoSRIAutorizada;
  procesoSRIAnulada: string = valores.procesoSRIAnulada;
  
  si = valores.si;
  no = valores.no;
  clienteDireccion = valores.clienteDireccion;
  nuevaDireccion = valores.nuevaDireccion;

  habilitarNuevaDireccion = false;
  abrirPanelAdmin = false;

  sesion: Sesion;
  empresa: Empresa = null;
  guiaRemision: GuiaRemision = new GuiaRemision();
  guiasRemisiones: GuiaRemision[] = [];

  controlIdentificacionCliente = new UntypedFormControl();
  controlRazonSocialCliente = new UntypedFormControl();
  controlFactura = new UntypedFormControl();
  filtroIdentificacionClientes: Observable<Cliente[]> = new Observable<Cliente[]>();
  filtroRazonSocialClientes: Observable<Cliente[]> = new Observable<Cliente[]>();
  filtroFacturas: Observable<Factura[]> = new Observable<Factura[]>();
  clientes: Cliente[] = [];
  facturas: Factura[] = [];
  transportistas: Transportista[] = [];
  vehiculos: Vehiculo[] = [];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: GuiaRemision) => `${row.codigo}` },
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: GuiaRemision) => `${this.datepipe.transform(row.fecha, "dd-MM-yyyy")}` },
    { nombreColumna: 'cliente', cabecera: 'Cliente', celda: (row: GuiaRemision) => `${row.factura.cliente.razonSocial}` },
    { nombreColumna: 'factura', cabecera: 'Factura', celda: (row: GuiaRemision) => `${row.factura.numeroComprobante}` },
    { nombreColumna: 'direccion', cabecera: 'Direccion', celda: (row: GuiaRemision) => row.opcionGuia == valores.clienteDireccion ? `${row.factura.cliente.direccion}` : `${row.direccionDestinatario}` },
    { nombreColumna: 'transportista', cabecera: 'Transportista', celda: (row: GuiaRemision) => `${row.transportista.nombre}` },
    { nombreColumna: 'placa', cabecera: 'Placa', celda: (row: GuiaRemision) => `${row.vehiculo.placa}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: GuiaRemision) => `${row.estado}`},
    { nombreColumna: 'procesoSRI', cabecera: 'Proceso SRI', celda: (row: GuiaRemision) => `${row.procesoSRI}`},
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<GuiaRemision>;
  clickedRows = new Set<GuiaRemision>();

  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("paginatorFacturaLinea") paginatorFacturaLinea: MatPaginator;
  @ViewChild('inputFiltroFacturaLinea') inputFiltroFacturaLinea: ElementRef;


  columnasFacturaLinea: any[] = [
    { nombreColumna: 'nombre', cabecera: 'Producto', celda: (row: FacturaLinea) => `${row.producto.nombre}` },
    { nombreColumna: 'medida', cabecera: 'Medida', celda: (row: FacturaLinea) => `${row.producto.medida.abreviatura}` },
    { nombreColumna: 'cantidad', cabecera: 'Cant.', celda: (row: FacturaLinea) => `${row.cantidad}` },
    { nombreColumna: 'valor', cabecera: 'P. Unit', celda: (row: FacturaLinea) => `$${row.precioUnitario}` },
    { nombreColumna: 'descuento', cabecera: 'Desc. $', celda: (row: FacturaLinea) => `$${row.valorDescuentoLinea}` },
    { nombreColumna: 'descuentoPorcentaje', cabecera: 'Desc. %', celda: (row: FacturaLinea) => `${row.porcentajeDescuentoLinea}%` },
    { nombreColumna: 'subtotal', cabecera: 'Subtotal', celda: (row: FacturaLinea) => `$${row.subtotalLinea}` },
    { nombreColumna: 'iva', cabecera: 'IVA', celda: (row: FacturaLinea) => `$${row.importeIvaLinea}` },
    { nombreColumna: 'total', cabecera: 'Total', celda: (row: FacturaLinea) => `$${row.totalLinea}` },
    { nombreColumna: 'entregado', cabecera: 'Entreg.', celda: (row: FacturaLinea) => `${row.entregado}` }
  ];
  cabeceraFacturaLinea: string[] = this.columnasFacturaLinea.map(titulo => titulo.nombreColumna);
  dataSourceFacturaLinea: MatTableDataSource<FacturaLinea> = new MatTableDataSource<FacturaLinea>(this.guiaRemision.factura.facturaLineas);
  clickedRowsFacturaLinea = new Set<FacturaLinea>();

  constructor(private clienteService: ClienteService, private sesionService: SesionService, private guiaRemisionElectronicaService: GuiaRemisionElectronicaService, 
    private vehiculoService: VehiculoService, private spinnerService: NgxSpinnerService, private datepipe: DatePipe, private renderer: Renderer2,
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
    this.empresa = this.sesion.usuario.estacion.establecimiento.empresa;
    this.consultar();
    this.consultarClientePorEmpresaYEstado();
    this.consultarTransportistas();
    this.consultarVehiculos();
    this.inicializarFiltros();
  }

  consultarClientePorEmpresaYEstado() {
    this.clienteService.consultarPorEmpresaYEstado(this.empresa.id, valores.estadoActivo).subscribe(
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

  nuevo(event){
    if (event!=null)
      event.preventDefault();
    this.guiaRemision = new GuiaRemision();
    this.hoy = new Date();
    this.guiaRemision.fecha = this.hoy;
    this.guiaRemision.fechaInicioTransporte = this.hoy;
    this.guiaRemision.fechaFinTransporte = this.hoy;
    this.guiaRemision.establecimiento = this.sesion.usuario.estacion.establecimiento.codigoSRI;
    this.guiaRemision.puntoVenta = this.sesion.usuario.estacion.codigoSRI;
    this.controlIdentificacionCliente.patchValue(valores.vacio);
    this.controlRazonSocialCliente.patchValue(valores.vacio);
    this.dataSourceFacturaLinea = new MatTableDataSource<FacturaLinea>([]);
    this.clickedRows.clear();
  }

  crear(event) {
    if (event != null)
      event.preventDefault();
    this.spinnerService.show();
    this.guiaRemision.usuario = this.sesion.usuario;
    this.guiaRemision.empresa = this.empresa;
    this.guiaRemisionService.crear(this.guiaRemision).subscribe(
      res => {
        this.spinnerService.hide();
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      err => {
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }

  crearGuiaRemisionElectronica(event) {
    if (event != null)
      event.preventDefault();
    this.spinnerService.show();
    this.guiaRemisionElectronicaService.enviar(this.guiaRemision.id).subscribe(
      res => {
        this.spinnerService.hide();
        let respuesta = res.resultado as String;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      err => {
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    this.spinnerService.show();
    this.guiaRemisionService.actualizar(this.guiaRemision).subscribe(
      res => {
        this.spinnerService.hide();
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.consultar();
        this.nuevo(null);
      },
      err => {
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      }
    );
  }

  anular(event) {
    if (event != null)
      event.preventDefault();
    Swal.fire({
      title: 'Advertencia',
      text: "Recuerda anular el comprobante ante el SRI",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ok'
      }).then((result) => {
          if (result.value) {
            this.guiaRemisionService.anular(this.guiaRemision).subscribe({
              next: res => {
                Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
                this.consultar();
                this.nuevo(null);
              },
              error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
            });
          }
      });  
  }

  seleccionarOpcionGuia() {
    if (this.guiaRemision.opcionGuia == valores.clienteDireccion) {
      this.habilitarNuevaDireccion = false;
    }
    if (this.guiaRemision.opcionGuia == valores.nuevaDireccion) {
      this.habilitarNuevaDireccion = true;
    }
    this.guiaRemision.identificacionDestinatario = valores.vacio;
    this.guiaRemision.razonSocialDestinatario = valores.vacio;
    this.guiaRemision.direccionDestinatario = valores.vacio;
    this.guiaRemision.telefonoDestinatario = valores.vacio;
    this.guiaRemision.celularDestinatario = valores.vacio;
    this.guiaRemision.correoDestinatario = valores.vacio;
  }

  seleccionar(guiaRemision: any) {
    if (!this.clickedRows.has(guiaRemision)) {
      this.clickedRows.clear();
      this.clickedRows.add(guiaRemision);
      this.spinnerService.show();
      this.guiaRemisionService.obtener(guiaRemision.id).subscribe({
        next: res => {
          this.spinnerService.hide();
          this.guiaRemision = res.resultado as GuiaRemision;
          this.construir();
          this.seleccionarOpcionGuia();
        },
        error: err => {
          this.spinnerService.hide();
          Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
        }
      });
    } else {
      this.clickedRows.clear();
      this.guiaRemision = new GuiaRemision();
    }
  }

  consultar() {
    this.guiaRemisionService.consultarPorEmpresa(this.empresa.id).subscribe(
      res => {
        this.guiasRemisiones = res.resultado as GuiaRemision[]
        this.dataSource = new MatTableDataSource(this.guiasRemisiones);
        this.dataSource.paginator = this.paginator;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarIdentificacionCliente() {
    this.spinnerService.show();
    let clienteId = this.controlIdentificacionCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe({
      next: res => {
        this.guiaRemision.factura.cliente = res.resultado as Cliente;
        this.controlIdentificacionCliente.patchValue(this.guiaRemision.factura.cliente);
        this.controlRazonSocialCliente.patchValue(this.guiaRemision.factura.cliente);
        this.facturaService.consultarPorClienteYEmpresaYEstado(this.guiaRemision.factura.cliente.id, this.empresa.id, valores.estadoRecaudada).subscribe(
          res => {
            this.facturas = res.resultado as Factura[]
            this.spinnerService.hide();
          },
          err => {
            this.spinnerService.hide();
            Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
          }
        );
      },
      error: err => { 
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
       }
    });
  }

  seleccionarRazonSocialCliente() {
    this.spinnerService.show();
    let clienteId = this.controlRazonSocialCliente.value.id;
    this.clienteService.obtener(clienteId).subscribe({
      next: res => {
        this.guiaRemision.factura.cliente = res.resultado as Cliente;
        this.controlIdentificacionCliente.patchValue(this.guiaRemision.factura.cliente);
        this.controlRazonSocialCliente.patchValue(this.guiaRemision.factura.cliente);
        this.facturaService.consultarPorClienteYEmpresaYEstado(this.guiaRemision.factura.cliente.id, this.empresa.id, valores.estadoRecaudada).subscribe(
          res => {
            this.facturas = res.resultado as Factura[];
            this.spinnerService.hide();
          },
          err => {
            this.spinnerService.hide();
            Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
          }
        );
      },
      error: err => {
        this.spinnerService.hide();
        Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje });
      }
    });
  }

  seleccionarFactura() {
    this.guiaRemision.factura = this.controlFactura.value;
    this.dataSourceFacturaLinea = new MatTableDataSource(this.guiaRemision.factura.facturaLineas);
    this.dataSourceFacturaLinea.paginator = this.paginatorFacturaLinea;
  }

  construir() {
    let fecha = new Date(this.guiaRemision.fecha);
    this.guiaRemision.fecha = fecha;
    let fechaInicioTransporte = new Date(this.guiaRemision.fechaInicioTransporte);
    this.guiaRemision.fechaInicioTransporte = fechaInicioTransporte;
    let fechaFinTransporte = new Date(this.guiaRemision.fechaFinTransporte);
    this.guiaRemision.fechaFinTransporte = fechaFinTransporte;
    this.controlIdentificacionCliente.patchValue(this.guiaRemision.factura.cliente);
    this.controlRazonSocialCliente.patchValue(this.guiaRemision.factura.cliente);
    this.controlFactura.patchValue(this.guiaRemision.factura);
    this.dataSourceFacturaLinea = new MatTableDataSource<FacturaLinea>(this.guiaRemision.factura.facturaLineas);
    this.dataSourceFacturaLinea.paginator = this.paginatorFacturaLinea;
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filtroFacturaLinea(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFacturaLinea.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceFacturaLinea.paginator) {
      this.dataSourceFacturaLinea.paginator.firstPage();
    }
  }

  borrarFiltroFacturaLinea() {
    this.renderer.setProperty(this.inputFiltroFacturaLinea.nativeElement, 'value', '');
    this.dataSourceFacturaLinea.filter = '';
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

  //FILTROS AUTOCOMPLETE
  inicializarFiltros(){
    this.filtroIdentificacionClientes = this.controlIdentificacionCliente.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(identificacion => typeof identificacion === 'string' ? this.filtroIdentificacionCliente(identificacion) : this.clientes.slice())
      );
    this.filtroRazonSocialClientes = this.controlRazonSocialCliente.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(razon_social => typeof razon_social === 'string' ? this.filtroRazonSocialCliente(razon_social) : this.clientes.slice())
      );
    this.filtroFacturas = this.controlFactura.valueChanges
      .pipe(
        startWith(valores.vacio),
        map(value => typeof value === 'string' || value == null ? value : value.id),
        map(factura => typeof factura === 'string' ? this.filtroFactura(factura) : this.facturas.slice())
      );
  }

  private filtroIdentificacionCliente(value: string): Cliente[] {
    if (this.clientes.length > valores.cero) {
      const filterValue = value.toUpperCase();
      return this.clientes.filter(cliente => cliente.identificacion.toUpperCase().includes(filterValue));
    }
    return [];
  }
  verIdentificacionCliente(cliente: Cliente): string {
    return cliente && cliente.identificacion ? cliente.identificacion : valores.vacio;
  }
  private filtroRazonSocialCliente(value: string): Cliente[] {
    if (this.clientes.length > valores.cero) {
      const filterValue = value.toUpperCase();
      return this.clientes.filter(cliente => cliente.razonSocial.toUpperCase().includes(filterValue));
    }
    return [];
  }
  verRazonSocialCliente(cliente: Cliente): string {
    return cliente && cliente.razonSocial ? cliente.razonSocial : valores.vacio;
  }

  private filtroFactura(value: string): Factura[] {
    if (this.facturas.length > valores.cero) {
      const filterValue = value.toLowerCase();
      return this.facturas.filter(factura => factura.numeroComprobante.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verFactura(factura: Factura): string {
    return factura && factura.numeroComprobante ? factura.numeroComprobante : valores.vacio;
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

  validarTelefono() {
    let digito = this.guiaRemision.telefonoDestinatario.substring(0, 1);
    if (this.guiaRemision.telefonoDestinatario.length != 11 || digito != "0") {
      this.guiaRemision.telefonoDestinatario = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_telefono_invalido });
    }
  }

  validarCelular() {
    let digito = this.guiaRemision.celularDestinatario.substring(0, 2);
    if (this.guiaRemision.celularDestinatario.length != 12 || digito != "09") {
      this.guiaRemision.celularDestinatario = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_celular_invalido });
    }
  }

  validarCorreo() {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    let validacion = expression.test(this.guiaRemision.correoDestinatario);
    if (!validacion) {
      this.guiaRemision.correoDestinatario = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_correo_invalido });
    }
  }

  formateaNumero (valor) {
    // si no es un número devuelve el valor, o lo convierte a número con 2 decimales
    return isNaN (valor) ? valor : parseFloat (valor).toFixed (2);
  }
}