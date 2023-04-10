import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Componentes de Angular Material
import { MaterialModule } from './componentes/material-module';

// Componete para google maps
import { GoogleMapsModule } from '@angular/google-maps'; 

import { AppComponent } from './app.component';
import { ModeloService } from './servicios/administracion/modelo.service';

// Componentes generales para las pestañas
import { TabContentComponent } from "./componentes/tab/tab-content.component";
import { ContentContainerDirective } from "./componentes/tab/content-container.directive";
import { TabService } from "./servicios/componente/tab/tab.service";

//Tienda - Estructura: Cabecera y Menu
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

//Servicios
import { PlazoCreditoService} from './servicios/cliente/plazo-credito.service';
import { ImpuestoService } from './servicios/inventario/impuesto.service';
import { RetencionService } from './servicios/cliente/retencion-cliente.service';
import { TransportistaService } from './servicios/entrega/transportista.service';
import { UbicacionService } from './servicios/configuracion/ubicacion.service';
import { TipoContribuyenteService } from './servicios/cliente/tipo-contribuyente.service';
import { VehiculoTransporteService } from './servicios/entrega/vehiculo-transporte.service';
import { EmpresaService } from './servicios/usuario/empresa.service';
import { EstablecimientoService } from './servicios/usuario/establecimiento.service';
import { EstacionService } from './servicios/usuario/estacion.service';
import { UsuarioService } from './servicios/usuario/usuario.service';
import { ClienteService } from './servicios/cliente/cliente.service';
import { FacturaService } from './servicios/venta/factura.service';
import { GrupoProductoService } from './servicios/inventario/grupo-producto.service';
import { FacturaCompraService } from './servicios/compra/factura-compra.service';
import { NotaCreditoCompraService } from './servicios/compra/nota-credito-compra.service';
import { NotaCreditoVentaService } from './servicios/venta/nota-credito-venta.service';
import { NotaDebitoCompraService } from './servicios/compra/nota-debito-compra.service';
import { NotaDebitoVentaService } from './servicios/venta/nota-debito-venta.service';

// Importar las Rutas
import { AppRoutingModule } from './app-routing.module';
import { RoutingComponents } from './app-routing.module';
import { TipoRetencionService } from './servicios/configuracion/tipo-retencion.service';

@NgModule({
    declarations: [
        AppComponent,
        TabContentComponent,
        ContentContainerDirective,
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
        GoogleMapsModule,
        AppRoutingModule
    ],
    providers: [PlazoCreditoService, ImpuestoService, RetencionService, ModeloService,
        TransportistaService, UbicacionService, TipoContribuyenteService, VehiculoTransporteService,
        EmpresaService, EstablecimientoService, EstacionService, UsuarioService, DatePipe,
        ClienteService, FacturaService, FacturaCompraService, TipoRetencionService, TabService, GrupoProductoService,
        NotaCreditoCompraService, NotaCreditoVentaService, NotaDebitoCompraService, NotaDebitoVentaService,
        {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }],
    bootstrap: [AppComponent]
})
export class AppModule {
}