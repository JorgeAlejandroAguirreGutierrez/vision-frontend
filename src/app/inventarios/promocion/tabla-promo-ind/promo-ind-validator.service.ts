import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//import { ValidatorService } from 'angular4-material-table';

@Injectable()
export class PromoIndValidatorService //implements ValidatorService 
{
  getRowValidator(): FormGroup {
    return new FormGroup({
/*      'id': new FormControl(),*/
      'fecha_ini': new FormControl(),
      'fecha_fin': new FormControl(),
      'segmento_id': new FormControl(null, Validators.required),
      'rango_ini': new FormControl(),
      'rango_fin': new FormControl(),
      'producto_promo_id': new FormControl(null, Validators.required), 
      'medida_promo_id': new FormControl(null, Validators.required),
      'cantidad_promo': new FormControl(null, Validators.required), 
      'descuento_promo': new FormControl(null, Validators.required),
      'precio_fin': new FormControl(null, Validators.required),
      });
  }
}