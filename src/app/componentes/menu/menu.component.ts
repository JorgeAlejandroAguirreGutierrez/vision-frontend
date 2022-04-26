import { Component, OnInit } from '@angular/core';
import { Type } from '@angular/core';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { EmpresaService } from '../../servicios/empresa.service';
import { Empresa } from '../../modelos/empresa';
import { environment } from '../../../environments/environment';
import { TabService } from "../services/tab.service";
import { FooterComponent } from "../footer/footer.component";
import * as util from '../../util';
import { Router } from '@angular/router';

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
  permiso_proveedores: boolean;
  permiso_facturacion: boolean;
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

  permiso_estadisticas: boolean;
  permiso_control: boolean;
  permiso_auditorias: boolean;
  permiso_tutoriales: boolean;
  permiso_configuraciones: boolean;
  permiso_usuarios: boolean;


  perfil_contador: boolean;
  perfil_administrativo: boolean;


  url_logo: string ="";
  nombre_empresa: string="";
  url_avatar: string= environment.prefijo_url_imagenes+"avatar/avatar1.png";

  ico_cliente: string = environment.prefijo_url_imagenes+"iconos/icoclientes.jpg";
  ico_proveedor: string = environment.prefijo_url_imagenes+"iconos/icoproveedores.png";
  ico_facturacion: string = environment.prefijo_url_imagenes+"iconos/icofacturacion.png";
  ico_inventario: string = environment.prefijo_url_imagenes+"iconos/icoinventarios.png";
  ico_caja_bancos: string = environment.prefijo_url_imagenes+"iconos/icocajabancos.png";
  ico_cuentasxcobrar: string = environment.prefijo_url_imagenes+"iconos/icocuentasxcobrar.png";
  ico_cuentasxpagar: string = environment.prefijo_url_imagenes+"iconos/icocuentasxpagar.png";
  ico_contabilidad: string = environment.prefijo_url_imagenes+"iconos/icocontabilidad.png";
  ico_financiero: string = environment.prefijo_url_imagenes+"iconos/icofinanciero.png";
  ico_activosfijos: string = environment.prefijo_url_imagenes+"iconos/icoactivosfijos.png";
  ico_talentohumano: string = environment.prefijo_url_imagenes+"iconos/icotalentohumano.png";
  ico_produccion: string = environment.prefijo_url_imagenes+"iconos/icoproduccion.png";
  ico_importacion: string = environment.prefijo_url_imagenes+"iconos/icoimportacion.png";
  ico_reportes: string = environment.prefijo_url_imagenes+"iconos/icoreportes.png";

  ico_estadistica: string = environment.prefijo_url_imagenes+"iconos/icoestadisticas.png";
  ico_organismoscontrol: string = environment.prefijo_url_imagenes+"iconos/icoorganismoscontrol.png";
  ico_auditoria: string = environment.prefijo_url_imagenes+"iconos/icoauditoria.png";
  ico_usuarios: string = environment.prefijo_url_imagenes+"iconos/icotutoriales.png";
  ico_configuracion: string = environment.prefijo_url_imagenes+"iconos/icoconfiguraciones.png";

  constructor(private sesionService: SesionService, private empresaService: EmpresaService, public tabService: TabService, private router: Router) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.obtenerEmpresa();
    // FINANCIERO
    this.permiso_clientes=this.obtenerPermiso('CLIENTES');
    this.permiso_proveedores=this.obtenerPermiso('PROVEEDORES');
    this.permiso_facturacion=this.obtenerPermiso('FACTURACION');
    this.permiso_inventarios=this.obtenerPermiso('INVENTARIOS');
    this.permiso_caja_bancos=this.obtenerPermiso('CAJA_BANCOS');
    this.permiso_cuentasxcobrar=this.obtenerPermiso('CUENTAS_COBRAR');
    this.permiso_cuentasxpagar=this.obtenerPermiso('CUENTAS_PAGAR');
    this.permiso_contabilidad=this.obtenerPermiso('CONTABILIDAD');
    this.permiso_financiero=this.obtenerPermiso('FINANCIERO');
    this.permiso_activos_fijos=this.obtenerPermiso('ACTIVOS_FIJOS');
    this.permiso_talento_humano=this.obtenerPermiso('TALENTO_HUMANO');
    this.permiso_produccion= this.obtenerPermiso('PRODUCCION');
    this.permiso_importacion= this.obtenerPermiso('IMPORTACION');
    this.permiso_reportes= this.obtenerPermiso('REPORTES');
    
    // ADMINISTRACION  
    this.permiso_estadisticas=this.obtenerPermiso('ESTADISTICAS');
    this.permiso_control=this.obtenerPermiso('ORGANISMOS_CONTROL');
    this.permiso_auditorias=this.obtenerPermiso('AUDITORIA');
    this.permiso_usuarios=this.obtenerPermiso('USUARIOS');
    this.permiso_configuraciones=this.obtenerPermiso('CONFIGURACIONES');
  }

  obtenerEmpresa(){
    let empresa=new Empresa();
    empresa.id=1;
    this.empresaService.obtener(empresa).subscribe(
      res => {
        empresa= res.resultado as Empresa
        this.url_logo=environment.prefijo_url_imagenes+"logos/"+empresa.logo;
        this.nombre_empresa=empresa.razonSocial;
      }
    );
  }

  obtenerPermiso(permiso: string): boolean {
    let bandera=false;
    this.sesion.usuario.perfil.permisos.forEach(elemento => {
      if (elemento.modulo==permiso){
        bandera=true;
      }
    });
    return bandera;
  }

  abrirOpcion(opcion: string){
    this.tabService.abrirTab(this.piePagina, opcion);
  }
}
