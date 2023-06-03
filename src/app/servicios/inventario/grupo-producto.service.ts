import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, lastValueFrom } from 'rxjs';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { GrupoProducto } from '../../modelos/inventario/grupo-producto';

@Injectable({
  providedIn: 'root'
})
export class GrupoProductoService {

  constructor(private http: HttpClient) { }

  crear(grupoProducto: GrupoProducto): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.grupoProducto, grupoProducto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.grupoProducto + urn.consultar + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarActivos(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto + urn.consultarActivos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarGrupos(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto+ urn.consultarGrupos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async consultarGruposAsync(): Promise<Respuesta> {
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto + urn.consultarGrupos, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultarSubgrupos(grupo: string): Observable<Respuesta> {
    let params = new HttpParams().set("grupo", grupo)
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto + urn.consultarSubgrupos, {params: params, headers: options.headers}).pipe(
      map(response => response as Respuesta), 
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async consultarSubgruposAsync(grupo: string): Promise<Respuesta> {
    let params = new HttpParams().set("grupo", grupo)
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto+ urn.consultarSubgrupos, {params: params, headers: options.headers}).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultarSecciones(grupo: string, subgrupo:string): Observable<Respuesta> {
    let params = new HttpParams().set("grupo", grupo)
                                 .set("subgrupo", subgrupo)
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto + urn.consultarSecciones, {params: params, headers: options.headers}).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async consultarSeccionesAsync(grupo: string, subgrupo:string): Promise<Respuesta> {
    let params = new HttpParams().set("grupo", grupo)
                                 .set("subgrupo", subgrupo)
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto + urn.consultarSecciones, {params: params, headers: options.headers}).pipe(
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
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto + urn.consultarLineas, {params: params, headers: options.headers}).pipe(
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
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto + urn.consultarLineas, {params: params, headers: options.headers}).pipe(
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
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto + urn.consultarSublineas, {params: params, headers: options.headers}).pipe(
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
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto + urn.consultarSublineas, {params: params, headers: options.headers}).pipe(
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
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto + urn.consultarPresentaciones, {params: params, headers: options.headers}).pipe(
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
    return lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto + urn.consultarPresentaciones, {params: params, headers: options.headers}).pipe(
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
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto + urn.consultarMovimientoContable, {params: params, headers: options.headers}).pipe(
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
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto + urn.obtenerGrupoProducto, {params: params, headers: options.headers}).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(grupo_producto_id: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.grupoProducto + urn.slash + grupo_producto_id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  buscar(grupo_producto: GrupoProducto): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.grupoProducto + urn.buscar, grupo_producto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  actualizar(grupo_producto: GrupoProducto): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.grupoProducto, grupo_producto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(grupoProducto: GrupoProducto): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.grupoProducto + urn.activar, grupoProducto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(grupoProducto: GrupoProducto): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.grupoProducto + urn.inactivar, grupoProducto, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
