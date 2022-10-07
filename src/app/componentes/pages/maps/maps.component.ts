import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MouseEvent } from '@agm/core'; 
import { Coordenada } from "../../../modelos/configuracion/coordenada";


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  @Input() ubicacionGeografica: Coordenada;
  @Output() coordenadaSeleccionada = new EventEmitter();

  ubicacionCentral: Coordenada;
  ubicacionSeleccionada: Coordenada;

  mapTypeId: string = 'hybrid';

  //coordenadas: Coordenada[] = [];

  constructor() { }

  ngOnInit() {
    if (!this.ubicacionGeografica){
      this.ubicacionCentral = new Coordenada(-1.6705413480437092, -78.64974203645144);
    }else{
      this.ubicacionCentral = this.ubicacionGeografica;
      this.ubicacionSeleccionada = this.ubicacionGeografica;
    }
    //this.ubicacionSeleccionada = new Coordenada(-1.6705413480437092, -78.64974203645144);
  }

  mapClicked($event: MouseEvent){
    this.ubicacionSeleccionada = new Coordenada($event.coords.lat, $event.coords.lng);
    //console.log(this.ubicacionSeleccionada);
    this.coordenadaSeleccionada.emit(this.ubicacionSeleccionada);
    //this.coordenadas.push(this.ubicacionSeleccionada);
  }

  getCurrentPosition(){
    navigator.geolocation.getCurrentPosition(position => {
      this.ubicacionCentral = new Coordenada(position.coords.latitude, position.coords.longitude);
      //console.log(this.ubicacionCentral);
    })
  }

}
