import { Component, OnInit } from '@angular/core';
import { Type } from '@angular/core';
import { validarSesion, modulos } from '../../constantes';

import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { TabService } from "../../servicios/componente/tab/tab.service";
import { FooterComponent } from "../footer/footer.component";

import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';

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

  ico_cliente: string = environment.prefijoUrlImagenes+"iconos/icoclientes.jpg";
  ico_proveedor: string = environment.prefijoUrlImagenes+"iconos/icoproveedores.png";
  ico_facturacion: string = environment.prefijoUrlImagenes+"iconos/icofacturacion.png";
  ico_inventario: string = environment.prefijoUrlImagenes+"iconos/icoinventarios.png";
  ico_caja_bancos: string = environment.prefijoUrlImagenes+"iconos/icocajabancos.png";
  ico_cuentasxcobrar: string = environment.prefijoUrlImagenes+"iconos/icocuentasxcobrar.png";
  ico_cuentasxpagar: string = environment.prefijoUrlImagenes+"iconos/icocuentasxpagar.png";
  ico_contabilidad: string = environment.prefijoUrlImagenes+"iconos/icocontabilidad.png";
  ico_financiero: string = environment.prefijoUrlImagenes+"iconos/icofinanciero.png";
  ico_activosfijos: string = environment.prefijoUrlImagenes+"iconos/icoactivosfijos.png";
  ico_talentohumano: string = environment.prefijoUrlImagenes+"iconos/icotalentohumano.png";
  ico_produccion: string = environment.prefijoUrlImagenes+"iconos/icoproduccion.png";
  ico_importacion: string = environment.prefijoUrlImagenes+"iconos/icoimportacion.png";
  ico_reportes: string = environment.prefijoUrlImagenes+"iconos/icoreportes.png";

  ico_accesos: string = environment.prefijoUrlImagenes+"iconos/icoacceso.png";
  ico_configuracion: string = environment.prefijoUrlImagenes+"iconos/icoconfiguraciones.png";
  ico_estadistica: string = environment.prefijoUrlImagenes+"iconos/icoestadisticas.png";
  ico_organismoscontrol: string = environment.prefijoUrlImagenes+"iconos/icoorganismoscontrol.png";
  ico_auditoria: string = environment.prefijoUrlImagenes+"iconos/icoauditoria.png";
  ico_tutoriales: string = environment.prefijoUrlImagenes+"iconos/icotutoriales.png";


  constructor(private sesionService: SesionService, public tabService: TabService, private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.obtenerPermiso();
  }

  obtenerPermiso(){
    this.sesion.usuario.perfil.permisos.forEach(elemento => {
      // FINANCIERO
      if (elemento.modulo==modulos.modulo_clientes){
        this.permiso_clientes = true;
      }
      if (elemento.modulo==modulos.modulo_compras){
        this.permiso_compras = true;
      }
      if (elemento.modulo==modulos.modulo_ventas){
        this.permiso_ventas = true;
      }
      if (elemento.modulo==modulos.modulo_inventarios){
        this.permiso_inventarios = true;
      }
      if (elemento.modulo==modulos.modulo_caja_bancos){
        this.permiso_caja_bancos = true;
      }
      if (elemento.modulo==modulos.modulo_cuentas_cobrar){
        this.permiso_cuentasxcobrar = true;
      }
      if (elemento.modulo==modulos.modulo_cuentas_pagar){
        this.permiso_cuentasxpagar = true;
      }
      if (elemento.modulo==modulos.modulo_activos_fijos){
        this.permiso_activos_fijos = true;
      }
      if (elemento.modulo==modulos.modulo_produccion){
        this.permiso_produccion = true;
      }
      if (elemento.modulo==modulos.modulo_contabilidad){
        this.permiso_contabilidad = true;
      }
      if (elemento.modulo==modulos.modulo_talento_humano){
        this.permiso_talento_humano = true;
      }
      if (elemento.modulo==modulos.modulo_financiero){
        this.permiso_financiero = true;
      }
      if (elemento.modulo==modulos.modulo_importacion){
        this.permiso_importacion = true;
      }
      if (elemento.modulo==modulos.modulo_reportes){
        this.permiso_reportes = true;
      }
      // ADMINISTRACIÓN
      if (elemento.modulo==modulos.modulo_accesos){
        this.permiso_accesos = true;
      }
      if (elemento.modulo==modulos.modulo_configuracion){
        this.permiso_configuraciones = true;
      }
      if (elemento.modulo==modulos.modulo_estadisticas){
        this.permiso_estadisticas = true;
      }
      if (elemento.modulo==modulos.modulo_control){
        this.permiso_control = true;
      }
      if (elemento.modulo==modulos.modulo_auditoria){
        this.permiso_auditorias = true;
      }
      if (elemento.modulo==modulos.modulo_tutoriales){
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
