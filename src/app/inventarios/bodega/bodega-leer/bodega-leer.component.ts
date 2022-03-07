import { Component, OnInit, Type } from '@angular/core';
import { Sesion } from '../../../modelos/sesion';
import { SesionService } from '../../../servicios/sesion.service';
import Swal from 'sweetalert2';
import { TabService } from "../../../componentes/services/tab.service";
import { BodegaComponent } from '../bodega.component';
import { BodegaService } from '../../../servicios/bodega.service';
import { Bodega } from '../../../modelos/bodega';
import * as constantes from '../../../constantes';


@Component({
  selector: 'app-bodega-leer',
  templateUrl: './bodega-leer.component.html',
  styleUrls: ['./bodega-leer.component.scss']
})
export class BodegaLeerComponent implements OnInit {

  collapsed = true;
  ComponenteBodega: Type<any> = BodegaComponent;

  sesion: Sesion;

  constructor(private bodegaService: BodegaService, private tabService: TabService, private sesionService: SesionService) { }

  bodegas: Bodega[];
  bodega: Bodega;
  bodegaBuscar: Bodega=new Bodega();


  ngOnInit() {
    this.consultar();
    this.sesion= this.sesionService.getSesion();
  }

  consultar() {
    this.bodegaService.consultar().subscribe(
      res => {
        this.bodegas = res.resultado as Bodega[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  buscar(event: any) {
    if (event!=null)
      event.preventDefault();
      this.bodegaService.buscarCodigo(this.bodegaBuscar).subscribe(
        res => {
          this.bodegas = res.resultado as Bodega[]
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
      );
  }

  seleccion(bodega: Bodega) {
    this.bodega=bodega;
  }

  actualizar(event: any){
    if (event!=null)
      event.preventDefault();
    if (this.bodega != null){
      this.bodegaService.enviar(this.bodega.id);
      this.tabService.addNewTab(this.ComponenteBodega, constantes.tab_crear_bodega);
    } else {
      Swal.fire(constantes.error, "Selecciona un Producto", constantes.error_swal);
    }
  }

  eliminar(event: any) {
    if (event!=null)
      event.preventDefault();
    this.bodegaService.eliminar(this.bodega).subscribe(
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

}
