import { Injectable } from '@angular/core';
import { Ubicacion } from '../../modelos/configuracion/ubicacion';
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
export class UbicacionService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(ubicacion: Ubicacion): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.ubicacion, ubicacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.ubicacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(ubicacion: Ubicacion): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.ubicacion, ubicacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(ubicacion: Ubicacion): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.ubicacion + urn.activar, ubicacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(ubicacion: Ubicacion): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.ubicacion + urn.inactivar, ubicacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarProvincias(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.ubicacion + '/provincia', options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarCantones(provincia: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.ubicacion + '/provincia/'+ provincia +'/canton', options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarParroquias(canton: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.ubicacion + '/provincia/canton/' + canton + '/parroquia', options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(ubicacion: Ubicacion): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.ubicacion + urn.buscar + urn.slash + ubicacion.codigoNorma + urn.slash + ubicacion.provincia + urn.slash + ubicacion.canton + urn.slash + ubicacion.parroquia, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
