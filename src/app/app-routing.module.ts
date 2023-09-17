import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes comunes para todas las paginas
import { HeaderComponent } from './componentes/comun/header/header.component';
import { FooterComponent } from './componentes/comun/footer/footer.component';
import { NavbarComponent } from './componentes/comun/navbar/navbar.component';
import { SidebarComponent } from './componentes/comun/sidebar/sidebar.component';
import { ImportarComponent } from './componentes/configuracion/importar/importar.component';
import { ExportarComponent } from './componentes/configuracion/exportar/exportar.component';

// Componentes de Inicio
import { InicioSesionComponent, CambioCredencialesComponent } from './componentes/comun/inicio-sesion/inicio-sesion.component';
import { MainComponent } from './componentes/comun/main/main.component';
import { MenuComponent } from './componentes/comun/menu/menu.component';

// Molulo de Clientes
import { ClienteComponent, DialogoMapaComponent } from './componentes/cliente/cliente/cliente.component';
import { SegmentoComponent } from './componentes/cliente/segmento/segmento.component';
import { GrupoClienteComponent, DialogoGrupoClienteCuentaContableComponent } from './componentes/cliente/grupo-cliente/grupo-cliente.component';
import { TablaGrupoClienteCuentaContableComponent } from './componentes/cliente/grupo-cliente/tabla-grupo-cliente-cuenta-contable/tabla-grupo-cliente-cuenta-contable.component';
import { OrigenIngresoComponent } from './componentes/cliente/origen-ingreso/origen-ingreso.component';
import { CalificacionClienteComponent } from './componentes/cliente/calificacion-cliente/calificacion-cliente.component';
import { EstadoCivilComponent } from './componentes/configuracion/estado-civil/estado-civil.component';
import { RegimenComponent } from './componentes/configuracion/regimen/regimen.component';
import { PlazoCreditoComponent } from './componentes/cliente/plazo-credito/plazo-credito.component';
import { ImpuestoComponent } from './componentes/configuracion/impuesto/impuesto.component';
import { FormaPagoComponent } from './componentes/cliente/forma-pago/forma-pago.component';
import { SecuencialComponent } from './componentes/configuracion/secuencial/secuencial.component';

//Módulo de Compras
import { ProveedorComponent, DialogoMapaProveedorComponent } from './componentes/compra/proveedor/proveedor.component';
import { FacturaCompraComponent } from './componentes/compra/factura-compra/factura-compra.component';
import { GrupoProveedorComponent, DialogoGrupoProveedorCuentaContableComponent } from './componentes/compra/grupo-proveedor/grupo-proveedor.component';
import { NotaCreditoCompraComponent } from './componentes/compra/nota-credito-compra/nota-credito-compra.component';
import { NotaDebitoCompraComponent } from './componentes/compra/nota-debito-compra/nota-debito-compra.component';

// Módulo de Ventas
import { FacturaComponent } from './componentes/venta/factura/factura.component';
import { NotaCreditoComponent } from './componentes/venta/nota-credito/nota-credito.component';
import { NotaDebitoComponent } from './componentes/venta/nota-debito/nota-debito.component';
import { CierreCajaComponent } from './componentes/venta/cierre-caja/cierre-caja.component';

//Módulo de Recaudaciones
import { RecaudacionComponent } from './componentes/recaudacion/recaudacion/recaudacion.component';
import { RecaudacionNDComponent } from './componentes/recaudacion/recaudacion-nd/recaudacion-nd.component';

//Módulo de Entregas
import { GuiaRemisionComponent } from './componentes/entrega/guia-remision/guia-remision.component';
import { TransportistaComponent } from './componentes/entrega/transportista/transportista.component';
import { VehiculoComponent } from './componentes/entrega/vehiculo/vehiculo.component';

//Módulo de Inventarios
import { BodegaComponent } from './componentes/inventario/bodega/bodega.component';
import { MedidaComponent } from './componentes/inventario/medida/medida.component';
import { GrupoProductoComponent, DialogoGrupoProductoCuentaContableComponent } from './componentes/inventario/grupo-producto/grupo-producto.component';
import { TablaGrupoProductoCuentaContableComponent } from './componentes/inventario/grupo-producto/tabla-grupo-producto-cuenta-contable/tabla-grupo-producto-cuenta-contable.component';
import { TablaGrupoProductoComponent } from './componentes/inventario/producto/tabla-grupo-producto/tabla-grupo-producto.component';
import { KardexComponent } from './componentes/inventario/kardex/kardex.component';
import { FiltroSerie } from './pipes/filtro-serie';
import { ProductoComponent, DialogoGrupoProductoComponent } from './componentes/inventario/producto/producto.component';
import { PromocionComponent, DialogComponente } from './componentes/inventario/promocion/promocion.component';
import { TablaPromoIndComponent } from './componentes/inventario/promocion/tabla-promo-ind/tabla-promo-ind.component';
import { TablaPromoGrupComponent } from './componentes/inventario/promocion/tabla-promo-grup/tabla-promo-grup.component';
import { TablaComboComponent } from './componentes/inventario/promocion/tabla-combo/tabla-combo.component';
import { TablaComponenteComponent } from './componentes/inventario/promocion/tabla-componente/tabla-componente.component';
import { TipoRetencionComponent } from './componentes/configuracion/tipo-retencion/tipo-retencion.component';

