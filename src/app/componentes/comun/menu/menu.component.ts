import { Component, OnInit } from '@angular/core';
import { Type } from '@angular/core';
import { validarSesion, modulos, valores } from '../../../constantes';

import { Router } from '@angular/router';
import { TabService } from "../../../servicios/comun/tab/tab.service";
import { FooterComponent } from "../footer/footer.component";

import { Sesion } from '../../../modelos/usuario/sesion';
import { SesionService } from '../../../servicios/usuario/sesion.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  sesion: Sesion;
  gridColumns = 7;

  piePagina: Type<any> = FooterComponent; 

  permiso_clientes: boolean;
  permiso_compras: boolean;
  permiso_ventas: boolean;
  permiso_inventarios: boolean;
  permiso_caja_bancos: boolean;
  permiso_cuentasxcobrar: boolean;
  permiso_cuentasxpagar: boolean;
  permiso_contabilidad: boolean;
  permiso_financiero: boolean;
  permiso_activos_fijos: boolean;
  permiso_talento_humano: boolean;
  permiso_produccion: boolean;
  permiso_importacion: boolean;
  permiso_reportes: boolean;

  permiso_accesos: boolean;
  permiso_configuraciones: boolean;
  permiso_estadisticas: boolean;
  permiso_control: boolean;
  permiso_auditorias: boolean;
  permiso_tutoriales: boolean;
  verAdministracion: boolean = true;

  ico_cliente: string = "./assets/icons/icoclientes.jpg";
  ico_proveedor: string = "./assets/icons/icoproveedores.png";
  ico_facturacion: string = "./assets/icons/icofacturacion.png";
  ico_inventario: string = "./assets/icons/icoinventarios.png";
  ico_caja_bancos: string = "./assets/icons/icocajabancos.png";
  ico_cuentasxcobrar: string = "./assets/icons/icocuentasxcobrar.png";
  ico_cuentasxpagar: string = "./assets/icons/icocuentasxpagar.png";
  ico_contabilidad: string = "./assets/icons/icocontabilidad.png";
  ico_financiero: string = "./assets/icons/icofinanciero.png";
  ico_activosfijos: string = "./assets/icons/icoactivosfijos.png";
  ico_talentohumano: string = "./assets/icons/icotalentohumano.png";
  ico_produccion: string = "./assets/icons/icoproduccion.png";
  ico_importacion: string = "./assets/icons/icoimportacion.png";
  ico_reportes: string = "./assets/icons/icoreportes.png";

  ico_accesos: string = "./assets/icons/icoacceso.png";
  ico_configuracion: string = "./assets/icons/icoconfiguraciones.png";
  ico_estadistica: string = "./assets/icons/icoestadisticas.png";
  ico_organismoscontrol: string = "./assets/icons/icoorganismoscontrol.png";
  ico_auditoria: string = "./assets/icons/icoauditoria.png";
  ico_tutoriales: string = "./assets/icons/icotutoriales.png";


  constructor(private sesionService: SesionService, public tabService: TabService, private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.obtenerPermiso();
  }

  obtenerPermiso(){ //Si quiero que aparezcan solo los módulos que tienen opciones
    this.sesion.usuario.perfil.permisos.forEach(permiso => {
      // FINANCIERO
      if (permiso.menuOpcion.modulo == modulos.modulo_clientes){ //  && permiso.menuOpcion.menu == valores.si
        this.permiso_clientes = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_compras){
        this.permiso_compras = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_ventas){
        this.permiso_ventas = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_inventarios){
        this.permiso_inventarios = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_caja_bancos){
        this.permiso_caja_bancos = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_cuentas_cobrar){
        this.permiso_cuentasxcobrar = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_cuentas_pagar){
        this.permiso_cuentasxpagar = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_activos_fijos){
        this.permiso_activos_fijos = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_produccion){
        this.permiso_produccion = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_contabilidad){
        this.permiso_contabilidad = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_talento_humano){
        this.permiso_talento_humano = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_financiero){
        this.permiso_financiero = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_importacion){
        this.permiso_importacion = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_reportes){
        this.permiso_reportes = true;
      }
      // ADMINISTRACIÓN
      if (permiso.menuOpcion.modulo == modulos.modulo_accesos){
        this.permiso_accesos = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_configuracion){
        this.permiso_configuraciones = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_indicadores){
        this.permiso_estadisticas = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_control){
        this.permiso_control = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_auditoria){
        this.permiso_auditorias = true;
      }
      if (permiso.menuOpcion.modulo == modulos.modulo_tutoriales){
        this.permiso_tutoriales = true;
      }
    });
    if (this.permiso_accesos || this.permiso_configuraciones || this.permiso_estadisticas || 
        this.permiso_control || this.permiso_auditorias || this.permiso_tutoriales){
      this.verAdministracion = true;
    } else {
      this.verAdministracion = false;
    }
  }

  abrirOpcion(opcion: string){
    this.tabService.abrirTab(this.piePagina, opcion);
  }
}
