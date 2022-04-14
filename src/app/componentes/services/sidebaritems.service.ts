import { Injectable, Type } from '@angular/core';
import * as constantes from '../../constantes';
import { SidebarItem } from "../../modelos/sidebar-item.model";
import { MapsComponent } from '../pages/maps/maps.component';

import { UsuarioComponent } from '../../usuarios/usuario/usuario.component';
import { UsuarioMostrarComponent } from '../../usuarios/usuario/usuario-leer/usuario-leer.component';
import { EstablecimientoComponent } from '../../usuarios/establecimiento/establecimiento.component';
import { EstablecimientoMostrarComponent } from '../../usuarios/establecimiento/establecimiento-leer/establecimiento-leer.component';
import { PuntoVentaComponent } from '../../usuarios/punto-venta/punto-venta.component';
import { PuntoVentaLeerComponent } from '../../usuarios/punto-venta/punto-.venta-leer/punto-venta-leer.component';

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
      this.llenarOpciones(ClienteComponent,constantes.tab_crear_cliente, constantes.item_crear_cliente, constantes.ico_crear_cliente);
      this.llenarOpciones(SegmentoComponent,constantes.tab_crear_segmento, constantes.item_crear_segmento, constantes.ico_crear_segmento);
      this.llenarOpciones(GrupoClienteComponent,constantes.tab_crear_grupo_cliente, constantes.item_crear_grupo_cliente, constantes.ico_crear_grupo_cliente);
      this.llenarOpciones(CalificacionClienteComponent,constantes.tab_crear_calificacion_cliente, constantes.item_crear_calificacion_cliente, constantes.ico_crear_calificacion_cliente);
      this.llenarOpciones(FormaPagoComponent, constantes.tab_crear_forma_pago, constantes.item_crear_forma_pago, constantes.ico_crear_forma_pago);
      this.llenarOpciones(OrigenIngresoComponent,constantes.tab_crear_origen_ingreso, constantes.item_crear_origen_ingreso, constantes.ico_crear_origen_ingreso);
      this.llenarOpciones(PlazoCreditoComponent,constantes.tab_crear_plazo_credito, constantes.item_crear_plazo_credito, constantes.ico_crear_plazo_credito);
      this.llenarOpciones(MapsComponent,constantes.tab_mapa_cliente, constantes.item_mapa_cliente,constantes.ico_mapa_cliente);
    }

    if (tabNombre == constantes.modulo_compras) {
      this.llenarOpciones(ProveedorComponent, constantes.tab_crear_proveedor, constantes.item_crear_proveedor, constantes.ico_crear_proveedor);
      this.llenarOpciones(FacturaCompraComponent, constantes.tab_crear_factura_compra, constantes.item_crear_factura_compra, constantes.ico_crear_factura_compra);
    }

    if (tabNombre == constantes.modulo_ventas) {
      this.llenarOpciones(FacturaComponent, constantes.tab_crear_factura, constantes.item_crear_factura, constantes.ico_crear_factura);
      this.llenarOpciones(PedidoComponent, constantes.tab_crear_pedido, constantes.item_crear_pedido, constantes.ico_crear_pedido);
      this.llenarOpciones(ProformaComponent, constantes.tab_crear_proforma, constantes.item_crear_proforma, constantes.ico_crear_proforma);
      this.llenarOpciones(EgresoComponent, constantes.tab_crear_egreso, constantes.item_crear_egreso, constantes.ico_crear_egreso);
      this.llenarOpciones(EgresoComponent, constantes.tab_crear_recaudacion, constantes.item_crear_recaudacion, constantes.ico_crear_recaudacion);
    }

    if (tabNombre == constantes.modulo_inventarios) {
      this.llenarOpciones(GrupoProductoComponent,constantes.tab_crear_grupo_producto, constantes.item_crear_grupo_producto, constantes.ico_crear_grupo_producto);
      this.llenarOpciones(ProductoComponent,constantes.tab_crear_producto, constantes.item_crear_producto, constantes.ico_crear_producto);
      this.llenarOpciones(PromocionComponent,constantes.tab_promociones,constantes.item_promociones,constantes.ico_promociones);
      this.llenarOpciones(ProveedorProductoComponent,constantes.tab_crear_proveedor_producto, constantes.item_crear_proveedor_producto, constantes.ico_crear_proveedor_producto);
      this.llenarOpciones(TransferenciaBodegaComponent,constantes.tab_crear_transferencia_bodega, constantes.item_crear_transferencia_bodega, constantes.ico_crear_transferencia_bodega);
      this.llenarOpciones(BodegaComponent,constantes.tab_crear_bodega, constantes.item_crear_bodega, constantes.ico_crear_bodega);
      this.llenarOpciones(MedidaComponent,constantes.tab_crear_medida, constantes.item_crear_medida, constantes.ico_crear_medida);
      this.llenarOpciones(EquivalenciaMedidaComponent,constantes.tab_crear_tabla_equivalencia_medida, constantes.item_crear_tabla_equivalencia_medida, constantes.ico_crear_tabla_equivalencia_medida);
    }

    if (tabNombre == constantes.modulo_contabilidad) {
      this.llenarOpciones(CuentaContableComponent, constantes.tab_crear_cuenta_contable, constantes.item_crear_cuenta_contable, constantes.ico_crear_cuenta_contable);
      this.llenarOpciones(MovimientoContableComponent, constantes.tab_crear_movimiento_contable, constantes.item_crear_movimiento_contable, constantes.ico_crear_movimiento_contable);
    }

    if (tabNombre == constantes.modulo_financiero) {
      this.llenarOpciones(FacturaComponent, constantes.tab_crear_factura, constantes.item_crear_factura, constantes.ico_crear_factura);
    }

    if (tabNombre == constantes.modulo_activos_fijos) {
      this.llenarOpciones(FacturaComponent, constantes.tab_crear_factura, constantes.item_crear_factura, constantes.ico_crear_factura);
    }

    if (tabNombre == constantes.modulo_talento_humano) {
      this.llenarOpciones(TransportistaComponent,constantes.tab_crear_transportista,constantes.item_crear_transportista, constantes.ico_crear_transportista);
    }

    if (tabNombre == constantes.modulo_produccion) {
      this.llenarOpciones(FacturaComponent, constantes.tab_crear_factura, constantes.item_crear_factura, constantes.ico_crear_factura);
    }

    if (tabNombre == constantes.modulo_importacion) {
      this.llenarOpciones(FacturaComponent, constantes.tab_crear_factura, constantes.item_crear_factura, constantes.ico_crear_factura);
    }

    if (tabNombre == constantes.modulo_configuracion) {
      this.llenarOpciones(EstadoCivilComponent,constantes.tab_crear_estado_civil, constantes.item_crear_estado_civil, constantes.ico_crear_estado_civil);
      this.llenarOpciones(GeneroComponent, constantes.tab_crear_genero, constantes.item_crear_genero, constantes.ico_crear_genero);
      this.llenarOpciones(TipoPagoComponent,constantes.tab_crear_tipo_pago, constantes.item_crear_tipo_pago, constantes.ico_crear_tipo_pago);
      //Integrar con TipoPago
      this.llenarOpciones(TransportistaComponent, constantes.tab_crear_transportista, constantes.item_crear_transportista, constantes.ico_crear_transportista);
      this.llenarOpciones(UbicacionComponent,constantes.tab_crear_ubicacion, constantes.item_crear_ubicacion, constantes.ico_crear_ubicacion);
      this.llenarOpciones(ImportarComponent, constantes.tab_crear_importacion, constantes.item_crear_importacion, constantes.ico_crear_importacion);
      this.llenarOpciones(ExportarComponent, constantes.tab_crear_exportacion, constantes.item_crear_exportacion, constantes.ico_crear_exportacion);
    }
    
    if (tabNombre == constantes.modulo_estadisticas) {
      this.llenarOpciones(FacturaComponent, constantes.tab_crear_factura, constantes.item_crear_factura, constantes.ico_crear_factura);
    }

    if (tabNombre == constantes.modulo_control) {
      this.llenarOpciones(FacturaComponent, constantes.tab_crear_factura, constantes.item_crear_factura, constantes.ico_crear_factura);
    }

    if (tabNombre == constantes.modulo_auditoria) {
      this.llenarOpciones(FacturaComponent, constantes.tab_crear_factura, constantes.item_crear_factura, constantes.ico_crear_factura);
    }

    if (tabNombre == constantes.modulo_usuarios) {
      this.llenarOpciones(UsuarioComponent, constantes.tab_crear_usuario, constantes.item_crear_usuario, constantes.ico_crear_usuario);
      // Integrar
      this.llenarOpciones(UsuarioMostrarComponent, constantes.tab_crear_usuario, constantes.item_crear_usuario, constantes.ico_crear_usuario);
      this.llenarOpciones(EstablecimientoComponent, constantes.tab_crear_establecimiento, constantes.item_crear_establecimiento, constantes.ico_crear_establecimiento);
      // Integrar
      this.llenarOpciones(EstablecimientoMostrarComponent,constantes.tab_crear_establecimiento, constantes.item_crear_establecimiento, constantes.ico_crear_establecimiento);
      this.llenarOpciones(PuntoVentaComponent,constantes.tab_crear_punto_venta, constantes.item_crear_punto_venta, constantes.ico_crear_punto_venta);
      // Integrar
      this.llenarOpciones(PuntoVentaLeerComponent,constantes.tab_crear_punto_venta, constantes.item_crear_punto_venta, constantes.ico_crear_punto_venta);
    }
    return this.opciones;
  }  
}
