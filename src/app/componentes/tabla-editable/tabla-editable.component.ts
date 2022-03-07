import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
//import { TableDataSource, ValidatorService } from 'angular4-material-table';

import { PersonValidatorService } from './services/person-validator.service';
import { Person } from './person'; //clase
import { PeriodicElement } from './models/periodic'; //interface

import { CoreService } from './services/core.service';

@Component({
  selector: 'app-tabla-editable',
//  providers: [{provide: ValidatorService, useClass: PersonValidatorService }],
  templateUrl: './tabla-editable.component.html',
  styleUrls: ['./tabla-editable.component.scss']
})
export class TablaEditableComponent implements OnInit {

  displayedColumns1: string[] = ['position', 'medida', 'segmento', 'costo', 'ganancia', 'precio', 'pvp', 'pvpf', 'rendimiento', 'utilidad'];
  dataSource1 = this.core.list$;
  controls: FormArray;

  displayedColumns = ['position', 'medida', 'segmento', 'costo', 'ganancia', 'precio', 'actionsColumn'];
  @Input() personList = [ 
    { position: 1, medida:'Unidad', segmento:'Mayorista', costo:4.001, ganancia: 16, precio: 4.0079, pvp: 4.1279, pvpf: 4.1279, rendimiento: 16, utilidad: 4.0079 },
    { position: 2, medida:'Unidad', segmento:'Distribuidor', costo:4.001, ganancia: 22, precio: 4.0026, pvp: 4.1226, pvpf: 4.1226, rendimiento: 22, utilidad: 4.1226 },
    { position: 3, medida:'Quintal', segmento:'Tarjeta de crédito', costo:12.006, ganancia: 24, precio: 12.0067, pvp: 12.1279, pvpf: 14.1279, rendimiento: 24, utilidad: 12.1279 },
    { position: 4, medida:'Quintal', segmento:'Cliente Final', costo:12.006, ganancia: 26, precio: 12.9994, pvp: 12.1279, pvpf: 16.1279, rendimiento: 26, utilidad: 12.1279 },
    ] ;
  @Output() personListChange = new EventEmitter<Person[]>();

  //dataSource: TableDataSource<Person>;

  constructor(private core: CoreService, 
  //  private personValidator: ValidatorService
    ) { }

/*    displayedColumns = ['name', 'age', 'actionsColumn'];

    @Input() personList = [ 
      { name: 'Mark', age: 15 },
      { name: 'Brad', age: 50 },
      ] ;
    @Output() personListChange = new EventEmitter<Person[]>();
  
    dataSource: TableDataSource<Person>;*/

  ngOnInit() {
    const toGroups = this.core.list$.value.map(entity => {
      return new FormGroup({
        position:  new FormControl(entity.position, Validators.required),
        medida: new FormControl(entity.medida, Validators.required), 
        segmento: new FormControl(entity.segmento, Validators.required), 
        costo: new FormControl(entity.costo, Validators.required),
        ganancia: new FormControl(entity.ganancia, Validators.required), 
        precio: new FormControl(entity.precio, Validators.required),
        pvp: new FormControl(entity.pvp, Validators.required)
      },{updateOn: "blur"});
      
    });
    
    console.log(this.dataSource1.value);
    this.controls = new FormArray(toGroups);
 //   this.dataSource = new TableDataSource<any>(this.personList, Person, this.personValidator);

 //   this.dataSource.datasourceSubject.subscribe(personList => this.personListChange.emit(personList));
  }

  
  updateField(index, field) {
    const control = this.getControl(index, field);
    if (control.valid) {
      this.core.update(index,field,control.value);
    }
  }

  getControl(index, fieldName) {
    const a  = this.controls.at(index).get(fieldName) as FormControl;
    return this.controls.at(index).get(fieldName) as FormControl;
  }

}
