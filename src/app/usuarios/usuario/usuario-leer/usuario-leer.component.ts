import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/sesion';
import { SesionService } from '../../../servicios/sesion.service';
import Swal from 'sweetalert2';
import { TabService } from "../../../componentes/services/tab.service";
import { UsuarioComponent } from '../usuario.component';
import { UsuarioService } from '../../../servicios/usuario.service';
import { Usuario } from '../../../modelos/usuario';
import * as constantes from '../../../constantes';


@Component({
  selector: 'app-usuario-leer',
  templateUrl: './usuario-leer.component.html',
  styleUrls: ['./usuario-leer.component.scss']
})
export class UsuarioMostrarComponent implements OnInit {

  collapsed = true;
  ComponenteUsuario: Type<any> = UsuarioComponent;

  sesion: Sesion;

  constructor(private usuarioService: UsuarioService, private tabService: TabService, 
    private sesionService: SesionService,private router: Router) { }

  usuarios: Usuario[];
  usuario: Usuario;
  usuarioBuscar: Usuario=new Usuario();


  ngOnInit() {
    this.consultar();
    this.sesion= this.sesionService.getSesion();
  }

  consultar() {
    this.usuarioService.consultar().subscribe(
      res => {
        this.usuarios = res.resultado as Usuario[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  buscar(event : any) {
    if (event!=null)
      event.preventDefault();
    this.usuarioService.buscar(this.usuarioBuscar).subscribe(
      res => {
        this.usuarios = res.resultado as Usuario[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  seleccion(usuario: Usuario) {
    this.usuario=usuario;
  }

  nuevo(event: any){
    if (event!=null)
      event.preventDefault();
  }

  actualizar(event: any){
    if (event!=null)
      event.preventDefault();
    if (this.usuario != null){
      this.usuarioService.enviar(this.usuario.id);
      this.tabService.addNewTab(this.ComponenteUsuario,'Actualizar Usuario');
    } else {
      Swal.fire(constantes.error, "Selecciona un Usuario", constantes.error_swal);
    }
  }

  eliminar(event: any) {
    if (event!=null)
      event.preventDefault();
    this.usuarioService.eliminar(this.usuario).subscribe(
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

  cambiarBuscarNombre(){
    this.buscar(null);
  }

  cambiarBuscarCorreo(){
    this.buscar(null);
  }

}
