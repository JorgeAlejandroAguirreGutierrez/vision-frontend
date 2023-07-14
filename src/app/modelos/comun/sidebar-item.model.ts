import { Type } from '@angular/core';

export class SidebarItem {
  public id: number;
  public componente: Type<any>;
  public tabTitulo: string;
  public itemNombre: string;
  public icoItem: string;
  public active: boolean;


  constructor(componente: Type<any>, tabTitulo: string, itemNombre: string, icoItem: string) {
    this.componente = componente;
    this.tabTitulo = tabTitulo;
    this.itemNombre = itemNombre;
    this.icoItem = icoItem
  }
}

