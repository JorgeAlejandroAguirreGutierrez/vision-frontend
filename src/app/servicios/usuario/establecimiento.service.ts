import { Injectable } from '@angular/core';
import { Establecimiento } from '../../modelos/usuario/establecimiento';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstablecimientoService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  enviar(establecimiento_id: number) {
    this.messageSource.next(establecimiento_id);
  }

  crear(establecimiento: Establecimiento): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.establecimiento, establecimiento, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.establecimiento, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }
    ));
  }

  obtener(establecimientoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.establecimiento + urn.slash + establecimientoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
    
  }

  actualizar(establecimiento: Establecimiento): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.establecimiento, establecimiento, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(establecimiento: Establecimiento): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.establecimiento + urn.activar, establecimiento, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(establecimiento: Establecimiento): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.establecimiento + urn.inactivar, establecimiento, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscarEmpresa(establecimientoId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.establecimiento + urn.buscar + urn.slash + establecimientoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
