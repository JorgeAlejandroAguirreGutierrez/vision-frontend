import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as util from '../../util';
import * as constantes from '../../constantes';
import Swal from 'sweetalert2';
import { DatoAdicionalService } from '../../servicios/dato-adicional.service';
import { DatoAdicional } from '../../modelos/dato-adicional';
import { Sesion } from 'src/app/modelos/sesion';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dato-adicional',
  templateUrl: './dato-adicional.component.html',
  styleUrls: ['./dato-adicional.component.scss']
})
export class DatoAdicionalComponent implements OnInit {

  datoAdicional= new DatoAdicional();
  datosAdicionales: DatoAdicional[];
  pDatoAdicional= new DatoAdicional();
  sesion: Sesion=null;

  constructor(private sesionService: SesionService, private router: Router, private datoAdicionalService: DatoAdicionalService, private modalService: NgbModal) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.datoAdicionalService.obtener().subscribe(
      res=>this.datosAdicionales=res.resultado as DatoAdicional[]
    );
  }

  open(content: any, dato_adicional: DatoAdicional) {
    this.pDatoAdicional=dato_adicional;
    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
      if (result=="actualizar") {
        this.actualizar(this.pDatoAdicional);
      }
      if (result=="eliminar") {
        this.eliminar(this.pDatoAdicional);
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
    this.datoAdicionalService.crear(this.datoAdicional).subscribe(
      res => {
        console.log(res);
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.datoAdicional=res.resultado as DatoAdicional;
        this.ngOnInit();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(datoAdicional: DatoAdicional) {
    this.datoAdicionalService.actualizar(datoAdicional).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.datoAdicional=res.resultado as DatoAdicional;
        this.ngOnInit();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(datoAdicional: DatoAdicional) {
    this.datoAdicionalService.eliminar(datoAdicional).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.datoAdicional=res.resultado as DatoAdicional;
        this.ngOnInit();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(datoAdicional: DatoAdicional) {
    
  }

}
