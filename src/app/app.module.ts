import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Formato de Fecha
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { DatePickerFormatDirective } from "./componentes/comun/formato/date-picker-format.directive";

// Componentes de Angular Material
import { MaterialModule } from './modelos/comun/material-module';

// Componete para google maps
import { GoogleMapsModule } from '@angular/google-maps'; 

import { AppComponent } from './app.component';
import { ModeloService } from './servicios/administracion/modelo.service';

//Spinner
import { NgxSpinnerModule } from 'ngx-spinner';

// Componentes generales para las pestañas
import { TabContentComponent } from "./componentes/comun/tab/tab-content.component";
import { ContentContainerDirective } from "./componentes/comun/tab/content-container.directive";
import { TabService } from "./servicios/comun/tab/tab.service";
import { FormatoDecimalDirective } from "./componentes/comun/formato/FormatoDecimal.directive";

//Tienda - Estructura: Cabecera y Menu
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

//Servicios
import { UbicacionService } from './servicios/configuracion/ubicacion.service';
import { EmpresaService } from './servicios/usuario/empresa.service';
import { ClienteService } from './servicios/cliente/cliente.service';
import { FacturaCompraService } from './servicios/compra/factura-compra.service';
import { NotaCreditoCompraService } from './servicios/compra/nota-credito-compra.service';
import { NotaDebitoCompraService } from './servicios/compra/nota-debito-compra.service';
import { FacturaService } from './servicios/venta/factura.service';
import { NotaCreditoService } from './servicios/venta/nota-credito.service';
import { NotaDebitoService } from './servicios/venta/nota-debito.service';

// Importar las Rutas
import { AppRoutingModule } from './app-routing.module';
import { RoutingComponents } from './app-routing.module';

@NgModule({
    declarations: [
        AppComponent,
        TabContentComponent,
        ContentContainerDirective,
        FormatoDecimalDirective,
        DatePickerFormatDirective,
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
        MatDatepickerModule,
        MatMomentDateModule,
        GoogleMapsModule,
        NgxSpinnerModule,
        AppRoutingModule
    ],
    providers: [ModeloService, TabService, UbicacionService, EmpresaService, DatePipe,
        ClienteService, FacturaService, NotaCreditoService, NotaDebitoService, 
        FacturaCompraService, NotaCreditoCompraService, NotaDebitoCompraService, 
        {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }],   
    bootstrap: [AppComponent]
})
export class AppModule {
}