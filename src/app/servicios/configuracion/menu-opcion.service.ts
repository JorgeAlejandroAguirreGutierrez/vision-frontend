import { Injectable } from '@angular/core';
import { MenuOpcion } from '../../modelos/configuracion/menu-opcion';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuOpcionService {

  constructor(private http: HttpClient, private router: Router) { }

  crear(menuOpcion: MenuOpcion): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.menuOpcion, menuOpcion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(parametro: MenuOpcion): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.menuOpcion + urn.slash + parametro.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.menuOpcion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.menuOpcion + urn.consultarPorEstado + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(menuOpcion: MenuOpcion): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.menuOpcion, menuOpcion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(menuOpcion: MenuOpcion): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.menuOpcion + urn.activar, menuOpcion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(menuOpcion: MenuOpcion): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.menuOpcion + urn.inactivar, menuOpcion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarModulos(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.menuOpcion + urn.consultarModulos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorModulo(modulo: String): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.menuOpcion + urn.consultarPorModulo + urn.slash + modulo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }  

  obtenerPorTipo(tipo: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.menuOpcion + urn.obtenerPorTipo + urn.slash + tipo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  consultarPorTipo(tipo: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.menuOpcion + urn.consultarPorTipo + urn.slash + tipo, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }   
}
