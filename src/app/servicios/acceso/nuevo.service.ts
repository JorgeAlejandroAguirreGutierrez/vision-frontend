import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options, optionsCargarArchivo } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Nuevo } from 'src/app/modelos/acceso/nuevo';

@Injectable({
  providedIn: 'root'
})
export class NuevoService {

  constructor(private http: HttpClient) { }

  crear(nuevo: Nuevo): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.nuevo, nuevo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(nuevoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.nuevo + urn.slash + nuevoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.nuevo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(nuevo: Nuevo): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.nuevo, nuevo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  ejecutar(nuevo: Nuevo): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.nuevo + urn.ejecutar, nuevo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
