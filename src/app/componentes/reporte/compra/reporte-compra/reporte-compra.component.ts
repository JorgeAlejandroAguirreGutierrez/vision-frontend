import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte-compra',
  templateUrl: './reporte-compra.component.html',
  styleUrls: ['./reporte-compra.component.scss']
})
export class ReporteCompraComponent implements OnInit {

  abrirPanelNuevo: boolean = true;
  verReporteDashboard: boolean = false;
  verReporteFormulario: boolean = false;
  verReporteTablas: boolean = false;
  verReporteTopografia: boolean = false;
  verReporteContacto: boolean = false;

  reporteCompra: number = 0;

  constructor() { }

  ngOnInit(): void {

  }

  verReporte(nombre: string){
    this.iniciarVistaReporte();
    if (nombre == 'DASHBOARD'){
      this.verReporteDashboard = true;
      return;
    }
    if (nombre == 'FORMULARIO'){
      this.verReporteFormulario = true;
      return;
    }
    if (nombre == 'TOPOGRAFIA'){
      this.verReporteTopografia = true;
      return;
    }
    if (nombre == 'CONTACTO'){
      this.verReporteContacto = true;
      return;
    }
  }

  iniciarVistaReporte(){
    this.verReporteDashboard = false;
    this.verReporteFormulario = false;
    this.verReporteTablas = false;
    this.verReporteTopografia = false;
    this.verReporteContacto = false;
  }

  nuevo(event){}

  crear(event){
  }

  actualizar(event) {
  }
}
