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
import { VehiculoTransporte } from '../../modelos/vehiculo-transporte';
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

  estado: string="";
  propio: string="";
  transportistas: Transportista[];
  vehiculosTransportes: VehiculoTransporte[];
  entrega: Entrega=new Entrega();
  sesion: Sesion;
  provincias: Ubicacion[];
  cantones: Ubicacion[];
  parroquias: Ubicacion[];
  banderaOpcion: boolean=false;
  ubicacion: Ubicacion=new Ubicacion();

  columnasFacturaDetalle: string[] = ['nombre', 'cantidad', 'precio_unitario', 'iva', 'total'];
  dataFacturaDetalle = new MatTableDataSource<FacturaDetalle>(this.entrega.factura.facturaDetalles);

  constructor(private transportistaService: TransportistaService, private sesionService: SesionService, private router: Router,
    private vehiculoTransporteService: VehiculoTransporteService, private facturaService: FacturaService, private modalService: NgbModal,
    private ubicacionService: UbicacionService, private entregaService: EntregaService) { }

  ngOnInit() {
    util.validarSesion(this.sesion, this.sesionService, this.router);
    this.consultarTransportistas();
    this.consultarVehiculosTransportes();
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
            console.log(this.entrega);
          }
          this.dataFacturaDetalle = new MatTableDataSource<FacturaDetalle>(this.entrega.factura.facturaDetalles);
        },
        err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
      );
    }
  }

  consultarUbicaciones(){
    this.ubicacionService.obtenerProvincias().subscribe(
      res => {
        this.provincias = res.resultado as Ubicacion[];
      },
      err => {
        Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
      }
    );
  }

  consultarTransportistas(){
    this.transportistaService.consultar().subscribe(
      res => {
        this.transportistas = res.resultado as Transportista[]
      },
      err => {
        Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal);
      }
    );
  }
  consultarVehiculosTransportes(){
    this.vehiculoTransporteService.consultar().subscribe(
      res => {
        this.vehiculosTransportes = res.resultado as VehiculoTransporte[]
      },
      err => {
        Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal);
      }
    );
  }

  crear(event: any) {
    if (event!=null)
      event.preventDefault();
    this.entrega.estado=true;
    this.entrega.normalizar();
    console.log(this.entrega);
    this.entregaService.crear(this.entrega).subscribe(
      res => {
        this.entrega = res.resultado as Entrega;
        if (res.mensaje){
          Swal.fire(constantes.exito, 'Se creo la guia de remision', constantes.exito_swal);
        }
      },
      err => {
        Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal);
      }
    );
  }

  actualizar(event: any) {
    if (event!=null)
      event.preventDefault();
    this.entrega.estado=true;
    this.entrega.normalizar();
    console.log(this.entrega);
    this.entregaService.actualizar(this.entrega).subscribe(
      res => {
        this.entrega = res.resultado as Entrega;
        if (res.mensaje){
          Swal.fire(constantes.exito, 'Se creo la guia de remision', constantes.exito_swal);
        }
      },
      err => {
        Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal);
      }
    );
  }

  provincia() {
    this.ubicacionService.obtenerCantones(this.entrega.direccion.ubicacion.provincia).subscribe(
      res => {
          this.cantones = res.resultado as Ubicacion[];
      },
      err => {
        Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal);
      }
    );
  }

  canton() {
    this.ubicacionService.obtenerParroquias(this.entrega.direccion.ubicacion.canton).subscribe(
      res => {
          this.parroquias = res.resultado as Ubicacion[];
      },
      err => {
        Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal);
      }
    );
  }
  parroquia(){
    if (this.entrega.direccion.ubicacion.provincia != "" && this.entrega.direccion.ubicacion.canton != "" && this.entrega.direccion.ubicacion.parroquia != ""){
      this.ubicacionService.obtenerUbicacionIDAsync(this.entrega.direccion.ubicacion).subscribe(
        res => {
          this.entrega.direccion.ubicacion=res.resultado as Ubicacion;
        },
        err => {
          Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal);
        }
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
      this.banderaOpcion=false;
      this.entrega.direccion={... this.entrega.factura.cliente.direccion};
    } else if (event.value=="1") {
      this.banderaOpcion=true;
      this.entrega.direccion=new Direccion();
    } else if (event.value=="2"){
      this.entrega=new Entrega();
      this.banderaOpcion=true;
      this.entrega.inhabilitar=true;
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
      err => {
        Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal);
      }
    );
  }
}
