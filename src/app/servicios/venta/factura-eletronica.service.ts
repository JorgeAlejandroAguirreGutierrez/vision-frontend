import { Injectable } from '@angular/core';
import { Factura } from '../../modelos/venta/factura';
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
export class FacturaElectronicaService {

  constructor(private http: HttpClient, private router: Router) { }

  enviar(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.facturaElectronica + urn.slash + facturaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }
  obtenerPDF(facturaId: number) {
    window.open(environment.host + urn.ruta + urn.facturaElectronica + urn.obtenerPDF + urn.slash + facturaId, '_blank');
  }
  enviarPDFYXML(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.facturaElectronica + urn.enviarPDFYXML + urn.slash + facturaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }
}
