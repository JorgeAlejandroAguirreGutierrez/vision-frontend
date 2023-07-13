import { Injectable } from "@angular/core";
import { Tab } from "../../../modelos/comun/tab.model";
import { BehaviorSubject } from "rxjs";
import { Type } from '@angular/core';

@Injectable()
export class TabService {
  public tabs: Tab[] = [];
  public tabs1: Tab[] = [];

  public tabsGroup: any[]=[];

  public tabSub = new BehaviorSubject<Tab[]>(this.tabs);
  public tabSub1 = new BehaviorSubject<Tab[]>(this.tabs1);
  public tabsGroupSub = new BehaviorSubject<any[]>(this.tabsGroup);

  existeTab: boolean = false;

  public removeTab(index: number) {
    this.tabs.splice(index, 1); //cambia el contenido del array eliminado o agregando elementos
    if (this.tabs.length > 0) {
      this.tabs[this.tabs.length - 1].active = true;
    }
    this.tabSub.next(this.tabs); //guarda el tabs y le expone al otro componente suscrito
    this.tabsGroupSub.next(this.tabsGroup);
  }

  public removeTab1(index: number) {
    this.tabs1.splice(index, 1); //cambia el contenido del array eliminado o agregando elementos
    if (this.tabs1.length > 0) { //No hace falta por que siempre está la opción menu
      this.tabs1[this.tabs1.length - 1].active = true;
    }
    this.tabSub1.next(this.tabs1); //guarda el tabs y le entregamos al otro componente suscrito
    this.tabsGroup.splice(index-1, 1);
    this.tabsGroupSub.next(this.tabsGroup);
    if (this.tabs1.length > 1){
      this.tabs = this.tabsGroup[this.tabs1.length - 2];
      this.tabSub.next(this.tabs);
    } else {
      this.vaciarTab();
    }
  }

  public addTab(tab: Tab) {
    for (let i = 0; i < this.tabs1.length; i++) {
      if (this.tabs1[i].active === true) {
        if (this.tabsGroup.length < (i)){
            this.vaciarTab();
          }else {
            this.tabs=this.tabsGroup[i-1];
        }
        // Pone false a todos los tabs, para dejar activo solo el nuevo
        for (let j = 0; j < this.tabs.length; j++) {
          if (this.tabs[j].active === true) {
            this.tabs[j].active = false;
          }
        }
        //Completa los datos del modelo tab
        tab.id = this.tabs.length;
        tab.active = true;
        //añade un elemento tab al final de un array y devuelve la nueva longitud del array.
        this.tabs.push(tab); 
        this.tabSub.next(this.tabs);
        this.tabsGroup[i-1]= this.tabs;
        this.tabsGroupSub.next(this.tabsGroup);
      }
    }    
  }

  public addTab1(tab1: Tab) {
    //Pone en estado inactivo todos los tabs
    for (let i = 0; i < this.tabs1.length; i++) {
      if (this.tabs1[i].active === true) {
        this.tabs1[i].active = false;
      }
    }
    tab1.id = this.tabs1.length;
    tab1.active = true; // Pone activo al nuevo tab
    this.tabs1.push(tab1); //añade uno o más elementos al final de un array y devuelve la nueva longitud del array.
    setTimeout(() => {
      this.tabSub1.next(this.tabs1); //guarda el nuevo tab local y le entrega al tab suscrito
    }, 5); // Para que no salga error ExpressionChangedAfterItHasBeenCheckedError
    if (this.tabs1.length > 1){
      this.tabsGroup[this.tabs1.length-2] = [];
      this.tabsGroupSub.next(this.tabsGroup);
    }
  }

  public addNewTab(Componente: Type<any>, tabNombre: string) {
    this.addTab(
      new Tab(Componente, tabNombre, { parent: "AppComponent" })
    );
  } 

  public addNewTab1(Componente: Type<any>, tabNombre: string) {
    this.vaciarTab();
    this.addTab1( 
      new Tab(Componente, tabNombre, { parent: "AppComponent" })
    );
  }

  public abrirTab(Componente: Type<any>, tabNombre: string){
    this.existeTab = false;
    // Recorre todo el tab en busca del nombre de la pestaña sino crea la nueva pestaña
    for (let i = 0; i < this.tabs1.length; i++) {
      //si encuentra el nombre activa la pestaña
      if (this.tabs1[i].title === tabNombre) {
        for (let j = 0; j < this.tabs1.length; j++) {
          if (this.tabs1[j].active === true) {
            this.tabs1[j].active = false;
          }
        }       
        this.tabs1[i].active = true;
        this.existeTab = true;
        this.tabSub1.next(this.tabs1); //guarda el tabs y le entregamos al otro componente suscrito
        this.tabsGroupSub.next(this.tabsGroup);
      } 
    }
    if (!this.existeTab) {
      this.addNewTab1(Componente, tabNombre);
    }
  }

  public vaciarTab(){
    this.tabs = [];
    this.tabSub.next(this.tabs);
  }

  public activarTab(event) {
    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].active === true) {
        this.tabs[i].active = false;
      }
    }
    for (let i = 0; i < this.tabs.length; i++) {
      if (event.index === i) {
        this.tabs[i].active = true;
      }
    }
    this.tabSub.next(this.tabs); //guarda los cambios y emite el evento para el observable suscrito
  }

// Para actualizar la pestaña ACTIVA del (tab1) y las subpestañas relacionadas en el (tab)
  public activarTab1(event) {
    for (let i = 0; i < this.tabs1.length; i++) {
      if (this.tabs1[i].active === true) {
        this.tabs1[i].active = false;
      }
    }
    for (let i = 0; i < this.tabs1.length; i++) {
      if (event.index === i) {
        this.tabs1[i].active = true;
        if (event.index !== 0){
          if (this.tabsGroup.length < (i)){
            this.vaciarTab();
          }else {
            this.tabs=this.tabsGroup[i-1];
            this.tabSub.next(this.tabs);
          }
        }
      }
    }
    this.tabSub1.next(this.tabs1); //guarda los cambios y emite el evento para el observable suscrito
    
  }

  public indexarTab() {
    for (let i = 0; i < this.tabs.length; i++) {
      this.tabs[i].id = i;
    } 
  }

  public indexarTab1() {
    for (let i = 0; i < this.tabs1.length; i++) {
      this.tabs1[i].id = i;
    } 
  }

}
