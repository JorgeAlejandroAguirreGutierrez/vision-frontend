import { Injectable } from '@angular/core';
import { Factura } from '../../modelos/comprobante/factura';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { optionsGenerarArchivo } from '../../constantes';
@Injectable({
  providedIn: 'root'
})
export class FacturaFisicaService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(factura: Factura) {
    return this.http.post(environment.host + urn.ruta + urn.facturaFisica, factura, optionsGenerarArchivo).pipe(
      map(response => response as Blob),
      catchError(err => {
        return throwError(err);
      })
    );
  }  
}
