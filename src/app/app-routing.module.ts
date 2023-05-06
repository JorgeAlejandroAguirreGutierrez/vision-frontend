import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes comunes para todas las paginas
import { HeaderComponent } from './componentes/header/header.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { SidebarComponent } from './componentes/sidebar/sidebar.component';
import { ImportarComponent } from './configuraciones/importar/importar.component';
import { ExportarComponent } from './configuraciones/exportar/exportar.component';

// Componentes de Inicio
import { InicioSesionComponent, CambioCredencialesComponent } from './componentes/inicio-sesion/inicio-sesion.component';
import { MainComponent } from './componentes/main/main.component';
import { MenuComponent } from './componentes/menu/menu.component';

// Molulo de Clientes
import { ClienteComponent, DialogoMapaComponent } from './clientes/cliente/cliente.component';
import { SegmentoComponent } from './clientes/segmento/segmento.component';
import { GrupoClienteComponent, DialogoGrupoClienteCuentaContableComponent } from './clientes/grupo-cliente/grupo-cliente.component';
import { TablaGrupoClienteCuentaContableComponent } from './clientes/grupo-cliente/tabla-grupo-cliente-cuenta-contable/tabla-grupo-cliente-cuenta-contable.component';
import { OrigenIngresoComponent } from './clientes/origen-ingreso/origen-ingreso.component';
import { CalificacionClienteComponent } from './clientes/calificacion-cliente/calificacion-cliente.component';
import { EstadoCivilComponent } from './configuraciones/estado-civil/estado-civil.component';
import { RegimenComponent } from './configuraciones/regimen/regimen.component';
import { PlazoCreditoComponent } from './clientes/plazo-credito/plazo-credito.component';
import { ImpuestoComponent } from './configuraciones/impuesto/impuesto.component';
import { FormaPagoComponent } from './clientes/forma-pago/forma-pago.component';
import { SecuencialComponent } from './configuraciones/secuencial/secuencial.component';

//Módulo de Inventarios
import { BodegaComponent } from './inventarios/bodega/bodega.component';
import { MedidaComponent } from './inventarios/medida/medida.component';
import { GrupoProductoComponent, DialogoGrupoProductoCuentaContableComponent } from './inventarios/grupo-producto/grupo-producto.component';
import { TablaGrupoProductoCuentaContableComponent } from './inventarios/grupo-producto/tabla-grupo-producto-cuenta-contable/tabla-grupo-producto-cuenta-contable.component';
import { TablaGrupoProductoComponent } from './inventarios/producto/tabla-grupo-producto/tabla-grupo-producto.component';
import { KardexComponent } from './inventarios/kardex/kardex.component';
import { FiltroSerie } from './pipes/filtro-serie';
import { ProductoComponent, DialogoGrupoProductoComponent } from './inventarios/producto/producto.component';
import { PromocionComponent, DialogComponente } from './inventarios/promocion/promocion.component';
import { TablaPromoIndComponent } from './inventarios/promocion/tabla-promo-ind/tabla-promo-ind.component';
import { TablaPromoGrupComponent } from './inventarios/promocion/tabla-promo-grup/tabla-promo-grup.component';
import { TablaComboComponent } from './inventarios/promocion/tabla-combo/tabla-combo.component';
import { TablaComponenteComponent } from './inventarios/promocion/tabla-componente/tabla-componente.component';
import { TipoRetencionComponent } from './configuraciones/tipo-retencion/tipo-retencion.component';

//Modulo Caja Bancos
import { CuentaPropiaComponent } from './caja-bancos/cuenta-propia/cuenta-propia.component';
import { BancoComponent } from './caja-bancos/banco/banco.component';

// Módulo de Ventas
import { FacturaComponent } from './ventas/factura/factura.component';
import { NotaCreditoVentaComponent } from './ventas/nota-credito-venta/nota-credito-venta.component';
import { NotaDebitoVentaComponent } from './ventas/nota-debito-venta/nota-debito-venta.component';

//Módulo de Recaudaciones
import { RecaudacionComponent } from './recaudacion/recaudacion/recaudacion.component';
import { RecaudacionNotaDebitoComponent } from './recaudacion/recaudacion-nota-debito/recaudacion-nota-debito.component';

//Módulo de Entregas
import { GuiaRemisionComponent } from './entregas/guia-remision/guia-remision.component';
import { TransportistaComponent } from './entregas/transportista/transportista.component';
import { VehiculoTransporteComponent } from './entregas/vehiculo-transporte/vehiculo-transporte.component';

