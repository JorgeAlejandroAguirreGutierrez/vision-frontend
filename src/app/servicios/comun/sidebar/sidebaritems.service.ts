import { Injectable, Type } from '@angular/core';
import { modulos, tabs, items, icos, valores } from '../../../constantes';
import { SidebarItem } from "../../../modelos/sidebar-item.model";
import { Sesion } from '../../../modelos/usuario/sesion';
import { Permiso } from '../../../modelos/usuario/permiso';
//CLIENTES
import { ClienteComponent } from "../../../componentes/cliente/cliente/cliente.component";
import { GrupoClienteComponent } from '../../../componentes/cliente/grupo-cliente/grupo-cliente.component';
import { SegmentoComponent } from '../../../componentes/cliente/segmento/segmento.component';
import { CalificacionClienteComponent } from '../../../componentes/cliente/calificacion-cliente/calificacion-cliente.component';
import { FormaPagoComponent } from '../../../componentes/cliente/forma-pago/forma-pago.component';
import { OrigenIngresoComponent } from '../../../componentes/cliente/origen-ingreso/origen-ingreso.component';
import { PlazoCreditoComponent } from '../../../componentes/cliente/plazo-credito/plazo-credito.component';
//COMPRAS
import { ProveedorComponent } from '../../../componentes/compra/proveedor/proveedor.component';
import { GrupoProveedorComponent } from '../../../componentes/compra/grupo-proveedor/grupo-proveedor.component';
import { NotaCreditoCompraComponent } from '../../../componentes/compra/nota-credito-compra/nota-credito-compra.component';
import { FacturaCompraComponent } from 'src/app/componentes/compra/factura-compra/factura-compra.component';
import { NotaDebitoCompraComponent } from 'src/app/componentes/compra/nota-debito-compra/nota-debito-compra.component';
//VENTAS
import { FacturaComponent } from "../../../componentes/venta/factura/factura.component";
import { NotaCreditoVentaComponent } from '../../../componentes/venta/nota-credito-venta/nota-credito-venta.component';
import { NotaDebitoVentaComponent } from 'src/app/componentes/venta/nota-debito-venta/nota-debito-venta.component';
//ENTREGA
import { GuiaRemisionComponent } from '../../../componentes/entrega/guia-remision/guia-remision.component';
import { TransportistaComponent } from '../../../componentes/entrega/transportista/transportista.component';
import { VehiculoComponent } from '../../../componentes/entrega/vehiculo/vehiculo.component';
//INVENTARIOS
import { GrupoProductoComponent } from '../../../componentes/inventario/grupo-producto/grupo-producto.component';
import { ProductoComponent } from "../../../componentes/inventario/producto/producto.component";
import { KardexComponent } from "../../../componentes/inventario/kardex/kardex.component";
import { PromocionComponent } from "../../../componentes/inventario/promocion/promocion.component";
import { BodegaComponent } from "../../../componentes/inventario/bodega/bodega.component";
import { MedidaComponent } from '../../../componentes/inventario/medida/medida.component';
//CAJA BANCOS
import { CuentaPropiaComponent } from '../../../componentes/caja-banco/cuenta-propia/cuenta-propia.component';
import { BancoComponent } from '../../../componentes/caja-banco/banco/banco.component';
//CONTABILIDAD
import { MovimientoContableComponent } from '../../../componentes/contabilidad/movimiento-contable/movimiento-contable.component';
import { CuentaContableComponent } from '../../../componentes/contabilidad/cuenta-contable/cuenta-contable.component';
//REPORTES
import { ReporteClienteComponent } from '../../../componentes/reporte/cliente/reporte-cliente/reporte-cliente.component';
import { ReporteCompraComponent } from '../../../componentes/reporte/compra/reporte-compra/reporte-compra.component';
import { ReporteInventarioComponent } from '../../../componentes/reporte/inventario/reporte-inventario/reporte-inventario.component';
import { ReporteCajaBancoComponent } from '../../../componentes/reporte/caja-banco/reporte-caja-banco/reporte-caja-banco.component';
import { ReporteCuentaCobrarComponent } from '../../../componentes/reporte/cuenta-cobrar/reporte-cuenta-cobrar/reporte-cuenta-cobrar.component';
import { ReporteCuentaPagarComponent } from '../../../componentes/reporte/cuenta-pagar/reporte-cuenta-pagar/reporte-cuenta-pagar.component';
import { ReporteActivoFijoComponent } from '../../../componentes/reporte/activo-fijo/reporte-activo-fijo/reporte-activo-fijo.component';
import { ReporteProduccionComponent } from '../../../componentes/reporte/produccion/reporte-produccion/reporte-produccion.component';
import { ReporteContabilidadComponent } from '../../../componentes/reporte/contabilidad/reporte-contabilidad/reporte-contabilidad.component';
import { ReporteTalentoHumanoComponent } from '../../../componentes/reporte/talento-humano/reporte-talento-humano/reporte-talento-humano.component';
import { ReporteFinancieroComponent } from '../../../componentes/reporte/financiero/reporte-financiero/reporte-financiero.component';
import { ReporteImportacionComponent } from '../../../componentes/reporte/importacion/reporte-importacion/reporte-importacion.component';

