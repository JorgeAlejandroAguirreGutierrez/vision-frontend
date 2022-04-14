import { Component, OnInit } from '@angular/core';
import { VehiculoTransporteService } from '../../servicios/vehiculo-transporte.service';
import { VehiculoTransporte } from '../../modelos/vehiculo-transporte';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Router } from '@angular/router';
import { Sesion } from 'src/app/modelos/sesion';

@Component({
  selector: 'app-vehiculo-transporte',
  templateUrl: './vehiculo-transporte.component.html',
  styleUrls: ['./vehiculo-transporte.component.scss']
})
export class VehiculoTransporteComponent implements OnInit {

  vehiculoTransporte= new VehiculoTransporte();
  vehicuylosTransportes: VehiculoTransporte[];
  pVehiculoTransporte= new VehiculoTransporte();
  sesion: Sesion=null;

  constructor(private sesionService: SesionService, private router: Router, private vehiculoTransporteService: VehiculoTransporteService, private modalService: NgbModal) { }

  ngOnInit() {
    util.validarSesion(this.sesion, this.sesionService, this.router);
    this.vehiculoTransporteService.consultar().subscribe(
      res=>{
        this.vehicuylosTransportes= res.resultado as VehiculoTransporte[]
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  open(content: any, vehiculoTransporte: VehiculoTransporte) {
    this.pVehiculoTransporte=vehiculoTransporte;
    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
      if (result=="actualizar") {
        this.actualizar(this.pVehiculoTransporte);
      }
      if (result=="eliminar") {
        this.eliminar(this.pVehiculoTransporte);
      }
    }, (reason: any) => {
      
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  crear() {
    this.vehiculoTransporteService.crear(this.vehiculoTransporte).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.vehiculoTransporte=res.resultado as VehiculoTransporte;
        this.ngOnInit();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizar(vehiculoTransporte: VehiculoTransporte) {
    this.vehiculoTransporteService.actualizar(vehiculoTransporte).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.vehiculoTransporte=res.resultado as VehiculoTransporte;
        this.ngOnInit();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  eliminar(vehiculoTransporte: VehiculoTransporte) {
    this.vehiculoTransporteService.eliminar(vehiculoTransporte).subscribe(
      res => {
        Swal.fire('Exito', res.mensaje, 'success');
        this.vehiculoTransporte=res.resultado as VehiculoTransporte
        this.ngOnInit();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

}
