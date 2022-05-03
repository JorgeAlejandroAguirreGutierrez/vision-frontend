import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import * as util from '../../util';
import { TransportistaService } from '../../servicios/transportista.service';
import { Transportista } from '../../modelos/transportista';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as constantes from '../../constantes';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Router } from '@angular/router';
import { Sesion } from 'src/app/modelos/sesion';

@Component({
  selector: 'app-transportista',
  templateUrl: './transportista.component.html',
  styleUrls: ['./transportista.component.scss']
})
export class TransportistaComponent implements OnInit {

  transportista= new Transportista();
  transportistas: Transportista[];
  pTransportista= new Transportista();
  sesion: Sesion=null;

  constructor(private sesionService: SesionService, private router: Router, private transportistaService: TransportistaService, private modalService: NgbModal) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.transportistaService.consultar().subscribe(
      res=>{
        this.transportistas= res.resultado as Transportista[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  open(content: any, transportista: Transportista) {
    this.pTransportista=transportista;
    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
      if (result=="actualizar") {
        this.actualizar(this.pTransportista);
      }
      if (result=="eliminar") {
        this.eliminar(this.pTransportista);
      }
    }, (reason) => {
      
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
    this.transportistaService.crear(this.transportista).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.transportista=res.resultado as Transportista;
        this.ngOnInit();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(transportista: Transportista) {
    this.transportistaService.actualizar(transportista).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.transportista=res.resultado as Transportista;
        this.ngOnInit();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(transportista: Transportista) {
    this.transportistaService.eliminar(transportista).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.transportista=res.resultado as Transportista
        this.ngOnInit();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

}
