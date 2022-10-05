import { Component, HostListener, OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario/usuario.service';
import { Usuario } from '../../modelos/usuario/usuario';
import Swal from 'sweetalert2';
import { TabService } from '../../componentes/services/tab.service';
import { validarSesion, exito_swal, error_swal, exito, error } from '../../constantes';
import { Perfil } from '../../modelos/usuario/perfil';
import { PerfilService } from '../../servicios/usuario/perfil-service.service';
import { PuntoVenta } from '../../modelos/usuario/punto-venta';
import { SesionService } from 'src/app/servicios/usuario/sesion.service';
import { Router } from '@angular/router';
import { Sesion } from 'src/app/modelos/usuario/sesion';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  usuario= new Usuario();
  perfiles: Perfil[]=[];
  puntosVentas: PuntoVenta[]=[];
  sesion: Sesion;

  constructor(private tabService: TabService,private usuarioService: UsuarioService, private perfilService: PerfilService, private sesionService: SesionService, private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.consultarPerfiles();
    this.consultarPuntosVentas();
    this.construirUsuario();
    
  }

  nuevo(event: any) {
    if (event!=null)
      event.preventDefault();
    this.usuario = new Usuario();
  }

  crear(event: any) {
    if (event!=null)
      event.preventDefault();
    this.usuarioService.crear(this.usuario).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.nuevo(null);
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event: any) {
    if (event!=null)
      event.preventDefault();
    this.usuarioService.actualizar(this.usuario).subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.usuario=res.resultado as Usuario;
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  async construirUsuario() {
    let usuarioId=0;
    this.usuarioService.currentMessage.subscribe(message => usuarioId = message);
    if (usuarioId!= 0) {
      await this.usuarioService.obtenerAsync(usuarioId).then(
        res => {
          Object.assign(this.usuario, res.resultado as Usuario);
          this.usuarioService.enviar(0);
        },
        err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 71) //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 78) //ASHIFT + N
      this.nuevo(null);
  }

  consultarPerfiles(){
    this.perfilService.consultar().subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.perfiles=res.resultado as Perfil[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  consultarPuntosVentas(){
    this.perfilService.consultar().subscribe(
      res => {
        Swal.fire({ icon: exito_swal, title: exito, text: res.mensaje });
        this.puntosVentas=res.resultado as PuntoVenta[]
      },
      err => Swal.fire({ icon: error_swal, title: error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

}