//Modulo Caja Bancos
import { CuentaPropiaComponent } from './componentes/caja-banco/cuenta-propia/cuenta-propia.component';
import { BancoComponent } from './componentes/caja-banco/banco/banco.component';

//Módulo de Contabilidad
import { ContabilizacionComponent } from './componentes/contabilidad/contabilizacion/contabilizacion.component';
import { CuentaContableComponent } from './componentes/contabilidad/cuenta-contable/cuenta-contable.component';
import { MovimientoContableComponent } from './componentes/contabilidad/movimiento-contable/movimiento-contable.component';
import { TablaCuentaContableComponent } from './componentes/contabilidad/cuenta-contable/tabla-cuenta-contable/tabla-cuenta-contable.component';
import { TablaMovimientoContableComponent } from './componentes/contabilidad/movimiento-contable/tabla-movimiento-contable/tabla-movimiento-contable.component';

// Módulo de reportes
import { ReporteClienteComponent } from './componentes/reporte/cliente/reporte-cliente/reporte-cliente.component';
import { ReporteCompraComponent } from './componentes/reporte/compra/reporte-compra/reporte-compra.component';
import { ReporteVentaComponent } from './componentes/reporte/venta/reporte-venta/reporte-venta.component';
import { DetalleVentasComponent } from './componentes/reporte/venta/detalle-ventas/detalle-ventas.component';
import { CajaComponent } from './componentes/reporte/venta/caja/caja.component';
import { ReporteInventarioComponent } from './componentes/reporte/inventario/reporte-inventario/reporte-inventario.component';
import { KardexMercaderiaComponent } from './componentes/reporte/inventario/kardex-mercaderia/kardex-mercaderia.component';
import { ReporteCajaBancoComponent } from './componentes/reporte/caja-banco/reporte-caja-banco/reporte-caja-banco.component';
import { ReporteCuentaCobrarComponent } from './componentes/reporte/cuenta-cobrar/reporte-cuenta-cobrar/reporte-cuenta-cobrar.component';
import { ReporteCuentaPagarComponent } from './componentes/reporte/cuenta-pagar/reporte-cuenta-pagar/reporte-cuenta-pagar.component';
import { ReporteActivoFijoComponent } from './componentes/reporte/activo-fijo/reporte-activo-fijo/reporte-activo-fijo.component';
import { ReporteProduccionComponent } from './componentes/reporte/produccion/reporte-produccion/reporte-produccion.component';
import { ReporteContabilidadComponent } from './componentes/reporte/contabilidad/reporte-contabilidad/reporte-contabilidad.component';
import { ReporteTalentoHumanoComponent } from './componentes/reporte/talento-humano/reporte-talento-humano/reporte-talento-humano.component';
import { ReporteFinancieroComponent } from './componentes/reporte/financiero/reporte-financiero/reporte-financiero.component';
import { ReporteImportacionComponent } from './componentes/reporte/importacion/reporte-importacion/reporte-importacion.component';

// Módulo de Accesos
import { UsuarioComponent } from './componentes/usuario/usuario/usuario.component';
import { EmpresaComponent } from './componentes/usuario/empresa/empresa.component';
import { EstablecimientoComponent, DialogoMapaEstablecimientoComponent } from './componentes/usuario/establecimiento/establecimiento.component';
import { EstacionComponent } from './componentes/usuario/estacion/estacion.component';
import { PerfilComponent } from './componentes/usuario/perfil/perfil.component';
import { PermisoComponent } from './componentes/usuario/permiso/permiso.component';
import { PaqueteComponent } from './componentes/usuario/paquete/paquete.component';

//Módulo de Configuraciones
import { UbicacionComponent } from './componentes/configuracion/ubicacion/ubicacion.component';

// Modulo de Indicadores
import { DashboardComponent } from './componentes/indicador/dashboard/dashboard.component';
import { MapsComponent } from './componentes/comun/maps/maps.component';

