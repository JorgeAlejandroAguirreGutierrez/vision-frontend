import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { DatoAdicionalService } from '../../servicios/dato-adicional.service';
import { DatoAdicional } from '../../modelos/dato-adicional';


@Component({
  selector: 'app-dato-adicional',
  templateUrl: './dato-adicional.component.html',
  styleUrls: ['./dato-adicional.component.scss']
})
export class DatoAdicionalComponent implements OnInit {

  datoAdicional= new DatoAdicional();
  datosAdicionales: DatoAdicional[];
  pDatoAdicional= new DatoAdicional();

  constructor(private datoAdicionalService: DatoAdicionalService, private modalService: NgbModal) { }

  ngOnInit() {
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
        Swal.fire('Exito', res.mensaje, 'success');
        this.datoAdicional=res.resultado as DatoAdicional;
        this.ngOnInit();
      },
      err => Swal.fire('Error', err.error.mensaje, 'error')
    );
  }

  actualizar(datoAdicional: DatoAdicional) {
    this.datoAdicionalService.actualizar(datoAdicional).subscribe(
      res => {
        Swal.fire('Exito', res.mensaje, 'success');
        this.datoAdicional=res.resultado as DatoAdicional;
        this.ngOnInit();
      },
      err => Swal.fire('Error', err.error.mensaje, 'error')
    );
  }

  eliminar(datoAdicional: DatoAdicional) {
    this.datoAdicionalService.eliminar(datoAdicional).subscribe(
      res => {
        Swal.fire('Exito', res.mensaje, 'success');
        this.datoAdicional=res.resultado as DatoAdicional;
        this.ngOnInit();
      },
      err => Swal.fire('Error', err.error.mensaje, 'error')
    );
  }

  seleccion(datoAdicional: DatoAdicional) {
    
  }

}
