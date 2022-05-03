import { Component, OnInit, HostListener } from '@angular/core';
import * as constantes from '../../constantes';
import * as util from '../../util';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { GeneroService } from '../../servicios/genero.service';
import { Genero } from '../../modelos/genero';
import { TabService } from '../../componentes/services/tab.service';


@Component({
  selector: 'app-genero',
  templateUrl: './genero.component.html',
  styleUrls: ['./genero.component.scss']
})
export class GeneroComponent implements OnInit {

  genero= new Genero();
  collapsed = true;
  abrirPanelNuevoGenero = true;
  abrirPanelAdminGenero = false;

  sesion: Sesion;
  generos: Genero[];
  generoActualizar: Genero= new Genero();
  generoBuscar: Genero=new Genero();

  constructor(private tabService: TabService,private generoService: GeneroService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.construirGenero();
    this.consultar();
  }
  
  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'E') // SHIFT + E
      this.eliminar(null);
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.tabService.addNewTab(GeneroComponent, constantes.tab_crear_genero);
  }

  borrar(event){
    if (event!=null)
      event.preventDefault();
      if(this.genero.id!=0){
        let id=this.genero.id;
        let codigo=this.genero.codigo;
        this.genero=new Genero();
        this.genero.id=id;
        this.genero.codigo=codigo;
      }
      else{
        this.genero=new Genero();
      }
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.generoService.crear(this.genero).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.generoService.actualizar(this.genero).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.genero=res.resultado as Genero;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizarLeer(event){
    if (event!=null)
      event.preventDefault();
      this.abrirPanelNuevoGenero = true;
      this.abrirPanelAdminGenero = false;
    if (this.generoActualizar.id != 0){
      this.genero={... this.generoActualizar};
      this.generoActualizar=new Genero();
    }
  }

  eliminar(genero: Genero) {
    this.generoService.eliminar(genero).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.genero=res.resultado as Genero
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminarLeer(event) {
    if (event!=null)
      event.preventDefault();
    this.generoService.eliminar(this.genero).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.consultar();   
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  async construirGenero() {
    let generoId=0;
    this.generoService.currentMessage.subscribe(message => generoId = message);
    if (generoId!= 0) {
      await this.generoService.obtenerAsync(generoId).then(
        res => {
          Object.assign(this.genero, res.resultado as Genero);
          this.generoService.enviar(0);
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }
  }
 
  consultar() {
    this.generoService.consultar().subscribe(
      res => {
        this.generos = res.resultado as Genero[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  buscar(event) {
    if (event!=null)
      event.preventDefault();
    this.generoService.buscar(this.generoBuscar).subscribe(
      res => {
        this.generos = res.resultado as Genero[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(genero: Genero) {
    this.genero=genero;
  }

  cambiarBuscarCodigo(){
    this.buscar(null);
  }

  cambiarBuscarDescripcion(){
    this.buscar(null);
  }

  cambiarBuscarAbreviatura(){
    this.buscar(null);
  }
}
