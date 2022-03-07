import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { CollapseModule } from 'ngx-bootstrap/collapse'; // Es para el colapse a la derecha
//import { ToastrModule } from 'ngx-toastr';

// Componentes de Angular Material
import { MaterialModule } from './componentes/material-module';

import { AppComponent } from './app.component';
import { ModeloService } from './servicios/modelo.service';

// Componentes generales para las pestañas
import { TabContentComponent } from "./componentes/tab-content.component";
import { ContentContainerDirective } from "./componentes/content-container.directive";
import { TabService } from "./componentes/services/tab.service";

// Diseño de tabla editable
import { TablaEditableComponent } from './componentes/tabla-editable/tabla-editable.component';
import { EditableComponent } from './componentes/tabla-editable/editable/editable.component';
import { ViewModeDirective } from './componentes/tabla-editable/editable/view-mode.directive';
import { EditModeDirective } from './componentes/tabla-editable/editable/edit-mode.directive';
import { FocusableDirective } from './componentes/tabla-editable/focusable.directive';
import { EditableOnEnterDirective } from './componentes/tabla-editable/editable/edit-on-enter.directive';

//Tienda - Estructura: Cabecera y Menu
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

//Servicios
import { DatoAdicionalService} from './servicios/dato-adicional.service';
import { PlazoCreditoService} from './servicios/plazo-credito.service';
import { ImpuestoService } from './servicios/impuesto.service';
import { RetencionService } from './servicios/retencion-cliente.service';
import { TransportistaService } from './servicios/transportista.service';
import { UbicacionService } from './servicios/ubicacion.service';
import { TipoContribuyenteService } from './servicios/tipo-contribuyente.service';
import { VehiculoTransporteService } from './servicios/vehiculo-transporte.service';
import { EmpresaService } from './servicios/empresa.service';
import { EstablecimientoService } from './servicios/establecimiento.service';
import { PuntoVentaService } from './servicios/punto-venta.service';
import { UsuarioService } from './servicios/usuario.service';
import { ClienteService } from './servicios/cliente.service';
import { FacturaService } from './servicios/factura.service';
import { EquivalenciaMedidaService } from './servicios/equivalencia-medida.service';
import { GrupoProductoService } from './servicios/grupo-producto.service';

// Importar las Rutas
import { AppRoutingModule } from './app-routing.module';
import { RoutingComponents } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    TabContentComponent,
    ContentContainerDirective,
    TablaEditableComponent,
    EditableComponent,
    ViewModeDirective,
    EditModeDirective,
    FocusableDirective, 
    EditableOnEnterDirective,
    RoutingComponents
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    FlexLayoutModule,
    MaterialModule,
    AppRoutingModule,
    //CollapseModule.forRoot(),
    //ToastrModule.forRoot()
  ],
  providers: [DatoAdicionalService, PlazoCreditoService, ImpuestoService, RetencionService, ModeloService,
              TransportistaService, UbicacionService, TipoContribuyenteService, VehiculoTransporteService,
              EmpresaService, EstablecimientoService, PuntoVentaService, UsuarioService, DatePipe,
              ClienteService, FacturaService, TabService,
              EquivalenciaMedidaService, GrupoProductoService,
              {
                provide: LocationStrategy, 
                useClass: PathLocationStrategy
              }],
  bootstrap: [AppComponent],
  entryComponents: [ ]
})
export class AppModule {
}