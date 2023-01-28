import { Component, OnInit } from '@angular/core';
import { Type } from '@angular/core';
import { Sesion } from '../../modelos/usuario/sesion';
import { SesionService } from '../../servicios/usuario/sesion.service';
import { EmpresaService } from '../../servicios/usuario/empresa.service';
import { Empresa } from '../../modelos/usuario/empresa';
import { environment } from '../../../environments/environment';
import { TabService } from "../services/tab.service";
import { FooterComponent } from "../footer/footer.component";
import { validarSesion } from '../../constantes';
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


  perfil_contador: boolean;
  perfil_administrativo: boolean;


  url_logo: string ="";
  nombre_empresa: string="";
  url_avatar: string= environment.prefijoUrlImagenes+"avatar/avatar1.png";

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


  constructor(private sesionService: SesionService, private empresaService: EmpresaService, public tabService: TabService, private router: Router) { }

  ngOnInit() {
    this.sesion=validarSesion(this.sesionService, this.router);
    this.obtenerEmpresa();
    // FINANCIERO
    this.permiso_clientes=this.obtenerPermiso('CLIENTES');
    this.permiso_compras=this.obtenerPermiso('COMPRAS');
    this.permiso_ventas=this.obtenerPermiso('VENTAS');
    this.permiso_inventarios=this.obtenerPermiso('INVENTARIOS');
    this.permiso_caja_bancos=this.obtenerPermiso('CAJA_BANCOS');
    this.permiso_cuentasxcobrar=this.obtenerPermiso('CUENTAS_COBRAR');
    this.permiso_cuentasxpagar=this.obtenerPermiso('CUENTAS_PAGAR');
    this.permiso_activos_fijos=this.obtenerPermiso('ACTIVOS_FIJOS');
    this.permiso_produccion= this.obtenerPermiso('PRODUCCION');
    this.permiso_contabilidad=this.obtenerPermiso('CONTABILIDAD');
    this.permiso_talento_humano=this.obtenerPermiso('TALENTO_HUMANO');
    this.permiso_financiero=this.obtenerPermiso('FINANCIERO');
    this.permiso_importacion= this.obtenerPermiso('IMPORTACION');
    this.permiso_reportes= this.obtenerPermiso('REPORTES');
    
    // ADMINISTRACION  
    this.permiso_accesos=this.obtenerPermiso('ACCESOS');
    this.permiso_configuraciones=this.obtenerPermiso('CONFIGURACIONES');
    this.permiso_estadisticas=this.obtenerPermiso('ESTADISTICAS');
    this.permiso_control=this.obtenerPermiso('ORGANISMOS_CONTROL');
    this.permiso_auditorias=this.obtenerPermiso('AUDITORIA');
    this.permiso_tutoriales=this.obtenerPermiso('TUTORIALES');
  }

  obtenerEmpresa(){
    let empresaId=1;
    this.empresaService.obtener(empresaId).subscribe(
      res => {
        let empresa= res.resultado as Empresa
        this.url_logo=environment.prefijoUrlImagenes+"logos/"+empresa.logo;
        this.nombre_empresa=empresa.razonSocial;
      }
    );
  }

  obtenerPermiso(permisoModulo: string): boolean {
    let bandera=false;
    this.sesion.usuario.perfil.permisos.forEach(elemento => {
      if (elemento.modulo==permisoModulo){
        bandera=true;
      }
    });
    return bandera;
  }

  abrirOpcion(opcion: string){
    this.tabService.abrirTab(this.piePagina, opcion);
  }
}
