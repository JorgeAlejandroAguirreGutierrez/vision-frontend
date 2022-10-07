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
    return this.http.post(environment.host + urn.ruta + urn.dependiente, JSON.stringify(dependiente), options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtener(dependienteId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.dependiente + '/' + dependienteId, options).pipe(
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
    return this.http.put(environment.host + urn.ruta + urn.dependiente, JSON.stringify(dependiente), options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  eliminar(dependiente: Dependiente): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.dependiente + '/' + dependiente.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  consultarRazonSocial(dependiente: Dependiente): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.dependiente + urn.buscar + urn.razonSocial + "/"+ dependiente.razonSocial + "/" + dependiente.cliente.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }
  consultarClienteID(dependiente: Dependiente): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.dependiente + urn.cliente + "/" + dependiente.cliente.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      }));
  }
}
