import { Injectable } from '@angular/core';
import { RetencionCliente } from '../../modelos/cliente/retencion-cliente';
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
export class RetencionService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(retencionCliente: RetencionCliente): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.retencionCliente, retencionCliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  consultar(retencionClienteId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.retencionCliente + urn.slash + retencionClienteId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.retencionCliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }

  actualizar(retencionCliente: RetencionCliente): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.retencionCliente, retencionCliente, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(retencionCliente: RetencionCliente): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.retencionCliente + urn.slash + retencionCliente.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