// Otros - borrar al final
import { TablesComponent } from './componentes/pages/tables/tables.component';
import { FormsComponent } from './componentes/pages/forms/forms.component';
import { TypographyComponent } from './componentes/pages/typography/typography.component';

const routes: Routes = [
  { path: '', redirectTo: '/iniciosesion', pathMatch: 'full' },
  { path: 'index', redirectTo: '/iniciosesion', pathMatch: 'full' },
  { path: 'iniciosesion', component: InicioSesionComponent },
  { path: 'main', component: MainComponent },
  { path: 'menu', component: MenuComponent },
  // Rutas del Modulo de configuración
  {path: 'cliente/empresa', component: EmpresaComponent},
  // Rutas para el modulo de recaudación
  { path: 'recaudacion', component: RecaudacionComponent },
  // Rutas para el modulo de compras
  { path: 'proveedor', component: ProveedorComponent },
  // Rutas para el módulo de ventas
  { path: 'factura', component: FacturaComponent },
  // Estos no se usa, borrar al final
  { path: 'dashboard', component: DashboardComponent },
  { path: 'forms', component: FormsComponent },
  { path: 'maps', component: MapsComponent },
  { path: 'tables', component: TablesComponent },
  { path: 'typography', component: TypographyComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule],
    bootstrap: [ClienteComponent]
})
export class AppRoutingModule { }
export const RoutingComponents = [
  HeaderComponent,
  FooterComponent,
  NavbarComponent,
  SidebarComponent,
  ImportarComponent,
  ExportarComponent,
  // Inicio
  InicioSesionComponent,
  MainComponent,
  MenuComponent,
  CambioCredencialesComponent,
  // Clientes
  ClienteComponent,
  DialogoMapaComponent,
  SegmentoComponent,
  GrupoClienteComponent,
  DialogoGrupoClienteCuentaContableComponent,
  TablaGrupoClienteCuentaContableComponent,
  PlazoCreditoComponent,
  ImpuestoComponent,
  OrigenIngresoComponent,
  CalificacionClienteComponent,
  FormaPagoComponent,
  // Inventarios
  ProductoComponent,
  DialogoGrupoProductoComponent,
  GrupoProductoComponent,
  DialogoGrupoProductoCuentaContableComponent,
  TablaGrupoProductoCuentaContableComponent,
  DialogoGrupoProductoComponent,
  TablaGrupoProductoComponent,
  BodegaComponent,
  MedidaComponent,
  KardexComponent,
  PromocionComponent,
  DialogComponente,
  TablaPromoIndComponent,
  TablaPromoGrupComponent,
  TablaComboComponent,
  TablaComponenteComponent,
  FiltroSerie,
  // Entregas
  GuiaRemisionComponent,
  TransportistaComponent,
  VehiculoComponent,
  // Recaudación
  RecaudacionComponent,
  RecaudacionNDComponent,
  //Caja Bancos
  CuentaPropiaComponent,
  BancoComponent,
  //Ventas
  FacturaComponent,
  NotaCreditoComponent,
  NotaDebitoComponent,
  CierreCajaComponent,
  // Compras
  ProveedorComponent,
  DialogoMapaProveedorComponent,
  FacturaCompraComponent,
  GrupoProveedorComponent,
  DialogoGrupoProveedorCuentaContableComponent,
  NotaCreditoCompraComponent,
  NotaDebitoCompraComponent,
  // Contabilidad
  ContabilizacionComponent,
  CuentaContableComponent,
  MovimientoContableComponent,
  TablaCuentaContableComponent,
  TablaMovimientoContableComponent,
  //Reportes
  ReporteClienteComponent,
  ReporteCompraComponent,
  ReporteVentaComponent,
  DetalleVentasComponent,
  CajaComponent,
  ReporteInventarioComponent,
  KardexMercaderiaComponent,
  ReporteCajaBancoComponent,
  ReporteCuentaCobrarComponent,
  ReporteCuentaPagarComponent,
  ReporteActivoFijoComponent,
  ReporteProduccionComponent,
  ReporteContabilidadComponent,
  ReporteTalentoHumanoComponent,
  ReporteFinancieroComponent,
  ReporteImportacionComponent,

  //Usuarios
  UsuarioComponent,
  EmpresaComponent,
  EstablecimientoComponent,
  DialogoMapaEstablecimientoComponent,
  EstacionComponent,
  PerfilComponent,
  PermisoComponent,
  PaqueteComponent,
  //Configuración
  TipoRetencionComponent,
  UbicacionComponent,
  EstadoCivilComponent,
  RegimenComponent,
  SecuencialComponent,
  //Indicadores
  DashboardComponent,
  //otros
  TablesComponent,
  FormsComponent,
  MapsComponent,
  TypographyComponent
];