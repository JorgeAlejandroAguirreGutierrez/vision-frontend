import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { FacturaCompraLinea } from '../../modelos/compra/factura-compra-linea';

@Injectable({
  providedIn: 'root'
})
export class FacturaCompraLineaService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(facturaCompraLinea: FacturaCompraLinea): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.facturaCompraLinea, facturaCompraLinea, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(facturaCompraLineaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.facturaCompraLinea + urn.slash + facturaCompraLineaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.facturaCompraLinea, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  calcularLinea(facturaCompraLinea: FacturaCompraLinea): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.facturaCompraLinea + urn.calcularLinea, facturaCompraLinea, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  
}
