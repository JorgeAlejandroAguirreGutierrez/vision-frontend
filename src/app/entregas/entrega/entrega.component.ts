import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SesionService } from '../../servicios/sesion.service';
import { Factura } from '../../modelos/factura';
import { EmpresaService } from '../../servicios/empresa.service';
import { Ubicacion } from '../../modelos/ubicacion';
import { UbicacionService } from '../../servicios/ubicacion.service';
import { TransportistaService } from '../../servicios/transportista.service';
import { Transportista } from '../../modelos/transportista';
import { VehiculoTransporte } from '../../modelos/vehiculo-transporte';
import { VehiculoTransporteService } from '../../servicios/vehiculo-transporte.service';
import { GuiaRemision } from '../../modelos/guia-remision';
import { Direccion } from '../../modelos/direccion';
import { GuiaRemisionService } from '../../servicios/guia-remision.service';
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

  @Input() factura: Factura=new Factura();
  estado: string="";
  propio: string="";
  transportistas: Transportista[];
  vehiculosTransportes: VehiculoTransporte[];
  guiaRemision: GuiaRemision=new GuiaRemision();
  guiaRemisionCrear: GuiaRemision;
  sesion: Sesion;
  provincias: Ubicacion[];
  cantones: Ubicacion[];
  parroquias: Ubicacion[];
  banderaOpcion: boolean=false;
  ubicacion: Ubicacion=new Ubicacion();

  columnasFacturaDetalle: string[] = ['nombre', 'cantidad', 'precio_unitario', 'iva', 'total'];
  dataFacturaDetalle = new MatTableDataSource<FacturaDetalle>(this.factura.facturaDetalles);

  constructor(private transportistaService: TransportistaService, private sesionService: SesionService, private router: Router,
    private vehiculoTransporteService: VehiculoTransporteService, private facturaService: FacturaService, private modalService: NgbModal,
    private ubicacionService: UbicacionService, private guiaRemisionService: GuiaRemisionService, private empresaService: EmpresaService) { }

  ngOnInit() {
    this.estado= this.guiaRemision.estado? "ENTREGADO": "PENDIENTE";
    this.validarSesion();
    this.consultarTransportistas();
    this.consultarVehiculosTransportes();
    this.consultarUbicaciones();
  }

  validarSesion(){
    this.sesion = this.sesionService.getSesion();
    if (this.sesion == undefined)
      this.router.navigate(['/iniciosesion']);
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
    this.guiaRemision.factura=this.factura;
    this.guiaRemision.estado=true;
    this.guiaRemision.normalizar();
    console.log(this.guiaRemision);
    this.guiaRemisionService.crear(this.guiaRemision).subscribe(
      res => {
        this.guiaRemisionCrear = res.resultado as GuiaRemision;
        this.guiaRemision.numero=this.guiaRemisionCrear.numero;
        this.estado=this.guiaRemisionCrear.estado? "ENTREGADO": "NO ENTREGADO";
        if (res.mensaje){
          Swal.fire(constantes.exito, 'Se creo la guia de remision', constantes.exito_swal);
        }
      },
      err => {
        Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal);
        this.guiaRemision.des_normalizar();
      }
    );
  }

  actualizar(event: any) {
    if (event!=null)
      event.preventDefault();
    this.guiaRemision.estado=true;
    this.guiaRemision.normalizar();
    console.log(this.guiaRemision);
    this.guiaRemisionService.actualizar(this.guiaRemision).subscribe(
      res => {
        this.guiaRemisionCrear = res.resultado as GuiaRemision;
        this.estado=this.guiaRemisionCrear.estado? "ENTREGADO": "NO ENTREGADO";
        if (res.mensaje){
          Swal.fire(constantes.exito, 'Se creo la guia de remision', constantes.exito_swal);
        }
      },
      err => {
        Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal);
        this.guiaRemision.des_normalizar();
      }
    );
  }

  provincia() {
    this.ubicacionService.obtenerCantones(this.guiaRemision.direccion.ubicacion.provincia).subscribe(
      res => {
          this.cantones = res.resultado as Ubicacion[];
      },
      err => {
        Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal);
      }
    );
  }

  canton() {
    this.ubicacionService.obtenerParroquias(this.guiaRemision.direccion.ubicacion.canton).subscribe(
      res => {
          this.parroquias = res.resultado as Ubicacion[];
      },
      err => {
        Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal);
      }
    );
  }
  parroquia(){
    if (this.guiaRemision.direccion.ubicacion.provincia != "" && this.guiaRemision.direccion.ubicacion.canton != "" && this.guiaRemision.direccion.ubicacion.parroquia != ""){
      this.ubicacionService.obtenerUbicacionIDAsync(this.guiaRemision.direccion.ubicacion).subscribe(
        res => {
          this.guiaRemision.direccion.ubicacion=res.resultado as Ubicacion;
        },
        err => {
          Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal);
        }
      );
    }
  }

  validarTelefono() {
    let digito=this.guiaRemision.telefono.substr(0,1);
    if (this.guiaRemision.telefono.length!=11 || digito!="0") {
      this.guiaRemision.telefono="";
      Swal.fire(constantes.error, "Telefono Invalido", constantes.error_swal);
    }
  }

  validarCelular() {
    let digito=this.guiaRemision.celular.substr(0,2);
    if (this.guiaRemision.celular.length!=12 || digito!="09") {
      this.guiaRemision.celular="";
      Swal.fire(constantes.error, "Celular Invalido", constantes.error_swal);
    }
  }

  validarCorreo() {
    let arroba=this.guiaRemision.correo.includes("@");
    if (!arroba) {
      this.guiaRemision.correo="";
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
      this.guiaRemision.direccion={... this.factura.cliente.direccion};
    } else if (event.value=="1") {
      this.banderaOpcion=true;
      this.guiaRemision.direccion=new Direccion();
    } else if (event.value=="2"){
      this.guiaRemision=new GuiaRemision();
      this.banderaOpcion=true;
      this.guiaRemision.inhabilitar=true;
    }
  }

  nuevo(event: any){
    this.guiaRemision=new GuiaRemision();
  }

  despachar(){

  }

  generarPdf(event: any){
    if (event!=null)
      event.preventDefault();
    this.facturaService.generar_pdf(this.factura.id).subscribe(
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
