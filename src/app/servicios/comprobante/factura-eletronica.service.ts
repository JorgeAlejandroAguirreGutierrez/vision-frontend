import { Injectable } from '@angular/core';
import { Factura } from '../../modelos/comprobante/factura';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FacturacionElectronicaService {

  constructor(private http: HttpClient, private router: Router) { }

  enviar(factura: Factura): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.facturaEletronica, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
