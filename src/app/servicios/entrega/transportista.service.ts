import { Injectable } from '@angular/core';
import { Transportista } from '../../modelos/entrega/transportista';
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
export class TransportistaService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(transportista: Transportista): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.transportista, transportista, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.transportista, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.transportista + urn.consultar + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYEstado(empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.transportista + urn.consultar + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  obtener(transportistaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.transportista + urn.slash + transportistaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(transportista: Transportista): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.transportista, transportista, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(transportista: Transportista): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.transportista + urn.activar, transportista, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(transportista: Transportista): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.transportista + urn.inactivar, transportista, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
