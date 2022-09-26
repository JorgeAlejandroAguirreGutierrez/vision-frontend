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
import { GrupoClienteComponent } from './clientes/grupo-cliente/grupo-cliente.component';
import { OrigenIngresoComponent } from './clientes/origen-ingreso/origen-ingreso.component';
import { CalificacionClienteComponent } from './clientes/calificacion-cliente/calificacion-cliente.component';
import { EstadoCivilComponent } from './configuraciones/estado-civil/estado-civil.component';
import { GeneroComponent } from './configuraciones/genero/genero.component';
import { PlazoCreditoComponent } from './clientes/plazo-credito/plazo-credito.component';
import { ImpuestoComponent } from './configuraciones/impuesto/impuesto.component';
import { FormaPagoComponent } from './clientes/forma-pago/forma-pago.component';
import { TipoPagoComponent } from './configuraciones/tipo-pago/tipo-pago.component';
import { MapsComponent } from './componentes/pages/maps/maps.component';

//Módulo de Inventarios
import { BodegaComponent } from './inventarios/bodega/bodega.component';
import { MedidaComponent } from './inventarios/medida/medida.component';
import { GrupoProductoComponent, DialogoMovimientoContableComponent } from './inventarios/grupo-producto/grupo-producto.component';
import { TablaGrupoProductoComponent } from './inventarios/grupo-producto/tabla-grupo-producto/tabla-grupo-producto.component';
import { KardexComponent } from './inventarios/kardex/kardex.component';
import { FiltroSerie } from './pipes/filtro-serie';
import { ProductoComponent, DialogoGrupoProductoComponent } from './inventarios/producto/producto.component';
import { PromocionComponent, DialogComponente } from './inventarios/promocion/promocion.component';
import { TablaPromoIndComponent } from './inventarios/promocion/tabla-promo-ind/tabla-promo-ind.component';
import { TablaPromoGrupComponent } from './inventarios/promocion/tabla-promo-grup/tabla-promo-grup.component';
import { TablaComboComponent } from './inventarios/promocion/tabla-combo/tabla-combo.component';
import { TablaComponenteComponent } from './inventarios/promocion/tabla-componente/tabla-componente.component';
import { ProveedorProductoComponent } from './inventarios/proveedor-producto/proveedor-producto.component';
import { TransferenciaBodegaComponent } from './inventarios/transferencia-bodega/transferencia-bodega.component';
import { EquivalenciaMedidaComponent } from './inventarios/equivalencia-medida/equivalencia-medida.component';

//Módulo de Recaudaciones
import { FinanciamientoComponent } from './recaudacion/financiamiento/financiamiento.component';
import { RecaudacionComponent } from './recaudacion/recaudacion/recaudacion.component';
import { BancoComponent } from './recaudacion/banco/banco.component';
import { DepositoTransferenciaComponent } from './recaudacion/deposito-transferencia/deposito-transferencia.component';
import { TarjetaCreditoComponent } from './recaudacion/tarjeta-credito/tarjeta-credito.component';
import { TarjetaDebitoComponent } from './recaudacion/tarjeta-debito/tarjeta-debito.component';
import { CompensacionComponent } from './recaudacion/compensacion/compensacion.component';
import { ChequeComponent } from './recaudacion/cheque/cheque.component';

// Módulo de Comprobantes
import { FacturaComponent } from './comprobantes/factura/factura.component';
import { EgresoComponent } from './comprobantes/egreso/egreso.component';
import { PedidoComponent } from './comprobantes/pedido/pedido.component';
import { ProformaComponent } from './comprobantes/proforma/proforma.component';

//Módulo de Entregas
import { EntregaComponent } from './entregas/entrega/entrega.component';
import { TransportistaComponent } from './entregas/transportista/transportista.component';
import { VehiculoTransporteComponent } from './entregas/vehiculo-transporte/vehiculo-transporte.component';

