import { Injectable } from '@angular/core';
import { PlazoCredito } from '../../modelos/cliente/plazo-credito';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlazoCreditoService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(plazoCreditoId: number) {
    this.messageSource.next(plazoCreditoId);
  }

  crear(plazoCredito: PlazoCredito): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.plazoCredito, plazoCredito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(plazoCreditoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.plazoCredito + '/' + plazoCreditoId, options).pipe(
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

  actualizar(plazoCredito: PlazoCredito): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.plazoCredito, plazoCredito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(plazoCredito: PlazoCredito): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.plazoCredito + '/' + plazoCredito.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminarPersonalizado(plazoCredito: PlazoCredito): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.plazoCredito + urn.personalizado + '/' + plazoCredito.id, options).pipe( 
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(plazoCredito: PlazoCredito): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.plazoCredito + urn.buscar+'/'+plazoCredito.codigo + '/'+plazoCredito.descripcion+'/'+plazoCredito.plazo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
