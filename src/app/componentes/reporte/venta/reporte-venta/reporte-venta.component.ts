import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte-venta',
  templateUrl: './reporte-venta.component.html',
  styleUrls: ['./reporte-venta.component.scss']
})

export class ReporteVentaComponent implements OnInit {

  verDetalleVentas: boolean = true;
  verCierreCaja: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  
  verReporte(nombre: string){
    this.iniciarVistaReporte();
    if (nombre == 'DETALLE'){
      this.verDetalleVentas = true;
      return;
    }
    if (nombre == 'CIERRE'){
      this.verCierreCaja = true;
      return;
    }
  }

  iniciarVistaReporte(){
    this.verDetalleVentas = false;
    this.verCierreCaja = false;
  }

}
