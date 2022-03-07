import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/sesion';
import { SesionService } from '../../../servicios/sesion.service';
import Swal from 'sweetalert2';
import { TabService } from "../../../componentes/services/tab.service";
import { EstadoCivilComponent } from '../estado-civil.component';
import { EstadoCivilService } from '../../../servicios/estado-civil.service';
import { EstadoCivil } from '../../../modelos/estado-civil';
import * as constantes from '../../../constantes';


@Component({
  selector: 'app-estado-civil-leer',
  templateUrl: './estado-civil-leer.component.html',
  styleUrls: ['./estado-civil-leer.component.scss']
})
export class EstadoCivilLeerComponent implements OnInit {

  collapsed = true;
  ComponenteEstadoCivil: Type<any> = EstadoCivilComponent;

  sesion: Sesion;

  constructor(private estadoCivilService: EstadoCivilService, private tabService: TabService, 
    private sesionService: SesionService,private router: Router) { }

  estadosCiviles: EstadoCivil[];
  estadoCivil: EstadoCivil;
  estadoCivilBuscar: EstadoCivil=new EstadoCivil();


  ngOnInit() {
    this.consultar();
    this.sesion= this.sesionService.getSesion();
  }

  consultar() {
    this.estadoCivilService.consultar().subscribe(
      res => {
        this.estadosCiviles = res.resultado as EstadoCivil[]
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  buscar(event) {
    if (event!=null)
      event.preventDefault();
    this.estadoCivilService.buscar(this.estadoCivilBuscar).subscribe(
      res => {
        if (res.resultado!=null) {
          this.estadosCiviles = res.resultado as EstadoCivil[]
        } else {
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  seleccion(estado_civil: EstadoCivil) {
    this.estadoCivil=estado_civil;
  }

  nuevo(event){
    if (event!=null)
      event.preventDefault();
  }

  actualizar(event){
    if (event!=null)
      event.preventDefault();
    if (this.estadoCivil != null){
      this.estadoCivilService.enviar(this.estadoCivil.id);
      let indice_tab_activo= constantes.tab_activo(this.tabService);
      this.tabService.removeTab(indice_tab_activo);
      this.tabService.addNewTab(this.ComponenteEstadoCivil,'Actualizar Estado Civil');
    } else {
      Swal.fire(constantes.error, "Selecciona un Estado Civil", constantes.error_swal);
    }
  }

  eliminar(event) {
    if (event!=null)
      event.preventDefault();
    this.estadoCivilService.eliminar(this.estadoCivil).subscribe(
      res => {
        if (res.resultado!=null){
          Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
          this.estadoCivil = res.resultado as EstadoCivil
        } else {
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }        
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  cambiarBuscarCodigo(){
    this.estadoCivilBuscar.descripcion="";
    this.estadoCivilBuscar.abreviatura="";
  }

  cambiarBuscarDescripcion(){
    this.estadoCivilBuscar.codigo="";
    this.estadoCivilBuscar.abreviatura="";
  }

  cambiarBuscarAbreviatura(){
    this.estadoCivilBuscar.codigo="";
    this.estadoCivilBuscar.descripcion="";
  }

}
