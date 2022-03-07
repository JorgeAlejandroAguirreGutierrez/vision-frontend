import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { TabService } from '../../componentes/services/tab.service';
import Swal from 'sweetalert2';
import { TipoPago } from '../../modelos/tipo-pago';
import { TipoPagoService } from '../../servicios/tipo-pago.service';
import * as constantes from '../../constantes';

@Component({
  selector: 'app-tipo-pago',
  templateUrl: './tipo-pago.component.html',
  styleUrls: ['./tipo-pago.component.scss']
})
export class TipoPagoComponent implements OnInit {

  tipoPago= new TipoPago();

  constructor(private tabService: TabService,private tipoPagoService: TipoPagoService) { }

  ngOnInit() {
    this.construirTipoPago();
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.tabService.addNewTab(TipoPagoComponent, constantes.tab_crear_plazo_credito);
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.tipoPagoService.crear(this.tipoPago).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.tipoPagoService.actualizar(this.tipoPago).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.tipoPago=res.resultado as TipoPago;
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  eliminar(tipoPago: TipoPago) {
    this.tipoPagoService.eliminar(tipoPago).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.tipoPago=res.resultado as TipoPago
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  async construirTipoPago() {
    let tipoPagoId=0;
    this.tipoPagoService.currentMessage.subscribe(message => tipoPagoId = message);
    if (tipoPagoId!= 0) {
      await this.tipoPagoService.obtenerAsync(tipoPagoId).then(
        res => {
          Object.assign(this.tipoPago, res.resultado as TipoPago);
          this.tipoPagoService.enviar(0);
        },
        err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
      );
    }
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 71) //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 78) //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 69) // SHIFT + E
      this.eliminar(null);
  }

}
