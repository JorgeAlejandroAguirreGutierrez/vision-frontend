import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable()
export class ComponenteValidatorService //implements ValidatorService 
{
  getRowValidator(): FormGroup {
    return new FormGroup({
      'producto_id': new FormControl(null, Validators.required), 
      'medida_id': new FormControl(null, Validators.required),
      'cantidad': new FormControl(null, Validators.required),
      'valor': new FormControl(),
      });
  }
}