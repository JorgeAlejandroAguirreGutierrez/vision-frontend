import { Injectable, Type } from '@angular/core';
import * as constantes from '../../constantes';
import { SidebarItem } from "../../modelos/sidebar-item.model";
import { MapsComponent } from '../pages/maps/maps.component';

import { UsuarioComponent } from '../../usuarios/usuario/usuario.component';
import { EstablecimientoComponent } from '../../usuarios/establecimiento/establecimiento.component';
import { PuntoVentaComponent } from '../../usuarios/punto-venta/punto-venta.component';

import { ClienteComponent } from "../../clientes/cliente/cliente.component";
import { GrupoClienteComponent } from '../../clientes/grupo-cliente/grupo-cliente.component';
import { CalificacionClienteComponent } from '../../clientes/calificacion-cliente/calificacion-cliente.component';
import { FormaPagoComponent } from '../../clientes/forma-pago/forma-pago.component';
import { OrigenIngresoComponent } from '../../clientes/origen-ingreso/origen-ingreso.component';
import { PlazoCreditoComponent } from '../../clientes/plazo-credito/plazo-credito.component';

import { ProveedorComponent } from '../../compras/proveedor/proveedor.component';
import { FacturaCompraComponent } from '../../compras/factura-compra/factura-compra.component';

import { FacturaComponent } from "../../comprobantes/factura/factura.component";
import { PedidoComponent } from "../../comprobantes/pedido/pedido.component";
import { ProformaComponent } from "../../comprobantes/proforma/proforma.component";
import { EgresoComponent } from "../../comprobantes/egreso/egreso.component";

import { ProductoComponent } from "../../inventarios/producto/producto.component";
import { PromocionComponent } from "../../inventarios/promocion/promocion.component";
import { ProveedorProductoComponent } from '../../inventarios/proveedor-producto/proveedor-producto.component';
import { TransferenciaBodegaComponent } from '../../inventarios/transferencia-bodega/transferencia-bodega.component';
import { BodegaComponent } from "../../inventarios/bodega/bodega.component";

import { TransportistaComponent } from '../../entregas/transportista/transportista.component';

import { MedidaComponent } from '../../inventarios/medida/medida.component';
import { EquivalenciaMedidaComponent } from '../../inventarios/equivalencia-medida/equivalencia-medida.component';
import { GrupoProductoComponent } from '../../inventarios/grupo-producto/grupo-producto.component';

import { GeneroComponent } from '../../configuraciones/genero/genero.component';
import { UbicacionComponent } from '../../configuraciones/ubicacion/ubicacion.component';
import { TipoPagoComponent } from '../../configuraciones/tipo-pago/tipo-pago.component';
import { EstadoCivilComponent } from '../../configuraciones/estado-civil/estado-civil.component';
import { ImportarComponent } from '../../configuraciones/importar/importar.component';
import { ExportarComponent } from '../../configuraciones/exportar/exportar.component';

import { SegmentoComponent } from '../../clientes/segmento/segmento.component';
import { MovimientoContableComponent } from '../../contabilidad/movimiento-contable/movimiento-contable.component';
import { CuentaContableComponent } from '../../contabilidad/cuenta-contable/cuenta-contable.component';
import { TipoRetencionComponent } from 'src/app/configuraciones/tipo-retencion/tipo-retencion.component';

@Injectable({
  providedIn: 'root'
})
export class SidebarItemsService {

  opciones = new Array<SidebarItem>();

  constructor() { }

  // Para llenar las opciones del sideBar
  llenarOpciones(Componente: Type<any>, tabTitulo: string, itemNombre: string, icoItem: string) {
    this.opciones.push(new SidebarItem(Componente, tabTitulo, itemNombre, icoItem));
  }