import { ReporteVentaComponent } from '../../../componentes/reporte/reporte-venta/reporte-venta.component';
import { ReporteCajaComponent } from 'src/app/componentes/reporte/reporte-caja/reporte-caja.component';
import { ReporteKardexComponent } from 'src/app/componentes/reporte/reporte-kardex/reporte-kardex.component';

//ACCESOS
import { UsuarioComponent } from '../../../componentes/usuario/usuario/usuario.component';
import { EmpresaComponent } from '../../../componentes/usuario/empresa/empresa.component';
import { EstablecimientoComponent } from '../../../componentes/usuario/establecimiento/establecimiento.component';
import { EstacionComponent } from '../../../componentes/usuario/estacion/estacion.component';
import { PerfilComponent } from '../../../componentes/usuario/perfil/perfil.component';
import { PermisoComponent } from '../../../componentes/usuario/permiso/permiso.component';
//CONFIGURACIONES
import { UbicacionComponent } from '../../../componentes/configuracion/ubicacion/ubicacion.component';
import { EstadoCivilComponent } from '../../../componentes/configuracion/estado-civil/estado-civil.component';
import { ImpuestoComponent } from '../../../componentes/configuracion/impuesto/impuesto.component';
import { SecuencialComponent } from '../../../componentes/configuracion/secuencial/secuencial.component';
import { RegimenComponent } from '../../../componentes/configuracion/regimen/regimen.component';
import { ImportarComponent } from '../../../componentes/configuracion/importar/importar.component';
import { ExportarComponent } from '../../../componentes/configuracion/exportar/exportar.component';
import { TipoRetencionComponent } from '../../../componentes/configuracion/tipo-retencion/tipo-retencion.component';
//INDICADORES
import { DashboardComponent } from '../../../componentes/indicador/dashboard/dashboard.component';


@Injectable({
  providedIn: 'root'
})
export class SidebarItemsService {

  opciones = new Array<SidebarItem>();
  permisos: Permiso[] = [];

  constructor() { }

  /******* LLENAR OPCIONES EN EL SIDEBAR */
  llenarOpciones(Componente: Type<any>, tabTitulo: string, itemNombre: string, icoItem: string) {
    // Validar si tiene permisos para ver la opcion en el sidebar
    this.permisos.forEach(permiso => {
      if (permiso.menuOpcion.opcion == itemNombre.toUpperCase() && permiso.menuOpcion.menu==valores.si && permiso.estado==valores.estadoActivo){
        this.opciones.push(new SidebarItem(Componente, tabTitulo, itemNombre, icoItem));
      }
    });
  }

