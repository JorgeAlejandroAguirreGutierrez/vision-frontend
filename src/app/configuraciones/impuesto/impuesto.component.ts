import { Component, OnInit } from '@angular/core';
import { ImpuestoService } from '../../servicios/impuesto.service';
import { Impuesto } from '../../modelos/impuesto';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Router } from '@angular/router';
import { Sesion } from 'src/app/modelos/sesion';

@Component({
  selector: 'app-impuesto',
  templateUrl: './impuesto.component.html',
  styleUrls: ['./impuesto.component.scss']
})
export class ImpuestoComponent implements OnInit {

  impuesto= new Impuesto();
  impuestos: Impuesto[];
  pImpuesto= new Impuesto();
  sesion: Sesion=null;

  constructor(private sesionService: SesionService, private router: Router, private impuestoService: ImpuestoService, private modalService: NgbModal) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.impuestoService.consultar().subscribe(
      res=>{
        this.impuestos= res.resultado as Impuesto[]
      }
    );
  }

  open(content: any, impuesto: Impuesto) {
    this.pImpuesto=impuesto;
    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
      if (result=="actualizar") {
        this.actualizar(this.pImpuesto);
      }
      if (result=="eliminar") {
        this.eliminar(this.pImpuesto);
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
    this.impuestoService.crear(this.impuesto).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.impuesto=res.resultado as Impuesto;
        this.ngOnInit();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(impuesto: Impuesto) {
    this.impuestoService.actualizar(impuesto).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.impuesto=res.resultado as Impuesto;
        this.ngOnInit();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(impuesto: Impuesto) {
    this.impuestoService.eliminar(impuesto).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.impuesto=res.resultado as Impuesto
        this.ngOnInit();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(impuesto: Impuesto) {
    
  }

}
