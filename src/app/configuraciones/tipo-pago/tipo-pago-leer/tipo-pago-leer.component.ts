import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/sesion';
import { SesionService } from '../../../servicios/sesion.service';
import Swal from 'sweetalert2';
import { TabService } from "../../../componentes/services/tab.service";
import { TipoPagoComponent } from '../tipo-pago.component';
import { TipoPagoService } from '../../../servicios/tipo-pago.service';
import { TipoPago } from '../../../modelos/tipo-pago';
import * as constantes from '../../../constantes';


@Component({
  selector: 'app-tipo-pago-leer',
  templateUrl: './tipo-pago-leer.component.html',
  styleUrls: ['./tipo-pago-leer.component.scss']
})
export class TipoPagoLeerComponent implements OnInit {

  collapsed = true;
  ComponenteTipoPago: Type<any> = TipoPagoComponent;

  sesion: Sesion;

  constructor(private tipoPagoService: TipoPagoService, private tabService: TabService, 
    private sesionService: SesionService,private router: Router) { }

  tiposPagos: TipoPago[];
  tipoPago: TipoPago;
  tipoPagoBuscar: TipoPago=new TipoPago();


  ngOnInit() {
    this.consultar();
    this.sesion= this.sesionService.getSesion();
  }

  consultar() {
    this.tipoPagoService.consultar().subscribe(
      res => {
        this.tiposPagos = res.resultado as TipoPago[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  buscar(event) {
    if (event!=null)
      event.preventDefault();
      this.tipoPagoService.buscar(this.tipoPagoBuscar).subscribe(
        res => {
          this.tiposPagos = res.resultado as TipoPago[]
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
      );
  }

  seleccion(tipoPago: TipoPago) {
    this.tipoPago=tipoPago;
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
  }

  actualizar(event){
    if (event!=null)
      event.preventDefault();
    if (this.tipoPago != null){
      this.tipoPagoService.enviar(this.tipoPago.id);
      let indice_tab_activo= constantes.tab_activo(this.tabService);
      this.tabService.removeTab(indice_tab_activo);
      this.tabService.addNewTab(this.ComponenteTipoPago,'Actualizar Genero');
    } else {
      Swal.fire(constantes.error, "Selecciona un Tipo de Pago", constantes.error_swal);
    }
  }

  eliminar(event) {
    if (event!=null)
      event.preventDefault();
    this.tipoPagoService.eliminar(this.tipoPago).subscribe(
      res => {
          Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
          this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  cambiarBuscarCodigo(){
    this.buscar(null);
  }

  cambiarBuscarDescripcion(){
    this.buscar(null)
  }

  cambiarBuscarAbreviatura(){
    this.buscar(null);
  }

}
