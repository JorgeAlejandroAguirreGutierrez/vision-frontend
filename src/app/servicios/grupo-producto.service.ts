import { Injectable } from '@angular/core';
import { Respuesta } from '../respuesta';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable, throwError, BehaviorSubject, lastValueFrom } from 'rxjs';
import * as util from '../util';
import { environment } from '../../environments/environment';
import { GrupoProducto } from '../modelos/grupo-producto';

@Injectable({
  providedIn: 'root'
})
export class GrupoProductoService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient) { }

  enviar(clienteId: number) {
    this.messageSource.next(clienteId);
  }

  crear(grupoProducto: GrupoProducto): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.grupoProducto, grupoProducto, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async consultarAsync(): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultarGrupos(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto+ util.consultarGrupos, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async consultarGruposAsync(): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto+ util.consultarGrupos, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultarSubgrupos(grupo: string): Observable<Respuesta> {
    let params = new HttpParams().set("grupo", grupo)
    return this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto+ util.consultarSubgrupos, {params: params, headers: util.options.headers}).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async consultarSubgruposAsync(grupo: string): Promise<Respuesta> {
    let params = new HttpParams().set("grupo", grupo)
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto+ util.consultarSubgrupos, {params: params, headers: util.options.headers}).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultarSecciones(grupo: string, subgrupo:string): Observable<Respuesta> {
    let params = new HttpParams().set("grupo", grupo)
                                 .set("subgrupo", subgrupo)
    return this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto+ util.consultarSecciones, {params: params, headers: util.options.headers}).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async consultarSeccionesAsync(grupo: string, subgrupo:string): Promise<Respuesta> {
    let params = new HttpParams().set("grupo", grupo)
                                 .set("subgrupo", subgrupo)
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto+ util.consultarSecciones, {params: params, headers: util.options.headers}).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultarLineas(grupo: string, subgrupo:string, seccion: string): Observable<Respuesta> {
    let params = new HttpParams().set("grupo", grupo)
                                 .set("subgrupo", subgrupo)
                                 .set("seccion", seccion)
    return this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto+ util.consultarLineas, {params: params, headers: util.options.headers}).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async consultarLineasAsync(grupo: string, subgrupo:string, seccion: string): Promise<Respuesta> {
    let params = new HttpParams().set("grupo", grupo)
                                 .set("subgrupo", subgrupo)
                                 .set("seccion", seccion)
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto+ util.consultarLineas, {params: params, headers: util.options.headers}).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultarSublineas(grupo: string, subgrupo:string, seccion: string, linea: string): Observable<Respuesta> {
    let params = new HttpParams().set("grupo", grupo)
                                 .set("subgrupo", subgrupo)
                                 .set("seccion", seccion)
                                 .set("linea", linea)
    return this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto+ util.consultarSublineas, {params: params, headers: util.options.headers}).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async consultarSublineasAsync(grupo: string, subgrupo:string, seccion: string, linea: string): Promise<Respuesta> {
    let params = new HttpParams().set("grupo", grupo)
                                 .set("subgrupo", subgrupo)
                                 .set("seccion", seccion)
                                 .set("linea", linea)
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto+ util.consultarSublineas, {params: params, headers: util.options.headers}).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultarPresentaciones(grupo: string, subgrupo:string, seccion: string, linea: string, sublinea: string): Observable<Respuesta> {
    let params = new HttpParams().set("grupo", grupo)
                                 .set("subgrupo", subgrupo)
                                 .set("seccion", seccion)
                                 .set("linea", linea)
                                 .set("sublinea", sublinea)
    return this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto+ util.consultarPresentaciones, {params: params, headers: util.options.headers}).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async consultarPresentacionesAsync(grupo: string, subgrupo:string, seccion: string, linea: string, sublinea: string): Promise<Respuesta> {
    let params = new HttpParams().set("grupo", grupo)
                                 .set("subgrupo", subgrupo)
                                 .set("seccion", seccion)
                                 .set("linea", linea)
                                 .set("sublinea", sublinea)
    return lastValueFrom(this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto+ util.consultarPresentaciones, {params: params, headers: util.options.headers}).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultarMovimientoContable(grupo: string, subgrupo: string, seccion: string): Observable<Respuesta> {
    let params = new HttpParams().set("grupo", grupo)
                                 .set("subgrupo", subgrupo)
                                 .set("seccion", seccion)
    return this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto+ util.consultarMovimientoContable, {params: params, headers: util.options.headers}).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtenerGrupoProducto(grupo: string, subgrupo:string, seccion: string, linea: string, sublinea: string, presentacion:string): Observable<Respuesta> {
    let params = new HttpParams().set("grupo", grupo)
                                 .set("subgrupo", subgrupo)
                                 .set("seccion", seccion)
                                 .set("linea", linea)
                                 .set("sublinea", sublinea)
                                 .set("presentacion", presentacion)
    return this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto+ util.obtenerGrupoProducto, {params: params, headers: util.options.headers}).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(grupo_producto_id: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + util.ruta + util.grupoProducto + '/' + grupo_producto_id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(grupo_producto: GrupoProducto): Observable<Respuesta> {
    return this.http.post(environment.host + util.ruta + util.grupoProducto+util.buscar, grupo_producto, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(grupo_producto: GrupoProducto): Observable<Respuesta> {
    return this.http.put(environment.host+util.ruta+util.grupoProducto, grupo_producto, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(grupoProducto: GrupoProducto): Observable<Respuesta> {
    return this.http.delete(environment.host+util.ruta+util.grupoProducto + '/' + grupoProducto.id, util.options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
