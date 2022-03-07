import { Component, HostListener, OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { Usuario } from '../../modelos/usuario';
import Swal from 'sweetalert2';
import { TabService } from '../../componentes/services/tab.service';
import * as constantes from '../../constantes';
import { Perfil } from '../../modelos/perfil';
import { PerfilService } from '../../servicios/perfil-service.service';
import { PuntoVenta } from '../../modelos/punto-venta';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  usuario= new Usuario();
  perfiles: Perfil[]=[];
  puntosVentas: PuntoVenta[]=[];

  constructor(private tabService: TabService,private usuarioService: UsuarioService, private perfilService: PerfilService) { }

  ngOnInit() {
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
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.nuevo(null);
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  actualizar(event: any) {
    if (event!=null)
      event.preventDefault();
    this.usuarioService.actualizar(this.usuario).subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.usuario=res.resultado as Usuario;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
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
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
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
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.perfiles=res.resultado as Perfil[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  consultarPuntosVentas(){
    this.perfilService.consultar().subscribe(
      res => {
        Swal.fire(constantes.exito, res.mensaje, constantes.exito_swal);
        this.puntosVentas=res.resultado as PuntoVenta[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.message })
    );
  }

  compareFn(a: any, b: any) {
    return a && b && a.id == b.id;
  }

}
