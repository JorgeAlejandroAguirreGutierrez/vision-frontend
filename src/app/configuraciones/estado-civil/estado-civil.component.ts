import { Component, OnInit, HostListener, Type } from '@angular/core';
import { TabService } from '../../componentes/services/tab.service';
import { EstadoCivil } from '../../modelos/estado-civil';
import { EstadoCivilService } from '../../servicios/estado-civil.service';
import * as constantes from '../../constantes';
import * as util from '../../util';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';

@Component({
  selector: 'app-estado-civil',
  templateUrl: './estado-civil.component.html',
  styleUrls: ['./estado-civil.component.scss']
})
export class EstadoCivilComponent implements OnInit {

  collapsed = true;
  abrirPanelNuevoEstadoCivil = true;
  abrirPanelAdminEstadoCivil = false;

  sesion: Sesion;
  estadoCivil= new EstadoCivil();

  estadosCiviles: EstadoCivil[];
  estadoCivilActualizar: EstadoCivil= new EstadoCivil();
  estadoCivilBuscar: EstadoCivil=new EstadoCivil();
  ComponenteEstadoCivil: Type<any> = EstadoCivilComponent;

  constructor(private tabService: TabService,private estadoCivilService: EstadoCivilService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    util.validarSesion(this.sesion, this.sesionService, this.router);
    this.construirEstadoCivil();
    this.consultar();
    this.sesion= this.sesionService.getSesion();
  }
  
  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == "G") //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "N") //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == "E") // SHIFT + E
      this.eliminar(null);
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
  }

  borrar(event){
    if (event!=null)
      event.preventDefault();
      if(this.estadoCivil.id!=0){
        let id=this.estadoCivil.id;
        let codigo=this.estadoCivil.codigo;
        this.estadoCivil=new EstadoCivil();
        this.estadoCivil.id=id;
        this.estadoCivil.codigo=codigo;
      }
      else{
        this.estadoCivil=new EstadoCivil();
      }
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.estadoCivilService.crear(this.estadoCivil).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.nuevo(null);
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.exito_swal)
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.estadoCivilService.actualizar(this.estadoCivil).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.estadoCivil=res.resultado as EstadoCivil;
        this.consultar();
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  actualizarLeer(event){
    if (event!=null)
      event.preventDefault();
      this.abrirPanelNuevoEstadoCivil = true;
      this.abrirPanelAdminEstadoCivil = false;
    if (this.estadoCivilActualizar.id != 0){
      this.estadoCivil={... this.estadoCivilActualizar};
      this.estadoCivilActualizar=new EstadoCivil();
    }
  }

  eliminar(estadoCivil: EstadoCivil) {
    this.estadoCivilService.eliminar(estadoCivil).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.error_swal);
        this.estadoCivil=res.resultado as EstadoCivil
        this.consultar(); 
      },
      err => Swal.fire(constantes.exito, err.error.mensaje, constantes.exito_swal)
    );
  }

  eliminarLeer(event) {
    if (event!=null)
      event.preventDefault();
    this.estadoCivilService.eliminar(this.estadoCivil).subscribe(
      res => {
        if (res.resultado!=null){
          Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
          this.estadoCivil = res.resultado as EstadoCivil
          this.consultar(); 
        } else {
          Swal.fire(constantes.error, res.mensaje, constantes.error_swal);
        }        
      },
      err => Swal.fire(constantes.error, err.error.mensaje, constantes.error_swal)
    );
  }

  async construirEstadoCivil() {
    let estadoCivilId=0;
    this.estadoCivilService.currentMessage.subscribe(message => estadoCivilId = message);
    if (estadoCivilId!= 0) {
      await this.estadoCivilService.obtenerAsync(estadoCivilId).then(
        res => {
          Object.assign(this.estadoCivil, res.resultado as EstadoCivil);
          this.estadoCivilService.enviar(0);
        },
        err => Swal.fire(constantes.exito, err.error.mensaje, constantes.exito_swal)
      );
    }
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

  seleccion(estadoCivil: EstadoCivil) {
    this.estadoCivil=estadoCivil;
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
