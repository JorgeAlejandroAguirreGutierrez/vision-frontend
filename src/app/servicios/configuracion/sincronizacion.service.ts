import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Sincronizacion } from 'src/app/modelos/configuracion/sincronizacion';
import { Modelo } from 'src/app/modelos/configuracion/modelo';
export const credencialUsuario = "admin";
export const credencialPassword = "admin";
export const credencial = credencialUsuario + ":" + credencialPassword;
export const headersCargarArchivo = new HttpHeaders({ "Authorization": "Basic " + btoa(credencial) });
export const optionsCargarArchivo = { headers: headersCargarArchivo };

@Injectable({
  providedIn: 'root'
})
export class SincronizacionService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(sincronizacion: Sincronizacion): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.sincronizacion, sincronizacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(sincronizacionId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.sincronizacion + urn.slash + sincronizacionId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.sincronizacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.sincronizacion + urn.consultarPorEstado + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(sincronizacion: Sincronizacion): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.sincronizacion, sincronizacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  procesar(sincronizacionId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.sincronizacion + urn.procesar + urn.slash + sincronizacionId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  crearModelos(modelos: Modelo[]): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.sincronizacion + urn.crearModelos, modelos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  cargarArchivo(sincronizacionId: number, file: File): Observable<Respuesta> {
    // Create form data
    const formData = new FormData(); 
    // Store form name as "file" with file data
    formData.append("file", file, file.name);
    return this.http.post(environment.host + urn.ruta + urn.sincronizacion + urn.cargarArchivo + urn.slash + sincronizacionId, formData, optionsCargarArchivo).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
