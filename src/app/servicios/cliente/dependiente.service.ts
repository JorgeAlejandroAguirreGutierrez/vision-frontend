import { Injectable } from '@angular/core';
import { Dependiente } from '../../modelos/cliente/dependiente';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DependienteService {

  constructor(private http: HttpClient) { }

  crear(dependiente: Dependiente): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.dependiente, dependiente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(dependienteId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.dependiente + urn.slash + dependienteId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.dependiente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(dependiente: Dependiente): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.dependiente, dependiente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  activar(dependiente: Dependiente): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.dependiente + urn.activar, dependiente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(dependiente: Dependiente): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.dependiente + urn.inactivar, dependiente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
