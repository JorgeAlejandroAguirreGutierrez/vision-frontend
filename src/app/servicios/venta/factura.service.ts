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

  consultarPorEstado(estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorEstado + urn.slash + estado, options).pipe(
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

  consultarPorEmpresaYEstado(empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorEmpresaYEstado + urn.slash + empresaId + urn.slash + estado, options).pipe(
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

  consultarPorClienteYEstado(clienteId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorClienteYEstado + urn.slash + clienteId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  consultarPorEmpresaYClienteYEstado(empresaId: number,clienteId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorEmpresaYClienteYEstado + urn.slash + empresaId + urn.slash + clienteId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  consultarPorClienteYEstadoYEstadoInternoYEstadoSri(clienteId: number, estado: string, estadoInterno: string, estadoSri: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorClienteYEstadoYEstadoInternoYEstadoSri + urn.slash + clienteId + urn.slash + estado + urn.slash + estadoInterno + urn.slash + estadoSri, options).pipe(
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

  activar(factura: Factura): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.factura + urn.activar, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  inactivar(factura: Factura): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.factura + urn.inactivar, factura, options).pipe(
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
