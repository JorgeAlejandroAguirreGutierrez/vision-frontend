import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Factura } from '../../../modelos/factura';
import { FacturaService } from '../../../servicios/factura.service';
import { Sesion } from '../../../modelos/sesion';
import { SesionService } from '../../../servicios/sesion.service';
import { TabService } from "../../../componentes/services/tab.service";
import { FacturaComponent } from '../factura.component';
import * as constantes from '../../../constantes';


@Component({
  selector: 'app-factura-leer',
  templateUrl: './factura-leer.component.html',
  styleUrls: ['./factura-leer.component.scss']
})
export class FacturaLeerComponent implements OnInit {

  collapsed = true;
  ComponenteFactura: Type<any> = FacturaComponent;

  sesion: Sesion;

  constructor(private facturaService: FacturaService, private tabService: TabService,
    private sesionService: SesionService, private router: Router, private modalService: NgbModal) { }

  facturas: Factura[];
  factura: Factura;
  facturaBuscar: Factura = new Factura();


  ngOnInit() {
    this.consultar();
    this.sesion = this.sesionService.getSesion();
  }

  consultar() {
    this.facturaService.consultar().subscribe(
      res => {
        this.facturas = res.resultado as Factura[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  buscar(event) {
    if (event != null)
      event.preventDefault();
    this.facturaService.buscar(this.facturaBuscar).subscribe(
      res => {
        this.facturas = res.resultado as Factura[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  seleccion(factura: Factura) {
    this.factura = factura;
  }

  actualizar(event) {
    if (event != null)
      event.preventDefault();
    if (this.factura != null) {
      this.facturaService.enviar(this.factura.id);
      this.tabService.addNewTab(this.ComponenteFactura, 'Actualizar Factura');
    } else {
      Swal.fire('Error', "Selecciona una Factura", 'error');
    }
  }

  eliminar(event) {
    if (event != null)
      event.preventDefault();
    this.facturaService.eliminar(this.factura.id).subscribe(
      res => {
          Swal.fire('Exito', res.mensaje, 'success');
          this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }
}
