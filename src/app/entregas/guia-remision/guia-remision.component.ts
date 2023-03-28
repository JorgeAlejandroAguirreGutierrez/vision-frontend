import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import Swal from 'sweetalert2';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { TransportistaService } from '../../servicios/entrega/transportista.service';
import { Transportista } from '../../modelos/entrega/transportista';
import { GuiaRemision } from '../../modelos/entrega/guia-remision';
import { GuiaRemisionService } from '../../servicios/entrega/guia-remision.service';
import { Sesion } from '../../modelos/usuario/sesion';
import { FacturaService } from '../../servicios/comprobante/factura.service';
import { valores, mensajes, otras, tabs, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { MatTableDataSource } from '@angular/material/table';
import { FacturaLinea } from '../../modelos/comprobante/factura-linea';
import { UntypedFormControl } from '@angular/forms';
import { Cliente } from 'src/app/modelos/cliente/cliente';
import { Factura } from 'src/app/modelos/comprobante/factura';
import { ClienteService } from 'src/app/servicios/cliente/cliente.service';
import { MatPaginator } from '@angular/material/paginator';
import { GuiaRemisionElectronicaService } from 'src/app/servicios/entrega/guia-remision-eletronica.service';

@Component({
  selector: 'app-guia-remision',
  templateUrl: './guia-remision.component.html',
  styleUrls: ['./guia-remision.component.scss']
})
export class GuiaRemisionComponent implements OnInit {

  panelOpenState = false;

  cargar = false;

  si = valores.si;
  no = valores.no;
  emitida = valores.emitida;
  anulada = valores.anulada;
  noFacturada = valores.noFacturada;
  facturada = valores.facturada;
  noRecaudada = valores.noRecaudada;
  recaudada = valores.recaudada;
  clienteDireccion = valores.clienteDireccion;
  nuevaDireccion = valores.nuevaDireccion;

  habilitarNuevaDireccion = false;

  seleccionCliente = new UntypedFormControl();
  filtroClientes: Observable<Cliente[]> = new Observable<Cliente[]>();
  clientes: Cliente[] = [];
  seleccionFactura = new UntypedFormControl();
  filtroFacturas: Observable<Factura[]> = new Observable<Factura[]>();
  facturas: Factura[] = [];
  transportistas: Transportista[] = [];

  columnas: any[] = [
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: GuiaRemision) => `${row.codigo}` },
    { nombreColumna: 'fecha', cabecera: 'Fecha', celda: (row: GuiaRemision) => `${this.datepipe.transform(row.fecha, "dd/MM/yyyy")}` },
    { nombreColumna: 'cliente', cabecera: 'Cliente', celda: (row: GuiaRemision) => `${row.factura.cliente.razonSocial}` },
    { nombreColumna: 'factura', cabecera: 'Factura', celda: (row: GuiaRemision) => `${row.factura.secuencia}` },
    { nombreColumna: 'direccion', cabecera: 'Direccion', celda: (row: GuiaRemision) => row.opcionGuia == valores.clienteDireccion ? `${row.factura.cliente.direccion}` : `${row.direccionDestinatario}` },
    { nombreColumna: 'transportista', cabecera: 'Transportista', celda: (row: GuiaRemision) => `${row.transportista.nombre}` },
    { nombreColumna: 'placa', cabecera: 'Placa', celda: (row: GuiaRemision) => `${row.transportista.vehiculoTransporte.placa}` },
    { nombreColumna: 'estado', cabecera: 'Estado', celda: (row: GuiaRemision) => `${row.estado}` }
  ];
  cabecera: string[] = this.columnas.map(titulo => titulo.nombreColumna);
  dataSource: MatTableDataSource<GuiaRemision>;
  clickedRows = new Set<GuiaRemision>();
  abrirPanelAdmin = false;
  guiasRemisiones: GuiaRemision[] = [];

  @ViewChild("paginator") paginator: MatPaginator;
  @ViewChild("paginatorLinea") paginatorLinea: MatPaginator;

  guiaRemision: GuiaRemision = new GuiaRemision();

  columnasLinea: string[] = ["codigo", "bodega", "nombre", "medida", "cantidad", "precio", "descuento", "descuentoPorcentaje", "impuesto", "total"];
  dataSourceLinea = new MatTableDataSource<FacturaLinea>(this.guiaRemision.factura.facturaLineas);
  sesion: Sesion;

  constructor(private clienteService: ClienteService, private sesionService: SesionService, private guiaRemisionElectronicaService: GuiaRemisionElectronicaService, private datepipe: DatePipe,
    private router: Router, private guiaRemisionService: GuiaRemisionService, private facturaService: FacturaService, private transportistaService: TransportistaService) { }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G") //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N") //ASHIFT + N
      this.nuevo(null);
  }

  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.consultar();
    this.consultarClientes();
    this.consultarTransportistas();
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
      return this.facturas.filter(factura => factura.secuencia.toLowerCase().includes(filterValue));
    }
    return [];
  }
  verFactura(factura: Factura): string {
    return factura && factura.secuencia ? factura.secuencia : valores.vacio;
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

  consultarClientes() {
    this.clienteService.consultar().subscribe(
      res => {
        this.clientes = res.resultado as Cliente[]
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

  consultarTransportistas() {
    this.transportistaService.consultar().subscribe(
      res => {
        this.transportistas = res.resultado as Transportista[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
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
          this.seleccionCliente.patchValue(this.guiaRemision.factura.cliente);
          this.seleccionFactura.patchValue(this.guiaRemision.factura);
          this.dataSourceLinea = new MatTableDataSource<FacturaLinea>(this.guiaRemision.factura.facturaLineas);
          this.seleccionarOpcionGuia();
        },
        error: err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      });
    } else {
      this.clickedRows.clear();
      this.guiaRemision = new GuiaRemision();
    }
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
