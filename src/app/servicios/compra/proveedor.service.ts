import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError, lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Proveedor } from '../../modelos/compra/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private messageSource = new BehaviorSubject(0);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient) { }

  enviar(proveedorId: number) {
    this.messageSource.next(proveedorId);
  }

  crear(proveedor: Proveedor): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.proveedor, proveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(proveedor: Proveedor): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.proveedor + urn.slash + proveedor.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  async obtener_proveedores_async(nombre_proveedor: string): Promise<Respuesta> {
    let params = new HttpParams().set("razon_social", nombre_proveedor)
    return await lastValueFrom(this.http.get<Respuesta>(environment.host + urn.ruta + urn.proveedor + urn.consultarProveedor, {params: params, headers: options.headers}).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    ));
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.proveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(proveedor: Proveedor): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.proveedor, proveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  activar(proveedor: Proveedor): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.proveedor + urn.activar, proveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(proveedor: Proveedor): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.proveedor + urn.inactivar, proveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(proveedor: Proveedor): Observable<Respuesta> {
    return this.http.post<Respuesta>(environment.host + urn.ruta + urn.proveedor + urn.buscar, proveedor, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtenerIdentificacion(identificacion: string): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.proveedor + urn.identificacion + urn.slash + identificacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  validarIdentificacion(identificacion: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.proveedor + '/identificacion/validar/' + identificacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
