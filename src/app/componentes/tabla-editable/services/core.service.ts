import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { PeriodicElement } from '../models/periodic';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  list: PeriodicElement[] = [
    { position: 1, medida:'Unidad', segmento:'Mayorista', costo:4.001, ganancia: 16, precio: 4.0079, pvp: 4.1279, pvpf: 4.1279, rendimiento: 16, utilidad: 4.0079 },
    { position: 2, medida:'Unidad', segmento:'Distribuidor', costo:4.001, ganancia: 22, precio: 4.0026, pvp: 4.1226, pvpf: 4.1226, rendimiento: 22, utilidad: 4.1226 },
    { position: 3, medida:'Unidad', segmento:'Tarjeta de crédito', costo:4.001, ganancia: 24, precio: 3.941, pvp: 3.1279, pvpf: 3.1279, rendimiento: 24, utilidad: 3.1279 },
    { position: 4, medida:'Unidad', segmento:'Cliente Final', costo:4.001, ganancia: 26, precio: 3.0122, pvp: 3.1279, pvpf: 3.1279, rendimiento: 26, utilidad: 3.1279 },
    { position: 5, medida:'Quintal', segmento:'Mayorista', costo:12.006, ganancia: 16, precio: 12.811, pvp: 12.1279, pvpf: 11.1279, rendimiento: 16, utilidad: 12.1279 },
    { position: 6, medida:'Quintal', segmento:'Distribuidor', costo:12.006, ganancia: 22, precio: 12.0107, pvp: 12.1279, pvpf: 12.1279, rendimiento: 22, utilidad: 12.1279 },
    { position: 7, medida:'Quintal', segmento:'Tarjeta de crédito', costo:12.006, ganancia: 24, precio: 12.0067, pvp: 12.1279, pvpf: 14.1279, rendimiento: 24, utilidad: 12.1279 },
    { position: 8, medida:'Quintal', segmento:'Cliente Final', costo:12.006, ganancia: 26, precio: 12.9994, pvp: 12.1279, pvpf: 16.1279, rendimiento: 26, utilidad: 12.1279 },
  ];
  list$: BehaviorSubject<PeriodicElement[]> = new BehaviorSubject(this.list);

  constructor() { 
  }

  update(index, field, value) {
    this.list = this.list.map((e, i) => {
      if (index === i) {
        return {
          ...e,
          [field]: value
        }
      }
      return e;
    });
    this.list$.next(this.list);
  }

  getControl(index, fieldName) {
  }



}