//Módulo de Compras
import { ProveedorComponent, DialogoMapaProveedorComponent } from './compras/proveedor/proveedor.component';
import { FacturaCompraComponent } from './compras/factura-compra/factura-compra.component';
import { GrupoProveedorComponent, DialogoGrupoProveedorCuentaContableComponent } from './compras/grupo-proveedor/grupo-proveedor.component';
import { NotaCreditoCompraComponent } from './compras/nota-credito-compra/nota-credito-compra.component';
import { NotaDebitoCompraComponent } from './compras/nota-debito-compra/nota-debito-compra.component';

//Módulo de Contabilidad
import { ContabilizacionComponent } from './contabilidad/contabilizacion/contabilizacion.component';
import { CuentaContableComponent } from './contabilidad/cuenta-contable/cuenta-contable.component';
import { MovimientoContableComponent } from './contabilidad/movimiento-contable/movimiento-contable.component';
import { TablaCuentaContableComponent } from './contabilidad/cuenta-contable/tabla-cuenta-contable/tabla-cuenta-contable.component';
import { TablaMovimientoContableComponent } from './contabilidad/movimiento-contable/tabla-movimiento-contable/tabla-movimiento-contable.component';

// Módulo de Usuarios
import { UsuarioComponent } from './usuarios/usuario/usuario.component';
import { EmpresaComponent } from './usuarios/empresa/empresa.component';
import { EstablecimientoComponent, DialogoMapaEstablecimientoComponent } from './usuarios/establecimiento/establecimiento.component';
import { EstacionComponent } from './usuarios/estacion/estacion.component';
import { PerfilComponent } from './usuarios/perfil/perfil.component';
import { PermisoComponent } from './usuarios/permiso/permiso.component';

//Módulo de Configuraciones
import { UbicacionComponent } from './configuraciones/ubicacion/ubicacion.component';

// Otros - borrar al final
import { DashboardComponent } from './componentes/pages/dashboard/dashboard.component';
import { TablesComponent } from './componentes/pages/tables/tables.component';
import { FormsComponent } from './componentes/pages/forms/forms.component';
import { MapsComponent } from './componentes/pages/maps/maps.component';
import { TypographyComponent } from './componentes/pages/typography/typography.component';


const routes: Routes = [
  { path: '', redirectTo: '/iniciosesion', pathMatch: 'full' },
  { path: 'index', redirectTo: '/iniciosesion', pathMatch: 'full' },
  { path: 'iniciosesion', component: InicioSesionComponent },
  { path: 'main', component: MainComponent },
  { path: 'menu', component: MenuComponent },
  // Rutas del Modulo de configuración
  {path: 'cliente/empresa', component: EmpresaComponent},
  // Rutas para el modulo de usuarios
  { path: 'usuario', component: UsuarioComponent },
  { path: 'usuario/establecimiento', component: EstablecimientoComponent },
  { path: 'usuario/estacion', component: EstacionComponent },
  // Rutas para el modulo de clientes
  { path: 'cliente', component: ClienteComponent },
  { path: 'cliente/grupocliente', component: GrupoClienteComponent },
  { path: 'cliente/calificacioncliente', component: CalificacionClienteComponent },
  { path: 'cliente/origeningreso', component: OrigenIngresoComponent },
  { path: 'cliente/formapago', component: FormaPagoComponent },
  // Rutas para el Modulo de inventarios
  { path: 'producto', component: ProductoComponent },
  { path: 'inventario/medida', component: MedidaComponent },
  { path: 'inventario/grupoproducto', component: GrupoProductoComponent },
  { path: 'promocion', component: PromocionComponent },
  // Rutas para el modulo de entregas
  { path: 'guiaremision', component: GuiaRemisionComponent },
  { path: 'cliente/vehiculotransporte', component: VehiculoTransporteComponent },
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
  VehiculoTransporteComponent,
  // Recaudación
  RecaudacionComponent,
  RecaudacionNotaDebitoComponent,
  //Caja Bancos
  CuentaPropiaComponent,
  BancoComponent,
  //Ventas
  FacturaComponent,
  NotaCreditoVentaComponent,
  NotaDebitoVentaComponent,
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
  //Usuarios
  UsuarioComponent,
  EmpresaComponent,
  EstablecimientoComponent,
  DialogoMapaEstablecimientoComponent,
  EstacionComponent,
  PerfilComponent,
  PermisoComponent,
  // configuración
  TipoRetencionComponent,
  UbicacionComponent,
  EstadoCivilComponent,
  RegimenComponent,
  SecuencialComponent,
  //otros
  DashboardComponent,
  TablesComponent,
  FormsComponent,
  MapsComponent,
  TypographyComponent
];