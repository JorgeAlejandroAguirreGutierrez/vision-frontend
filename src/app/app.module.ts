import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Formato de Fecha
import { DatePickerFormatDirective } from "./componentes/comun/formato/date-picker-format.directive";

// Componentes de Angular Material
import { MaterialModule } from './modelos/comun/material-module';

// Componete para google maps
import { GoogleMapsModule } from '@angular/google-maps'; 

//Spinner
import { NgxSpinnerModule } from 'ngx-spinner';

// Componentes generales para las pestañas
import { TabContentComponent } from "./componentes/comun/tab/tab-content.component";
import { ContentContainerDirective } from "./componentes/comun/tab/content-container.directive";
import { TabService } from "./servicios/comun/tab/tab.service";

//Tienda - Estructura: Cabecera y Menu
import { FlexLayoutModule } from '@angular/flex-layout';

// Importar las Rutas
import { AppRoutingModule } from './app-routing.module';
import { RoutingComponents } from './app-routing.module';

@NgModule({
    declarations: [
        AppComponent,
        TabContentComponent,
        ContentContainerDirective,
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
        FlexLayoutModule,
        MaterialModule,
        GoogleMapsModule,
        NgxSpinnerModule,
        AppRoutingModule
    ],
    providers: [TabService, DatePipe],   
    bootstrap: [AppComponent]
})
export class AppModule {
}