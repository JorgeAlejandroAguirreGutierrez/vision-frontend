import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte-inventario',
  templateUrl: './reporte-inventario.component.html',
  styleUrls: ['./reporte-inventario.component.scss']
})
export class ReporteInventarioComponent implements OnInit {

  verKardexMercaderia: boolean = true;
  verExistencia: boolean = false;

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
    if (nombre == 'EXISTENCIA'){
      this.verExistencia = true;
      return;
    }
  }

  iniciarVistaReporte(){
    this.verKardexMercaderia = false;
    this.verExistencia = false;
  }

}
