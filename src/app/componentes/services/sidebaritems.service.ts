import { Injectable, Type } from '@angular/core';
import { modulos, tabs, items, icos, valores } from '../../constantes';
import { SidebarItem } from "../../modelos/sidebar-item.model";
import { Sesion } from '../../modelos/usuario/sesion';
import { Permiso } from '../../modelos/usuario/permiso';

//CLIENTES
import { ClienteComponent } from "../../clientes/cliente/cliente.component";
import { GrupoClienteComponent } from '../../clientes/grupo-cliente/grupo-cliente.component';
import { SegmentoComponent } from '../../clientes/segmento/segmento.component';
import { CalificacionClienteComponent } from '../../clientes/calificacion-cliente/calificacion-cliente.component';
import { FormaPagoComponent } from '../../clientes/forma-pago/forma-pago.component';
import { OrigenIngresoComponent } from '../../clientes/origen-ingreso/origen-ingreso.component';
import { PlazoCreditoComponent } from '../../clientes/plazo-credito/plazo-credito.component';

//COMPRAS
import { ProveedorComponent } from '../../compras/proveedor/proveedor.component';
import { FacturaCompraComponent } from '../../compras/factura-compra/factura-compra.component';
import { GrupoProveedorComponent } from '../../compras/grupo-proveedor/grupo-proveedor.component';

//VENTAS
import { FacturaComponent } from "../../comprobantes/factura/factura.component";
import { PedidoComponent } from "../../comprobantes/pedido/pedido.component";
import { ProformaComponent } from "../../comprobantes/proforma/proforma.component";
import { EgresoComponent } from "../../comprobantes/egreso/egreso.component";

//INVENTARIOS
import { GrupoProductoComponent } from '../../inventarios/grupo-producto/grupo-producto.component';
import { ProductoComponent } from "../../inventarios/producto/producto.component";
import { KardexComponent } from "../../inventarios/kardex/kardex.component";
import { PromocionComponent } from "../../inventarios/promocion/promocion.component";
import { ProveedorProductoComponent } from '../../inventarios/proveedor-producto/proveedor-producto.component';
import { TransferenciaBodegaComponent } from '../../inventarios/transferencia-bodega/transferencia-bodega.component';
import { BodegaComponent } from "../../inventarios/bodega/bodega.component";
import { MedidaComponent } from '../../inventarios/medida/medida.component';
import { EquivalenciaMedidaComponent } from '../../inventarios/equivalencia-medida/equivalencia-medida.component';


import { TransportistaComponent } from '../../entregas/transportista/transportista.component';
import { VehiculoTransporteComponent } from '../../entregas/vehiculo-transporte/vehiculo-transporte.component';

//ACCESOS
import { UsuarioComponent } from '../../usuarios/usuario/usuario.component';
import { EmpresaComponent } from '../../usuarios/empresa/empresa.component';
import { EstablecimientoComponent } from '../../usuarios/establecimiento/establecimiento.component';
import { EstacionComponent } from '../../usuarios/estacion/estacion.component';
import { PerfilComponent } from '../../usuarios/perfil/perfil.component';

//CONFIGURACIONES

import { UbicacionComponent } from '../../configuraciones/ubicacion/ubicacion.component';
import { EstadoCivilComponent } from '../../configuraciones/estado-civil/estado-civil.component';
import { ImpuestoComponent } from '../../configuraciones/impuesto/impuesto.component';
import { TipoPagoComponent } from '../../configuraciones/tipo-pago/tipo-pago.component';
import { GeneroComponent } from '../../configuraciones/genero/genero.component';
import { ImportarComponent } from '../../configuraciones/importar/importar.component';
import { ExportarComponent } from '../../configuraciones/exportar/exportar.component';
import { TipoRetencionComponent } from '../../configuraciones/tipo-retencion/tipo-retencion.component';

//INDICADORES
import { DashboardComponent } from '../../componentes/pages/dashboard/dashboard.component';

//CONTABILIDAD
import { MovimientoContableComponent } from '../../contabilidad/movimiento-contable/movimiento-contable.component';
import { CuentaContableComponent } from '../../contabilidad/cuenta-contable/cuenta-contable.component';


@Injectable({
  providedIn: 'root'
})
export class SidebarItemsService {

  opciones = new Array<SidebarItem>();
  permisoOpciones: Permiso[] = [];

  constructor() { }

  llenarOpciones(Componente: Type<any>, tabTitulo: string, itemNombre: string, icoItem: string) {
    this.permisoOpciones.forEach(elemento => {
      if (elemento.operacion==itemNombre.toUpperCase() && elemento.habilitado==valores.si && elemento.estado==valores.activo){ //opciones sidebar
        this.opciones.push(new SidebarItem(Componente, tabTitulo, itemNombre, icoItem));
      }
    });
  }

