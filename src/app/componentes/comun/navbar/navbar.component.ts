import { SidebarService } from '../../../servicios/comun/sidebar/sidebar.service';
import { valores, mensajes, validarSesion, exito_swal, error_swal, exito, error } from '../../../constantes';
import { Component, OnInit, Input } from '@angular/core';

import { Router } from '@angular/router';
import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';
import { Usuario } from '../../../modelos/usuario/usuario';
import { UsuarioService } from '../../../servicios/usuario/usuario.service';
import { EmpresaService } from '../../../servicios/usuario/empresa.service';
import { Empresa } from '../../../modelos/usuario/empresa';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  imagenes = environment.imagenes;
  logos = valores.logos;
  avatares = valores.avatares;

  @Input() istabMenu:boolean;

  isCollapsed: boolean = true;

  sesion: Sesion = null;
  empresa: Empresa = new Empresa();
  usuario: Usuario = new Usuario();

  constructor(private sesionService: SesionService, private sidebarService: SidebarService, private empresaService: EmpresaService,
            private usuarioService: UsuarioService, private router: Router) { }


  ngOnInit() {
    this.sesion = validarSesion(this.sesionService, this.router);
    this.obtenerEmpresa();
    this.obtenerUsuario();
  }

  obtenerEmpresa() {
    this.empresaService.obtener(this.sesion.usuario.estacion.establecimiento.empresa.id).subscribe(
      res => {
        this.empresa = res.resultado as Empresa;
      }
    );
  }

  obtenerUsuario() {
    this.usuarioService.obtener(this.sesion.usuario.id).subscribe(
      res => {
        this.usuario = res.resultado as Usuario;
      }
    );
  }

  get isSidebarVisible(): boolean {
    return this.sidebarService.isSidebarVisible;
  }

  toggleSidebarPin() {
    this.sidebarService.toggleSidebarPin();
    this.sidebarService.toggleSidebarVisibility();
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
    this.sidebarService.toggleSidebarVisibility();
  }

}