import { EventEmitter, Injectable, Output } from '@angular/core';
import { Factura } from '../../modelos/venta/factura';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { FacturaLinea } from '../../modelos/venta/factura-linea';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http: HttpClient) { }

  @Output() eventoRecaudacion = new EventEmitter<Factura>();

  enviarEventoRecaudacion(data: Factura) {
    this.eventoRecaudacion.emit(data);
  }

  @Output() eventoEntrega = new EventEmitter<number>();

  enviarEventoEntrega(data: number) {
    this.eventoEntrega.emit(data);
  }

  crear(factura: Factura): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.factura, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarPorEstadoSRI(estadoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorEstadoSRI + urn.slash + estadoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYEstadoSRI(empresaId: number, estadoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorEmpresaYEstadoSRI + urn.slash + empresaId + urn.slash + estadoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorCliente(clienteId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorCliente + urn.slash + clienteId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  consultarPorClienteYEstadoSRI(clienteId: number, estadoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorClienteYEstadoSRI + urn.slash + clienteId + urn.slash + estadoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  consultarPorClienteYEmpresaYProceso(clienteId: number, empresaId: number, proceso: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorClienteYEmpresaYProceso + urn.slash + clienteId + urn.slash + empresaId + urn.slash + proceso, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  consultarPorClienteYEmpresaYEstadoSRI(clienteId: number, empresaId: number, estadoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorClienteYEmpresaYEstadoSRI + urn.slash + clienteId + urn.slash + empresaId + urn.slash + estadoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  consultarPorClienteYProcesoYEstadoSRI(clienteId: number, proceso: string, estadoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorClienteYProcesoYEstadoSRI + urn.slash + clienteId + urn.slash + proceso + urn.slash + estadoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  obtener(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura+ urn.slash + facturaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  validarIdentificacion(identificacion: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.validarIdentificacion + urn.slash + identificacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(factura: Factura): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.factura, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  recaudar(factura: Factura): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.factura + urn.recaudar, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  anular(factura: Factura): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.factura + urn.anular, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(factura: Factura): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.factura + urn.buscar, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcular(factura: Factura): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.factura + urn.calcular, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  
  calcularLinea(facturaLinea: FacturaLinea): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.factura + urn.calcularLinea, facturaLinea, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcularRecaudacion(factura: Factura): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.factura + urn.calcularRecaudacion, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
