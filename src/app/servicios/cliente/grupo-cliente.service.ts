import { Injectable } from '@angular/core';
import { GrupoCliente } from '../../modelos/cliente/grupo-cliente';
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
export class GrupoClienteService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(grupoCliente: GrupoCliente): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.grupoCliente, grupoCliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(grupoClienteId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoCliente + urn.slash + grupoClienteId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.grupoCliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivos(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.grupoCliente + urn.consultarActivos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(grupoCliente: GrupoCliente): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.grupoCliente + urn.buscar, grupoCliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(grupoCliente: GrupoCliente): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.grupoCliente, grupoCliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(grupoCliente: GrupoCliente): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.grupoCliente + urn.activar, grupoCliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(grupoCliente: GrupoCliente): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.grupoCliente + urn.inactivar, grupoCliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
