import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Coordenada } from "../../../modelos/configuracion/coordenada";
import { valores } from "../../../constantes";

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

  // Configuración de Google Maps 
  latInicial: number = valores.latCiudad;
  center: google.maps.LatLngLiteral = { lat: valores.latCiudad, lng: valores.lngCiudad };
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

  constructor() { }

  ngOnInit() {
    if (!this.posicionGeografica) {
      this.posicionCentral = new Coordenada(valores.latCiudad, valores.lngCiudad);
      //this.posicionSeleccionada = this.posicionCentral;
    } else {
      this.posicionCentral = this.posicionGeografica;
      this.posicionSeleccionada = this.posicionGeografica;
    }
  }

  mapClicked($event: google.maps.MapMouseEvent) {
    this.posicionSeleccionada = new Coordenada($event.latLng.lat(), $event.latLng.lng());
    this.infoWindow.close();
    this.coordenadaSeleccionada.emit(this.posicionSeleccionada);
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(position => {
      this.posicionCentral = new Coordenada(position.coords.latitude, position.coords.longitude);
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
