import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte-inventario',
  templateUrl: './reporte-inventario.component.html',
  styleUrls: ['./reporte-inventario.component.scss']
})
export class ReporteInventarioComponent implements OnInit {

  verKardexMercaderia: boolean = true;
  verCierreCaja: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  
  verReporte(nombre: string){
    this.iniciarVistaReporte();
    if (nombre == 'CIERRE'){
      this.verKardexMercaderia = true;
      return;
    }
    if (nombre == 'OTRO'){
      this.verCierreCaja = true;
      return;
    }
  }

  iniciarVistaReporte(){
    this.verKardexMercaderia = false;
    this.verCierreCaja = false;
  }

}
