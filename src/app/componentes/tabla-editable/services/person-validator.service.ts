import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//import { ValidatorService } from 'angular4-material-table';

@Injectable()
export class PersonValidatorService //implements ValidatorService 
{
  getRowValidator(): FormGroup {
    return new FormGroup({
      'position': new FormControl(),
      'segmento': new FormControl(null, Validators.required),
      'precio': new FormControl(),
      'medida': new FormControl(null, Validators.required), 
      'costo': new FormControl(null, Validators.required),
      'ganancia': new FormControl(null, Validators.required), 
/*      'pvp': new FormControl(null, Validators.required)
      'name': new FormControl(null, Validators.required),
      'age': new FormControl(),*/
      });
  }
}