import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { Recaudacion } from '../../modelos/recaudacion/recaudacion';

@Injectable({
  providedIn: 'root'
})
export class RecaudacionService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(recaudacion: Recaudacion): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.recaudacion, recaudacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.recaudacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(recaudacion: Recaudacion): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.recaudacion + "/" + recaudacion.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(recaudacion: Recaudacion): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.recaudacion, recaudacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(recaudacion: Recaudacion): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.recaudacion + '/' + recaudacion.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtenerPorFactura(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.recaudacion + urn.factura + "/" + facturaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  calcular(recaudacion: Recaudacion): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.recaudacion + urn.calcular, recaudacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  calcularTotales(recaudacion: Recaudacion): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.recaudacion + urn.calcularTotales, recaudacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
