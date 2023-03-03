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
import { GuiaRemision } from '../../modelos/entrega/guia-remision';
import { GuiaRemisionService } from '../../servicios/entrega/guia-remision.service';
import { Sesion } from '../../modelos/usuario/sesion';
import { FacturaService } from '../../servicios/comprobante/factura.service';
import { valores, mensajes, otras, tabs, validarSesion, tab_activo, exito, exito_swal, error, error_swal } from '../../constantes';
import { MatTableDataSource } from '@angular/material/table';
import { FacturaLinea } from '../../modelos/comprobante/factura-linea';
import { FacturaElectronicaService } from 'src/app/servicios/comprobante/factura-eletronica.service';

@Component({
  selector: 'app-guia-remision',
  templateUrl: './guia-remision.component.html',
  styleUrls: ['./guia-remision.component.scss']
})
export class GuiaRemisionComponent implements OnInit {

  panelGuiaRemision=true;
  panelGuiaDetalle=false;

  transportistas: Transportista[];
  guiaRemision: GuiaRemision = new GuiaRemision();
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


  columnas: string[] = ['nombre', 'cantidad', 'precio_unitario', 'iva', 'total'];
  dataSource = new MatTableDataSource<FacturaLinea>(this.guiaRemision.factura.facturaLineas);

  constructor(private transportistaService: TransportistaService, private sesionService: SesionService, private router: Router,
    private facturaService: FacturaService, private facturaElectronicaService: FacturaElectronicaService, private modalService: NgbModal,
    private ubicacionService: UbicacionService, private guiaRemisionService: GuiaRemisionService) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarTransportistas();
    this.consultarUbicaciones();

    this.facturaService.eventoEntrega.subscribe((data:number) => {
      this.facturaService.obtener(data).subscribe(
        res => {
          this.guiaRemision.factura = res.resultado as Factura;
          this.cargar();
        },
        err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      );
    });
  }

  cargar(){
    this.guiaRemisionService.obtenerPorFactura(this.guiaRemision.factura.id).subscribe(
      res => {
        if (res.resultado!= null){
          Object.assign(this.guiaRemision, res.resultado as GuiaRemision);
          this.seleccionarProvincia();
          this.seleccionarCanton();
        } else{
          this.guiaRemision.direccion=this.guiaRemision.factura.cliente.direccion;
          this.guiaRemision.ubicacion=this.guiaRemision.factura.cliente.ubicacion;
          this.seleccionarProvincia();
          this.seleccionarCanton();
          this.guiaRemision.telefono=this.guiaRemision.factura.cliente.telefonos[0].numero;
          this.guiaRemision.celular=this.guiaRemision.factura.cliente.celulares[0].numero;
          this.guiaRemision.correo=this.guiaRemision.factura.cliente.correos[0].email;
          this.deshabilitar=true;
        }
        this.dataSource = new MatTableDataSource<FacturaLinea>(this.guiaRemision.factura.facturaLineas);
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
    this.guiaRemisionService.crear(this.guiaRemision).subscribe(
      res => {
        this.guiaRemision = res.resultado as GuiaRemision;
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event: any) {
    if (event!=null)
      event.preventDefault();
    this.guiaRemisionService.actualizar(this.guiaRemision).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.guiaRemision = res.resultado as GuiaRemision;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarProvincia() {
    this.ubicacionService.consultarCantones(this.guiaRemision.ubicacion.provincia).subscribe(
      res => {
          this.cantones = res.resultado as Ubicacion[];
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccionarCanton() {
    this.ubicacionService.consultarParroquias(this.guiaRemision.ubicacion.canton).subscribe(
      res => {
          this.parroquias = res.resultado as Ubicacion[];
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  validarTelefono() {
    let digito = this.guiaRemision.telefono.substring(0, 1);
    if (this.guiaRemision.telefono.length != 11 || digito != "0") {
      this.guiaRemision.telefono = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_telefono_invalido });
    }
  }

  validarCelular() {
    let digito = this.guiaRemision.celular.substring(0, 2);
    if (this.guiaRemision.celular.length != 12 || digito != "09") {
      this.guiaRemision.celular = valores.vacio;
      Swal.fire({ icon: error_swal, title: error, text: mensajes.error_celular_invalido });
    }
  }

  validarCorreo() {
    let arroba = this.guiaRemision.correo.includes("@");
    if (!arroba) {
      this.guiaRemision.correo = valores.vacio;
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
    if (this.guiaRemision.opcionGuia==this.clienteDireccion){
      this.guiaRemision.direccion=this.guiaRemision.factura.cliente.direccion;
      this.guiaRemision.ubicacion=this.guiaRemision.factura.cliente.ubicacion;
      this.seleccionarProvincia();
      this.seleccionarCanton();
      this.guiaRemision.telefono=this.guiaRemision.factura.cliente.telefonos[0].numero;
      this.guiaRemision.celular=this.guiaRemision.factura.cliente.celulares[0].numero;
      this.guiaRemision.correo=this.guiaRemision.factura.cliente.correos[0].email;
      this.deshabilitar=true;
      this.deshabilitarTransportista = false;
    } else if (this.guiaRemision.opcionGuia==this.nuevaDireccion) {
      this.guiaRemision.direccion = valores.vacio;
      this.guiaRemision.ubicacion = new Ubicacion();
      this.guiaRemision.telefono = valores.vacio;
      this.guiaRemision.celular = valores.vacio;
      this.guiaRemision.correo = valores.vacio;
      this.guiaRemision.transportista = new Transportista();
      this.deshabilitar=false;
      this.deshabilitarTransportista = false;
    } else if (this.guiaRemision.opcionGuia==this.sinGuia){
      this.guiaRemision.direccion= valores.vacio;
      this.guiaRemision.ubicacion = new Ubicacion();
      this.guiaRemision.telefono= valores.vacio;
      this.guiaRemision.celular= valores.vacio;
      this.guiaRemision.correo= valores.vacio;
      this.guiaRemision.transportista = new Transportista();
      this.deshabilitar=true
      this.deshabilitarTransportista = true;
    }
  }

  nuevo(event: any){
    this.guiaRemision=new GuiaRemision();
  }

  crearFacturaElectronica(event){
    if (event != null)
      event.preventDefault();
    this.facturaElectronicaService.enviar(this.guiaRemision.factura.id).subscribe(
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