//Módulo de Compras
import { ProveedorComponent, DialogoMapaProveedorComponent } from './compras/proveedor/proveedor.component';
import { FacturaCompraComponent } from './compras/factura-compra/factura-compra.component';
import { PagoCompraComponent } from './compras/pago-compra/pago-compra.component';

//Módulo de Contabilidad
import { ContabilizacionComponent } from './contabilidad/contabilizacion/contabilizacion.component';
import { CuentaContableComponent } from './contabilidad/cuenta-contable/cuenta-contable.component';
import { MovimientoContableComponent } from './contabilidad/movimiento-contable/movimiento-contable.component';
import { TablaMovimientoContableComponent } from './contabilidad/movimiento-contable/tabla-movimiento-contable/tabla-movimiento-contable.component';

// Módulo de Usuarios
import { SesionComponent } from './usuarios/sesion/sesion.component';
import { PermisoComponent } from './usuarios/permiso/permiso.component';
import { UsuarioComponent } from './usuarios/usuario/usuario.component';
import { EstablecimientoComponent } from './usuarios/establecimiento/establecimiento.component';
import { PuntoVentaComponent } from './usuarios/punto-venta/punto-venta.component';
import { PerfilComponent } from './usuarios/perfil/perfil.component';

//Módulo de Configuraciones
import { EmpresaComponent, DialogoMapaEmpresaComponent } from './configuraciones/empresa/empresa.component';
import { UbicacionComponent } from './configuraciones/ubicacion/ubicacion.component';
import { DatoAdicionalComponent } from './configuraciones/dato-adicional/dato-adicional.component';

// Otros - borrar al final
import { DashboardComponent } from './componentes/pages/dashboard/dashboard.component';
import { TablesComponent } from './componentes/pages/tables/tables.component';
import { FormsComponent } from './componentes/pages/forms/forms.component';
import { TypographyComponent } from './componentes/pages/typography/typography.component';
import { TipoRetencionComponent } from './configuraciones/tipo-retencion/tipo-retencion.component';


