import { Injectable } from '@angular/core';
import { PlazoCredito } from '../../modelos/cliente/plazo-credito';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlazoCreditoService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(plazoCredito: PlazoCredito): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.plazoCredito, plazoCredito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(plazoCreditoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.plazoCredito + urn.slash + plazoCreditoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.plazoCredito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.plazoCredito + urn.consultar + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivos(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.plazoCredito + urn.consultarActivos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(plazoCredito: PlazoCredito): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.plazoCredito, plazoCredito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(plazoCredito: PlazoCredito): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.plazoCredito + urn.activar, plazoCredito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(plazoCredito: PlazoCredito): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.plazoCredito + urn.inactivar, plazoCredito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(plazoCredito: PlazoCredito): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.plazoCredito + urn.buscar + urn.slash + plazoCredito.codigo + urn.slash + plazoCredito.descripcion + urn.slash + plazoCredito.plazo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
