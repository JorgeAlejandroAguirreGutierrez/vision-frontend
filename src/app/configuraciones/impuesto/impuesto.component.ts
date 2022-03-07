import { Component, OnInit } from '@angular/core';
import { ImpuestoService } from '../../servicios/impuesto.service';
import { Impuesto } from '../../modelos/impuesto';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';

@Component({
  selector: 'app-impuesto',
  templateUrl: './impuesto.component.html',
  styleUrls: ['./impuesto.component.scss']
})
export class ImpuestoComponent implements OnInit {

  impuesto= new Impuesto();
  impuestos: Impuesto[];
  pImpuesto= new Impuesto();

  constructor(private impuestoService: ImpuestoService, private modalService: NgbModal) { }

  ngOnInit() {
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
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.impuesto=res.resultado as Impuesto;
        this.ngOnInit();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizar(impuesto: Impuesto) {
    this.impuestoService.actualizar(impuesto).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.impuesto=res.resultado as Impuesto;
        this.ngOnInit();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  eliminar(impuesto: Impuesto) {
    this.impuestoService.eliminar(impuesto).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.impuesto=res.resultado as Impuesto
        this.ngOnInit();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  seleccion(impuesto: Impuesto) {
    
  }

}