  menuOpciones(tabNombre: string, sesion: Sesion): SidebarItem[] {
    this.opciones = [];
    this.permisos = sesion.usuario.perfil.permisos;
    if (tabNombre == modulos.modulo_clientes) {
      this.llenarOpciones(GrupoClienteComponent, tabs.tab_grupo_cliente, items.item_grupo_cliente, icos.ico_grupo_cliente);
      this.llenarOpciones(ClienteComponent, tabs.tab_cliente, items.item_cliente, icos.ico_cliente);
      this.llenarOpciones(SegmentoComponent, tabs.tab_segmento, items.item_segmento, icos.ico_segmento);
      this.llenarOpciones(FormaPagoComponent, tabs.tab_forma_pago, items.item_forma_pago, icos.ico_forma_pago);
      this.llenarOpciones(OrigenIngresoComponent, tabs.tab_origen_ingreso, items.item_origen_ingreso, icos.ico_origen_ingreso);
      this.llenarOpciones(PlazoCreditoComponent, tabs.tab_plazo_credito, items.item_plazo_credito, icos.ico_plazo_credito);
      this.llenarOpciones(CalificacionClienteComponent, tabs.tab_calificacion_cliente, items.item_calificacion_cliente, icos.ico_calificacion_cliente);
    }

    if (tabNombre == modulos.modulo_compras) {
      this.llenarOpciones(GrupoProveedorComponent, tabs.tab_grupo_proveedor, items.item_grupo_proveedor, icos.ico_grupo_proveedor);
      this.llenarOpciones(ProveedorComponent, tabs.tab_proveedor, items.item_proveedor, icos.ico_proveedor);
      this.llenarOpciones(FacturaCompraComponent, tabs.tab_factura_compra, items.item_factura_compra, icos.ico_factura_compra);
      this.llenarOpciones(NotaCreditoCompraComponent, tabs.tab_nota_credito_compra, items.item_nota_credito_compra, icos.ico_nota_credito_compra);
      this.llenarOpciones(NotaDebitoCompraComponent, tabs.tab_nota_debito_compra, items.item_nota_debito_compra, icos.ico_nota_debito_compra);
    }

    if (tabNombre == modulos.modulo_ventas) {
      this.llenarOpciones(FacturaComponent, tabs.tab_factura, items.item_factura, icos.ico_factura);
      this.llenarOpciones(NotaCreditoVentaComponent, tabs.tab_nota_credito_venta, items.item_nota_credito_venta, icos.ico_nota_credito_venta);
      this.llenarOpciones(NotaDebitoVentaComponent, tabs.tab_nota_debito_venta, items.item_nota_debito_venta, icos.ico_nota_debito_venta);
      this.llenarOpciones(GuiaRemisionComponent, tabs.tab_guia_remision, items.item_guia_remision, icos.ico_guia_remision);
      this.llenarOpciones(TransportistaComponent, tabs.tab_transportista, items.item_transportista, icos.ico_transportista);
      this.llenarOpciones(VehiculoComponent, tabs.tab_vehiculo_transporte, items.item_vehiculo_transporte, icos.ico_vehiculo_transporte);
    }

    if (tabNombre == modulos.modulo_inventarios) {
      this.llenarOpciones(GrupoProductoComponent,tabs.tab_grupo_producto, items.item_grupo_producto, icos.ico_grupo_producto);
      this.llenarOpciones(ProductoComponent,tabs.tab_producto, items.item_producto, icos.ico_producto);
      this.llenarOpciones(KardexComponent,tabs.tab_kardex, items.item_kardex, icos.ico_kardex);
      this.llenarOpciones(PromocionComponent,tabs.tab_promocion,items.item_promocion,icos.ico_promocion);
      this.llenarOpciones(BodegaComponent,tabs.tab_bodega, items.item_bodega, icos.ico_bodega);
      this.llenarOpciones(MedidaComponent,tabs.tab_medida, items.item_medida, icos.ico_medida);
    }

    if (tabNombre == modulos.modulo_caja_bancos) {
      this.llenarOpciones(CuentaPropiaComponent,tabs.tab_cuenta_propia, items.item_cuenta_propia, icos.ico_cuenta_propia);
      this.llenarOpciones(BancoComponent,tabs.tab_banco, items.item_banco, icos.ico_banco);
    }

    if (tabNombre == modulos.modulo_cuentas_cobrar) {

    }

    if (tabNombre == modulos.modulo_cuentas_pagar) {

    }

    if (tabNombre == modulos.modulo_activos_fijos) {
    }

    if (tabNombre == modulos.modulo_produccion) {
    }

    if (tabNombre == modulos.modulo_contabilidad) {
      this.llenarOpciones(CuentaContableComponent, tabs.tab_cuenta_contable, items.item_cuenta_contable, icos.ico_cuenta_contable);
      this.llenarOpciones(MovimientoContableComponent, tabs.tab_movimiento_contable, items.item_movimiento_contable, icos.ico_movimiento_contable);
    }

    if (tabNombre == modulos.modulo_talento_humano) {

    }

    if (tabNombre == modulos.modulo_financiero) {

    }

    if (tabNombre == modulos.modulo_importacion) {
    }

    if (tabNombre == modulos.modulo_reportes) {
      this.llenarOpciones(ReporteClienteComponent, tabs.tab_reporte_clientes, items.item_reporte_clientes, icos.ico_reporte_clientes);
      this.llenarOpciones(ReporteCompraComponent, tabs.tab_reporte_compras, items.item_reporte_compras, icos.ico_reporte_compras);
      this.llenarOpciones(ReporteInventarioComponent, tabs.tab_reporte_inventarios, items.item_reporte_inventarios, icos.ico_reporte_inventarios);
      this.llenarOpciones(ReporteCajaBancoComponent, tabs.tab_reporte_caja_bancos, items.item_reporte_caja_bancos, icos.ico_reporte_caja_bancos);
      this.llenarOpciones(ReporteCuentaCobrarComponent, tabs.tab_reporte_cuentas_cobrar, items.item_reporte_cuentas_cobrar, icos.ico_reporte_cuentas_cobrar);
      this.llenarOpciones(ReporteCuentaPagarComponent, tabs.tab_reporte_cuentas_pagar, items.item_reporte_cuentas_pagar, icos.ico_reporte_cuentas_pagar);
      this.llenarOpciones(ReporteActivoFijoComponent, tabs.tab_reporte_activos_fijos, items.item_reporte_activos_fijos, icos.ico_reporte_activos_fijos);
      this.llenarOpciones(ReporteProduccionComponent, tabs.tab_reporte_produccion, items.item_reporte_produccion, icos.ico_reporte_produccion);
      this.llenarOpciones(ReporteContabilidadComponent, tabs.tab_reporte_contabilidad, items.item_reporte_contabilidad, icos.ico_reporte_contabilidad);
       //this.llenarOpciones(ReporteTalentoHumanoComponent, tabs.tab_reporte_talento_humano, items.item_reporte_talento_humano, icos.ico_reporte_talento_humano);
      //this.llenarOpciones(ReporteFinancieroComponent, tabs.tab_reporte_financiero, items.item_reporte_financiero, icos.ico_reporte_financiero);
      //this.llenarOpciones(ReporteImportacionComponent, tabs.tab_reporte_importacion, items.item_reporte_importacion, icos.ico_reporte_importacion);

      this.llenarOpciones(ReporteVentaComponent, tabs.tab_reporte_talento_humano, items.item_reporte_talento_humano, icos.ico_reporte_talento_humano);
      this.llenarOpciones(ReporteCajaComponent, tabs.tab_reporte_financiero, items.item_reporte_financiero, icos.ico_reporte_financiero);
      this.llenarOpciones(ReporteKardexComponent, tabs.tab_reporte_importacion, items.item_reporte_importacion, icos.ico_reporte_importacion);
    }

    if (tabNombre == modulos.modulo_accesos) {
      this.llenarOpciones(UsuarioComponent, tabs.tab_usuario, items.item_usuario, icos.ico_usuario);
      this.llenarOpciones(EmpresaComponent, tabs.tab_empresa, items.item_empresa, icos.ico_empresa);
      this.llenarOpciones(EstablecimientoComponent, tabs.tab_establecimiento, items.item_establecimiento, icos.ico_establecimiento);
      this.llenarOpciones(EstacionComponent, tabs.tab_estacion, items.item_estacion, icos.ico_estacion);
      this.llenarOpciones(PerfilComponent, tabs.tab_perfil, items.item_perfil, icos.ico_perfil);
      this.llenarOpciones(PermisoComponent, tabs.tab_permiso, items.item_permiso, icos.ico_permiso);
    }

    if (tabNombre == modulos.modulo_configuracion) {
      this.llenarOpciones(UbicacionComponent, tabs.tab_ubicacion, items.item_ubicacion, icos.ico_ubicacion);
      this.llenarOpciones(EstadoCivilComponent, tabs.tab_estado_civil, items.item_estado_civil, icos.ico_estado_civil);
      this.llenarOpciones(ImpuestoComponent, tabs.tab_impuesto, items.item_impuesto, icos.ico_impuesto);
      this.llenarOpciones(SecuencialComponent, tabs.tab_secuencial, items.item_secuencial, icos.ico_secuencial);
      this.llenarOpciones(TipoRetencionComponent, tabs.tab_tipo_retencion, items.item_tipo_retencion, icos.ico_tipo_retencion);
      this.llenarOpciones(RegimenComponent, tabs.tab_regimen, items.item_regimen, icos.ico_regimen);
      this.llenarOpciones(ImportarComponent, tabs.tab_importacion, items.item_importacion, icos.ico_importacion);
      this.llenarOpciones(ExportarComponent, tabs.tab_exportacion, items.item_exportacion, icos.ico_exportacion);
    }
    
    if (tabNombre == modulos.modulo_indicadores) {
      this.llenarOpciones(DashboardComponent, tabs.tab_indicadores, items.item_indicadores, icos.ico_indicadores);
    }

    if (tabNombre == modulos.modulo_control) {
    }

    if (tabNombre == modulos.modulo_auditoria) {
    }

    if (tabNombre == modulos.modulo_tutoriales) {
    }
    return this.opciones;
  }  
}
