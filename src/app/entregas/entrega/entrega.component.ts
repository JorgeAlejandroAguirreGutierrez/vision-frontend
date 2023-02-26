import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { Factura } from '../../modelos/comprobante/factura';
import { Ubicacion } from '../../modelos/configuracion/ubicacion';
import { UbicacionService } from '../../servicios/configuracion/ubicacion.service';
import { TransportistaService } from '../../servicios/entrega/transportista.service';
import { Transportista } from '../../modelos/entrega/transportista';
import { Entrega } from '../../modelos/entrega/entrega';
import { EntregaService } from '../../servicios/entrega/entrega.service';
import { Sesion } from '../../modelos/usuario/sesion';
import { FacturaService } from '../../servicios/comprobante/factura.service';
import { valores, mensajes, otras, tabs, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { MatTableDataSource } from '@angular/material/table';
import { FacturaDetalle } from '../../modelos/comprobante/factura-detalle';
import { FacturacionElectronicaService } from 'src/app/servicios/comprobante/factura-eletronica.service';

@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.component.html',
  styleUrls: ['./entrega.component.scss']
})
export class EntregaComponent implements OnInit {

  panelGuiaRemision=true;
  panelGuiaDetalle=false;

  transportistas: Transportista[];
  entrega: Entrega = new Entrega();
  sesion: Sesion;
  provincias: Ubicacion[];
  cantones: Ubicacion[];
  parroquias: Ubicacion[];
  deshabilitar: boolean = false;
  deshabilitarTransportista: boolean = false;
  pendiente = valores.pendiente;
  entregado = valores.entregado;
  sinGuia = valores.sinGuia;
  clienteDireccion = valores.clienteDireccion;
  nuevaDireccion = valores.nuevaDireccion;


  columnasFacturaDetalle: string[] = ['nombre', 'cantidad', 'precio_unitario', 'iva', 'total'];
  dataFacturaDetalle = new MatTableDataSource<FacturaDetalle>(this.entrega.factura.facturaDetalles);

  constructor(private transportistaService: TransportistaService, private sesionService: SesionService, private router: Router,
    private facturaService: FacturaService, private facturacionElectronicaService: FacturacionElectronicaService, private modalService: NgbModal,
    private ubicacionService: UbicacionService, private entregaService: EntregaService) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarTransportistas();
    this.consultarUbicaciones();

    this.facturaService.eventoEntrega.subscribe((data:number) => {
      this.facturaService.obtener(data).subscribe(
        res => {
          this.entrega.factura = res.resultado as Factura;
          this.cargar();
        },
        err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      );
    });
  }

  cargar(){
    this.entregaService.obtenerPorFactura(this.entrega.factura.id).subscribe(
      res => {
        if (res.resultado!= null){
          Object.assign(this.entrega, res.resultado as Entrega);
          this.seleccionarProvincia();
          this.seleccionarCanton();
        } else{
          this.entrega.direccion=this.entrega.factura.cliente.direccion;
          this.entrega.ubicacion=this.entrega.factura.cliente.ubicacion;
          this.seleccionarProvincia();
          this.seleccionarCanton();
          this.entrega.telefono=this.entrega.factura.cliente.telefonos[0].numero;
          this.entrega.celular=this.entrega.factura.cliente.celulares[0].numero;
          this.entrega.correo=this.entrega.factura.cliente.correos[0].email;
          this.deshabilitar=true;
        }
        this.dataFacturaDetalle = new MatTableDataSource<FacturaDetalle>(this.entrega.factura.facturaDetalles);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarUbicaciones(){
    this.ubicacionService.consultarProvincias().subscribe(
      res => {
        this.provincias = res.resultado as Ubicacion[];
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarTransportistas(){
    this.transportistaService.consultar().subscribe(
      res => {
        this.transportistas = res.resultado as Transportista[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  crear(event: any) {
    if (event!=null)
      event.preventDefault();
    this.entregaService.crear(this.entrega).subscribe(
      res => {
        this.entrega = res.resultado as Entrega;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event: any) {
    if (event!=null)
      event.preventDefault();
    this.entregaService.actualizar(this.entrega).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.entrega = res.resultado as Entrega;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarProvincia() {
    this.ubicacionService.consultarCantones(this.entrega.ubicacion.provincia).subscribe(
      res => {
          this.cantones = res.resultado as Ubicacion[];
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarCanton() {
    this.ubicacionService.consultarParroquias(this.entrega.ubicacion.canton).subscribe(
      res => {
          this.parroquias = res.resultado as Ubicacion[];
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  validarTelefono() {
    let digito = this.entrega.telefono.substring(0, 1);
    if (this.entrega.telefono.length != 11 || digito != "0") {
      this.entrega.telefono = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_telefono_invalido });
    }
  }

  validarCelular() {
    let digito = this.entrega.celular.substring(0, 2);
    if (this.entrega.celular.length != 12 || digito != "09") {
      this.entrega.celular = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_celular_invalido });
    }
  }

  validarCorreo() {
    let arroba = this.entrega.correo.includes("@");
    if (!arroba) {
      this.entrega.correo = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_correo_invalido });
    }
  }

  open(content: any, event: any) {
    if (event!=null)
      event.preventDefault();
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
    }, (reason) => {

    });
  }

  seleccionarOpcionGuia(){
    if (this.entrega.opcionGuia==this.clienteDireccion){
      this.entrega.direccion=this.entrega.factura.cliente.direccion;
      this.entrega.ubicacion=this.entrega.factura.cliente.ubicacion;
      this.seleccionarProvincia();
      this.seleccionarCanton();
      this.entrega.telefono=this.entrega.factura.cliente.telefonos[0].numero;
      this.entrega.celular=this.entrega.factura.cliente.celulares[0].numero;
      this.entrega.correo=this.entrega.factura.cliente.correos[0].email;
      this.deshabilitar=true;
      this.deshabilitarTransportista = false;
    } else if (this.entrega.opcionGuia==this.nuevaDireccion) {
      this.entrega.direccion = valores.vacio;
      this.entrega.ubicacion = new Ubicacion();
      this.entrega.telefono = valores.vacio;
      this.entrega.celular = valores.vacio;
      this.entrega.correo = valores.vacio;
      this.entrega.transportista = new Transportista();
      this.deshabilitar=false;
      this.deshabilitarTransportista = false;
    } else if (this.entrega.opcionGuia==this.sinGuia){
      this.entrega.direccion= valores.vacio;
      this.entrega.ubicacion = new Ubicacion();
      this.entrega.telefono= valores.vacio;
      this.entrega.celular= valores.vacio;
      this.entrega.correo= valores.vacio;
      this.entrega.transportista = new Transportista();
      this.deshabilitar=true
      this.deshabilitarTransportista = true;
    }
  }

  nuevo(event: any){
    this.entrega=new Entrega();
  }

  crearFacturaElectronica(event){
    if (event != null)
      event.preventDefault();
    this.facturacionElectronicaService.enviar(this.entrega.factura).subscribe(
      res => {
        let respuesta = res.resultado as String;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje, footer: respuesta });
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }
}