const routes: Routes = [
  { path: '', redirectTo: '/iniciosesion', pathMatch: 'full' },
  { path: 'index', redirectTo: '/iniciosesion', pathMatch: 'full' },
  { path: 'iniciosesion', component: InicioSesionComponent },
  { path: 'main', component: MainComponent },
  { path: 'menu', component: MenuComponent },
  // Rutas del Modulo de configuración
  { path: 'cliente/ubicacion', component: UbicacionComponent },
  { path: 'cliente/empresa', component: EmpresaComponent },
  { path: 'cliente/datoadicional', component: DatoAdicionalComponent },
  // Rutas para el modulo de usuarios
  { path: 'usuario', component: UsuarioComponent },
  { path: 'usuario/establecimiento', component: EstablecimientoComponent },
  { path: 'usuario/puntoventa', component: PuntoVentaComponent },
  // Rutas para el modulo de clientes
  { path: 'cliente', component: ClienteComponent },
  { path: 'cliente/plazocredito', component: PlazoCreditoComponent },
  { path: 'cliente/impuesto', component: ImpuestoComponent },
  { path: 'cliente/grupocliente', component: GrupoClienteComponent },
  { path: 'cliente/genero', component: GeneroComponent },
  { path: 'cliente/estadocivil', component: EstadoCivilComponent },
  { path: 'cliente/calificacioncliente', component: CalificacionClienteComponent },
  { path: 'cliente/origeningreso', component: OrigenIngresoComponent },
  { path: 'cliente/formapago', component: FormaPagoComponent },
  { path: 'cliente/tipopago', component: TipoPagoComponent },
  // Rutas para el Modulo de inventarios
  { path: 'producto', component: ProductoComponent },
  { path: 'inventario/medida', component: MedidaComponent },
  { path: 'inventario/grupoproducto', component: GrupoProductoComponent },
  { path: 'promocion', component: PromocionComponent },
  { path: 'inventario/tablaequivalenciamedida', component: EquivalenciaMedidaComponent },
  // Rutas para el modulo de entregas
  { path: 'entrega', component: EntregaComponent },
  { path: 'cliente/vehiculotransporte', component: VehiculoTransporteComponent },
  // Rutas para el modulo de recaudación
  { path: 'recaudacion', component: RecaudacionComponent },
  // Rutas para el modulo de compras
  { path: 'proveedor', component: ProveedorComponent },
  { path: 'factura-compra', component: FacturaCompraComponent },
  // Rutas para el módulo de comprobantes
  { path: 'factura', component: FacturaComponent },
  // Estos no se usa, borrar al final
  { path: 'dashboard', component: DashboardComponent },
  { path: 'forms', component: FormsComponent },
  { path: 'tables', component: TablesComponent },
  { path: 'typography', component: TypographyComponent },
  { path: 'maps', component: MapsComponent },
  { path: 'proforma', component: ProformaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  entryComponents: [DialogoMapaComponent, DialogoMovimientoContableComponent,
    DialogoGrupoProductoComponent, CambioCredencialesComponent, UsuarioComponent, PuntoVentaComponent, TipoRetencionComponent,
    EstablecimientoComponent, ClienteComponent, GrupoClienteComponent, CalificacionClienteComponent, EstadoCivilComponent,
    GeneroComponent, OrigenIngresoComponent, PlazoCreditoComponent, FormaPagoComponent, TipoPagoComponent, BodegaComponent,
    DialogComponente, EquivalenciaMedidaComponent, MedidaComponent, FacturaComponent, ProformaComponent, ImportarComponent, ExportarComponent
  ],
  bootstrap: [ProformaComponent],
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
  PlazoCreditoComponent,
  ImpuestoComponent,
  OrigenIngresoComponent,
  CalificacionClienteComponent,
  EstadoCivilComponent,
  GeneroComponent,
  FormaPagoComponent,
  TipoPagoComponent,
  // Inventarios
  ProductoComponent,
  DialogoGrupoProductoComponent,
  GrupoProductoComponent,
  DialogoMovimientoContableComponent,
  TablaGrupoProductoComponent,
  BodegaComponent,
  MedidaComponent,
  KardexComponent,
  ProveedorProductoComponent,
  TransferenciaBodegaComponent,
  PromocionComponent,
  DialogComponente,
  TablaPromoIndComponent,
  TablaPromoGrupComponent,
  TablaComboComponent,
  TablaComponenteComponent,
  EquivalenciaMedidaComponent,
  FiltroSerie,
  // Entregas
  EntregaComponent,
  TransportistaComponent,
  VehiculoTransporteComponent,
  // Recaudación
  FinanciamientoComponent,
  RecaudacionComponent,
  BancoComponent,
  DepositoTransferenciaComponent,
  TarjetaCreditoComponent,
  TarjetaDebitoComponent,
  CompensacionComponent,
  ChequeComponent,
  //Comprobantes
  FacturaComponent,
  EgresoComponent,
  PedidoComponent,
  ProformaComponent,
  // Compras
  ProveedorComponent,
  DialogoMapaProveedorComponent,
  FacturaCompraComponent,
  PagoCompraComponent,
  // Contabilidad
  ContabilizacionComponent,
  CuentaContableComponent,
  MovimientoContableComponent,
  TablaMovimientoContableComponent,
  //Usuarios
  SesionComponent,
  PermisoComponent,
  UsuarioComponent,
  EstablecimientoComponent,
  PuntoVentaComponent,
  PerfilComponent,
  // configuración
  EmpresaComponent,
  DialogoMapaEmpresaComponent,
  DatoAdicionalComponent,
  TipoRetencionComponent,
  UbicacionComponent,
  //otros
  DashboardComponent,
  TablesComponent,
  FormsComponent,
  TypographyComponent,
  MapsComponent
];