  menuOpciones(tabNombre: string, sesion: Sesion): SidebarItem[] {
    this.opciones = [];
    this.permisoOpciones = sesion.usuario.perfil.permisos;
    if (tabNombre == modulos.modulo_clientes) {
      this.llenarOpciones(ClienteComponent, tabs.tab_cliente, items.item_cliente, icos.ico_cliente);
      this.llenarOpciones(SegmentoComponent, tabs.tab_segmento, items.item_segmento, icos.ico_segmento);
      this.llenarOpciones(GrupoClienteComponent, tabs.tab_grupo_cliente, items.item_grupo_cliente, icos.ico_grupo_cliente);
      this.llenarOpciones(FormaPagoComponent, tabs.tab_forma_pago, items.item_forma_pago, icos.ico_forma_pago);
      this.llenarOpciones(OrigenIngresoComponent, tabs.tab_origen_ingreso, items.item_origen_ingreso, icos.ico_origen_ingreso);
      this.llenarOpciones(PlazoCreditoComponent, tabs.tab_plazo_credito, items.item_plazo_credito, icos.ico_plazo_credito);
      this.llenarOpciones(CalificacionClienteComponent, tabs.tab_calificacion_cliente, items.item_calificacion_cliente, icos.ico_calificacion_cliente);
    }

    if (tabNombre == modulos.modulo_compras) {
      this.llenarOpciones(ProveedorComponent, tabs.tab_proveedor, items.item_proveedor, icos.ico_proveedor);
      this.llenarOpciones(FacturaCompraComponent, tabs.tab_factura_compra, items.item_factura_compra, icos.ico_factura_compra);     
      this.llenarOpciones(GrupoProveedorComponent, tabs.tab_grupo_proveedor, items.item_grupo_proveedor, icos.ico_grupo_proveedor);
    }

    if (tabNombre == modulos.modulo_ventas) {
      this.llenarOpciones(FacturaComponent, tabs.tab_factura, items.item_factura, icos.ico_factura);
      this.llenarOpciones(PedidoComponent, tabs.tab_pedido, items.item_pedido, icos.ico_pedido);
      this.llenarOpciones(ProformaComponent, tabs.tab_proforma, items.item_proforma, icos.ico_proforma);
      this.llenarOpciones(EgresoComponent, tabs.tab_egreso, items.item_egreso, icos.ico_egreso);
      this.llenarOpciones(TransportistaComponent, tabs.tab_transportista, items.item_transportista, icos.ico_transportista);
      this.llenarOpciones(VehiculoTransporteComponent, tabs.tab_vehiculo_transporte, items.item_vehiculo_transporte, icos.ico_vehiculo_transporte);
    }

    if (tabNombre == modulos.modulo_inventarios) {
      this.llenarOpciones(GrupoProductoComponent,tabs.tab_grupo_producto, items.item_grupo_producto, icos.ico_grupo_producto);
      this.llenarOpciones(ProductoComponent,tabs.tab_producto, items.item_producto, icos.ico_producto);
      this.llenarOpciones(KardexComponent,tabs.tab_kardex, items.item_kardex, icos.ico_kardex);
      this.llenarOpciones(PromocionComponent,tabs.tab_promocion,items.item_promocion,icos.ico_promocion);
      this.llenarOpciones(ProveedorProductoComponent,tabs.tab_proveedor_producto, items.item_proveedor_producto, icos.ico_proveedor_producto);
      this.llenarOpciones(TransferenciaBodegaComponent,tabs.tab_transferencia_bodega, items.item_transferencia_bodega, icos.ico_transferencia_bodega);
      this.llenarOpciones(BodegaComponent,tabs.tab_bodega, items.item_bodega, icos.ico_bodega);
      this.llenarOpciones(MedidaComponent,tabs.tab_medida, items.item_medida, icos.ico_medida);
      this.llenarOpciones(EquivalenciaMedidaComponent,tabs.tab_equivalencia_medida, items.item_equivalencia_medida, icos.ico_equivalencia_medida);
    }

    if (tabNombre == modulos.modulo_caja_bancos) {

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

    }

    if (tabNombre == modulos.modulo_accesos) {
      this.llenarOpciones(UsuarioComponent, tabs.tab_usuario, items.item_usuario, icos.ico_usuario);
      this.llenarOpciones(EmpresaComponent, tabs.tab_empresa, items.item_empresa, icos.ico_empresa);
      this.llenarOpciones(EstablecimientoComponent, tabs.tab_establecimiento, items.item_establecimiento, icos.ico_establecimiento);
      this.llenarOpciones(EstacionComponent, tabs.tab_estacion, items.item_estacion, icos.ico_estacion);
      this.llenarOpciones(PerfilComponent, tabs.tab_perfil, items.item_perfil, icos.ico_perfil);
    }

    if (tabNombre == modulos.modulo_configuracion) {
      this.llenarOpciones(UbicacionComponent, tabs.tab_ubicacion, items.item_ubicacion, icos.ico_ubicacion);
      this.llenarOpciones(EstadoCivilComponent, tabs.tab_estado_civil, items.item_estado_civil, icos.ico_estado_civil);
      this.llenarOpciones(ImpuestoComponent, tabs.tab_impuesto, items.item_impuesto, icos.ico_impuesto);
      this.llenarOpciones(TipoPagoComponent, tabs.tab_tipo_pago, items.item_tipo_pago, icos.ico_tipo_pago);
      this.llenarOpciones(TipoRetencionComponent, tabs.tab_tipo_retencion, items.item_tipo_retencion, icos.ico_tipo_retencion);
      this.llenarOpciones(GeneroComponent, tabs.tab_genero, items.item_genero, icos.ico_genero);
      this.llenarOpciones(ImportarComponent, tabs.tab_importacion, items.item_importacion, icos.ico_importacion);
      this.llenarOpciones(ExportarComponent, tabs.tab_exportacion, items.item_exportacion, icos.ico_exportacion);
    }
    
    if (tabNombre == modulos.modulo_estadisticas) {
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
