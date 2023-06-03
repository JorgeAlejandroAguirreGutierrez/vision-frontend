import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//import { ValidatorService } from 'angular4-material-table';

@Injectable()
export class ComboValidatorService //implements ValidatorService 
{
  getRowValidator(): FormGroup {
    return new FormGroup({
      'nombre': new FormControl(null, Validators.required),
      'descripcion': new FormControl(),
      'facturable': new FormControl(null, Validators.required),
      'precio_real': new FormControl(null, Validators.required),
      'precio_combo': new FormControl(null, Validators.required)
      });
  }
}