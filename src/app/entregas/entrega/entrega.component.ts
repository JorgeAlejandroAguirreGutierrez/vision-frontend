import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import * as util from '../../util';
import Swal from 'sweetalert2';
import { SesionService } from '../../servicios/sesion.service';
import { Factura } from '../../modelos/factura';
import { Ubicacion } from '../../modelos/ubicacion';
import { UbicacionService } from '../../servicios/ubicacion.service';
import { TransportistaService } from '../../servicios/transportista.service';
import { Transportista } from '../../modelos/transportista';
import { VehiculoTransporteService } from '../../servicios/vehiculo-transporte.service';
import { Entrega } from '../../modelos/entrega';
import { Direccion } from '../../modelos/direccion';
import { EntregaService } from '../../servicios/entrega.service';
import { Sesion } from '../../modelos/sesion';
import { FacturaService } from '../../servicios/factura.service';
import * as constantes from '../../constantes';
import { MatTableDataSource } from '@angular/material/table';
import { FacturaDetalle } from '../../modelos/factura-detalle';

@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.component.html',
  styleUrls: ['./entrega.component.scss']
})
export class EntregaComponent implements OnInit {

  transportistas: Transportista[];
  entrega: Entrega=new Entrega();
  sesion: Sesion;
  provincias: Ubicacion[];
  cantones: Ubicacion[];
  parroquias: Ubicacion[];
  deshabilitar: boolean=false;

  columnasFacturaDetalle: string[] = ['nombre', 'cantidad', 'precio_unitario', 'iva', 'total'];
  dataFacturaDetalle = new MatTableDataSource<FacturaDetalle>(this.entrega.factura.facturaDetalles);

  constructor(private transportistaService: TransportistaService, private sesionService: SesionService, private router: Router,
    private vehiculoTransporteService: VehiculoTransporteService, private facturaService: FacturaService, private modalService: NgbModal,
    private ubicacionService: UbicacionService, private entregaService: EntregaService) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.consultarTransportistas();
    this.consultarUbicaciones();

    this.facturaService.eventoEntrega.subscribe((data:Factura) => {
      this.entrega.factura=data;
      this.cargar();
    });
  }

  cargar(){
    if(this.entrega.factura.id!=0){
      this.entregaService.obtenerPorFactura(this.entrega.factura.id).subscribe(
        res => {
          if (res.resultado!= null){
            Object.assign(this.entrega, res.resultado as Entrega);
            this.provincia();
            this.canton();
          } else{
            this.entrega.direccion.direccion=this.entrega.factura.cliente.direccion.direccion;
            this.entrega.direccion.ubicacion=this.entrega.factura.cliente.direccion.ubicacion;
            this.provincia();
            this.canton();
            this.entrega.telefono=this.entrega.factura.cliente.telefonos[0].numero;
            this.entrega.celular=this.entrega.factura.cliente.celulares[0].numero;
            this.entrega.correo=this.entrega.factura.cliente.correos[0].email;
            this.deshabilitar=true;
          }
          this.dataFacturaDetalle = new MatTableDataSource<FacturaDetalle>(this.entrega.factura.facturaDetalles);
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }
  }

  consultarUbicaciones(){
    this.ubicacionService.obtenerProvincias().subscribe(
      res => {
        this.provincias = res.resultado as Ubicacion[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarTransportistas(){
    this.transportistaService.consultar().subscribe(
      res => {
        this.transportistas = res.resultado as Transportista[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  crear(event: any) {
    if (event!=null)
      event.preventDefault();
    this.entrega.normalizar();
    console.log(this.entrega);
    this.entregaService.crear(this.entrega).subscribe(
      res => {
        this.entrega = res.resultado as Entrega;
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event: any) {
    if (event!=null)
      event.preventDefault();
    this.entrega.normalizar();
    console.log(this.entrega);
    this.entregaService.actualizar(this.entrega).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.entrega = res.resultado as Entrega;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  provincia() {
    this.ubicacionService.obtenerCantones(this.entrega.direccion.ubicacion.provincia).subscribe(
      res => {
          this.cantones = res.resultado as Ubicacion[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  canton() {
    this.ubicacionService.obtenerParroquias(this.entrega.direccion.ubicacion.canton).subscribe(
      res => {
          this.parroquias = res.resultado as Ubicacion[];
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  parroquia(){
    if (this.entrega.direccion.ubicacion.provincia != "" && this.entrega.direccion.ubicacion.canton != "" && this.entrega.direccion.ubicacion.parroquia != ""){
      this.ubicacionService.obtenerUbicacionIDAsync(this.entrega.direccion.ubicacion).subscribe(
        res => {
          this.entrega.direccion.ubicacion=res.resultado as Ubicacion;
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }
  }

  validarTelefono() {
    let digito=this.entrega.telefono.substr(0,1);
    if (this.entrega.telefono.length!=11 || digito!="0") {
      this.entrega.telefono="";
      Swal.fire(constantes.error, "Telefono Invalido", constantes.error_swal);
    }
  }

  validarCelular() {
    let digito=this.entrega.celular.substr(0,2);
    if (this.entrega.celular.length!=12 || digito!="09") {
      this.entrega.celular="";
      Swal.fire(constantes.error, "Celular Invalido", constantes.error_swal);
    }
  }

  validarCorreo() {
    let arroba=this.entrega.correo.includes("@");
    if (!arroba) {
      this.entrega.correo="";
      Swal.fire(constantes.error, "Correo Invalido", constantes.error_swal);
    }
  }

  open(content: any, event: any) {
    if (event!=null)
      event.preventDefault();
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
    }, (reason) => {

    });
  }

  seleccionarOpcion(event: any){
    if (event.value=="0"){
      this.entrega.direccion.direccion=this.entrega.factura.cliente.direccion.direccion;
      this.entrega.direccion.ubicacion=this.entrega.factura.cliente.direccion.ubicacion;
      this.provincia();
      this.canton();
      this.entrega.telefono=this.entrega.factura.cliente.telefonos[0].numero;
      this.entrega.celular=this.entrega.factura.cliente.celulares[0].numero;
      this.entrega.correo=this.entrega.factura.cliente.correos[0].email;
      this.entrega.inhabilitar=false;
      this.deshabilitar=true;
    } else if (event.value=="1") {
      this.entrega.direccion=new Direccion();
      this.entrega.telefono="";
      this.entrega.celular="";
      this.entrega.correo="";
      this.entrega.inhabilitar=false;
      this.deshabilitar=false
    } else if (event.value=="2"){
      this.entrega.transportista=new Transportista();
      this.entrega.direccion=new Direccion();
      this.entrega.telefono="";
      this.entrega.celular="";
      this.entrega.correo="";
      this.entrega.inhabilitar=true;
      this.deshabilitar=true
    }
  }

  nuevo(event: any){
    this.entrega=new Entrega();
  }

  despachar(){

  }

  generarPdf(event: any){
    if (event!=null)
      event.preventDefault();
    this.facturaService.generar_pdf(this.entrega.factura.id).subscribe(
      res => {
        let file = new Blob([res], { type: 'application/pdf' });            
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
}
