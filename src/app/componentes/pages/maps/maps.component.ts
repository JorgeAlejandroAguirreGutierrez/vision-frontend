import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Coordenada } from "../../../modelos/configuracion/coordenada";


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  @Input() posicionGeografica: Coordenada;
  @Output() coordenadaSeleccionada = new EventEmitter();

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  posicionCentral: Coordenada;
  posicionSeleccionada: Coordenada;

  //mapTypeId: string = 'hybrid';

  // Configuración de Google Maps 
    center: google.maps.LatLngLiteral = {lat: -1.6705413480437092, lng: -78.64974203645144};
    markerPosiciones: google.maps.LatLngLiteral[] = [];
    zoom = 15;
    display?: google.maps.LatLngLiteral;
    options: google.maps.MapOptions = {
      mapTypeId: 'hybrid',
      zoomControl: true,
      scrollwheel: true,
      disableDoubleClickZoom: false,
      maxZoom: 20,
      minZoom: 12,
    };

  //coordenadas: Coordenada[] = [];

  constructor() { }

  ngOnInit() {
    if (!this.posicionGeografica){
      this.posicionCentral = new Coordenada(-1.6705413480437092, -78.64974203645144);
      //this.posicionSeleccionada = this.posicionCentral;
    }else{
      this.posicionCentral = this.posicionGeografica;
      this.posicionSeleccionada = this.posicionGeografica;
    }
    //this.posicionSeleccionada = new Coordenada(-1.6705413480437092, -78.64974203645144);
  }

  mapClicked($event: google.maps.MapMouseEvent ){
    this.posicionSeleccionada = new Coordenada($event.latLng.lat(), $event.latLng.lng());
    //console.log(this.posicionSeleccionada);
    this.infoWindow.close();
    this.coordenadaSeleccionada.emit(this.posicionSeleccionada);
    //this.coordenadas.push(this.ubicacionSeleccionada);
  }

  getCurrentPosition(){
    navigator.geolocation.getCurrentPosition(position => {
      this.posicionCentral = new Coordenada(position.coords.latitude, position.coords.longitude);
      //console.log(this.ubicacionCentral);
    })
  }

  zoomIn() {
    if (this.zoom < this.options.maxZoom) this.zoom++;
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom) this.zoom--;
  }

  addMarker(event: google.maps.MapMouseEvent) {
    this.markerPosiciones.push(event.latLng.toJSON());
  }

  openInfoWindow(marker: MapMarker) {
      this.infoWindow.open(marker);
  }
}