  menuOpciones(tabNombre: string): SidebarItem[] {
    this.opciones = [];
    if (tabNombre == constantes.modulo_clientes) {
      this.llenarOpciones(ClienteComponent,constantes.tab_cliente, constantes.item_cliente, constantes.ico_cliente);
      this.llenarOpciones(SegmentoComponent,constantes.tab_segmento, constantes.item_segmento, constantes.ico_segmento);
      this.llenarOpciones(GrupoClienteComponent,constantes.tab_grupo_cliente, constantes.item_grupo_cliente, constantes.ico_grupo_cliente);
      this.llenarOpciones(CalificacionClienteComponent,constantes.tab_calificacion_cliente, constantes.item_calificacion_cliente, constantes.ico_calificacion_cliente);
      this.llenarOpciones(FormaPagoComponent, constantes.tab_forma_pago, constantes.item_forma_pago, constantes.ico_forma_pago);
      this.llenarOpciones(OrigenIngresoComponent,constantes.tab_origen_ingreso, constantes.item_origen_ingreso, constantes.ico_origen_ingreso);
      this.llenarOpciones(PlazoCreditoComponent,constantes.tab_plazo_credito, constantes.item_plazo_credito, constantes.ico_plazo_credito);
      this.llenarOpciones(MapsComponent,constantes.tab_mapa_cliente, constantes.item_mapa_cliente,constantes.ico_mapa_cliente);
    }

    if (tabNombre == constantes.modulo_compras) {
      this.llenarOpciones(ProveedorComponent, constantes.tab_proveedor, constantes.item_proveedor, constantes.ico_proveedor);
      this.llenarOpciones(FacturaCompraComponent, constantes.tab_factura_compra, constantes.item_factura_compra, constantes.ico_factura_compra);
    }

    if (tabNombre == constantes.modulo_ventas) {
      this.llenarOpciones(FacturaComponent, constantes.tab_factura, constantes.item_factura, constantes.ico_factura);
      this.llenarOpciones(PedidoComponent, constantes.tab_pedido, constantes.item_pedido, constantes.ico_pedido);
      this.llenarOpciones(ProformaComponent, constantes.tab_proforma, constantes.item_proforma, constantes.ico_proforma);
      this.llenarOpciones(EgresoComponent, constantes.tab_egreso, constantes.item_egreso, constantes.ico_egreso);
      this.llenarOpciones(EgresoComponent, constantes.tab_recaudacion, constantes.item_recaudacion, constantes.ico_recaudacion);
    }

    if (tabNombre == constantes.modulo_inventarios) {
      this.llenarOpciones(GrupoProductoComponent,constantes.tab_grupo_producto, constantes.item_grupo_producto, constantes.ico_grupo_producto);
      this.llenarOpciones(ProductoComponent,constantes.tab_producto, constantes.item_producto, constantes.ico_producto);
      this.llenarOpciones(PromocionComponent,constantes.tab_promociones,constantes.item_promociones,constantes.ico_promociones);
      this.llenarOpciones(ProveedorProductoComponent,constantes.tab_proveedor_producto, constantes.item_proveedor_producto, constantes.ico_proveedor_producto);
      this.llenarOpciones(TransferenciaBodegaComponent,constantes.tab_transferencia_bodega, constantes.item_transferencia_bodega, constantes.ico_transferencia_bodega);
      this.llenarOpciones(BodegaComponent,constantes.tab_bodega, constantes.item_bodega, constantes.ico_bodega);
      this.llenarOpciones(MedidaComponent,constantes.tab_medida, constantes.item_medida, constantes.ico_medida);
      this.llenarOpciones(EquivalenciaMedidaComponent,constantes.tab_tabla_equivalencia_medida, constantes.item_tabla_equivalencia_medida, constantes.ico_tabla_equivalencia_medida);
    }

    if (tabNombre == constantes.modulo_contabilidad) {
      this.llenarOpciones(CuentaContableComponent, constantes.tab_cuenta_contable, constantes.item_cuenta_contable, constantes.ico_cuenta_contable);
      this.llenarOpciones(MovimientoContableComponent, constantes.tab_movimiento_contable, constantes.item_movimiento_contable, constantes.ico_movimiento_contable);
    }

    if (tabNombre == constantes.modulo_financiero) {
      this.llenarOpciones(FacturaComponent, constantes.tab_factura, constantes.item_factura, constantes.ico_factura);
    }

    if (tabNombre == constantes.modulo_activos_fijos) {
      this.llenarOpciones(FacturaComponent, constantes.tab_factura, constantes.item_factura, constantes.ico_factura);
    }

    if (tabNombre == constantes.modulo_talento_humano) {
      this.llenarOpciones(TransportistaComponent,constantes.tab_transportista,constantes.item_transportista, constantes.ico_transportista);
    }

    if (tabNombre == constantes.modulo_produccion) {
      this.llenarOpciones(FacturaComponent, constantes.tab_factura, constantes.item_factura, constantes.ico_factura);
    }

    if (tabNombre == constantes.modulo_importacion) {
      this.llenarOpciones(FacturaComponent, constantes.tab_factura, constantes.item_factura, constantes.ico_factura);
    }

    if (tabNombre == constantes.modulo_configuracion) {
      this.llenarOpciones(EstadoCivilComponent,constantes.tab_estado_civil, constantes.item_estado_civil, constantes.ico_estado_civil);
      this.llenarOpciones(GeneroComponent, constantes.tab_genero, constantes.item_genero, constantes.ico_genero);
      this.llenarOpciones(TipoPagoComponent,constantes.tab_tipo_pago, constantes.item_tipo_pago, constantes.ico_tipo_pago);
      this.llenarOpciones(TransportistaComponent, constantes.tab_transportista, constantes.item_transportista, constantes.ico_transportista);
      this.llenarOpciones(UbicacionComponent,constantes.tab_ubicacion, constantes.item_ubicacion, constantes.ico_ubicacion);
      this.llenarOpciones(TipoRetencionComponent,constantes.tab_tipo_retencion, constantes.item_tipo_retencion, constantes.ico_tipo_retencion);
      this.llenarOpciones(ImportarComponent, constantes.tab_importacion, constantes.item_importacion, constantes.ico_importacion);
      this.llenarOpciones(ExportarComponent, constantes.tab_exportacion, constantes.item_exportacion, constantes.ico_exportacion);
    }
    
    if (tabNombre == constantes.modulo_estadisticas) {
      this.llenarOpciones(FacturaComponent, constantes.tab_factura, constantes.item_factura, constantes.ico_factura);
    }

    if (tabNombre == constantes.modulo_control) {
      this.llenarOpciones(FacturaComponent, constantes.tab_factura, constantes.item_factura, constantes.ico_factura);
    }

    if (tabNombre == constantes.modulo_auditoria) {
      this.llenarOpciones(FacturaComponent, constantes.tab_factura, constantes.item_factura, constantes.ico_factura);
    }

    if (tabNombre == constantes.modulo_usuarios) {
      this.llenarOpciones(UsuarioComponent, constantes.tab_usuario, constantes.item_usuario, constantes.ico_usuario);
      // Integrar
      this.llenarOpciones(EstablecimientoComponent, constantes.tab_establecimiento, constantes.item_establecimiento, constantes.ico_establecimiento);
      // Integrar
      this.llenarOpciones(PuntoVentaComponent,constantes.tab_punto_venta, constantes.item_punto_venta, constantes.ico_punto_venta);
    }
    return this.opciones;
  }  
}
