import { Injectable } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
//import { ValidatorService } from 'angular4-material-table';

@Injectable()
export class PromoIndValidatorService //implements ValidatorService 
{
  getRowValidator(): UntypedFormGroup {
    return new UntypedFormGroup({
/*      'id': new FormControl(),*/
      'fecha_ini': new UntypedFormControl(),
      'fecha_fin': new UntypedFormControl(),
      'segmento_id': new UntypedFormControl(null, Validators.required),
      'rango_ini': new UntypedFormControl(),
      'rango_fin': new UntypedFormControl(),
      'producto_promo_id': new UntypedFormControl(null, Validators.required), 
      'medida_promo_id': new UntypedFormControl(null, Validators.required),
      'cantidad_promo': new UntypedFormControl(null, Validators.required), 
      'descuento_promo': new UntypedFormControl(null, Validators.required),
      'precio_fin': new UntypedFormControl(null, Validators.required),
      });
  }
}